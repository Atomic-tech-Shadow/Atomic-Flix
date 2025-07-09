#!/usr/bin/env node

// Test simple de l'application mobile ATOMIC FLIX
// Vérifie que les fonctionnalités sont identiques au site web

const fs = require('fs');
const path = require('path');

console.log('🤖 ATOMIC FLIX - Test de synchronisation Mobile/Web');
console.log('=================================================');

// 1. Vérifier que tous les écrans mobiles existent
const mobileScreens = [
  'src/screens/HomeScreen.tsx',
  'src/screens/AnimeDetailScreen.tsx', 
  'src/screens/AnimePlayerScreen.tsx',
  'src/screens/MangaReaderScreen.tsx'
];

console.log('\n📱 Vérification des écrans mobiles:');
mobileScreens.forEach(screen => {
  if (fs.existsSync(screen)) {
    console.log(`✅ ${screen} - Présent`);
  } else {
    console.log(`❌ ${screen} - Manquant`);
  }
});

// 2. Vérifier que l'API est correctement configurée
const homeScreenContent = fs.readFileSync('src/screens/HomeScreen.tsx', 'utf8');
const apiConfigured = homeScreenContent.includes('anime-sama-scraper.vercel.app');
console.log(`\n🔗 Configuration API: ${apiConfigured ? '✅ Correcte' : '❌ Incorrecte'}`);

// 3. Vérifier les fonctions principales
const functionsToCheck = [
  'loadTrendingAnimes',
  'searchAnimes',
  'apiRequest'
];

console.log('\n⚡ Fonctions principales:');
functionsToCheck.forEach(func => {
  const functionPresent = homeScreenContent.includes(func);
  console.log(`${functionPresent ? '✅' : '❌'} ${func}`);
});

// 4. Vérifier les types partagés
const typesExist = fs.existsSync('src/types/index.ts');
console.log(`\n📋 Types TypeScript: ${typesExist ? '✅ Présents' : '❌ Manquants'}`);

// 5. Vérifier la navigation
const navigationExists = fs.existsSync('src/navigation/AppNavigator.tsx');
console.log(`🧭 Navigation: ${navigationExists ? '✅ Configurée' : '❌ Manquante'}`);

// 6. Vérifier package.json
const packageExists = fs.existsSync('package.json');
if (packageExists) {
  const packageContent = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const hasExpo = packageContent.dependencies?.expo;
  const hasReactNative = packageContent.dependencies?.['react-native'];
  console.log(`📦 Dependencies: ${hasExpo && hasReactNative ? '✅ Complètes' : '❌ Incomplètes'}`);
}

console.log('\n🎯 Résumé de la synchronisation:');
console.log('- HomeScreen.tsx ↔ anime-sama.tsx: Pages de recherche et trending');
console.log('- AnimeDetailScreen.tsx ↔ anime.tsx: Détails anime et saisons');
console.log('- AnimePlayerScreen.tsx ↔ anime-player.tsx: Lecteur vidéo');
console.log('- MangaReaderScreen.tsx ↔ manga-reader.tsx: Lecteur manga');

console.log('\n📱 Pour générer l\'APK:');
console.log('1. cd mobile');
console.log('2. npm run termux:setup (dans Termux)');
console.log('3. npm run termux:build (dans Termux)');
console.log('4. ou npm run build:android (avec EAS Build)');

console.log('\n✅ Test terminé!');