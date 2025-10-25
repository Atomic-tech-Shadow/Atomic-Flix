# 📡 Structure des Endpoints API - ATOMIC FLIX

Base URL: `https://anime-sama-scraper.vercel.app/api`

## ✅ ENDPOINTS FONCTIONNELS (8/12)

### 1. ❌ `/popular` - TRENDING/POPULAR
**Status**: ❌ 404 Not Found  
**Description**: Animes populaires  
**Temps de réponse**: ~14ms  
**Problème**: Endpoint non disponible sur l'API

---

### 2. ❌ `/recommendations` - RECOMMENDATIONS
**Status**: ❌ 404 Not Found  
**Description**: Recommandations personnalisées  
**Temps de réponse**: ~15ms  
**Problème**: Endpoint non disponible sur l'API

---

### 3. ❌ `/planning` - PLANNING
**Status**: ❌ 404 Not Found  
**Description**: Planning hebdomadaire  
**Temps de réponse**: ~14ms  
**Problème**: Endpoint non disponible sur l'API

---

### 4. ✅ `/recent` - ÉPISODES RÉCENTS
**Status**: ✅ 200 OK  
**Temps de réponse**: ~3597ms  
**Type**: Array (20 éléments)

**Structure**:
```json
{
  "title": "Giji Harem - Épisode 3",
  "url": "https://anime-sama.fr/catalogue/giji-harem/saison1/vostfr/episode-3",
  "image": "https://anime-sama.fr/img/contenu/poster-giji-harem_f80de892ce.webp",
  "date": "25 Oct 2025",
  "rawDate": "2025-10-25T09:00:00.000Z",
  "type": "anime",
  "animeId": "giji-harem",
  "episodeNumber": 3,
  "season": 1,
  "language": "VOSTFR"
}
```

**Champs**:
- `title`: Titre avec numéro d'épisode
- `url`: URL de l'épisode
- `image`: Image poster de l'anime
- `date`: Date formatée (ex: "25 Oct 2025")
- `rawDate`: Date ISO
- `type`: "anime" ou "manga"
- `animeId`: Identifiant unique
- `episodeNumber`: Numéro de l'épisode
- `season`: Numéro de saison
- `language`: "VOSTFR" ou "VF"

---

### 5. ✅ `/search?query={query}` - RECHERCHE
**Status**: ✅ 200 OK  
**Temps de réponse**: ~1748ms  
**Type**: Array (21 éléments pour "naruto")

**Structure**:
```json
{
  "id": "naruto",
  "title": "Naruto",
  "url": "https://anime-sama.fr/catalogue/naruto",
  "image": "https://anime-sama.fr/img/contenu/poster-naruto_acb36dc7f9.webp",
  "synopsis": "À Konoha, le village caché de la Feuille...",
  "type": "anime",
  "genres": ["Action", "Aventure"],
  "status": "Terminé",
  "score": "8.3/10",
  "year": "2002"
}
```

**Champs**:
- `id`: Identifiant unique (slug)
- `title`: Titre de l'anime
- `url`: URL de la page anime
- `image`: URL de l'image poster
- `synopsis`: Description complète
- `type`: "anime" ou "manga"
- `genres`: Array de genres
- `status`: "En cours" ou "Terminé"
- `score`: Note sur 10
- `year`: Année de sortie

---

### 6. ✅ `/anime/{id}` - DÉTAILS ANIME
**Status**: ✅ 200 OK  
**Temps de réponse**: ~1809ms  
**Type**: Object

**Structure**:
```json
{
  "id": "naruto",
  "title": "Naruto",
  "url": "https://anime-sama.fr/catalogue/naruto",
  "image": "https://anime-sama.fr/img/contenu/poster-naruto_acb36dc7f9.webp",
  "banner": "https://anime-sama.fr/img/contenu/banner-naruto.webp",
  "synopsis": "À Konoha, le village caché de la Feuille...",
  "type": "anime",
  "genres": ["Action", "Aventure", "Shōnen"],
  "status": "Terminé",
  "score": "8.3/10",
  "year": "2002",
  "studio": "Pierrot",
  "seasons": [
    {
      "seasonNumber": 1,
      "title": "Saison 1",
      "episodes": 220
    },
    {
      "seasonNumber": 2,
      "title": "Saison 2 - Shippuden",
      "episodes": 500
    }
  ],
  "languages": ["VOSTFR", "VF"]
}
```

**Champs supplémentaires par rapport à search**:
- `banner`: URL de la bannière
- `studio`: Studio d'animation
- `seasons`: Array des saisons avec nombre d'épisodes
- `languages`: Langues disponibles

---

### 7. ✅ `/seasons/{animeId}` - SAISONS
**Status**: ✅ 200 OK  
**Temps de réponse**: ~1808ms  
**Type**: Array (2 saisons pour naruto)

**Structure**:
```json
{
  "seasonNumber": 1,
  "title": "Saison 1",
  "synopsis": "Naruto Uzumaki, jeune ninja du village...",
  "episodes": 220,
  "languages": ["VOSTFR", "VF"],
  "animeId": "naruto"
}
```

