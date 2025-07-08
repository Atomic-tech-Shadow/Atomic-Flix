# Guide de publication ATOMIC FLIX sur Amazon Appstore

## 1. Préparation de l'APK

### Étape 1 : Générer l'APK de production
```bash
# Dans le dossier mobile/
npx expo build:android
```

### Étape 2 : Créer les assets requis
- **Icône de l'application** : 512x512px (PNG)
- **Screenshots** : Au moins 3 captures d'écran
- **Banner/Feature graphic** : 1024x500px

## 2. Inscription sur Amazon Appstore

### Créer un compte développeur Amazon
1. Aller sur https://developer.amazon.com/apps-and-games
2. Cliquer sur "Sign up" ou "Sign in"
3. Compléter le profil développeur (gratuit)

### Informations requises :
- **Nom du développeur** : ATOMIC FLIX Team
- **Email de contact** : Votre email
- **Site web** : https://atomic-flix.vercel.app

## 3. Informations de l'application

### Détails de base :
- **Nom de l'app** : ATOMIC FLIX
- **Description courte** : Plateforme de streaming d'animes et mangas
- **Description longue** : 
```
ATOMIC FLIX - Votre destination ultime pour les animes et mangas !

🎬 Fonctionnalités principales :
• Streaming d'animes en haute qualité
• Lecteur de mangas intégré
• Interface moderne et intuitive
• Notifications pour les nouveaux épisodes
• Recherche avancée
• Compatible mobile et desktop

🌟 Caractéristiques :
• Design moderne avec thème sombre
• Navigation fluide et rapide
• Pas de publicités intrusives
• Mise à jour régulière du contenu
• Support multilingue

Plongez dans l'univers infini des animes et mangas avec ATOMIC FLIX !
```

### Catégorie :
- **Catégorie principale** : Entertainment
- **Catégorie secondaire** : Media & Video

### Mots-clés :
anime, manga, streaming, entertainment, video, japanese, otaku, series

## 4. Configuration technique

### Permissions requises :
- INTERNET (pour le streaming)
- WAKE_LOCK (pour éviter la mise en veille)
- WRITE_EXTERNAL_STORAGE (pour les téléchargements)

### Version minimale Android : 6.0 (API 23)

## 5. Assets visuels requis

### Icônes :
- **App icon** : 512x512px
- **Small icon** : 114x114px

### Screenshots (minimum 3) :
- **Phone screenshots** : 1080x1920px ou 1080x2400px
- **Tablet screenshots** : 1200x1920px (optionnel)

### Graphics :
- **Feature graphic** : 1024x500px
- **Promo graphic** : 180x120px (optionnel)

## 6. Politique de contenu

### Déclaration de contenu :
- Application de divertissement
- Contenu approprié pour 13+
- Pas de contenu généré par l'utilisateur
- Streaming de contenu légal uniquement

### Conformité :
- Respecte les guidelines Amazon
- Pas de contenu inapproprié
- Interface adaptée aux familles

## 7. Processus de soumission

### Étapes :
1. Créer une nouvelle app sur Amazon Developer Console
2. Uploader l'APK
3. Remplir les informations de l'app
4. Ajouter les screenshots et icônes
5. Configurer les paramètres de distribution
6. Soumettre pour révision

### Temps de révision : 2-7 jours ouvrables

## 8. Checklist avant soumission

- [ ] APK testé et fonctionnel
- [ ] Toutes les captures d'écran ajoutées
- [ ] Description complète et attrayante
- [ ] Icônes haute résolution
- [ ] Permissions correctement configurées
- [ ] Politique de confidentialité (si nécessaire)
- [ ] Informations de contact à jour

## 9. Après publication

### Monitoring :
- Vérifier les avis utilisateurs
- Surveiller les téléchargements
- Répondre aux commentaires
- Planifier les mises à jour

### Mises à jour :
- Corriger les bugs reportés
- Ajouter nouvelles fonctionnalités
- Améliorer les performances
- Mettre à jour le contenu

---

**Note importante** : Amazon Appstore a des policies strictes concernant le contenu. Assurez-vous que votre application respecte toutes les guidelines avant la soumission.