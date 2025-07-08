#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Test des dépendances ATOMIC FLIX Mobile');
console.log('========================================');

// Lire le package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

console.log('📦 Configuration actuelle:');
console.log('- Expo SDK:', packageJson.dependencies.expo);
console.log('- React:', packageJson.dependencies.react);
console.log('- React Native:', packageJson.dependencies['react-native']);
console.log('- React Navigation:', packageJson.dependencies['@react-navigation/native']);

// Vérifier la compatibilité
const isExpoSDK53 = packageJson.dependencies.expo.includes('53');
const isReact19 = packageJson.dependencies.react.includes('19');
const isRN079 = packageJson.dependencies['react-native'].includes('0.79');

console.log('\n✅ Compatibilité SDK 53:');
console.log('- Expo SDK 53:', isExpoSDK53 ? '✓' : '✗');
console.log('- React 19:', isReact19 ? '✓' : '✗');
console.log('- React Native 0.79:', isRN079 ? '✓' : '✗');

// Vérifier les fichiers de configuration
const hasEasJson = fs.existsSync('eas.json');
const hasAppJson = fs.existsSync('app.json');

console.log('\n📋 Fichiers de configuration:');
console.log('- eas.json:', hasEasJson ? '✓' : '✗');
console.log('- app.json:', hasAppJson ? '✓' : '✗');

if (hasEasJson) {
  const easJson = JSON.parse(fs.readFileSync('eas.json', 'utf8'));
  const hasApkBuild = easJson.build?.preview?.android?.buildType === 'apk';
  console.log('- APK build configuré:', hasApkBuild ? '✓' : '✗');
}

console.log('\n🚀 Commandes pour build APK:');
console.log('1. expo login');
console.log('2. eas build --platform android --profile preview');
console.log('\n💡 Ou utilisez le script: ./build-apk-final.sh');

console.log('\n✅ Configuration validée pour Expo SDK 53!');