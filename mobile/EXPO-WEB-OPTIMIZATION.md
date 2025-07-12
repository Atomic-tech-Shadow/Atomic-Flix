# 🌐 Optimisation Build Expo.dev Web Interface

## 🎯 Optimisations pour builds expo.dev + GitHub

### 1. Configuration Gradle optimisée
- Réduit la mémoire: `-Xmx3072m` (au lieu de 4096m)
- Workers limités: `--max-workers=2`
- Cache désactivé pour éviter les conflits

### 2. Profile "fast" ajouté
Sur expo.dev interface, sélectionnez le profile **"fast"** :
- Build debug (plus rapide)
- Gradle optimisé
- Moins de vérifications

### 3. Variables d'environnement GitHub
Vérifiez dans votre repo GitHub que ces variables sont définies :
```
NODE_ENV=production
EXPO_USE_HERMES=false
```

### 4. Synchronisation GitHub
Pour que les changements soient appliqués :
1. Commit et push les modifications sur GitHub
2. Actualisez la page expo.dev
3. Lancez un nouveau build avec le profile optimisé

### 5. Monitoring du build
- Les builds cloud peuvent prendre 5-15 minutes
- Vérifiez l'onglet "Logs" pour voir la progression
- Si bloqué > 20 min, annulez et relancez

## ⚙️ Modifications appliquées :
- Gradle plus léger avec `--max-workers=2`
- Mémoire optimisée pour serveurs cloud
- Profile "fast" pour tests rapides
- Cache désactivé (évite les bugs de cache)

**Temps de build attendu avec optimisations : 5-12 minutes**