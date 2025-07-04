#!/bin/bash

# Script pour construire l'APK TWA d'ATOMIC FLIX
echo "🚀 Construction de l'APK TWA pour ATOMIC FLIX..."

cd android-twa

# Vérifier si Bubblewrap est installé
if ! command -v bubblewrap &> /dev/null; then
    echo "❌ Bubblewrap n'est pas installé globalement"
    echo "🔧 Installation de Bubblewrap..."
    npm install -g @bubblewrap/cli
fi

# Initialiser le projet TWA avec le manifest existant
echo "📦 Initialisation du projet TWA..."
bubblewrap init --manifest=https://atomic-flix.vercel.app/manifest.json

# Ou utiliser la configuration manuelle si le manifest automatique échoue
if [ $? -ne 0 ]; then
    echo "⚙️ Configuration manuelle du projet TWA..."
    bubblewrap init \
        --packageId="app.vercel.atomic_flix.twa" \
        --name="ATOMIC FLIX" \
        --host="atomic-flix.vercel.app" \
        --startUrl="/" \
        --themeColor="#8F00FF" \
        --backgroundColor="#0F111A" \
        --iconUrl="https://atomic-flix.vercel.app/assets/atomic-logo.png" \
        --display="standalone"
fi

# Générer une clé de signature si elle n'existe pas
if [ ! -f "android.keystore" ]; then
    echo "🔑 Génération de la clé de signature..."
    keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000 \
        -dname "CN=ATOMIC FLIX, OU=Development, O=ATOMIC FLIX, L=Paris, ST=IDF, C=FR" \
        -storepass android -keypass android
fi

# Obtenir l'empreinte SHA256 de la clé
echo "🔍 Extraction de l'empreinte SHA256..."
SHA256_FINGERPRINT=$(keytool -list -v -keystore android.keystore -alias android -storepass android -keypass android | grep "SHA256:" | cut -d' ' -f3)

echo "📋 Empreinte SHA256: $SHA256_FINGERPRINT"

# Créer le fichier assetlinks.json
echo "📝 Création du fichier assetlinks.json..."
mkdir -p ../client/public/.well-known
cat > ../client/public/.well-known/assetlinks.json << EOF
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.vercel.atomic_flix.twa",
      "sha256_cert_fingerprints": [
        "$SHA256_FINGERPRINT"
      ]
    }
  }
]
EOF

echo "✅ Fichier assetlinks.json créé dans client/public/.well-known/"

# Construire l'APK
echo "🔨 Construction de l'APK..."
bubblewrap build

# Vérifier si la construction a réussi
if [ -f "app-release-signed.apk" ]; then
    echo "✅ APK construit avec succès: app-release-signed.apk"
    echo "📦 Taille de l'APK: $(du -h app-release-signed.apk | cut -f1)"
else
    echo "❌ Échec de la construction de l'APK"
    exit 1
fi

echo ""
echo "🎉 Construction terminée!"
echo ""
echo "📋 Étapes suivantes:"
echo "1. Déployez le fichier assetlinks.json sur https://atomic-flix.vercel.app/.well-known/assetlinks.json"
echo "2. Installez l'APK: adb install app-release-signed.apk"
echo "3. Testez l'application pour vérifier que la barre d'URL n'apparaît pas"
echo ""
echo "🔑 Empreinte SHA256 pour assetlinks.json: $SHA256_FINGERPRINT"