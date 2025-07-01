// Configuration API centralisée pour ATOMIC FLIX
export const API_CONFIG = {
  // API externe pour les données anime/manga
  EXTERNAL_API: 'https://anime-sama-scraper.vercel.app/api',
  
  // Timeout par défaut
  TIMEOUT: 15000,
  
  // Retry configuration
  MAX_RETRIES: 1,
  RETRY_DELAY: 500
};

// Fonction utilitaire pour les requêtes API avec retry automatique
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const { MAX_RETRIES, RETRY_DELAY, TIMEOUT, EXTERNAL_API } = API_CONFIG;
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
      
      const url = endpoint.startsWith('http') ? endpoint : `${EXTERNAL_API}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        ...options
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      attempt++;
      console.log(`Tentative ${attempt}/${MAX_RETRIES} échouée:`, error);
      
      if (attempt >= MAX_RETRIES) {
        console.error('Erreur API après', MAX_RETRIES, 'tentatives:', error);
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
    }
  }
};

// Données de démonstration pour Vercel
const DEMO_DATA = {
  trending: {
    success: true,
    results: [
      {
        id: "one-piece",
        title: "One Piece",
        image: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
        type: "Anime",
        status: "En cours",
        url: "https://anime-sama.fr/catalogue/one-piece/"
      },
      {
        id: "demon-slayer",
        title: "Demon Slayer",
        image: "https://cdn.myanimelist.net/images/anime/1286/99889.jpg",
        type: "Anime", 
        status: "Terminé",
        url: "https://anime-sama.fr/catalogue/demon-slayer/"
      },
      {
        id: "attack-on-titan",
        title: "Attack on Titan",
        image: "https://cdn.myanimelist.net/images/anime/10/47347.jpg",
        type: "Anime",
        status: "Terminé", 
        url: "https://anime-sama.fr/catalogue/attack-on-titan/"
      },
      {
        id: "naruto",
        title: "Naruto",
        image: "https://cdn.myanimelist.net/images/anime/13/17405.jpg",
        type: "Anime",
        status: "Terminé",
        url: "https://anime-sama.fr/catalogue/naruto/"
      },
      {
        id: "dragon-ball-z",
        title: "Dragon Ball Z", 
        image: "https://cdn.myanimelist.net/images/anime/1277/142725.jpg",
        type: "Anime",
        status: "Terminé",
        url: "https://anime-sama.fr/catalogue/dragon-ball-z/"
      },
      {
        id: "my-hero-academia",
        title: "My Hero Academia",
        image: "https://cdn.myanimelist.net/images/anime/10/78745.jpg",
        type: "Anime",
        status: "En cours",
        url: "https://anime-sama.fr/catalogue/my-hero-academia/"
      }
    ]
  }
};

// Fonctions API spécialisées pour ATOMIC FLIX avec fallback
export const animeAPI = {
  // Récupérer les animes tendance avec fallback
  getTrending: async () => {
    try {
      const response = await apiRequest('/trending');
      return response;
    } catch (error) {
      console.log('API externe indisponible, utilisation des données de démonstration');
      return DEMO_DATA.trending;
    }
  },
  
  // Rechercher des animes avec fallback
  search: async (query: string) => {
    try {
      const response = await apiRequest(`/search?query=${encodeURIComponent(query)}`);
      return response;
    } catch (error) {
      console.log('Recherche indisponible, filtrage des données locales');
      const filtered = DEMO_DATA.trending.results.filter(anime => 
        anime.title.toLowerCase().includes(query.toLowerCase())
      );
      return { success: true, results: filtered };
    }
  },
  
  // Détails d'un anime avec fallback
  getDetails: async (id: string) => {
    try {
      const response = await apiRequest(`/anime/${id}`);
      return response;
    } catch (error) {
      const anime = DEMO_DATA.trending.results.find(a => a.id === id);
      if (anime) {
        return {
          success: true,
          data: {
            ...anime,
            synopsis: `Synopsis de ${anime.title} - Cette série est actuellement en démonstration.`,
            genres: ["Action", "Aventure", "Shonen"],
            year: "2023",
            seasons: [
              {
                number: 1,
                name: "Saison 1",
                value: "saison1",
                languages: ["VOSTFR", "VF"],
                episodeCount: 24,
                url: "saison1/vostfr",
                available: true
              }
            ]
          }
        };
      }
      throw error;
    }
  },
  
  // Épisodes d'une saison avec fallback
  getEpisodes: async (animeId: string, season: string, language: string) => {
    try {
      const response = await apiRequest(`/episodes/${animeId}?season=${season}&language=${language.toLowerCase()}`);
      return response;
    } catch (error) {
      return {
        success: true,
        animeId,
        season,
        language: language.toLowerCase(),
        episodes: Array.from({length: 12}, (_, i) => ({
          number: i + 1,
          title: `Épisode ${i + 1}`,
          url: `https://anime-sama.fr/catalogue/${animeId}/${season}/${language.toLowerCase()}/episode-${i + 1}`,
          streamingSources: [
            {
              server: "Demo Player",
              url: "#demo",
              quality: "HD",
              serverNumber: 1
            }
          ],
          language: language.toUpperCase(),
          available: true
        }))
      };
    }
  },
  
  // Sources de streaming avec fallback
  getEmbedSources: async (episodeUrl: string) => {
    try {
      const response = await apiRequest(`/embed?url=${encodeURIComponent(episodeUrl)}`);
      return response;
    } catch (error) {
      return {
        success: true,
        url: episodeUrl,
        sources: [
          {
            server: "Demo Player",
            url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
            quality: "HD",
            type: "streaming",
            serverNumber: 1
          }
        ]
      };
    }
  }
};