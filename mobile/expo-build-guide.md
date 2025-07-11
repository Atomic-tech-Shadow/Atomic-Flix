# Guide de Build ATOMIC FLIX sur Expo.dev

## Configuration GitHub + Expo

### 1. Connexion GitHub
✅ Votre GitHub est déjà connecté à Expo
✅ Le projet sera automatiquement synchronisé

### 2. Commandes de Build

#### Build Preview (Recommandé)
```bash
eas build --platform android --profile preview
```

#### Build Production
```bash
eas build --platform android --profile production
```

#### Build avec Cache Clear
```bash
eas build --platform android --profile preview --clear-cache
```

### 3. Configuration Optimisée

**Profils disponibles :**
- **development** : Pour les tests avec Expo Go
- **preview** : APK complet pour tests (recommandé)
- **production** : APK final pour publication

**Optimisations incluses :**
- Android API 33 (compatibilité maximale)
- Support multi-architecture (arm64-v8a, armeabi-v7a)
- Moteur JavaScript JSC (pas d'erreurs Hermes)
- Gradle optimisé pour build cloud

### 4. Workflow GitHub

1. **Push votre code** sur GitHub
2. **Lancez le build** depuis votre terminal ou expo.dev
3. **Téléchargez l'APK** depuis https://expo.dev/builds
4. **Installez sur Android** directement

### 5. Avantages vs Termux

**Expo.dev :**
✅ Build cloud (pas de ressources locales)
✅ Pas de problèmes de dépendances
✅ Historique des builds
✅ Intégration GitHub automatique
✅ Builds parallèles possibles

**Termux :**
❌ Ressources limitées sur mobile
❌ Problèmes de dépendances natives
❌ Temps de build plus longs
❌ Erreurs CMake/NDK fréquentes

### 6. Commandes Rapides

```bash
# Depuis le dossier mobile/
cd mobile

# Build preview (recommandé)
eas build --platform android --profile preview

# Vérifier le statut
eas build:list

# Voir les détails d'un build
eas build:view [BUILD_ID]
```

### 7. Téléchargement APK

1. Ouvrez https://expo.dev/builds
2. Sélectionnez votre projet ATOMIC FLIX
3. Téléchargez l'APK généré
4. Installez sur votre appareil Android

### 8. Compatibilité Android

**Supporté :**
- Android 5.0 (API 21) minimum
- Android 13 (API 33) cible
- arm64-v8a et armeabi-v7a
- 95%+ des appareils Android

**Taille APK :**
- Environ 15-25 MB
- Optimisé pour la performance

Votre setup GitHub + Expo est maintenant parfaitement configuré pour des builds rapides et fiables !