#!/bin/bash

echo "📱 ATOMIC FLIX Mobile - Installation des dépendances corrigées"

# Clean install pour éviter les conflits
echo "Nettoyage des anciennes dépendances..."
rm -rf node_modules package-lock.json

echo "Installation des dépendances SDK 53 compatibles..."

# Dépendances Expo SDK 53
npx expo install expo@~53.0.0
npx expo install expo-status-bar@~2.2.3
npx expo install expo-linear-gradient@~14.0.2
npx expo install expo-av@~15.0.1

# Vector Icons (utiliser @expo/vector-icons au lieu de react-native-vector-icons)
npx expo install @expo/vector-icons@^14.0.0

# Navigation React Native compatible
npm install @react-navigation/native@^7.0.0
npm install @react-navigation/stack@^7.0.0
npx expo install react-native-screens@~4.4.2
npx expo install react-native-safe-area-context@~4.12.1  
npx expo install react-native-gesture-handler@~2.20.2
npx expo install react-native-reanimated@~3.16.5

# State management
npm install @tanstack/react-query@^5.60.5

# EAS Build CLI pour les builds modernes
npm install -g @expo/eas-cli

echo "✅ Installation terminée avec les versions compatibles Expo SDK 53 !"
echo ""
echo "Vérifications :"
echo "  npx expo doctor"
echo ""
echo "Démarrer l'app :"
echo "  npx expo start"
echo ""
echo "Build APK (moderne) :"
echo "  eas build --platform android --profile preview"