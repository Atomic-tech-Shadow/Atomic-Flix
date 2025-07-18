// Configuration API pour ATOMIC FLIX - API externe directe
export const API_CONFIG = {
  // API externe pour les données anime/manga - Jikan API (MyAnimeList)
  EXTERNAL_API: 'https://api.jikan.moe/v4',
  
  // Timeout par défaut
  TIMEOUT: 15000,
  
  // Retry configuration
  MAX_RETRIES: 2,
  RETRY_DELAY: 1000
};

// Fonction utilitaire pour les requêtes API directes
export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const { MAX_RETRIES, RETRY_DELAY, TIMEOUT, EXTERNAL_API } = API_CONFIG;
  let attempt = 0;
  
  while (attempt < MAX_RETRIES) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);
      
      // Utiliser directement l'API externe
      const url = `${EXTERNAL_API}${endpoint}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        },
        cache: 'no-cache',
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

// Fonctions API spécialisées pour ATOMIC FLIX utilisant Jikan API
export const animeAPI = {
  // Récupérer les animes tendance (top animes)
  getTrending: async () => {
    return await apiRequest('/top/anime?limit=20');
  },
  
  // Rechercher des animes
  search: async (query: string) => {
    return await apiRequest(`/anime?q=${encodeURIComponent(query)}&limit=20`);
  },
  
  // Détails d'un anime
  getDetails: async (id: string) => {
    return await apiRequest(`/anime/${id}`);
  },
  
  // Épisodes d'une saison (utilise les données de l'anime)
  getEpisodes: async (animeId: string, season: string, language: string) => {
    return await apiRequest(`/anime/${animeId}/episodes`);
  },
  
  // Sources de streaming (simulé pour compatibilité)
  getEmbedSources: async (episodeUrl: string) => {
    // Jikan n'a pas de sources de streaming, on retourne un format compatible
    return {
      sources: [
        { url: episodeUrl, quality: '720p', server: 'Original' }
      ]
    };
  },
  
  // Chapitres de manga
  getMangaChapters: async (mangaId: string) => {
    return await apiRequest(`/manga/${mangaId}`);
  },
  
  // Pages d'un chapitre de manga (simulé)
  getChapterPages: async (chapterId: string) => {
    return {
      pages: [],
      message: 'Lecture manga non disponible avec cette API'
    };
  }
};