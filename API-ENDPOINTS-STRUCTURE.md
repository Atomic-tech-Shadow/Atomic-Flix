# 📡 Structure des Endpoints API - ATOMIC FLIX

Base URL: `https://anime-sama-scraper.vercel.app/api`

## ✅ ENDPOINTS FONCTIONNELS (9/9)

Tous les endpoints anime fonctionnent parfaitement ! L'API n'a plus aucune fonctionnalité manga.

---

### 1. ✅ `/popular` - ANIMES POPULAIRES
**Status**: ✅ 200 OK  
**Temps de réponse**: ~886ms  
**Type**: Object

**Structure**:
```json
{
  "success": true,
  "totalCount": 40,
  "categories": {
    "classiques": {
      "count": 20,
      "anime": [
        {
          "id": "dragon-ball-z",
          "title": "Dragon Ball Z DBZ",
          "image": "https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/dragon-ball-z.jpg",
          "url": "https://anime-sama.fr/catalogue/dragon-ball-z"
        }
      ]
    }
  }
}
```

**Champs**:
- `success`: Boolean de succès
- `totalCount`: Nombre total d'animes
- `categories`: Object avec classiques et autres catégories
  - `count`: Nombre dans la catégorie
  - `anime`: Array d'animes populaires

---

### 2. ✅ `/recommendations?page={page}&limit={limit}` - RECOMMANDATIONS
**Status**: ✅ 200 OK  
**Temps de réponse**: ~128ms  
**Type**: Object

**Structure**:
```json
{
  "success": true,
  "data": [
    {
      "id": "mattaku-saikin-no-tantei-to-kitara",
      "title": "Mattaku Saikin no Tantei to Kitara",
      "image": "https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/mattaku-saikin-no-tantei-to-kitara.jpg",
      "url": "https://anime-sama.fr/catalogue/mattaku-saikin-no-tantei-to-kitara",
      "contentType": "anime",
      "genres": ["Comédie", "Mystère", "Romance", "Seinen", "Slice of Life", "Détective", "Enquête", "VOSTFR"]
    }
  ]
}
```

**Champs**:
- `success`: Boolean
- `data`: Array de recommandations
  - `id`: Identifiant unique
  - `title`: Titre de l'anime
  - `image`: URL de l'image
  - `url`: URL de la page
  - `contentType`: "anime"
  - `genres`: Array de genres et langues

---

### 3. ✅ `/planning` - PLANNING HEBDOMADAIRE
**Status**: ✅ 200 OK  
**Temps de réponse**: ~1180ms  
**Type**: Object

**Structure**:
```json
{
  "success": true,
  "currentDay": "samedi",
  "extractedAt": "2025-10-25T08:49:10.436Z",
  "day": "Samedi",
  "count": 20,
  "items": [
    {
      "animeId": "my-hero-academia",
      "title": "My Hero Academia",
      "url": "https://anime-sama.fr/catalogue/my-hero-academia/saison8/vostfr/",
      "image": "https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/my-hero-academia.jpg",
      "releaseTime": "09h50",
      "originalTime": "11h50",
      "language": "VOSTFR",
      "type": "anime"
    }
  ]
}
```

**Champs**:
- `success`: Boolean
- `currentDay`: Jour actuel en français
- `extractedAt`: Date d'extraction ISO
- `day`: Jour du planning
- `count`: Nombre d'animes
- `items`: Array des sorties
  - `animeId`: ID de l'anime
  - `title`: Titre
  - `url`: URL de la saison
  - `image`: Image
  - `releaseTime`: Heure de sortie locale
  - `originalTime`: Heure originale
  - `language`: VOSTFR ou VF
  - `type`: "anime"

---

### 4. ✅ `/recent` - ÉPISODES RÉCENTS
**Status**: ✅ 200 OK  
**Temps de réponse**: ~787ms  
**Type**: Object

**Structure**:
```json
{
  "success": true,
  "count": 30,
  "recentEpisodes": [
    {
      "animeId": "sanda",
      "animeTitle": "Sanda",
      "season": 1,
      "episode": 4,
      "language": "VOSTFR",
      "isFinale": false,
      "isVFCrunchyroll": false,
      "url": "https://anime-sama.fr/catalogue/sanda/saison1/vostfr/",
      "image": "https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/sanda.jpg",
      "badgeInfo": "Saison 1 Episode 4",
      "addedAt": "2025-10-25T08:49:14.086Z",
      "type": "episode"
    }
  ]
}
```

