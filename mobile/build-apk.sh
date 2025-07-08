#!/bin/bash

echo "🚀 Starting ATOMIC FLIX APK build process..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "app.json" ]; then
  echo "❌ Please run this script from the mobile directory"
  exit 1
fi

# Étape 1: Installer les dépendances
echo "📦 Installing dependencies..."
npm install

# Étape 2: Vérifier la configuration Expo
echo "⚙️  Checking Expo configuration..."
if ! command -v expo &> /dev/null; then
  echo "Installing Expo CLI..."
  npm install -g @expo/cli
fi

# Étape 3: Vérifier EAS CLI
echo "🔧 Checking EAS CLI..."
if ! command -v eas &> /dev/null; then
  echo "Installing EAS CLI..."
  npm install -g eas-cli
fi

# Étape 4: Login Expo/EAS (si nécessaire)
echo "🔑 Checking Expo authentication..."
if ! expo whoami &> /dev/null; then
  echo "Please login to Expo:"
  expo login
fi

# Étape 5: Configurer EAS (si nécessaire)
echo "⚙️  Configuring EAS..."
if [ ! -f "eas.json" ]; then
  eas build:configure
fi

# Étape 6: Build de l'APK
echo "🔨 Building APK for production..."
echo "This may take several minutes..."

# Utiliser EAS Build pour créer l'APK
eas build --platform android --profile preview --non-interactive

if [ $? -eq 0 ]; then
  echo "✅ APK build completed successfully!"
  echo "📱 Your APK is ready for download"
  echo ""
  echo "Next steps:"
  echo "1. Download the APK from the EAS build dashboard"
  echo "2. Test the APK on your device"
  echo "3. Follow the android-publish-guide.md for submission"
else
  echo "❌ Build failed. Please check the error messages above."
  exit 1
fi