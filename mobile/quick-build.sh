#!/bin/bash

echo "🚀 ATOMIC FLIX - Quick APK Builder"
echo "================================="

# Vérifier si nous sommes dans le bon répertoire
if [ ! -f "app.json" ]; then
  echo "❌ Please run from mobile directory"
  exit 1
fi

# Méthode 1: EAS Build (Recommandée)
echo "📱 Building APK with EAS Build..."
echo ""
echo "Étapes à suivre:"
echo "1. expo login"
echo "2. eas build --platform android --profile preview"
echo ""

# Méthode 2: TWA Alternative
echo "🌐 Alternative: TWA (Trusted Web Activity)"
echo ""
echo "Si le build React Native échoue, utilisez TWA:"
echo "1. npm install -g @bubblewrap/cli"
echo "2. bubblewrap init --manifest=https://atomic-flix.vercel.app/manifest.json"
echo "3. bubblewrap build"
echo ""

# Méthode 3: Expo Legacy
echo "🔧 Legacy: Expo Build"
echo ""
echo "Ancienne méthode (si EAS ne fonctionne pas):"
echo "1. npm install -g expo-cli"
echo "2. expo login"
echo "3. expo build:android --type apk"
echo ""

echo "✅ Choisissez la méthode qui convient le mieux à votre configuration!"
echo ""
echo "📋 Pour plus de détails, consultez BUILD-APK-GUIDE.md"