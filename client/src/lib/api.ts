// Configuration API pour ATOMIC FLIX - API externe directe
export const API_CONFIG = {
  // API externe pour les données anime
  EXTERNAL_API: 'https://anime-sama-scraper.vercel.app/api',
  
  // Timeout par défaut
  TIMEOUT: 30000,
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000
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
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Referer': 'https://atomic-flix.vercel.app/',
          'Origin': 'https://atomic-flix.vercel.app',
          ...options.headers
        },
        mode: 'cors',
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
      console.error(`Tentative ${attempt}/${MAX_RETRIES} échouée pour ${endpoint}:`, error);
      
      if (attempt >= MAX_RETRIES) {
        console.error('Erreur API après', MAX_RETRIES, 'tentatives:', error);
        
        // Propagate error without fallback
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
    }
  }
};

// Fonctions API spécialisées pour ATOMIC FLIX
export const animeAPI = {
  // Récupérer les animes populaires (Classiques + Pépites)
  getPopular: async () => {
    return await apiRequest('/popular');
  },
  
  // Système de recommandations intelligent v2.0 (1500-2000 animes avec rotation)
  getRecommendations: async (page = 1, limit = 50) => {
    return await apiRequest(`/recommendations?page=${page}&limit=${limit}`);
  },
  
  // Planning hebdomadaire des sorties (avec détection timezone automatique)
  getPlanning: async (day?: string, filter?: string, timezone?: string) => {
    let queryParams = [];
    if (day) queryParams.push(`day=${encodeURIComponent(day)}`);
    if (filter) queryParams.push(`filter=${encodeURIComponent(filter)}`);
    if (timezone) queryParams.push(`timezone=${encodeURIComponent(timezone)}`);
    
    const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
    return await apiRequest(`/planning${queryString}`);
  },
  
  // Épisodes récents (avec détection langue améliorée)
  getRecent: async () => {
    return await apiRequest('/recent');
  },
  
  // Rechercher des animes
  search: async (query: string) => {
    return await apiRequest(`/search?query=${encodeURIComponent(query)}`);
  },
  
  // Détails d'un anime
  getDetails: async (id: string) => {
    return await apiRequest(`/anime/${id}`);
  },
  
  // Saisons d'un anime (avec synopsis complet)
  getSeasons: async (animeId: string) => {
    return await apiRequest(`/seasons/${animeId}`);
  },
  
  // Épisodes d'une saison
  getEpisodes: async (animeId: string, season: string, language: string) => {
    return await apiRequest(`/episodes/${animeId}?season=${season}&language=${language}`);
  },
  
  // Sources de streaming par ID d'épisode
  getEpisodeById: async (episodeId: string) => {
    return await apiRequest(`/episode-by-id?id=${encodeURIComponent(episodeId)}`);
  },
  
  // Sources de streaming (méthode alternative)
  getEmbedSources: async (episodeUrl: string) => {
    return await apiRequest(`/embed?url=${encodeURIComponent(episodeUrl)}`);
  }
};