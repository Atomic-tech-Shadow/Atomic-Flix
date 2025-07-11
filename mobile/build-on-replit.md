# Build APK depuis Replit

## Étapes pour construire votre APK ATOMIC FLIX

### 1. Connexion à EAS
```bash
cd mobile
eas login
```
Entrez vos identifiants Expo :
- Email ou nom d'utilisateur
- Mot de passe

### 2. Vérification du projet
```bash
eas project:init
```
Ou si déjà initialisé :
```bash
eas whoami
```

### 3. Build APK
```bash
eas build --platform android --profile preview
```

### 4. Suivi du build
```bash
eas build:list
```

### 5. Téléchargement
Une fois terminé, téléchargez l'APK sur :
https://expo.dev/builds

## Commandes rapides

```bash
# Tout en une fois
cd mobile && eas login && eas build --platform android --profile preview

# Avec cache propre
cd mobile && eas build --platform android --profile preview --clear-cache

# Vérifier le statut
cd mobile && eas build:list
```

## Troubleshooting

Si erreur de connexion :
```bash
eas logout
eas login
```

Si erreur de build :
```bash
eas build --platform android --profile preview --clear-cache
```

Votre APK sera compatible Android 5.0+ et prêt pour installation !