#!/bin/bash

echo "🤖 ATOMIC FLIX - Configuration Termux pour Build APK"
echo "=================================================="

# Vérifier que nous sommes dans Termux
if [ ! -d "/data/data/com.termux" ]; then
  echo "❌ Ce script doit être exécuté dans Termux"
  exit 1
fi

# Étape 1: Mise à jour Termux et installation des packages essentiels
echo "📦 Mise à jour de Termux et installation des packages..."
pkg update && pkg upgrade -y
pkg install -y nodejs-lts python build-essential git coreutils vim nano

# Étape 2: Vérifier les versions
echo "✅ Vérification des installations:"
echo "Node.js: $(node --version)"
echo "npm: $(npm --version)"
echo "Python: $(python --version)"

# Étape 3: Configuration du stockage
echo "📁 Configuration de l'accès au stockage..."
termux-setup-storage

# Étape 4: Installation des CLI Expo modernes
echo "🔧 Installation d'Expo CLI et EAS CLI..."
npm install -g @expo/cli eas-cli

# Vérifier les installations
echo "✅ Vérification des CLI:"
echo "Expo CLI: $(npx expo --version)"
echo "EAS CLI: $(eas --version)"

# Étape 5: Optimisation pour Termux
echo "⚡ Optimisations Termux..."

# Créer le dossier de projets dans le stockage interne Termux
mkdir -p ~/projects
cd ~/projects

# Configuration npm pour éviter les erreurs de permissions
npm config set cache ~/.npm
npm config set prefix ~/.npm-global

# Ajouter le répertoire npm global au PATH
echo 'export PATH="$HOME/.npm-global/bin:$PATH"' >> ~/.bashrc

# Étape 6: Wake lock pour éviter les interruptions
echo "🔋 Configuration du wake lock..."
pkg install -y termux-api
echo "💡 Utilisez 'termux-wake-lock' avant les longs builds"

echo ""
echo "✅ Configuration Termux terminée!"
echo ""
echo "📋 Prochaines étapes pour ATOMIC FLIX:"
echo "1. cd mobile"
echo "2. ./termux-build-apk.sh"
echo ""
echo "💡 Conseil: Exécutez 'termux-wake-lock' avant les builds longs"
echo "💡 Tous les projets doivent être dans: ~/projects/"