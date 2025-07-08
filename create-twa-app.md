# Créer l'APK TWA pour ATOMIC FLIX

## Vue d'ensemble
Cette approche utilise votre site web exactement comme il est, dans une application Android native.

## Prérequis
- Node.js installé
- Android SDK (via Android Studio)
- Java JDK 11+

## Étape 1: Installation des outils

```bash
# Installer Bubblewrap CLI
npm install -g @bubblewrap/cli

# Vérifier l'installation
bubblewrap --version
```

## Étape 2: Initialiser le projet TWA

```bash
# Créer un nouveau dossier pour la TWA
mkdir atomic-flix-twa
cd atomic-flix-twa

# Initialiser avec le manifest existant
bubblewrap init --manifest https://atomic-flix.vercel.app/manifest.json
```

## Étape 3: Configuration personnalisée

Le fichier `twa-manifest.json` sera créé automatiquement. Ajustements recommandés :

```json
{
  "packageId": "app.vercel.atomic_flix.twa",
  "host": "atomic-flix.vercel.app",
  "name": "ATOMIC FLIX",
  "launcherName": "ATOMIC FLIX",
  "display": "standalone",
  "orientation": "default",
  "themeColor": "#00ffff",
  "backgroundColor": "#0a0a0a",
  "startUrl": "/",
  "iconUrl": "https://atomic-flix.vercel.app/assets/atomic-flix-logo.png",
  "maskableIconUrl": "https://atomic-flix.vercel.app/assets/atomic-flix-logo.png",
  "monochromeIconUrl": "https://atomic-flix.vercel.app/assets/atomic-flix-logo.png",
  "features": {
    "playBilling": {
      "enabled": false
    },
    "locationDelegation": {
      "enabled": false
    },
    "googlePlayBilling": {
      "enabled": false
    }
  },
  "enableNotifications": true,
  "isChromeOSOnly": false,
  "isMetaQuest": false,
  "minSdkVersion": 23,
  "targetSdkVersion": 34
}
```

## Étape 4: Configurer Digital Asset Links

Créer le fichier `assetlinks.json` sur votre serveur web :

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "app.vercel.atomic_flix.twa",
    "sha256_cert_fingerprints": ["SHA256_FINGERPRINT_HERE"]
  }
}]
```

## Étape 5: Générer la clé de signature

```bash
# Générer keystore
keytool -genkey -v -keystore atomic-flix-release-key.keystore -alias atomic-flix -keyalg RSA -keysize 2048 -validity 10000

# Obtenir le SHA256 fingerprint
keytool -list -v -keystore atomic-flix-release-key.keystore -alias atomic-flix
```

## Étape 6: Build de l'APK

```bash
# Build debug (pour tests)
bubblewrap build

# Build release (pour publication)
bubblewrap build --release
```

## Étape 7: Déployer assetlinks.json

Placer le fichier `assetlinks.json` à :
```
https://atomic-flix.vercel.app/.well-known/assetlinks.json
```

## Étape 8: Test et validation

```bash
# Installer sur device pour test
adb install app-release-signed.apk

# Vérifier les asset links
adb shell am start -W -a android.intent.action.VIEW -d "https://atomic-flix.vercel.app" app.vercel.atomic_flix.twa
```

## Avantages de cette approche

✅ **Interface identique** au site web
✅ **Même fonctionnalités** exactes
✅ **Notifications natives** Android
✅ **Pas de barre d'URL**
✅ **Icône dans launcher**
✅ **Performance optimale**
✅ **Une seule codebase** à maintenir

## Fichiers de sortie

- `app-release-signed.apk` - APK prêt pour publication
- `atomic-flix-release-key.keystore` - Clé de signature (à conserver)
- `twa-manifest.json` - Configuration TWA

## Publication sur Amazon Appstore

L'APK TWA peut être publié exactement comme un APK normal :
- Mêmes requirements
- Même processus de soumission
- Même délai d'approbation

## Maintenance future

Pour mettre à jour l'app :
1. Mettre à jour le site web
2. L'app sera automatiquement à jour
3. Pas besoin de republier l'APK (sauf changements de configuration)

Cette solution garantit une expérience 100% cohérente entre web et mobile !