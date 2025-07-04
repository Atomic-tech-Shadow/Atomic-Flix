#!/usr/bin/env node

/**
 * Script simplifié pour créer un APK TWA d'ATOMIC FLIX
 * Utilise PWABuilder et des outils simples pour éviter les complications JDK
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const config = {
  packageId: "app.vercel.atomic_flix.twa",
  host: "atomic-flix.vercel.app",
  name: "ATOMIC FLIX",
  shortName: "ATF",
  startUrl: "/",
  themeColor: "#8F00FF",
  backgroundColor: "#0F111A",
  iconUrl: "https://atomic-flix.vercel.app/assets/atomic-logo.png",
  display: "standalone"
};

console.log('🚀 Création de l\'APK TWA pour ATOMIC FLIX...');

// Créer le manifeste Bubblewrap
const twaManifest = {
  packageId: config.packageId,
  host: config.host,
  name: config.name,
  launcherName: config.name,
  display: config.display,
  themeColor: config.themeColor,
  backgroundColor: config.backgroundColor,
  startUrl: config.startUrl,
  iconUrl: config.iconUrl,
  maskableIconUrl: config.iconUrl,
  orientation: "default",
  webManifestUrl: `https://${config.host}/manifest.json`,
  shortcuts: [],
  enableNotifications: true,
  signing: {
    keystore: "./android.keystore",
    alias: "android",
    keystorePassword: "android",
    keyPassword: "android"
  },
  alphaDependencies: {
    enabled: false
  },
  features: {
    fullPagination: false
  }
};

// Sauvegarder la configuration
fs.writeFileSync('twa-manifest.json', JSON.stringify(twaManifest, null, 2));

console.log('✅ Configuration sauvegardée dans twa-manifest.json');

// Créer le fichier assetlinks.json template
const assetlinksTemplate = `[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "${config.packageId}",
      "sha256_cert_fingerprints": [
        "SHA256_FINGERPRINT_PLACEHOLDER"
      ]
    }
  }
]`;

// Créer le dossier .well-known
const wellKnownDir = '../client/public/.well-known';
if (!fs.existsSync(wellKnownDir)) {
  fs.mkdirSync(wellKnownDir, { recursive: true });
}

fs.writeFileSync(path.join(wellKnownDir, 'assetlinks.json'), assetlinksTemplate);

console.log('✅ Template assetlinks.json créé dans client/public/.well-known/');

// Instructions pour l'utilisateur
console.log(`
🎯 Configuration TWA créée avec succès!

📋 Étapes suivantes:

1. Aller sur PWABuilder pour générer l'APK:
   https://www.pwabuilder.com/

2. Entrer l'URL: https://atomic-flix.vercel.app

3. Cliquer sur "Package For Stores" puis "Android"

4. Utiliser ces paramètres:
   • Package ID: ${config.packageId}
   • App Name: ${config.name}
   • Short Name: ${config.shortName}
   • Theme Color: ${config.themeColor}
   • Background Color: ${config.backgroundColor}
   • Display Mode: ${config.display}
   • Start URL: ${config.startUrl}

5. Générer et télécharger l'APK

6. Déployer assetlinks.json sur Vercel:
   Le fichier template est dans: client/public/.well-known/assetlinks.json
   
7. Mettre à jour l'empreinte SHA256 dans assetlinks.json
   (PWABuilder fournira cette empreinte avec l'APK)

8. Redéployer sur Vercel pour activer TWA

📱 L'APK résultant ouvrira ATOMIC FLIX sans barre d'URL!
`);

// Créer un script d'aide pour obtenir l'empreinte SHA256
const helpScript = `#!/bin/bash
# Script pour obtenir l'empreinte SHA256 d'un APK

if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <path-to-apk>"
    exit 1
fi

APK_PATH="$1"

echo "🔍 Extraction de l'empreinte SHA256 de l'APK..."

# Extraire le certificat
unzip -p "$APK_PATH" META-INF/*.RSA | keytool -printcert -inform DER | grep "SHA256:" | cut -d' ' -f3

echo "📋 Copiez cette empreinte dans assetlinks.json"
`;

fs.writeFileSync('get-sha256.sh', helpScript);
execSync('chmod +x get-sha256.sh');

console.log('✅ Script d\'aide créé: get-sha256.sh');