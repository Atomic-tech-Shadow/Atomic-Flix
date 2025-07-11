#!/bin/bash

echo "🤖 ATOMIC FLIX - Build APK avec Termux"
echo "====================================="

# Vérifier l'environnement Termux
if [ ! -d "/data/data/com.termux" ]; then
  echo "❌ Ce script doit être exécuté dans Termux"
  exit 1
fi

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "app.json" ]; then
  echo "❌ Exécutez ce script depuis le dossier mobile"
  exit 1
fi

# Étape 1: Wake lock pour éviter les interruptions
echo "🔋 Activation du wake lock..."
if command -v termux-wake-lock &> /dev/null; then
  termux-wake-lock
  echo "✅ Wake lock activé - le processus ne sera pas interrompu"
else
  echo "⚠️  Wake lock non disponible - installez termux-api"
fi

# Étape 2: Nettoyer le cache et les dépendances
echo "🧹 Nettoyage des dépendances..."
rm -rf node_modules package-lock.json
npm cache clean --force

# Étape 3: Configuration npm pour Termux
echo "⚙️  Configuration npm pour Termux..."
npm config set cache ~/.npm
npm config set prefix ~/.npm-global
npm config set legacy-peer-deps true

# Étape 4: Installation des dépendances avec options Termux
echo "📦 Installation des dépendances (optimisé Termux)..."
npm install --legacy-peer-deps --no-audit --prefer-offline

# Vérifier l'installation
if [ $? -ne 0 ]; then
  echo "❌ Échec de l'installation des dépendances"
  echo "💡 Solutions Termux:"
  echo "   - Vérifiez l'espace disque: df -h"
  echo "   - Nettoyez le cache: npm cache clean --force"
  echo "   - Essayez: npm install --force --legacy-peer-deps"
  exit 1
fi

# Étape 5: Vérifier les CLI
echo "🔧 Vérification des outils Expo..."
if ! command -v expo &> /dev/null; then
  echo "Installation d'Expo CLI..."
  npm install -g @expo/cli
fi

if ! command -v eas &> /dev/null; then
  echo "Installation d'EAS CLI..."
  npm install -g eas-cli
fi

# Étape 6: Login Expo
echo "🔑 Vérification de l'authentification Expo..."
if ! expo whoami &> /dev/null; then
  echo "🔐 Connexion à Expo requise:"
  echo "   expo login"
  echo ""
  echo "Connectez-vous puis relancez ce script."
  exit 1
fi

# Étape 7: Build APK via EAS (méthode cloud - recommandée pour Termux)
echo "☁️  Lancement du build APK via EAS Build..."
echo "Configuration: Expo SDK 53 + React Native 0.79.3"
echo "Build Type: APK (installation directe)"
echo ""
echo "⏱️  Le build peut prendre 5-15 minutes..."

# Build avec EAS (cloud build - pas de ressources locales requises)
# Configuration optimisée pour éviter les erreurs CMake et Hermes
export ANDROID_NATIVE_API_LEVEL=33
export EXPO_USE_HERMES=false
export EXPO_USE_FAST_RESOLVER=true

eas build --platform android --profile preview --non-interactive --clear-cache

# Vérifier le résultat
if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Build APK terminé avec succès!"
  echo ""
  echo "📱 Votre APK est disponible sur:"
  echo "   🔗 https://expo.dev/builds"
  echo ""
  echo "📋 Installation sur votre appareil:"
  echo "   1. Ouvrez le lien ci-dessus dans votre navigateur"
  echo "   2. Téléchargez l'APK"
  echo "   3. Activez 'Sources inconnues' dans Android"
  echo "   4. Installez l'APK"
  echo ""
  echo "🔋 Désactivation du wake lock..."
  if command -v termux-wake-unlock &> /dev/null; then
    termux-wake-unlock
  fi
else
  echo ""
  echo "❌ Échec du build"
  echo ""
  echo "🔧 Solutions Termux:"
  echo "   - Vérifiez votre connexion internet"
  echo "   - Vérifiez le statut EAS: https://status.expo.dev"
  echo "   - Consultez les logs détaillés ci-dessus"
  echo ""
  echo "🔋 Désactivation du wake lock..."
  if command -v termux-wake-unlock &> /dev/null; then
    termux-wake-unlock
  fi
  exit 1
fi