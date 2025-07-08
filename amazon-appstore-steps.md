# Guide étape par étape : Publication sur Amazon Appstore

## 🎯 Étape 1 : Préparation de l'APK

### A. Installer les outils nécessaires
```bash
# Installer Expo CLI globalement
npm install -g @expo/cli

# Aller dans le dossier mobile
cd mobile

# Installer les dépendances
npm install
```

### B. Configurer le build
```bash
# Se connecter à Expo
expo login

# Configurer l'application pour production
expo install expo-build-properties
```

### C. Générer l'APK
```bash
# Lancer le build APK
expo build:android --type apk --release-channel production

# Ou avec EAS Build (recommandé)
npx eas build --platform android --profile production
```

## 🏪 Étape 2 : Créer le compte Amazon Developer

### A. Inscription
1. Aller sur https://developer.amazon.com/apps-and-games
2. Cliquer sur "Get Started" ou "Sign In"
3. Utiliser votre compte Amazon existant ou en créer un nouveau
4. Compléter le profil développeur (gratuit)

### B. Informations requises
- **Nom du développeur** : ATOMIC FLIX Team
- **Adresse email** : [votre email]
- **Site web** : https://atomic-flix.vercel.app
- **Informations de contact** : Adresse postale

## 📱 Étape 3 : Créer une nouvelle application

### A. Démarrer la soumission
1. Dans Amazon Developer Console, cliquer sur "Add New App"
2. Sélectionner "Android"
3. Donner un nom à l'app : "ATOMIC FLIX"

### B. Informations de base
- **Title** : ATOMIC FLIX - Anime & Manga Streaming
- **Package name** : com.atomicflix.app
- **Category** : Entertainment
- **Subcategory** : Media & Video

## 🖼️ Étape 4 : Préparer les assets visuels

### A. Screenshots obligatoires (minimum 3)
**Tailles : 1080x1920px ou 1080x2400px**

1. **Screenshot 1** : Page d'accueil avec recherche
   - Montrer la barre de recherche
   - Afficher des animes populaires
   - Interface ATOMIC FLIX visible

2. **Screenshot 2** : Page détails anime
   - Informations complètes d'un anime
   - Boutons de saisons/épisodes
   - Synopsis visible

3. **Screenshot 3** : Lecteur vidéo
   - Interface de lecture en action
   - Contrôles vidéo visibles
   - Qualité HD mise en avant

### B. Icônes requises
- **App icon** : 512x512px (PNG, fond transparent)
- **Small icon** : 114x114px (PNG)

### C. Graphics promotionnels
- **Feature graphic** : 1024x500px
- **Promo graphic** : 180x120px (optionnel)

## 📝 Étape 5 : Rédiger la description

### A. Description courte (150 caractères max)
```
Votre destination ultime pour les animes et mangas ! Streaming HD, interface moderne, notifications.
```

### B. Description longue
```
ATOMIC FLIX - Plongez dans l'univers infini des animes et mangas !

🎬 FONCTIONNALITÉS :
• Streaming d'animes en haute qualité
• Lecteur de mangas intégré
• Interface moderne et intuitive
• Notifications pour nouveaux épisodes
• Recherche avancée
• Thème sombre optimal

🌟 AVANTAGES :
• Design futuriste avec effets atomiques
• Navigation fluide et rapide
• Pas de publicités intrusives
• Mise à jour régulière du contenu
• Support multilingue

Découvrez des milliers d'animes et mangas avec ATOMIC FLIX !
```

### C. Mots-clés
```
anime, manga, streaming, entertainment, video, japanese, otaku, series, HD, mobile
```

## ⚙️ Étape 6 : Configuration technique

### A. Paramètres APK
- **Version** : 1.0.0
- **Version code** : 1
- **Min SDK** : 23 (Android 6.0)
- **Target SDK** : 34 (Android 14)

### B. Permissions
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.WAKE_LOCK" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

### C. Âge recommandé
- **Rating** : 13+ (Teen)
- **Raison** : Contenu animé pouvant inclure violence légère

## 🚀 Étape 7 : Soumission

### A. Upload de l'APK
1. Dans la console Amazon, section "APK Files"
2. Glisser-déposer votre APK
3. Attendre la validation automatique
4. Vérifier que toutes les permissions sont correctes

### B. Ajouter les assets
1. **Icons** : Uploader l'icône 512x512px
2. **Screenshots** : Ajouter minimum 3 screenshots
3. **Graphics** : Uploader feature graphic 1024x500px

### C. Informations finales
- **Price** : Free (Gratuit)
- **Availability** : All countries (Tous les pays)
- **Release date** : Upon approval (Dès approbation)

### D. Soumettre pour révision
1. Réviser toutes les informations
2. Accepter les terms et conditions
3. Cliquer sur "Submit App"

## ⏱️ Étape 8 : Attendre l'approbation

### A. Processus de révision
- **Temps moyen** : 2-7 jours ouvrables
- **Statut** : Visible dans Developer Console
- **Notifications** : Par email à chaque étape

### B. Statuts possibles
- **Submitted** : En attente de révision
- **In Review** : En cours de révision
- **Live** : Publié et disponible
- **Rejected** : Nécessite corrections

## 📊 Étape 9 : Après publication

### A. Monitoring
- Vérifier les téléchargements
- Lire les avis utilisateurs
- Surveiller les performances
- Répondre aux commentaires

### B. Mises à jour
- Corriger les bugs reportés
- Ajouter nouvelles fonctionnalités
- Améliorer l'expérience utilisateur
- Maintenir la compatibilité

---

## 🆘 Ressources et support

**Documentation Amazon** : https://developer.amazon.com/docs/app-submission/

**Support technique** : https://developer.amazon.com/support/

**Guidelines** : https://developer.amazon.com/docs/app-submission/app-submission-overview.html

---

## ✅ Checklist finale

- [ ] APK testé et fonctionnel
- [ ] Compte Amazon Developer configuré
- [ ] Screenshots de qualité créés
- [ ] Description attractive rédigée
- [ ] Tous les assets uploadés
- [ ] Informations techniques correctes
- [ ] Application soumise pour révision

**Félicitations ! ATOMIC FLIX est maintenant en route vers Amazon Appstore !**