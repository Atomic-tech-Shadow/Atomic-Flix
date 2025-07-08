# 🚀 Guide de Build APK - ATOMIC FLIX Mobile

## Méthodes pour créer l'APK

### Méthode 1: EAS Build (Recommandée)

1. **Installation des outils:**
   ```bash
   npm install -g @expo/cli eas-cli
   ```

2. **Installation des dépendances:**
   ```bash
   cd mobile
   npm install --legacy-peer-deps
   ```

3. **Login Expo:**
   ```bash
   expo login
   ```

4. **Build APK:**
   ```bash
   eas build --platform android --profile preview
   ```

### Méthode 2: Expo Build (Legacy)

1. **Installation:**
   ```bash
   npm install -g expo-cli
   ```

2. **Login:**
   ```bash
   expo login
   ```

3. **Build:**
   ```bash
   expo build:android --type apk
   ```

### Méthode 3: TWA (Trusted Web Activity) - Alternative

Si le build React Native pose problème, utilisez la méthode TWA qui encapsule la version web:

1. **Utiliser Bubblewrap CLI:**
   ```bash
   npm install -g @bubblewrap/cli
   bubblewrap init --manifest=https://atomic-flix.vercel.app/manifest.json
   bubblewrap build
   ```

## Configuration requise

### package.json - Dépendances corrigées
```json
{
  "dependencies": {
    "expo": "~53.0.0",
    "react": "18.3.1",
    "react-native": "0.76.3",
    "@react-navigation/native": "^6.1.18",
    "@react-navigation/stack": "^6.4.1"
  }
}
```

### app.json - Configuration Expo
```json
{
  "expo": {
    "name": "ATOMIC FLIX",
    "slug": "atomic-flix",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#0a0a0a"
    },
    "android": {
      "package": "com.atomicflix.mobile",
      "versionCode": 1,
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#0a0a0a"
      }
    }
  }
}
```

## Résolution des problèmes courants

### Erreur de dépendances
```bash
npm install --legacy-peer-deps --force
```

### Erreur de build
```bash
expo r -c  # Clear cache
expo install  # Install Expo SDK
```

### Erreur de permissions
```bash
chmod +x build-apk.sh
```

## Étapes après le build

1. **Télécharger l'APK** depuis le tableau de bord Expo
2. **Tester l'APK** sur un appareil Android
3. **Publier sur Amazon Appstore** (voir android-publish-guide.md)

## Liens utiles

- [Expo Documentation](https://docs.expo.dev/)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [React Native Documentation](https://reactnative.dev/)