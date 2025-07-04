# 🚀 Supprimer la barre d'URL - Guide Simple

## Le problème que vous voyez
La barre d'URL rouge que vous avez entourée apparaît encore parce que vous utilisez une PWA installée, mais pas une vraie TWA (Trusted Web Activity).

## Solution rapide

### 1. Sur PWABuilder, générer l'APK Android
- Aller sur https://www.pwabuilder.com/
- Entrer: `https://atomic-flix.vercel.app`
- Cliquer "Package For Stores" → "Android"
- Utiliser ces paramètres:
  ```
  Package ID: app.vercel.atomic_flix.twa
  App Name: ATOMIC FLIX
  Display Mode: standalone
  Theme Color: #8F00FF
  Background Color: #0F111A
  ```

### 2. Après téléchargement de l'APK
PWABuilder va vous donner une empreinte SHA256, par exemple:
`A1:B2:C3:D4:E5:F6:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB:CD:EF:12:34:56:78:90:AB`

### 3. Mettre à jour le fichier assetlinks.json
Remplacer `PLACEHOLDER_SHA256_FINGERPRINT` dans `client/public/.well-known/assetlinks.json` par votre vraie empreinte.

### 4. Redéployer sur Vercel
```bash
git add .
git commit -m "Add assetlinks.json for TWA"
git push
```

### 5. Résultat
L'APK TWA s'ouvrira sans aucune barre d'URL - expérience 100% native !

## La différence
- **PWA installée** = garde la barre d'URL (ce que vous voyez maintenant)
- **APK TWA** = aucune barre d'URL (ce que vous voulez)