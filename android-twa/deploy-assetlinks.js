#!/usr/bin/env node

/**
 * Script pour déployer assetlinks.json sur Vercel
 * Met à jour automatiquement le fichier avec l'empreinte SHA256 fournie
 */

import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
🔧 Déploiement d'assetlinks.json pour TWA

Usage:
  node deploy-assetlinks.js <SHA256_FINGERPRINT>

Exemple:
  node deploy-assetlinks.js "A1:B2:C3:D4:E5:F6:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB"

📋 Pour obtenir l'empreinte SHA256:
1. Télécharger l'APK depuis PWABuilder
2. Utiliser: ./get-sha256.sh path/to/your.apk
3. Ou suivre les instructions de PWABuilder
`);
  process.exit(1);
}

const sha256Fingerprint = args[0];
const assetlinksPath = '../client/public/.well-known/assetlinks.json';

// Valider le format SHA256
const sha256Regex = /^[A-F0-9:]{95}$|^[A-F0-9]{64}$/i;
if (!sha256Regex.test(sha256Fingerprint.replace(/:/g, ''))) {
  console.error('❌ Format d\'empreinte SHA256 invalide');
  console.log('📋 Format attendu: A1:B2:C3:... ou A1B2C3...');
  process.exit(1);
}

// Formater l'empreinte avec des deux-points si nécessaire
const formattedFingerprint = sha256Fingerprint.includes(':') 
  ? sha256Fingerprint 
  : sha256Fingerprint.match(/.{2}/g).join(':');

const assetlinks = [
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.vercel.atomic_flix.twa",
      "sha256_cert_fingerprints": [
        formattedFingerprint
      ]
    }
  }
];

// Écrire le fichier assetlinks.json
try {
  fs.writeFileSync(assetlinksPath, JSON.stringify(assetlinks, null, 2));
  console.log('✅ assetlinks.json mis à jour avec succès');
  console.log(`📍 Empreinte: ${formattedFingerprint}`);
  console.log(`📂 Fichier: ${assetlinksPath}`);
  
  console.log(`
📤 Étapes de déploiement:

1. Commiter les changements:
   git add client/public/.well-known/assetlinks.json
   git commit -m "Add assetlinks.json for TWA"

2. Pousser sur Vercel:
   git push

3. Vérifier le déploiement:
   https://atomic-flix.vercel.app/.well-known/assetlinks.json

4. Tester l'APK TWA:
   - Installer l'APK sur Android
   - Ouvrir l'application
   - Vérifier qu'il n'y a pas de barre d'URL

🎯 Votre application TWA devrait maintenant s'ouvrir sans barre d'adresse!
`);

} catch (error) {
  console.error('❌ Erreur lors de l\'écriture du fichier:', error.message);
  process.exit(1);
}