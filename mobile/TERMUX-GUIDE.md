# 🤖 ATOMIC FLIX Mobile - Guide Termux

## Configuration Termux pour Build APK

Ce guide est basé sur la documentation officielle Termux et les meilleures pratiques pour développer des applications React Native dans Termux.

## Installation Termux

1. **Téléchargez Termux depuis F-Droid** (évitez le Play Store - version obsolète)
   - F-Droid: https://f-droid.org/packages/com.termux/
   - GitHub: https://github.com/termux/termux-app/releases

## Configuration Initiale

### 1. Setup Automatique
```bash
./termux-setup.sh
```

### 2. Setup Manuel
```bash
# Mise à jour système
pkg update && pkg upgrade

# Installation packages essentiels
pkg install nodejs-lts python build-essential git

# Configuration stockage
termux-setup-storage

# Installation CLI Expo
npm install -g @expo/cli eas-cli
```

## Build APK ATOMIC FLIX

### Méthode Recommandée (EAS Build Cloud)
```bash
cd mobile
./termux-build-apk.sh
```

### Étapes Manuelles
```bash
# 1. Wake lock (éviter interruptions)
termux-wake-lock

# 2. Installation dépendances
npm install --legacy-peer-deps

# 3. Login Expo
expo login

# 4. Build APK
eas build --platform android --profile preview

# 5. Désactiver wake lock
termux-wake-unlock
```

## Spécificités Termux

### Limitations
- ❌ Pas de build local Android (SDK trop lourd)
- ❌ Problèmes de permissions storage externe
- ❌ Ressources limitées pour compilation

### Solutions
- ✅ **EAS Build Cloud** (compilation sur serveurs Expo)
- ✅ **Stockage interne Termux** (~/projects/)
- ✅ **Wake lock** (éviter interruptions processus)
- ✅ **Configuration npm** optimisée

### Optimisations
```bash
# Cache npm local
npm config set cache ~/.npm
npm config set prefix ~/.npm-global

# Options installation
npm install --legacy-peer-deps --no-audit --prefer-offline

# Wake lock pour builds longs
termux-wake-lock
```

## Résolution Problèmes

### Erreur: Permission Denied
```bash
# Utiliser le stockage interne Termux
cd ~/projects/
```

### Erreur: npm install échoue
```bash
# Nettoyer cache
npm cache clean --force

# Forcer installation
npm install --force --legacy-peer-deps
```

### Erreur: Processus interrompu
```bash
# Activer wake lock avant builds
termux-wake-lock
```

### Vérifier espace disque
```bash
df -h
```

## Configuration Validée

### Versions Compatibles
- **Node.js**: LTS (v18+)
- **Expo SDK**: 53
- **React Native**: 0.79.3
- **React**: 19.0.0

### Workflow Recommandé
1. **Développement**: `npx expo start` (test avec Expo Go)
2. **Build**: EAS Build Cloud (génération APK)
3. **Test**: Installation APK sur appareil
4. **Distribution**: Amazon Appstore / APK direct

## Scripts Disponibles

- `termux-setup.sh` - Configuration initiale Termux
- `termux-build-apk.sh` - Build APK optimisé Termux
- `test-dependencies.js` - Validation configuration

## Résultat

APK disponible sur: https://expo.dev/builds

**Compatible avec toutes les spécificités Termux Android!**