#!/bin/bash

echo "🚀 ATOMIC FLIX Mobile APK Builder"
echo "================================="

# Aller dans le dossier mobile
cd "$(dirname "$0")"

# Vérifier la présence d'app.json
if [ ! -f "app.json" ]; then
  echo "❌ app.json not found. Please run this script from the mobile directory."
  exit 1
fi

# Nettoyer les dépendances existantes
echo "🧹 Cleaning existing dependencies..."
rm -rf node_modules package-lock.json

# Installer les dépendances via npm avec overrides pour React 19
echo "📦 Installing dependencies..."
npm install

# Vérifier l'installation
if [ $? -ne 0 ]; then
  echo "❌ Failed to install dependencies"
  exit 1
fi

# Vérifier la présence d'Expo CLI
echo "🔧 Checking Expo CLI..."
if ! command -v expo &> /dev/null; then
  echo "Installing Expo CLI globally..."
  npm install -g @expo/cli
fi

# Vérifier la présence d'EAS CLI
echo "🔧 Checking EAS CLI..."
if ! command -v eas &> /dev/null; then
  echo "Installing EAS CLI globally..."
  npm install -g eas-cli
fi

# Mise à jour de la configuration EAS
echo "⚙️  Updating EAS configuration..."
cat > eas.json << EOF
{
  "cli": {
    "version": ">= 12.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "distribution": "internal"
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  },
  "submit": {
    "production": {}
  }
}
EOF

echo "✅ Setup completed successfully!"
echo ""
echo "To build the APK, run:"
echo "  eas build --platform android --profile preview"
echo ""
echo "Note: You'll need to login to Expo first:"
echo "  expo login"