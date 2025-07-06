import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { SectionLoading } from '@/components/ui/loading-spinner';
import { animeAPI } from '@/lib/api';

interface SearchResult {
  id: string;
  title: string;
  url: string;
  type: string;
  status: string;
  image: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  meta?: any;
}

const AnimeSamaPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchHistory, setWatchHistory] = useState<{[key: string]: number}>({});
  const [popularAnimes, setPopularAnimes] = useState<SearchResult[]>([]);

  // Charger l'historique au démarrage et vérifier les paramètres de recherche
  useEffect(() => {
    const savedHistory = localStorage.getItem('animeWatchHistory');
    if (savedHistory) {
      setWatchHistory(JSON.parse(savedHistory));
    }
    
    // Charger les animes populaires au démarrage
    loadPopularAnimes();
  }, []);

  // Écouter les changements d'URL pour les paramètres de recherche
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    if (searchParam && searchParam !== searchQuery) {
      setSearchQuery(searchParam);
    } else if (!searchParam && searchQuery) {
      setSearchQuery('');
    }
  }, [window.location.search]);

  // Charger tout le contenu populaire depuis l'API
  const loadPopularAnimes = async () => {
    try {
      const response = await animeAPI.getTrending();
      
      if (response && response.success && response.results) {
        // Afficher tous les types de contenu de l'API : animes, mangas, films
        setPopularAnimes(response.results.slice(0, 24)); // Augmenter le nombre d'éléments affichés
        console.log('Contenu populaire chargé:', response.results.length, 'éléments');
      } else {
        console.warn('Réponse API trending échouée:', response);
        setPopularAnimes([]);
      }
    } catch (error) {
      console.error('Erreur chargement trending:', error);
      setPopularAnimes([]);
    }
  };

  // Configuration API externe
  const API_BASE_URL = 'https://anime-sama-scraper.vercel.app';

  // Fonction utilitaire pour les requêtes API externes
  const apiRequest = async (endpoint: string, options = {}) => {
    const maxRetries = 2;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          ...options
        });
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        attempt++;
        console.log(`Tentative ${attempt}/${maxRetries} échouée:`, error);
        
        if (attempt >= maxRetries) {
          console.error('Erreur API après', maxRetries, 'tentatives:', error);
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  };

  // Recherche d'animes
  const searchAnimes = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await animeAPI.search(query);
      
      if (response && response.success) {
        const results = response.results || [];
        if (Array.isArray(results)) {
          // Afficher tout le contenu de l'API : animes, mangas, films, etc.
          setSearchResults(results);
        } else {
          console.warn('Pas de résultats dans la réponse:', response);
          setSearchResults([]);
        }
      } else {
        throw new Error('Réponse API invalide');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de recherche';
      console.error('Erreur recherche:', errorMessage);
      
      if (errorMessage.includes('504') || errorMessage.includes('timeout')) {
        setError('Le serveur anime-sama-scraper.vercel.app ne répond pas actuellement. Veuillez réessayer plus tard.');
      } else if (errorMessage.includes('500')) {
        setError('Erreur temporaire du serveur. Veuillez réessayer dans quelques instants.');
      } else {
        setError('Impossible de rechercher les animes. Vérifiez votre connexion internet.');
      }
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Naviguer vers la page dédiée (anime ou manga)
  const loadAnimeDetails = async (animeId: string, contentType?: string) => {
    // Détecter si c'est un manga pour rediriger vers le lecteur approprié
    if (contentType === 'manga') {
      navigate(`/manga/${animeId}/reader`);
    } else {
      navigate(`/anime/${animeId}`);
    }
  };



  // Gérer la recherche en temps réel
  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        searchAnimes(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  return (
    <MainLayout>
      <div className="min-h-screen text-white atomic-fade-in" style={{ backgroundColor: 'var(--atomic-dark)' }}>

      {/* Page principale */}
      <div className="px-2 pt-1 pb-2">
        {/* Barre de recherche locale */}
        {searchQuery && (
          <div className="mb-6 atomic-slide-in">
            <div className="atomic-glass flex items-center gap-3 p-4">
              <Search size={20} className="text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher des animes..."
                className="flex-1 bg-transparent text-white placeholder-gray-400 border-none outline-none atomic-input"
                autoFocus
              />
              <button
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Résultats de recherche */}
        <AnimatePresence mode="wait">
          {loading && searchQuery && (
            <SectionLoading message="Recherche en cours..." />
          )}
          
          {searchResults.length > 0 && !loading && (
            <motion.div 
              key="search-results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3"
            >
              {searchResults.map((anime, index) => (
                <motion.div
                  key={`search-${anime.id}-${index}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  onClick={() => loadAnimeDetails(anime.id, anime.type)}
                  className="cursor-pointer group overflow-hidden atomic-hover-scale h-56 sm:h-64 md:h-72 rounded-lg relative"
                >
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity absolute inset-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Image+Non+Disponible';
                      target.onerror = null;
                    }}
                  />
                  {/* Badge type de contenu */}
                  <div className={`absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-full font-bold backdrop-blur-sm border transition-all duration-300 ${
                    anime.type === 'manga' ? 'bg-orange-500/80 border-orange-400 hover:bg-orange-500' :
                    anime.type === 'film' ? 'bg-purple-500/80 border-purple-400 hover:bg-purple-500' :
                    anime.type === 'movie' ? 'bg-purple-500/80 border-purple-400 hover:bg-purple-500' :
                    'bg-cyan-500/80 border-cyan-400 hover:bg-cyan-500'
                  }`}>
                    {anime.type === 'manga' ? 'MANGA' :
                     anime.type === 'film' || anime.type === 'movie' ? 'FILM' :
                     'ANIME'}
                  </div>
                  
                  {watchHistory[anime.id] && (
                    <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
                      Ep {watchHistory[anime.id]}
                    </div>
                  )}
                  
                  {/* Titre superposé sur l'image */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 pb-3">
                    <h3 className="text-white font-semibold text-sm leading-tight mb-2 group-hover:text-cyan-400 transition-all duration-300">{anime.title}</h3>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300 text-xs uppercase tracking-wide">{anime.status}</p>
                      <p className="text-cyan-400/80 text-xs font-medium">{anime.type || 'anime'}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {!searchQuery && !searchResults.length && (
          <div>
            {/* Section Héro - Nouvelle Saison */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8 relative overflow-hidden rounded-2xl"
              style={{
                background: '#0A0A1A',
                border: '1px solid rgba(0, 240, 255, 0.2)'
              }}
            >
              {/* Images d'animes en mosaïque visible en haut */}
              <div className="flex h-24 md:h-32">
                {popularAnimes.slice(0, 8).map((anime, index) => (
                  <div
                    key={`hero-mosaic-${index}`}
                    className="flex-1 overflow-hidden"
                    style={{
                      transform: `skew(${index % 2 === 0 ? '3deg' : '-3deg'})`,
                      marginLeft: index > 0 ? '-2px' : '0'
                    }}
                  >
                    <img
                      src={anime.image}
                      alt={anime.title}
                      className="w-full h-full object-cover brightness-90 hover:brightness-100 transition-all duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Contenu principal */}
              <div className="px-6 py-8 md:px-12 md:py-12 text-center bg-gradient-to-t from-black via-black/95 to-black/80">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <h1 className="text-3xl md:text-5xl font-bold mb-2 atomic-gradient-text">
                    ATOMIC FLIX
                  </h1>
                  <p className="text-lg md:text-xl text-gray-200 mb-4 font-light">
                    Plongez dans l'univers infini<br />
                    des animes et mangas !
                  </p>
                </motion.div>
              </div>

              {/* Logo en bas à droite */}
              <div className="absolute bottom-4 right-6 opacity-60">
                <img 
                  src="/assets/atomic-logo-new.png" 
                  alt="ATOMIC FLIX" 
                  className="h-8 w-auto"
                />
              </div>


            </motion.div>

            {/* Section Animes Populaires */}
            {popularAnimes.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-4"
              >
                <div className="mb-4">
                  <h2 className="atomic-gradient-text text-xl font-bold flex items-center gap-2">
                    🔥 Contenu Populaire 📈
                  </h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {popularAnimes.map((anime, index) => (
                    <motion.div
                      key={`popular-${anime.id}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                      onClick={() => loadAnimeDetails(anime.id, anime.type)}
                      className="cursor-pointer group overflow-hidden atomic-hover-scale h-56 sm:h-64 md:h-72 rounded-lg relative"
                    >
                      <img
                        src={anime.image}
                        alt={anime.title}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity absolute inset-0"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/300x400/1a1a1a/ffffff?text=Image+Non+Disponible';
                          target.onerror = null;
                        }}
                      />
                      {/* Badge type de contenu */}
                      <div className={`absolute top-2 left-2 text-white text-xs px-2 py-1 rounded-full font-semibold ${
                        anime.type === 'manga' ? 'bg-orange-500' :
                        anime.type === 'film' ? 'bg-purple-500' :
                        anime.type === 'movie' ? 'bg-purple-500' :
                        'bg-blue-500'
                      }`}>
                        {anime.type === 'manga' ? 'MANGA' :
                         anime.type === 'film' || anime.type === 'movie' ? 'FILM' :
                         'ANIME'}
                      </div>
                      
                      {watchHistory[anime.id] && (
                        <div className="absolute top-2 right-2 bg-cyan-500 text-white text-xs px-2 py-1 rounded-full">
                          Ep {watchHistory[anime.id]}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      {/* Titre superposé sur l'image */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-4 pb-3">
                        <h3 className="text-white font-semibold text-sm leading-tight mb-2 group-hover:text-cyan-400 transition-colors">
                          {anime.title}
                        </h3>
                        <div className="flex justify-between items-center">
                          <p className="text-gray-300 text-xs">{anime.status}</p>
                          <div className="text-cyan-400 text-xs font-medium">#{index + 1}</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Message de chargement */}
            {loading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                <p className="text-gray-400 mt-2">Chargement...</p>
              </div>
            )}

            {/* Message d'erreur */}
            {error && (
              <div className="text-center py-8">
                <p className="text-red-400">{error}</p>
                <button 
                  onClick={() => {
                    setError(null);
                    loadPopularAnimes();
                  }}
                  className="mt-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Réessayer
                </button>
              </div>
            )}

            {/* Message vide si pas de contenu populaire et pas de chargement */}
            {!loading && !error && popularAnimes.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-400">Aucun contenu populaire trouvé</p>
                <button 
                  onClick={() => loadPopularAnimes()}
                  className="mt-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Charger le contenu populaire
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      </div>
    </MainLayout>
  );
};

export default AnimeSamaPage;
