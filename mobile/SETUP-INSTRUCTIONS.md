# 📱 Configuration Mobile ATOMIC FLIX

## Aperçu
L'application mobile React Native Expo reproduit exactement la même interface, fonctionnalités et design que le site web atomic-flix.vercel.app.

## ✅ Fonctionnalités Synchronisées

### Interface Identique au Site Web
- **Header ATOMIC FLIX** : Logo atomique cyan/magenta identique
- **Recherche** : Barre de recherche avec debounce et même API
- **Design** : Couleurs, gradients et animations identiques
- **Navigation** : Stack navigation reproduisant le routing web

### Pages Adaptées
1. **HomeScreen_new.tsx** ← anime-sama.tsx
   - Recherche d'animes en temps réel
   - Affichage trending/populaire
   - Cartes anime avec même design
   
2. **AnimeDetailScreen_exact.tsx** ← anime.tsx
   - Banner avec poster et métadonnées
   - Synopsis et informations
   - Grille des saisons disponibles
   
3. **AnimePlayerScreen_exact.tsx** ← anime-player.tsx
   - Interface de lecture vidéo
   - Sélection d'épisodes et serveurs
   - Contrôles de navigation
   
4. **MangaReaderScreen_exact.tsx** ← manga-reader.tsx
   - Lecteur de pages manga
   - Navigation chapitres
   - Contrôles tactiles

## 🔧 Installation Manuelle Requise

### WebView pour Lecteur Vidéo
```bash
cd mobile
npm install react-native-webview --legacy-peer-deps
```

### Dépendances Expo Requises
```bash
npx expo install expo-linear-gradient
npx expo install @expo/vector-icons
npx expo install expo-status-bar
```

## 🚀 Lancement de l'App Mobile

### Mode Développement
```bash
cd mobile
npx expo start
```

### Scanner QR Code
- **Android** : Expo Go app
- **iOS** : Camera app native

### Build APK/IPA
```bash
# Android APK
npx expo build:android --type apk

# iOS IPA (nécessite compte Apple Developer)
npx expo build:ios --type archive
```

## 📊 API Configuration

### Même API que le Site Web
- **Base URL** : `https://anime-sama-scraper.vercel.app`
- **Endpoints** : /trending, /search, /anime, /episodes, /embed
- **Error Handling** : Retry automatique avec exponential backoff
- **Types** : Interfaces TypeScript partagées

## 🎯 Résultat Final

L'utilisateur obtient :
- **Interface 100% identique** au site web
- **Même fonctionnalités** (streaming, manga, notifications)
- **Navigation native** Android/iOS
- **Performance optimisée** React Native
- **Expérience cohérente** sur tous les devices

## 🔄 Synchronisation Continue

Toute modification du site web peut être facilement reportée :
1. **Design** : Copier les styles CSS vers StyleSheet React Native
2. **Logique** : Adapter les hooks React vers React Native
3. **API** : Même configuration et endpoints
4. **Types** : Interfaces TypeScript partagées

## 📝 Notes Techniques

- **Navigation** : React Navigation Stack
- **State Management** : TanStack Query identique
- **Styling** : StyleSheet reproduisant Tailwind CSS
- **Icons** : Expo Vector Icons (Ionicons)
- **Gradients** : Expo Linear Gradient
- **Types** : TypeScript strict avec interfaces partagées

Cette configuration garantit une synchronisation parfaite entre le site web et l'application mobile !