#!/bin/bash

# ATOMIC FLIX - Build Android APK Script
# This script builds the React Native Expo app into an Android APK

echo "🚀 Building ATOMIC FLIX Android APK..."
echo "========================================"

# Check if we're in the mobile directory
if [ ! -f "app.json" ]; then
    echo "❌ Error: Please run this script from the mobile/ directory"
    exit 1
fi

# Check if Expo CLI is installed
if ! command -v expo &> /dev/null; then
    echo "📦 Installing Expo CLI..."
    npm install -g @expo/cli
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build for Android
echo "🏗️  Building Android APK..."
echo "This will create a production-ready APK file..."

# Create APK build
expo build:android --type apk

echo "✅ Build process started!"
echo ""
echo "📱 ATOMIC FLIX Mobile App Build Information:"
echo "   - Platform: Android APK"
echo "   - Architecture: Universal"
echo "   - Features: Identical to web version"
echo ""
echo "⏳ The build process will take several minutes."
echo "   You can check the build status at: https://expo.dev/"
echo ""
echo "📲 Once complete, you can download the APK from the Expo dashboard"
echo "   or install it directly on your Android device."