# ATOMIC FLIX - Déploiement sur Vercel

## Configuration du déploiement

### Étapes pour déployer sur Vercel :

1. **Connectez votre dépôt GitHub à Vercel**
   - Allez sur [vercel.com](https://vercel.com)
   - Connectez-vous avec votre compte GitHub
   - Cliquez sur "New Project" et sélectionnez votre dépôt

2. **Configuration des variables d'environnement**
   Sur Vercel, ajoutez ces variables dans Settings > Environment Variables :
   - `DATABASE_URL` : URL de votre base de données PostgreSQL
   - `NODE_ENV` : `production`

3. **Déploiement automatique**
   - Vercel déploiera automatiquement à chaque push sur la branche main
   - Le build utilisera la commande `npm run build`
   - L'application sera accessible via votre domaine Vercel

### Structure du projet pour Vercel :
- `/api/index.ts` : Point d'entrée pour les fonctions serverless
- `/vercel.json` : Configuration Vercel
- `/dist/public` : Fichiers statiques buildés du frontend

### Commandes importantes :
```bash
npm run build    # Build l'application pour production
npm run dev      # Développement local
npm run start    # Démarrage en production
```

## Architecture de déploiement

L'application utilise :
- **Frontend** : React/Vite buildé en fichiers statiques
- **Backend** : API Express.js en tant que fonctions serverless Vercel
- **Base de données** : PostgreSQL (recommandé : Vercel Postgres ou Neon)

Votre application sera disponible sur `https://votre-projet.vercel.app`