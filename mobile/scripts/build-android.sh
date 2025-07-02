#!/bin/bash

# Script de build pour Android APK
echo "🚀 Building ATOMIC FLIX Android APK..."

# Installation des dépendances si nécessaire
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build de l'APK de production
echo "🔨 Building production APK..."
npx expo build:android --type apk

echo "✅ Android APK build completed!"
echo "🎉 Your ATOMIC FLIX APK is ready for distribution!"