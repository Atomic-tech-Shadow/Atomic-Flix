// Configuration API pour ATOMIC FLIX - API externe uniquement
export const API_CONFIG = {
  // API externe pour les données anime/manga
  EXTERNAL_API: 'https://anime-sama-scraper.vercel.app/api',
  
  // Configuration locale pour Vercel
  LOCAL_API: '/api',
  
  // Timeout par défaut
  TIMEOUT: 15000,
  
  // Retry configuration
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000
};

// Fonction utilitaire pour les requêtes API
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const { MAX_RETRIES, RETRY_DELAY, TIMEOUT, LOCAL_API } = API_CONFIG;
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
      
      // Utiliser l'API locale pour Vercel qui fait proxy vers l'API externe
      const url = `${LOCAL_API}${endpoint}`;
      
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
      console.error(`Tentative ${attempt}/${MAX_RETRIES} échouée:`, error);
      
      if (attempt >= MAX_RETRIES) {
        console.error('Erreur API après', MAX_RETRIES, 'tentatives:', error);
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
    }
  }
};

// Fonctions API spécialisées pour ATOMIC FLIX
export const animeAPI = {
  // Récupérer les animes tendance
  getTrending: async () => {
    return await apiRequest('/trending');
  },
  
  // Récupérer les animes populaires
  getPopular: async () => {
    return await apiRequest('/popular');
  },
  
  // Rechercher des animes
  search: async (query: string) => {
    return await apiRequest(`/search?query=${encodeURIComponent(query)}`);
  },
  
  // Détails d'un anime
  getDetails: async (id: string) => {
    return await apiRequest(`/anime/${id}`);
  },
  
  // Épisodes d'une saison
  getEpisodes: async (animeId: string, season: string, language: string) => {
    return await apiRequest(`/episodes/${animeId}?season=${season}&language=${language}`);
  },
  
  // Sources de streaming
  getEmbedSources: async (episodeUrl: string) => {
    return await apiRequest(`/embed?url=${encodeURIComponent(episodeUrl)}`);
  },
  
  // Chapitres de manga
  getMangaChapters: async (mangaId: string) => {
    return await apiRequest(`/manga/${mangaId}/chapters`);
  },
  
  // Pages d'un chapitre de manga
  getChapterPages: async (chapterId: string) => {
    return await apiRequest(`/manga/chapter/${chapterId}`);
  }
};