**Champs**:
- `success`: Boolean
- `count`: Nombre d'épisodes
- `recentEpisodes`: Array des derniers épisodes ajoutés
  - `animeId`: ID de l'anime
  - `animeTitle`: Titre de l'anime
  - `season`: Numéro de saison
  - `episode`: Numéro d'épisode
  - `language`: VOSTFR ou VF
  - `isFinale`: Boolean si finale
  - `isVFCrunchyroll`: Boolean si VF Crunchyroll
  - `url`: URL de la saison
  - `image`: Image de l'anime
  - `badgeInfo`: Info formatée
  - `addedAt`: Date d'ajout ISO
  - `type`: "episode"

---

### 5. ✅ `/search?query={query}` - RECHERCHE
**Status**: ✅ 200 OK  
**Temps de réponse**: ~1748ms (dépend de la recherche)  
**Type**: Object avec array de résultats

**Structure**:
```json
{
  "success": true,
  "results": [
    {
      "id": "naruto",
      "title": "Naruto",
      "url": "https://anime-sama.fr/catalogue/naruto",
      "image": "https://anime-sama.fr/img/contenu/poster-naruto.webp",
      "synopsis": "À Konoha, le village caché de la Feuille...",
      "type": "anime",
      "genres": ["Action", "Aventure"],
      "status": "Terminé",
      "score": "8.3/10",
      "year": "2002"
    }
  ]
}
```

**Champs**:
- `success`: Boolean
- `results`: Array de résultats
  - `id`: Identifiant unique (slug)
  - `title`: Titre de l'anime
  - `url`: URL de la page anime
  - `image`: URL de l'image poster
  - `synopsis`: Description complète
  - `type`: "anime" ou "film" ou "movie"
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
  "success": true,
  "id": "naruto",
  "title": "Naruto",
  "url": "https://anime-sama.fr/catalogue/naruto",
  "image": "https://anime-sama.fr/img/contenu/poster-naruto.webp",
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
**Type**: Object avec array de saisons

**Structure**:
```json
{
  "success": true,
  "seasons": [
    {
      "seasonNumber": 1,
      "title": "Saison 1",
      "synopsis": "Naruto Uzumaki, jeune ninja du village...",
      "episodes": 220,
      "languages": ["VOSTFR", "VF"],
      "animeId": "naruto"
    }
  ]
}
```

**Champs**:
- `success`: Boolean
- `seasons`: Array de saisons
  - `seasonNumber`: Numéro de saison
  - `title`: Titre de la saison
  - `synopsis`: Description de la saison
  - `episodes`: Nombre total d'épisodes
  - `languages`: Langues disponibles
  - `animeId`: ID de l'anime parent

---

