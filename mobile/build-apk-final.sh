#!/bin/bash

echo "🚀 ATOMIC FLIX - APK Builder (SDK 53 Compatible)"
echo "=============================================="

# Vérifier le répertoire
if [ ! -f "app.json" ]; then
  echo "❌ Erreur: Exécutez ce script depuis le dossier mobile"
  exit 1
fi

# Étape 1: Nettoyer et installer les dépendances
echo "🧹 Nettoyage et installation des dépendances..."
rm -rf node_modules package-lock.json

# Installer avec npm (legacy-peer-deps pour compatibilité React 19)
echo "📦 Installation des packages avec --legacy-peer-deps..."
npm install --legacy-peer-deps

# Vérifier l'installation
if [ $? -ne 0 ]; then
  echo "❌ Échec de l'installation des dépendances"
  echo "💡 Essayez manuellement: npm install --force"
  exit 1
fi

# Étape 2: Vérifier les outils Expo
echo "🔧 Vérification des outils Expo..."
if ! command -v expo &> /dev/null; then
  echo "Installation d'Expo CLI..."
  npm install -g @expo/cli
fi

if ! command -v eas &> /dev/null; then
  echo "Installation d'EAS CLI..."
  npm install -g eas-cli
fi

# Étape 3: Vérifier la configuration
echo "⚙️ Vérification de la configuration..."
if [ ! -f "eas.json" ]; then
  echo "❌ Fichier eas.json manquant"
  exit 1
fi

# Étape 4: Vérifier l'authentification
echo "🔑 Vérification de l'authentification Expo..."
if ! expo whoami &> /dev/null; then
  echo "🔐 Vous devez vous connecter à Expo:"
  echo "   expo login"
  echo ""
  echo "Puis relancez ce script."
  exit 1
fi

# Étape 5: Lancer le build
echo "🔨 Lancement du build APK..."
echo "Configuration: Expo SDK 53 + React Native 0.79.3 + React 19"
echo ""

# Build APK pour preview/test
echo "Building APK for preview..."
eas build --platform android --profile preview --non-interactive

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build APK terminé avec succès!"
  echo "📱 Votre APK est disponible dans le dashboard EAS"
  echo ""
  echo "🔗 Accédez à: https://expo.dev/builds"
  echo ""
  echo "📋 Prochaines étapes:"
  echo "   1. Téléchargez l'APK depuis le dashboard"
  echo "   2. Testez l'APK sur votre appareil"
  echo "   3. Consultez android-publish-guide.md pour la publication"
else
  echo ""
  echo "❌ Échec du build"
  echo "💡 Vérifiez les logs ci-dessus pour plus de détails"
  echo "🔧 Solutions possibles:"
  echo "   - Vérifiez votre connexion internet"
  echo "   - Assurez-vous d'être connecté à Expo"
  echo "   - Consultez le status d'EAS: https://status.expo.dev"
  exit 1
fi