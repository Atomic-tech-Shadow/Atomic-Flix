# 🔨 Guide de Build ATOMIC FLIX Mobile

## Structure Nettoyée

### Fichiers Essentiels (11 fichiers TypeScript)
```
mobile/
├── App.tsx                    # Point d'entrée principal
├── src/
│   ├── navigation/
│   │   └── AppNavigator.tsx   # Navigation stack
│   ├── screens/               # Pages reproduisant le web
│   │   ├── HomeScreen.tsx     # ← anime-sama.tsx
│   │   ├── AnimeDetailScreen.tsx # ← anime.tsx
│   │   ├── AnimePlayerScreen.tsx # ← anime-player.tsx
│   │   └── MangaReaderScreen.tsx # ← manga-reader.tsx
│   ├── types/
│   │   └── index.ts          # Interfaces TypeScript
│   └── utils/
│       └── queryClient.ts    # Configuration React Query
```

## 🚀 Build Instructions

### 1. Installation des Dépendances (Corrigées SDK 53)
```bash
cd mobile
./expo-install-deps.sh
npx expo doctor  # Vérifier les problèmes
```

### 2. Démarrage Dev
```bash
npx expo start
```

### 3. Build Production

#### Android APK (Moderne avec EAS)
```bash
# Installation EAS CLI
npm install -g @expo/eas-cli

# Login Expo
eas login

# Configuration
eas build:configure

# Build APK
eas build --platform android --profile preview
```

#### iOS (nécessite Apple Developer)
```bash
eas build --platform ios --profile preview
```

### 4. Build Local avec EAS
```bash
# Installation EAS CLI
npm install -g @expo/eas-cli

# Login Expo
eas login

# Configuration
eas build:configure

# Build Android
eas build --platform android

# Build iOS
eas build --platform ios
```

## 🔧 Résolution des Erreurs Communes

### WebView Dependency Error
```bash
npm install react-native-webview --legacy-peer-deps
```

### React Navigation Errors
```bash
npx expo install react-native-screens react-native-safe-area-context
```

### TypeScript Errors
- Tous les types sont définis dans `src/types/index.ts`
- Import: `import { SearchResult } from '../types/index'`

### Build Failures
```bash
# Clean cache
expo r -c

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Restart
npx expo start
```

## 📱 Test sur Device

### Android
1. Installer Expo Go depuis Play Store
2. Scanner le QR code affiché dans le terminal
3. L'app se lance automatiquement

### iOS
1. Installer Expo Go depuis App Store
2. Scanner le QR code avec l'app Camera native
3. Ouvrir avec Expo Go

## 🎯 Fonctionnalités Testables

✅ **Interface ATOMIC FLIX** - Logo et design identiques
✅ **Recherche d'animes** - API en temps réel
✅ **Navigation** - Stack navigation native
✅ **Affichage détails** - Banner, synopsis, saisons
✅ **Lecteur manga** - Navigation chapitres
✅ **Lecteur vidéo** - Interface (WebView optionnel)

## 📦 Taille Finale

- **APK Android** : ~15-20 MB
- **Bundle iOS** : ~18-25 MB
- **Expo Dev** : Streaming instantané

## 🔄 Mise à Jour

Pour mettre à jour l'app :
1. Modifier le code source
2. Expo recharge automatiquement
3. Pas besoin de rebuild pour le dev

L'app mobile est maintenant optimisée pour un build sans erreur ! 🚀