### 8. ✅ `/episodes/{animeId}?season={season}&language={language}` - ÉPISODES
**Status**: ✅ 200 OK  
**Temps de réponse**: ~965ms (peut être plus long pour beaucoup d'épisodes)  
**Type**: Object

**Structure**:
```json
{
  "success": true,
  "animeId": "naruto",
  "season": "1",
  "language": "vostfr",
  "contentType": "anime",
  "count": 220,
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
- `success`: Boolean
- `animeId`: ID de l'anime
- `season`: Numéro de saison (string)
- `language`: Langue sélectionnée
- `contentType`: "anime"
- `count`: Nombre total d'épisodes
- `episodes`: Array de tous les épisodes

**Structure d'un épisode**:
- `number`: Numéro de l'épisode
- `title`: Titre de l'épisode
- `url`: URL de l'épisode
- `streamingSources`: **Array des sources de streaming** (IMPORTANT!)
  - `server`: Nom du serveur (Vidmoly, OneUpload, etc.)
  - `url`: URL embed du serveur pour le streaming
  - `quality`: Qualité (HD, SD, etc.)
  - `serverNumber`: Numéro du serveur
- `language`: Langue de l'épisode
- `season`: Numéro de saison
- `available`: Disponibilité (true/false)

---

### 9. ✅ `/embed?url={episodeUrl}` - SOURCES EMBED
**Status**: ✅ 200 OK  
**Temps de réponse**: ~171ms  
**Type**: Object

**Structure**:
```json
{
  "success": true,
  "url": "https://anime-sama.fr/catalogue/naruto/saison1/vostfr/episode-1",
  "sources": [
    {
      "server": "Server 2",
      "url": "https://vidmoly.to/embed-xxxxx.html",
      "quality": "HD",
      "type": "streaming",
      "episode": 1,
      "serverNumber": 2
    },
    {
      "server": "Server 1",
      "url": "https://oneupload.to/embed-xxxxx.html",
      "quality": "HD",
      "type": "streaming",
      "episode": 1,
      "serverNumber": 1
    }
  ]
}
```

**Champs**:
- `success`: Boolean
- `url`: URL de l'épisode
- `sources`: Array des sources de streaming
  - `server`: Nom du serveur
  - `url`: URL embed pour streaming
  - `quality`: Qualité vidéo
  - `type`: "streaming"
  - `episode`: Numéro d'épisode
  - `serverNumber`: Numéro du serveur

---

## 📊 STATISTIQUES GLOBALES

- **Taux de succès**: 100% (9/9 endpoints)
- **Endpoints fonctionnels**: 9
- **Endpoints manga**: 0 (supprimés de l'API)
- **Temps de réponse moyen**: ~0.1-2 secondes
- **Endpoints les plus lents**: 
  - `/planning` (~1.2s)
  - `/anime/{id}` (~1.8s)
  - `/seasons/{animeId}` (~1.8s)
- **Endpoints les plus rapides**:
  - `/recommendations` (~0.1s)
  - `/embed` (~0.2s)

---

## 🎯 ENDPOINTS UTILISÉS PAR ATOMIC FLIX

### Page d'accueil (`/`)
1. ✅ `getPopular()` - Animes populaires (classiques + pépites)
2. ✅ `getRecent()` - Derniers épisodes ajoutés
3. ✅ `getRecommendations()` - Recommandations
4. ✅ `getPlanning()` - Planning hebdomadaire des sorties
5. ✅ `search()` - Recherche d'animes

### Page anime (`/anime/:id`)
6. ✅ `getDetails()` - Détails complets de l'anime
7. ✅ `getSeasons()` - Liste des saisons

### Page player (`/anime/:id/player`)
8. ✅ `getEpisodes()` - Épisodes avec sources de streaming
9. ✅ `getEmbedSources()` - Alternative pour obtenir les sources

---

## 🔧 FONCTIONS API DISPONIBLES

```typescript
// client/src/lib/api.ts
export const animeAPI = {
  getPopular: async () => Promise<Object>
  getRecommendations: async (page = 1, limit = 50) => Promise<Object>
  getPlanning: async (day?, filter?, timezone?) => Promise<Object>
  getRecent: async () => Promise<Object>
  search: async (query: string) => Promise<Object>
  getDetails: async (id: string) => Promise<Object>
  getSeasons: async (animeId: string) => Promise<Object>
  getEpisodes: async (animeId: string, season: string, language: string) => Promise<Object>
  getEpisodeById: async (episodeId: string) => Promise<Object>
  getEmbedSources: async (episodeUrl: string) => Promise<Object>
}
```

---

## 📝 NOTES IMPORTANTES

1. **Toutes les réponses** incluent `"success": true` quand la requête réussit
2. **Sources de streaming**: Les URLs de streaming sont dans `streamingSources` de chaque épisode
3. **Multi-serveurs**: Chaque épisode a plusieurs serveurs (Vidmoly, OneUpload, etc.)
4. **Langues**: Support VOSTFR et VF
5. **Performance**: API très rapide, réponses entre 0.1s et 2s
6. **Fiabilité**: 100% des endpoints fonctionnent correctement
7. **Manga**: Aucune fonctionnalité manga (supprimée de l'API et du site)

---

**Date du test**: 25 Octobre 2025  
**API testée**: `https://anime-sama-scraper.vercel.app/api`  
**Résultat**: ✅ Tous les endpoints anime fonctionnent parfaitement !
