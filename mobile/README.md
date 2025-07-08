# 🤖 ATOMIC FLIX Mobile - Build APK

## Configuration React Native

Application mobile optimisée pour build APK :
- **Expo SDK 53** + **React Native 0.79.3** + **React 19**
- **EAS Build Cloud** (compilation serveur)
- **Termux compatible** avec optimisations spéciales

## Quick Start

### Build APK Standard
```bash
expo login
eas build --platform android --profile preview
```

### Build APK Termux
```bash
npm run termux:setup      # Configuration une fois
npm run termux:validate   # Vérification environnement
npm run termux:build      # Build APK optimisé
```

## Scripts Disponibles

```bash
npm run start:tunnel        # Dev server avec tunnel
npm run termux:setup        # Configuration Termux
npm run termux:validate     # Validation environnement
npm run termux:build        # Build APK Termux
npm run build:android       # Build APK standard
npm run build:production    # Build production
```

## Fichiers Termux

- `termux-setup.sh` - Configuration automatique
- `termux-build-apk.sh` - Build APK optimisé
- `termux-validate.sh` - Test environnement
- `TERMUX-FINAL.md` - Guide complet

## Résultat

APK Android ATOMIC FLIX disponible sur:
🔗 https://expo.dev/builds

Compatible Android 5.0+ (API 21+)