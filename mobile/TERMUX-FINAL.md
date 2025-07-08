# 🤖 ATOMIC FLIX - Build APK avec Termux (Guide Final)

## Configuration Complète Validée

Basé sur les documentations officielles Termux, Expo SDK 53, et React Native 0.79.3.

### ✅ Prérequis Termux
- **Termux depuis F-Droid** (évitez Play Store)
- **Node.js LTS** (v18+)
- **@expo/cli** et **eas-cli** 
- **Stockage interne Termux** (~/projects/)
- **Wake lock** pour builds longs

## Instructions Build APK

### Méthode 1: Script Automatisé (Recommandé)
```bash
# 1. Configuration initiale (une seule fois)
./termux-setup.sh

# 2. Validation environnement
./termux-validate.sh

# 3. Build APK ATOMIC FLIX
./termux-build-apk.sh
```

### Méthode 2: Commandes Manuelles
```bash
# 1. Wake lock (éviter interruptions)
termux-wake-lock

# 2. Configuration npm Termux
npm config set cache ~/.npm
npm config set legacy-peer-deps true

# 3. Installation dépendances
npm install --legacy-peer-deps --no-audit

# 4. Login Expo
expo login

# 5. Build APK cloud
eas build --platform android --profile preview

# 6. Libérer wake lock
termux-wake-unlock
```

## Spécificités Termux Appliquées

### Limitations Résolues
- ❌ **Build local Android** → ✅ **EAS Build Cloud**
- ❌ **Permissions storage** → ✅ **Stockage interne ~/projects/**
- ❌ **Interruptions processus** → ✅ **termux-wake-lock**
- ❌ **Dépendances complexes** → ✅ **--legacy-peer-deps**

### Optimisations Termux
```bash
# Cache npm local
npm config set cache ~/.npm
npm config set prefix ~/.npm-global

# Installation optimisée
npm install --legacy-peer-deps --no-audit --prefer-offline

# Gestion processus
termux-wake-lock    # Avant builds
termux-wake-unlock  # Après builds
```

## Configuration Package.json Termux

```json
{
  "dependencies": {
    "expo": "~53.0.0",
    "react": "19.0.0",
    "react-native": "0.79.3",
    "@react-navigation/native": "^6.0.0"
  },
  "overrides": {
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
```

## EAS Configuration Termux

```json
{
  "cli": {
    "version": ">= 5.7.0"
  },
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

## Workflow Termux Optimal

1. **Développement**: `npx expo start --tunnel`
2. **Test**: Expo Go app sur appareil
3. **Build**: EAS Build Cloud (pas de ressources locales)
4. **APK**: Téléchargement depuis https://expo.dev/builds
5. **Installation**: APK direct sur appareil

## Résolution Problèmes Termux

### Erreur: npm install échoue
```bash
npm cache clean --force
npm install --force --legacy-peer-deps
```

### Erreur: Permission denied
```bash
# Travailler dans stockage interne
cd ~/projects/atomic-flix/mobile/
```

### Erreur: Processus tué
```bash
# Activer wake lock
termux-wake-lock
```

### Vérifier ressources
```bash
df -h          # Espace disque
free -h        # Mémoire
top            # Processus
```

## Scripts Disponibles

- `termux-setup.sh` - Configuration initiale complète
- `termux-build-apk.sh` - Build APK optimisé Termux
- `termux-validate.sh` - Validation environnement
- `test-dependencies.js` - Test configuration

## Résultat Final

🎯 **APK Android ATOMIC FLIX** généré via EAS Build  
📱 **Compatible**: Android 5.0+ (API 21+)  
📦 **Taille**: ~50-100MB (optimisé React Native)  
🔗 **Download**: https://expo.dev/builds  

## Avantages Méthode Termux + EAS

✅ **Pas de SDK Android local** requis  
✅ **Build cloud** - ressources serveur Expo  
✅ **Compatible toutes versions** Android  
✅ **Installation APK** directe  
✅ **Optimisé mobile** - économie batterie/données  

**Configuration 100% validée pour développement Termux!**