#!/bin/bash

echo "📱 Installation des dépendances ATOMIC FLIX Mobile"

# Dépendances Expo requises
echo "Installing Expo dependencies..."
npx expo install expo-linear-gradient
npx expo install @expo/vector-icons
npx expo install expo-status-bar

# Navigation
echo "Installing navigation..."
npm install @react-navigation/native @react-navigation/stack
npx expo install react-native-screens react-native-safe-area-context
npx expo install react-native-gesture-handler

# State management
echo "Installing state management..."
npm install @tanstack/react-query

# WebView (optionnel pour le lecteur vidéo)
echo "Installing WebView (optional)..."
npm install react-native-webview --legacy-peer-deps || echo "WebView installation failed - will use placeholder"

echo "✅ Installation terminée !"
echo ""
echo "Pour démarrer l'app :"
echo "  npx expo start"
echo ""
echo "Pour scanner le QR code :"
echo "  📱 Android: Expo Go app"
echo "  📱 iOS: Camera app"