# 🔧 Solution Expo Build Keystore Error

## Problème résolu ✅
**Erreur:** "Generating a new Keystore is not supported in --non-interactive mode"

## Solutions implémentées :

### 1. Profile Development (Sans signature)
```bash
cd mobile
npx eas build --platform android --profile development --non-interactive
```
**Configuration:** `"withoutCredentials": true` - APK non-signé pour tests

### 2. Profile Preview/Production (Avec signature)
**Option A - Setup interactif initial (Recommandé) :**
```bash
cd mobile
# Première fois : mode interactif pour créer keystore
npx eas build --platform android --profile preview

# Répondre "Yes" à "Generate a new keystore"
# Après setup : mode non-interactif fonctionne
npx eas build --platform android --profile preview --non-interactive
```

**Option B - Build local :**
```bash
cd mobile
npx eas build --platform android --profile preview --local
```

## Configuration eas.json corrigée :
- **development**: `withoutCredentials: true` (APK non-signé)
- **preview/production**: `credentialsSource: "remote"` (Keystore EAS)

## Commandes recommandées :
1. **Test rapide**: `eas build -p android --profile development --non-interactive`
2. **APK final**: Setup interactif puis `eas build -p android --profile preview --non-interactive`
3. **Build local**: `eas build -p android --profile preview --local`