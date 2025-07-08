#!/bin/bash

echo "🚀 Building ATOMIC FLIX TWA (Trusted Web Activity)"
echo "This will create an Android APK that uses your exact website"

# Vérifier les dépendances
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found. Please install Node.js first"
    exit 1
fi

# Créer le dossier TWA
echo "📁 Creating TWA project directory..."
mkdir -p atomic-flix-twa
cd atomic-flix-twa

# Installer Bubblewrap si pas déjà installé
if ! command -v bubblewrap &> /dev/null; then
    echo "📦 Installing Bubblewrap CLI..."
    npm install -g @bubblewrap/cli
fi

# Initialiser le projet TWA
echo "⚙️  Initializing TWA project..."
bubblewrap init --manifest https://atomic-flix.vercel.app/manifest.json

# Configuration personnalisée
echo "🔧 Applying custom configuration..."
cat > twa-manifest.json << EOF
{
  "packageId": "app.vercel.atomic_flix.twa",
  "host": "atomic-flix.vercel.app",
  "name": "ATOMIC FLIX",
  "launcherName": "ATOMIC FLIX",
  "display": "standalone",
  "orientation": "default",
  "themeColor": "#00ffff",
  "backgroundColor": "#0a0a0a",
  "startUrl": "/",
  "iconUrl": "https://atomic-flix.vercel.app/assets/atomic-flix-logo.png",
  "maskableIconUrl": "https://atomic-flix.vercel.app/assets/atomic-flix-logo.png",
  "monochromeIconUrl": "https://atomic-flix.vercel.app/assets/atomic-flix-logo.png",
  "features": {
    "playBilling": {
      "enabled": false
    },
    "locationDelegation": {
      "enabled": false
    },
    "googlePlayBilling": {
      "enabled": false
    }
  },
  "enableNotifications": true,
  "isChromeOSOnly": false,
  "isMetaQuest": false,
  "minSdkVersion": 23,
  "targetSdkVersion": 34
}
EOF

echo "🔑 Generating signing key..."
if [ ! -f "atomic-flix-release-key.keystore" ]; then
    keytool -genkey -v -keystore atomic-flix-release-key.keystore -alias atomic-flix -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=ATOMIC FLIX, OU=Development, O=ATOMIC FLIX Team, L=Unknown, ST=Unknown, C=Unknown" -storepass atomicflix -keypass atomicflix
fi

echo "🔍 Getting SHA256 fingerprint..."
SHA256_FINGERPRINT=$(keytool -list -v -keystore atomic-flix-release-key.keystore -alias atomic-flix -storepass atomicflix | grep -A1 "SHA256:" | tail -n1 | tr -d ' :')

echo "📝 Your SHA256 fingerprint is: $SHA256_FINGERPRINT"
echo "   Add this to client/public/.well-known/assetlinks.json"

echo "🔨 Building APK..."
bubblewrap build --release

if [ $? -eq 0 ]; then
    echo "✅ TWA APK built successfully!"
    echo ""
    echo "📱 APK location: atomic-flix-twa/app-release-signed.apk"
    echo "🔑 Keystore: atomic-flix-twa/atomic-flix-release-key.keystore"
    echo "🔐 SHA256: $SHA256_FINGERPRINT"
    echo ""
    echo "Next steps:"
    echo "1. Update client/public/.well-known/assetlinks.json with the SHA256 fingerprint"
    echo "2. Deploy the updated website with assetlinks.json"
    echo "3. Test the APK on your device"
    echo "4. Submit to Amazon Appstore"
else
    echo "❌ Build failed. Check the error messages above."
    exit 1
fi