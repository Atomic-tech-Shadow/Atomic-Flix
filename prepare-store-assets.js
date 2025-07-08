#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🎨 Preparing ATOMIC FLIX store assets...');

// Créer les dossiers nécessaires
const assetsDir = path.join(__dirname, 'android-assets');
const iconsDir = path.join(assetsDir, 'icons');
const screenshotsDir = path.join(assetsDir, 'screenshots');
const graphicsDir = path.join(assetsDir, 'graphics');

[assetsDir, iconsDir, screenshotsDir, graphicsDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
});

// Copier le logo existant et le renommer pour les stores
const logoPath = path.join(__dirname, 'client/public/assets/atomic-flix-logo.png');
const iconPath = path.join(iconsDir, 'app-icon-512.png');

if (fs.existsSync(logoPath)) {
  fs.copyFileSync(logoPath, iconPath);
  console.log('✅ App icon prepared (512x512)');
} else {
  console.log('⚠️  Logo not found, you\'ll need to create app icons manually');
}

// Créer le fichier de métadonnées pour les assets
const assetsMetadata = {
  appName: "ATOMIC FLIX",
  packageName: "com.atomicflix.app",
  version: "1.0.0",
  versionCode: 1,
  requiredAssets: {
    icons: [
      { name: "app-icon-512.png", size: "512x512", format: "PNG", required: true },
      { name: "app-icon-114.png", size: "114x114", format: "PNG", required: true }
    ],
    screenshots: [
      { name: "screenshot-home.png", size: "1080x1920", description: "Page d'accueil avec recherche" },
      { name: "screenshot-anime.png", size: "1080x1920", description: "Page détails anime" },
      { name: "screenshot-player.png", size: "1080x1920", description: "Lecteur vidéo" },
      { name: "screenshot-manga.png", size: "1080x1920", description: "Lecteur manga", optional: true }
    ],
    graphics: [
      { name: "feature-graphic.png", size: "1024x500", description: "Bannière principale" },
      { name: "promo-graphic.png", size: "180x120", description: "Graphique promotionnel", optional: true }
    ]
  },
  stores: {
    amazon: {
      url: "https://developer.amazon.com/apps-and-games",
      requirements: "android-publish-guide.md"
    }
  }
};

fs.writeFileSync(
  path.join(assetsDir, 'assets-metadata.json'),
  JSON.stringify(assetsMetadata, null, 2)
);

// Créer des templates SVG pour les assets manquants
const featureGraphicSVG = `
<svg width="1024" height="500" viewBox="0 0 1024 500" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="atomicGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#00ffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff00ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="1024" height="500" fill="#0a0a0a"/>
  <circle cx="200" cy="250" r="80" fill="none" stroke="url(#atomicGradient)" stroke-width="4"/>
  <circle cx="200" cy="250" r="20" fill="url(#atomicGradient)"/>
  <text x="320" y="200" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="url(#atomicGradient)">ATOMIC</text>
  <text x="320" y="280" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="url(#atomicGradient)">FLIX</text>
  <text x="320" y="350" font-family="Arial, sans-serif" font-size="32" fill="#ffffff">Anime & Manga Streaming</text>
  <rect x="50" y="50" width="924" height="400" fill="none" stroke="url(#atomicGradient)" stroke-width="2" rx="20"/>
</svg>
`;

fs.writeFileSync(path.join(graphicsDir, 'feature-graphic-template.svg'), featureGraphicSVG);

console.log('✅ Assets preparation completed!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Review android-publish-guide.md for complete instructions');
console.log('2. Create screenshots using your mobile app');
console.log('3. Follow submission-checklist.md for store submission');
console.log('4. Build your APK with: cd mobile && ./build-release.js');
console.log('');
console.log('📁 Assets directory structure:');
console.log('android-assets/');
console.log('├── icons/           (App icons)');
console.log('├── screenshots/     (App screenshots)');
console.log('├── graphics/        (Store graphics)');
console.log('└── assets-metadata.json');