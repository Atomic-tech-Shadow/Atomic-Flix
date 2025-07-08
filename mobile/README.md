# 📱 ATOMIC FLIX Mobile

Application React Native Expo qui reproduit exactement l'interface web d'ATOMIC FLIX.

## 🚀 Démarrage Rapide

```bash
cd mobile
./expo-install-deps.sh
npx expo start
```

Scanner le QR code avec Expo Go (Android) ou Camera (iOS).

## 📁 Structure Optimisée

- **App.tsx** - Point d'entrée
- **src/navigation/** - Navigation stack  
- **src/screens/** - 4 pages reproduisant le web
- **src/types/** - Interfaces TypeScript
- **src/utils/** - Configuration React Query

## 🎯 Fonctionnalités

✅ Interface ATOMIC FLIX identique au web
✅ Recherche d'animes en temps réel
✅ Lecteur vidéo et manga
✅ Navigation native
✅ API synchronisée

Voir **BUILD-GUIDE.md** pour les instructions détaillées.

## 🔨 Build Production

```bash
# Android APK
npm run build:android

# iOS (nécessite Apple Developer)
npm run build:ios
```

L'application mobile reproduit parfaitement le site web avec React Native Expo.