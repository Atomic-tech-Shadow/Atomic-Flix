# ATOMIC FLIX Mobile - Application React Native Expo

Application mobile native reproduisant exactement toutes les fonctionnalités du site web ATOMIC FLIX.

## 🚀 Fonctionnalités

### ✅ Fonctionnalités Identiques au Site Web
- **Recherche d'animes/mangas** : Interface de recherche identique avec API anime-sama-scraper
- **Navigation fluide** : Navigation entre les écrans avec animations et transitions
- **Détails d'anime** : Page de détails complète avec synopsis, genres, saisons, langues
- **Lecteur vidéo** : Streaming intégré avec sélection de serveurs et qualité
- **Lecteur de manga** : Interface de lecture avec navigation verticale/horizontale
- **Design identique** : Même thème sombre cyan/violet, mêmes couleurs, même style

### 📱 Fonctionnalités Mobile Spécifiques
- **Interface tactile** : Optimisée pour les écrans tactiles
- **Navigation native** : Stack navigation avec React Navigation
- **Performance** : Application native avec React Native et Expo
- **Responsive** : Adaptation automatique aux différentes tailles d'écran

## 🛠️ Technologies

- **React Native** : Framework mobile multiplateforme
- **Expo** : Plateforme de développement React Native
- **TypeScript** : Typage statique pour une meilleure robustesse
- **React Navigation** : Navigation native entre écrans
- **TanStack Query** : Gestion d'état et cache pour les API
- **Expo AV** : Lecteur vidéo natif pour le streaming
- **Expo Image** : Composant d'image optimisé
- **React Native WebView** : Intégration de lecteurs web
- **Expo Linear Gradient** : Gradients pour le design
- **React Native Vector Icons** : Icônes vectorielles

## 📦 Installation

### Prérequis
- Node.js 18+ installé
- Expo CLI installé globalement
- Expo Go app sur votre téléphone (pour les tests)

### Installation des Dépendances
```bash
cd mobile
npm install
```

### Lancement en Mode Développement
```bash
# Démarrer le serveur de développement
npm start

# Ou directement pour Android
npm run android

# Ou directement pour iOS
npm run ios
```

## 📱 Build APK Android

### Build de Production
```bash
# Installer Expo CLI si nécessaire
npm install -g @expo/cli

# Build APK
npx expo build:android --type apk
```

### Build avec EAS (Recommandé)
```bash
# Installer EAS CLI
npm install -g @expo/eas-cli

# Login Expo
eas login

# Configurer le projet
eas build:configure

# Build APK Android
eas build --platform android --profile preview
```

## 🏗️ Structure du Projet

```
mobile/
├── src/
│   ├── navigation/          # Configuration de navigation
│   │   └── AppNavigator.tsx # Navigation principale
│   ├── screens/             # Écrans de l'application
│   │   ├── HomeScreen.tsx   # Écran d'accueil avec recherche
│   │   ├── AnimeDetailScreen.tsx    # Détails d'anime
│   │   ├── AnimePlayerScreen.tsx    # Lecteur vidéo
│   │   └── MangaReaderScreen.tsx    # Lecteur de manga
│   ├── services/            # Services API
│   │   └── api.ts          # Client API anime-sama-scraper
│   ├── types/              # Types TypeScript
│   │   └── index.ts        # Interfaces partagées
│   └── utils/              # Utilitaires
│       └── queryClient.ts  # Configuration TanStack Query
├── assets/                 # Ressources (icônes, images)
├── App.tsx                # Point d'entrée principal
├── app.json               # Configuration Expo
├── package.json           # Dépendances et scripts
└── README.md             # Documentation
```

## 🎨 Design System

### Couleurs
- **Primary** : Cyan-blue (#0ea5e9)
- **Secondary** : Purple-violet (#d946ef)
- **Dark** : Slate dark (#0f172a, #1e293b)
- **Text** : White/Gray variants

### Animations
- Transitions fluides entre écrans
- Animations de chargement
- Effets tactiles (opacity, scale)
- Gradients animés

## 🔗 API Integration

L'application utilise exactement la même API que le site web :
- **Base URL** : `https://anime-sama-scraper.vercel.app/api`
- **Endpoints** : `/search`, `/anime`, `/episode`, `/manga`
- **Authentification** : Aucune requise
- **Cache** : TanStack Query pour optimiser les performances

## 📋 Scripts Disponibles

```bash
# Développement
npm start              # Démarrer Expo Metro
npm run android        # Lancer sur Android
npm run ios           # Lancer sur iOS
npm run web           # Lancer sur web

# Build
npm run build         # Build de production
```

## 🚀 Déploiement

### Google Play Store
1. Build APK avec `eas build --platform android`
2. Upload sur Google Play Console
3. Configuration des métadonnées
4. Publication

### App Store (iOS)
1. Build IPA avec `eas build --platform ios`
2. Upload via App Store Connect
3. Configuration des métadonnées
4. Publication après review

## 🔧 Configuration

### Variables d'Environnement
Aucune variable d'environnement requise - l'API est publique.

### Permissions Android
- `INTERNET` : Accès réseau pour l'API
- `ACCESS_NETWORK_STATE` : Vérification de la connectivité

## 📱 Tests

### Tests sur Appareil Physique
1. Installer Expo Go depuis le Play Store/App Store
2. Scanner le QR code affiché par `npm start`
3. L'application se lance directement

### Tests sur Émulateur
1. Configurer Android Studio ou Xcode
2. Lancer l'émulateur
3. Utiliser `npm run android` ou `npm run ios`

## 🎯 Fonctionnalités Futures

- Mode hors ligne avec cache local
- Notifications push pour nouveaux épisodes
- Système de favoris synchronisé
- Mode lecture automatique
- Chromecast support
- Download local d'épisodes

## 🤝 Contribution

L'application mobile suit exactement les mêmes standards que le site web :
- Code TypeScript strict
- Architecture modulaire
- Documentation complète
- Tests unitaires (à venir)

## 📄 Licence

Même licence que le projet principal ATOMIC FLIX.