**Champs**:
- `seasonNumber`: Numéro de saison
- `title`: Titre de la saison
- `synopsis`: Description de la saison
- `episodes`: Nombre total d'épisodes
- `languages`: Langues disponibles
- `animeId`: ID de l'anime parent

---

### 8. ✅ `/episodes/{animeId}?season={season}&language={language}` - ÉPISODES
**Status**: ✅ 200 OK  
**Temps de réponse**: ~9280ms (long car 220 épisodes)  
**Type**: Object

**Structure**:
```json
{
  "animeId": "naruto",
  "season": 1,
  "language": "VOSTFR",
  "totalEpisodes": 220,
  "episodes": [
    {
      "number": 1,
      "title": "Épisode 1",
      "url": "https://anime-sama.fr/catalogue/naruto/saison1/vostfr/episode-1",
      "streamingSources": [
        {
          "server": "Vidmoly",
          "url": "https://vidmoly.to/embed-xxxxx.html",
          "quality": "HD",
          "serverNumber": 2
        },
        {
          "server": "OneUpload",
          "url": "https://oneupload.to/embed-xxxxx.html",
          "quality": "HD",
          "serverNumber": 1
        }
      ],
      "language": "VOSTFR",
      "season": 1,
      "available": true
    }
  ]
}
```

**Champs principaux**:
- `animeId`: ID de l'anime
- `season`: Numéro de saison
- `language`: Langue sélectionnée
- `totalEpisodes`: Nombre total d'épisodes
- `episodes`: Array de tous les épisodes

**Structure d'un épisode**:
- `number`: Numéro de l'épisode
- `title`: Titre de l'épisode
- `url`: URL de l'épisode
- `streamingSources`: Array des sources de streaming
  - `server`: Nom du serveur (Vidmoly, OneUpload, etc.)
  - `url`: URL embed du serveur
  - `quality`: Qualité (HD, SD, etc.)
  - `serverNumber`: Numéro du serveur
- `language`: Langue de l'épisode
- `season`: Numéro de saison
- `available`: Disponibilité (true/false)

---

## ❌ ENDPOINTS NON FONCTIONNELS (4/12)

### 9. ❌ `/episode-by-id?id={episodeId}`
**Status**: ❌ 400 Bad Request  
**Temps de réponse**: ~6353ms  
**Problème**: Format d'ID invalide ou endpoint non implémenté

---

### 10. ❌ `/embed?url={episodeUrl}`
**Status**: ❌ 404 Not Found  
**Temps de réponse**: ~1573ms  
**Problème**: Endpoint non disponible

---

### 11. ❌ `/manga/{mangaId}/chapters`
**Status**: ❌ 404 Not Found  
**Temps de réponse**: ~16ms  
**Problème**: Endpoint manga non disponible

---

### 12. ❌ `/manga/chapter/{chapterId}`
**Status**: ❌ 404 Not Found  
**Temps de réponse**: ~21ms  
**Problème**: Endpoint manga non disponible

---

## 📊 STATISTIQUES GLOBALES

- **Taux de succès**: 67% (8/12 endpoints)
- **Endpoints fonctionnels**: 8
- **Endpoints non disponibles**: 4
- **Temps de réponse moyen**: ~2-4 secondes
- **Endpoints les plus lents**: 
  - `/episodes` (9280ms) - Normal car beaucoup de données
  - `/episode-by-id` (6353ms) - Erreur
  - `/recent` (3597ms)

---

## 🔧 RECOMMANDATIONS

### Endpoints à retirer du code:
1. ❌ `getPopular()` - Utiliser `/recent` à la place
2. ❌ `getRecommendations()` - Non disponible
3. ❌ `getPlanning()` - Non disponible
4. ❌ `getEpisodeById()` - Non fonctionnel
5. ❌ `getEmbedSources()` - Non disponible
6. ❌ `getMangaChapters()` - Non disponible
7. ❌ `getChapterPages()` - Non disponible

### Endpoints à conserver:
1. ✅ `getRecent()` - Fonctionne parfaitement
2. ✅ `search()` - Fonctionne parfaitement
3. ✅ `getDetails()` - Fonctionne parfaitement
4. ✅ `getSeasons()` - Fonctionne parfaitement
5. ✅ `getEpisodes()` - Fonctionne parfaitement (utiliser pour streaming)

### Solution pour les fonctionnalités manquantes:
- **Trending/Popular**: Utiliser `/recent` qui donne les derniers épisodes ajoutés
- **Manga**: Désactiver les fonctionnalités manga ou attendre que l'API les implémente
- **Planning/Recommendations**: Retirer ces fonctionnalités ou créer des alternatives côté client

---

## 📝 NOTES IMPORTANTES

1. **Sources de streaming**: Les URLs de streaming sont dans `streamingSources` de chaque épisode
2. **Multi-serveurs**: Chaque épisode a plusieurs serveurs (Vidmoly, OneUpload, etc.)
3. **Langues**: Support VOSTFR et VF
4. **Performance**: Les endpoints avec beaucoup de données (220 épisodes) sont plus lents
5. **Fiabilité**: 8 endpoints sur 12 fonctionnent correctement

---

**Date du test**: 25 Octobre 2025  
**API testée**: `https://anime-sama-scraper.vercel.app/api`
