# 📱 Guide Complet - APK Android TWA pour ATOMIC FLIX

Ce guide vous explique comment créer une application Android native à partir de votre site PWA ATOMIC FLIX, sans afficher la barre d'adresse URL.

## 🎯 Objectif

Transformer https://atomic-flix.vercel.app en application Android native utilisant **Trusted Web Activity (TWA)** pour une expérience 100% native.

## 📋 Prérequis

- Site PWA déployé sur https://atomic-flix.vercel.app ✅
- Compte Vercel pour déployer assetlinks.json ✅
- Appareil Android pour tester l'APK

## 🚀 Méthode Recommandée : PWABuilder

### Étape 1: Générer l'APK

1. **Aller sur PWABuilder**
   - URL: https://www.pwabuilder.com/
   - Entrer: `https://atomic-flix.vercel.app`
   - Cliquer sur "Start"

2. **Analyser votre PWA**
   - PWABuilder analysera automatiquement votre site
   - Vérifier que le score PWA est élevé

3. **Générer l'APK Android**
   - Cliquer sur "Package For Stores"
   - Sélectionner "Android"
   - Choisir "Signed APK"

4. **Configurer les paramètres**
   ```
   Package ID: app.vercel.atomic_flix.twa
   App Name: ATOMIC FLIX
   Short Name: ATF
   Theme Color: #8F00FF
   Background Color: #0F111A
   Display Mode: standalone
   Start URL: /
   ```

5. **Télécharger l'APK**
   - PWABuilder générera l'APK
   - Télécharger le fichier .apk et les informations de signature

### Étape 2: Configurer Digital Asset Links

1. **Obtenir l'empreinte SHA256**
   - PWABuilder fournit cette information avec l'APK
   - Ou utiliser: `./get-sha256.sh votre-apk.apk`

2. **Mettre à jour assetlinks.json**
   ```bash
   # Dans le dossier android-twa
   node deploy-assetlinks.js "VOTRE_EMPREINTE_SHA256"
   ```

3. **Déployer sur Vercel**
   ```bash
   git add client/public/.well-known/assetlinks.json
   git commit -m "Add assetlinks.json for TWA"
   git push
   ```

4. **Vérifier le déploiement**
   - Visiter: https://atomic-flix.vercel.app/.well-known/assetlinks.json
   - Le fichier doit être accessible publiquement

### Étape 3: Tester l'APK

1. **Installer l'APK**
   ```bash
   # Avec ADB
   adb install votre-apk.apk
   
   # Ou transférer sur l'appareil et installer manuellement
   ```

2. **Vérifier le fonctionnement**
   - Ouvrir l'application ATOMIC FLIX
   - ✅ Pas de barre d'URL visible
   - ✅ Navigation fluide
   - ✅ Fonctionnalités complètes

## 🛠️ Méthode Alternative : Bubblewrap CLI

Si PWABuilder ne fonctionne pas, utiliser Bubblewrap :

```bash
# Installation globale
npm install -g @bubblewrap/cli

# Initialisation
bubblewrap init \
  --packageId="app.vercel.atomic_flix.twa" \
  --name="ATOMIC FLIX" \
  --host="atomic-flix.vercel.app" \
  --startUrl="/" \
  --themeColor="#8F00FF" \
  --backgroundColor="#0F111A" \
  --iconUrl="https://atomic-flix.vercel.app/assets/atomic-logo.png" \
  --display="standalone"

# Construction
bubblewrap build
```

## 🔧 Configuration Détaillée

### Paramètres de l'Application

| Paramètre | Valeur |
|-----------|--------|
| Package ID | `app.vercel.atomic_flix.twa` |
| App Name | ATOMIC FLIX |
| Short Name | ATF |
| Start URL | `/` |
| Host | `atomic-flix.vercel.app` |
| Theme Color | `#8F00FF` (violet) |
| Background Color | `#0F111A` (noir) |
| Display Mode | `standalone` |
| Orientation | `default` |

### Contenu assetlinks.json

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

## 🔍 Vérifications et Tests

### Checklist de Vérification

- [ ] APK généré avec succès
- [ ] assetlinks.json déployé sur Vercel
- [ ] Empreinte SHA256 correcte dans assetlinks.json
- [ ] Application installable sur Android
- [ ] Ouverture sans barre d'URL
- [ ] Navigation fonctionnelle
- [ ] Recherche d'anime fonctionnelle
- [ ] Lecture vidéo fonctionnelle

### Tests de Fonctionnement

1. **Test d'ouverture**
   - L'app s'ouvre directement sur ATOMIC FLIX
   - Pas de barre d'adresse visible
   - Logo ATOMIC FLIX visible

2. **Test de navigation**
   - Recherche d'anime
   - Sélection de saisons
   - Lecture de vidéos
   - Retour en arrière

3. **Test de partage**
   - Partager un lien depuis l'app
   - Le lien s'ouvre dans l'app (pas le navigateur)

## ❗ Résolution de Problèmes

### Problème: Barre d'URL visible

**Causes possibles:**
- assetlinks.json non accessible
- Empreinte SHA256 incorrecte
- Délai de propagation Vercel

**Solutions:**
1. Vérifier https://atomic-flix.vercel.app/.well-known/assetlinks.json
2. Contrôler l'empreinte SHA256
3. Attendre 5-10 minutes après déploiement
4. Redémarrer l'application

### Problème: Installation échoue

**Solutions:**
1. Activer "Sources inconnues" sur Android
2. Vérifier l'espace de stockage
3. Utiliser une version Android supportée (API 16+)

### Problème: App ne démarre pas

**Solutions:**
1. Vérifier la connectivité internet
2. Contrôler que le site ATOMIC FLIX est accessible
3. Redémarrer l'appareil

## 📦 Fichiers Générés

```
android-twa/
├── twa-manifest.json          # Configuration Bubblewrap
├── build-apk-simple.js        # Script de génération
├── deploy-assetlinks.js       # Script de déploiement
├── get-sha256.sh             # Utilitaire d'empreinte
└── README.md                 # Documentation

client/public/.well-known/
└── assetlinks.json           # Validation TWA
```

## 🎉 Résultat Final

Votre application Android ATOMIC FLIX:
- ✅ S'ouvre sans barre d'URL
- ✅ Expérience 100% native
- ✅ Performances optimales
- ✅ Toutes les fonctionnalités PWA
- ✅ Prête pour publication sur Google Play Store

## 📞 Support

Pour toute question sur ce processus TWA, référez-vous à:
- Documentation PWABuilder: https://docs.pwabuilder.com/
- Guide TWA Google: https://developers.google.com/web/android/trusted-web-activity/