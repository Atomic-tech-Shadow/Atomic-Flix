# ATOMIC FLIX - Anime Streaming Platform

Plateforme de streaming d'anime moderne construite avec React, TypeScript et API externe.

## 🚀 Déploiement Vercel

### Prérequis
- Compte Vercel
- Repository Git (GitHub, GitLab, etc.)

### Configuration de déploiement

1. **Connectez votre repository à Vercel**
   - Importez votre projet sur [vercel.com](https://vercel.com)
   - Sélectionnez votre repository

2. **Configuration automatique**
   - Vercel détectera automatiquement la configuration grâce au fichier `vercel.json`
   - Aucune configuration manuelle requise

3. **Variables d'environnement (optionnel)**
   - Aucune variable requise pour le fonctionnement de base
   - L'application utilise uniquement l'API externe `anime-sama-scraper.vercel.app`

### Commandes de build

```bash
# Développement local
npm run dev

# Build pour production
npm run build

# Type checking
npm run check
```

## 🏗️ Architecture

### Frontend
- **React 18** avec TypeScript
- **Vite** pour le build et dev server
- **Tailwind CSS** pour le styling
- **TanStack Query** pour la gestion d'état
- **Wouter** pour le routing

### Backend
- **API externe directe** (anime-sama-scraper.vercel.app)
- **Pas de serveur backend requis** (frontend-only)
- **Pas de base de données locale** (données externes uniquement)

### Structure du projet
```
├── client/               # Frontend React
│   ├── src/
│   │   ├── components/   # Composants UI
│   │   ├── pages/        # Pages de l'application
│   │   └── lib/          # Utilitaires et configuration API
# Plus de backend requis - frontend direct vers API externe
├── shared/               # Types TypeScript partagés
└── vercel.json           # Configuration Vercel
```

## 🔧 Fonctionnalités

- **Recherche d'anime** en temps réel
- **Lecteur vidéo** intégré
- **Lecteur de manga** avec navigation
- **Interface responsive** (mobile/desktop)
- **Thème sombre** moderne
- **Navigation fluide** sans rechargement de page

## 🌐 API

L'application utilise exclusivement l'API externe :
- `https://anime-sama-scraper.vercel.app/api`

Aucune base de données locale ou données de démonstration.

## 📱 Interface

- Design moderne avec effets glassmorphism
- Animations fluides avec Framer Motion
- Composants UI basés sur Radix UI
- Responsive design pour tous les appareils

## 🔒 Sécurité

- Frontend-only sécurisé
- Pas de données sensibles stockées localement
- Appels API directs vers service externe sécurisé
- Configuration Vercel optimisée

## 📝 Déploiement réussi

✅ Build optimisé pour Vercel (frontend-only)  
✅ API externe directe (plus de serverless)  
✅ Pas de base de données requise  
✅ Configuration simplifiée  
✅ Interface responsive complète  

**URL de démonstration :** Disponible après déploiement Vercel