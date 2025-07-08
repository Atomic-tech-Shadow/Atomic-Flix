#!/bin/bash

echo "🚀 Starting ATOMIC FLIX APK build process..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "app.json" ]; then
  echo "❌ Please run this script from the mobile directory"
  exit 1
fi

# Étape 1: Mettre à jour les dépendances
echo "📦 Installing dependencies..."
npm install

# Étape 2: Vérifier la configuration Expo
echo "⚙️  Checking Expo configuration..."
if ! command -v expo &> /dev/null; then
  echo "Installing Expo CLI..."
  npm install -g @expo/cli
fi

# Étape 3: Login Expo (si nécessaire)
echo "🔑 Checking Expo authentication..."
if ! expo whoami &> /dev/null; then
  echo "Please login to Expo:"
  expo login
fi

# Étape 4: Build de l'APK
echo "🔨 Building APK for production..."
echo "This may take several minutes..."

expo build:android --type apk --release-channel production

if [ $? -eq 0 ]; then
  echo "✅ APK build completed successfully!"
  echo "📱 Your APK is ready for Amazon Appstore submission"
  echo ""
  echo "Next steps:"
  echo "1. Download the APK from the Expo build service"
  echo "2. Test the APK on your device"
  echo "3. Follow the android-publish-guide.md for submission"
else
  echo "❌ Build failed. Please check the error messages above."
  exit 1
fi