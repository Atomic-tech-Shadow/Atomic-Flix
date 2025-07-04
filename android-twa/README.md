# ATOMIC FLIX - Android TWA (Trusted Web Activity)

Ce dossier contient les outils pour créer une application Android native à partir du site PWA ATOMIC FLIX.

## Prérequis

- Node.js installé
- Android SDK (optionnel, pour ADB)
- Java JDK (pour keytool)

## Construction de l'APK

### Option 1: Script automatique

```bash
./build-twa.sh
```

### Option 2: Construction manuelle

```bash
cd android-twa

# Initialiser le projet
npx @bubblewrap/cli init --manifest=https://atomic-flix.vercel.app/manifest.json

# Ou configuration manuelle
npx @bubblewrap/cli init \
    --packageId="app.vercel.atomic_flix.twa" \
    --name="ATOMIC FLIX" \
    --host="atomic-flix.vercel.app" \
    --startUrl="/" \
    --themeColor="#8F00FF" \
    --backgroundColor="#0F111A" \
    --iconUrl="https://atomic-flix.vercel.app/assets/atomic-logo.png" \
    --display="standalone"

# Construire l'APK
npx @bubblewrap/cli build
```

## Configuration

### Paramètres de l'application

- **Package ID**: `app.vercel.atomic_flix.twa`
- **Nom**: ATOMIC FLIX
- **Nom court**: ATF
- **URL de démarrage**: `/`
- **Hôte**: `atomic-flix.vercel.app`
- **Couleur du thème**: `#8F00FF`
- **Couleur d'arrière-plan**: `#0F111A`
- **Icône**: `https://atomic-flix.vercel.app/assets/atomic-logo.png`

### Digital Asset Links

Le fichier `assetlinks.json` doit être déployé sur:
```
https://atomic-flix.vercel.app/.well-known/assetlinks.json
```

Contenu:
```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "app.vercel.atomic_flix.twa",
      "sha256_cert_fingerprints": [
        "VOTRE_EMPREINTE_SHA256"
      ]
    }
  }
]
```

## Installation de l'APK

```bash
# Avec ADB
adb install app-release-signed.apk

# Ou transférer l'APK sur votre appareil et installer manuellement
```

## Vérification

1. L'application s'ouvre sans barre d'URL
2. Navigation fluide dans l'application
3. Partage et liens fonctionnent correctement

## Dépannage

### Problème: La barre d'URL apparaît encore

**Solutions:**
1. Vérifiez que `assetlinks.json` est accessible
2. Vérifiez l'empreinte SHA256 dans assetlinks.json
3. Assurez-vous que Chrome est à jour sur l'appareil
4. Redémarrez l'application

### Problème: Erreur de construction

**Solutions:**
1. Vérifiez la connectivité internet
2. Assurez-vous que le manifest PWA est valide
3. Vérifiez que Java JDK est installé pour keytool

## Fichiers générés

- `app-release-signed.apk` - APK signé prêt pour installation
- `app-release-bundle.aab` - Bundle Android pour Google Play Store
- `android.keystore` - Clé de signature (garder secret!)
- `twa-manifest.json` - Configuration du projet