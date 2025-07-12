# 🚀 Build ATOMIC FLIX Mobile - Solutions Rapides

## 🎯 Problème : Build expo.dev bloqué

Le build sur expo.dev peut prendre 10-20 minutes ou se bloquer. Voici les solutions :

## ⚡ Solution 1 : Build Local (Recommandé)
```bash
cd mobile
npx eas build --platform android --profile preview --local
```
**Avantages :** Plus rapide, pas de queue d'attente

## 🔄 Solution 2 : Annuler et Relancer  
```bash
# Annuler le build actuel sur expo.dev
# Puis relancer avec cache désactivé :
npx eas build --platform android --profile preview --clear-cache --non-interactive
```

## 📱 Solution 3 : Profile Development (Plus rapide)
```bash
npx eas build --platform android --profile development --non-interactive
```
**Note :** Build de debug, plus rapide à compiler

## 🛠️ Solution 4 : Build Termux Direct
Si vous êtes sur Android/Termux :
```bash
cd mobile
./termux-build-apk.sh
```

## 🔍 Diagnostics
Vérifiez le status du build :
```bash
npx eas build:list --platform android --limit 5
```

## ⚙️ Optimisations appliquées dans eas.json :
- Cache désactivé pour le profile preview
- Gradle optimisé avec --no-daemon
- Hermes désactivé pour compatibilité
- Credentials automatiques

**Recommandation :** Essayez le build local (#1) pour éviter les délais d'attente cloud.