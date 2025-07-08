# 🤖 ATOMIC FLIX Mobile - Build APK Termux

## Configuration Complète

Application React Native optimisée pour build APK dans Termux, basée sur :
- **Expo SDK 53** + **React Native 0.79.3** + **React 19**
- **EAS Build Cloud** (pas de SDK Android local requis)
- **Termux optimizations** (wake lock, cache, storage)

## Quick Start Termux

### 1. Setup Initial (une fois)
```bash
npm run termux:setup
```

### 2. Validation Configuration
```bash
npm run termux:validate
```

### 3. Build APK
```bash
npm run termux:build
```

## Build APK Standard

### Méthode Cloud (Recommandée Termux)
```bash
expo login
eas build --platform android --profile preview
```

### Scripts Disponibles
```bash
npm run start:tunnel        # Dev server avec tunnel
npm run termux:setup        # Configuration Termux
npm run termux:validate     # Validation environnement
npm run termux:build        # Build APK Termux
npm run build:android       # Build APK standard
npm run build:production    # Build production
```

## Configuration Termux

### Packages Requis
- `nodejs-lts python build-essential git`
- `@expo/cli eas-cli`
- `termux-api` (pour wake lock)

### Optimisations
- **Wake lock**: `termux-wake-lock` avant builds longs
- **Cache npm**: Configuration stockage interne
- **Legacy deps**: `--legacy-peer-deps` pour React 19

## Fichiers Termux

- `termux-setup.sh` - Configuration automatique
- `termux-build-apk.sh` - Build APK optimisé
- `termux-validate.sh` - Test environnement
- `TERMUX-GUIDE.md` - Documentation complète
- `TERMUX-FINAL.md` - Guide final

## Résultat

APK Android ATOMIC FLIX disponible sur:
🔗 https://expo.dev/builds

Compatible Android 5.0+ (API 21+)