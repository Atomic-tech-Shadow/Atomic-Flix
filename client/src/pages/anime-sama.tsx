import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useLocation } from 'wouter';
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

const AnimeSamaPage: React.FC = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Nouvelles sections
  const [popularAnimes, setPopularAnimes] = useState<any>(null);
  const [recentEpisodes, setRecentEpisodes] = useState<any[]>([]);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [planning, setPlanning] = useState<any>(null);

  // Charger toutes les sections au démarrage
  useEffect(() => {
    loadPopularAnimes();
    loadRecentEpisodes();
    loadRecommendations();
    loadPlanning();
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

  // Charger les animes populaires (Classiques + Pépites)
  const loadPopularAnimes = async () => {
    try {
      const response = await animeAPI.getPopular();
      if (response && response.success) {
        setPopularAnimes(response);
      }
    } catch (error) {
      console.error('Erreur chargement populaires:', error);
    }
  };

  // Charger les épisodes récents
  const loadRecentEpisodes = async () => {
    try {
      const response = await animeAPI.getRecent();
      if (response && response.success && response.recentEpisodes) {
        setRecentEpisodes(response.recentEpisodes.slice(0, 20));
      }
    } catch (error) {
      console.error('Erreur chargement épisodes récents:', error);
    }
  };

  // Charger les recommandations
  const loadRecommendations = async () => {
    try {
      const response = await animeAPI.getRecommendations(1, 30);
      if (response && response.success && response.data) {
        setRecommendations(response.data);
      }
    } catch (error) {
      console.error('Erreur chargement recommandations:', error);
    }
  };

  // Charger le planning du jour
  const loadPlanning = async () => {
    try {
      const response = await animeAPI.getPlanning();
      if (response && response.success) {
        setPlanning(response);
      }
    } catch (error) {
      console.error('Erreur chargement planning:', error);
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
        // ⚠️ L'API retourne "animes" pas "results"
        const animes = response.animes || [];
        if (Array.isArray(animes)) {
          setSearchResults(animes);
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

  // Naviguer vers la page dédiée anime
  const loadAnimeDetails = async (animeId: string) => {
    navigate(`/anime/${animeId}`);
  };

  // Naviguer directement vers le lecteur avec les informations d'épisode
  const playEpisode = (episode: any) => {
    const lang = episode.language?.toLowerCase() || 'vostfr';
    navigate(`/anime/${episode.animeId}/player?season=${episode.season}&episode=${episode.episode}&lang=${lang}`);
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
                  onClick={() => loadAnimeDetails(anime.id)}
                  className="cursor-pointer group overflow-hidden atomic-hover-scale h-56 sm:h-64 md:h-72 rounded-lg relative"
                >
                  <img
                    src={anime.image}
                    alt={anime.title}
                    className="w-full h-full object-cover group-hover:opacity-90 transition-opacity absolute inset-0"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                  {/* Badge type de contenu */}
                  <div className={`absolute top-2 left-2 text-white text-xs px-3 py-1 rounded-full font-bold backdrop-blur-sm border transition-all duration-300 ${
                    anime.type === 'film' || anime.type === 'movie' ? 'bg-cyan-500/80 border-cyan-400 hover:bg-cyan-500' :
                    'bg-cyan-500/80 border-cyan-400 hover:bg-cyan-500'
                  }`}>
                    {anime.type === 'film' || anime.type === 'movie' ? 'FILM' : 'ANIME'}
                  </div>
                  
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
            {/* Section Héro - Classiques Incontournables */}
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
              {/* Images d'animes classiques en mosaïque visible en haut */}
              {popularAnimes?.categories?.classiques?.anime?.length > 0 && (
                <>
                  {/* Mobile: 5 images */}
                  <div className="flex h-20 sm:hidden">
                    {popularAnimes.categories.classiques.anime.slice(0, 5).map((anime: any, index: number) => (
                      <div
                        key={`hero-mosaic-mobile-${index}`}
                        className="flex-1 overflow-hidden cursor-pointer"
                        style={{
                          transform: `skew(${index % 2 === 0 ? '3deg' : '-3deg'})`,
                          marginLeft: index > 0 ? '-2px' : '0'
                        }}
                        onClick={() => loadAnimeDetails(anime.id)}
                      >
                        <img
                          src={anime.image}
                          alt={anime.title}
                          className="w-full h-full object-cover brightness-90 hover:brightness-110 transition-all duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${anime.id}.jpg`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {/* Desktop: 8 images */}
                  <div className="hidden sm:flex h-28 md:h-32">
                    {popularAnimes.categories.classiques.anime.slice(0, 8).map((anime: any, index: number) => (
                      <div
                        key={`hero-mosaic-desktop-${index}`}
                        className="flex-1 overflow-hidden cursor-pointer"
                        style={{
                          transform: `skew(${index % 2 === 0 ? '3deg' : '-3deg'})`,
                          marginLeft: index > 0 ? '-2px' : '0'
                        }}
                        onClick={() => loadAnimeDetails(anime.id)}
                      >
                        <img
                          src={anime.image}
                          alt={anime.title}
                          className="w-full h-full object-cover brightness-90 hover:brightness-110 transition-all duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${anime.id}.jpg`;
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Contenu principal */}
              <div className="px-4 py-6 sm:px-8 sm:py-10 md:px-12 md:py-12 text-center bg-gradient-to-t from-black via-black/95 to-black/80">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  {/* Badge Premium */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    className="inline-block mb-3 sm:mb-4"
                  >
                    <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border-2 border-cyan-400/50 rounded-full backdrop-blur-sm">
                      <span className="text-cyan-400 font-bold text-xs sm:text-sm tracking-wider">✨ STREAMING PREMIUM</span>
                    </div>
                  </motion.div>

                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black mb-4 sm:mb-6 atomic-gradient-text drop-shadow-[0_0_30px_rgba(0,240,255,0.8)] tracking-tight leading-tight px-2">
                    ATOMIC FLIX<br />
                    <span className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                      Ta dose d'anime 🔥
                    </span>
                  </h1>
                  
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 mb-5 sm:mb-6 font-medium max-w-2xl mx-auto leading-relaxed px-2">
                    Plonge dans l'univers des <span className="text-cyan-400 font-bold">meilleurs animes</span> du moment.
                    <br className="hidden sm:inline" /><span className="sm:hidden"> </span>
                    Des <span className="text-purple-400 font-bold">classiques légendaires</span> aux <span className="text-pink-400 font-bold">nouveautés épiques</span> !
                  </p>

                  {/* Tags Features */}
                  <div className="flex flex-wrap justify-center gap-2 sm:gap-3 px-2">
                    {[
                      { icon: '🎬', text: 'VOSTFR & VF', color: 'from-cyan-500 to-blue-500' },
                      { icon: '⚡', text: 'HD STREAMING', color: 'from-purple-500 to-pink-500' },
                      { icon: '🌟', text: '100% GRATUIT', color: 'from-yellow-500 to-orange-500' }
                    ].map((tag, index) => (
                      <motion.div
                        key={tag.text}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1, type: "spring" }}
                        className={`px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r ${tag.color} rounded-lg font-bold text-white text-xs sm:text-sm shadow-lg hover:scale-105 transition-transform duration-200`}
                      >
                        {tag.icon} {tag.text}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Logo en bas à droite */}
              <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 opacity-60">
                <img 
                  src="/assets/atomic-logo-round.png" 
                  alt="ATOMIC FLIX" 
                  className="h-6 w-6 sm:h-8 sm:w-8 atomic-logo-round"
                />
              </div>


            </motion.div>

            {/* Section Épisodes Récents */}
            {recentEpisodes.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="mb-6">
                  <h2 className="atomic-gradient-text text-3xl md:text-4xl font-extrabold flex items-center gap-3 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                    <span className="text-4xl md:text-5xl">📺</span>
                    <span className="tracking-tight">Nouveautés</span>
                  </h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-transparent mt-3 rounded-full"></div>
                </div>
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex gap-4 w-max animate-scroll-left">
                    {recentEpisodes.map((episode, index) => (
                      <motion.div
                        key={`recent-${episode.animeId}-${episode.episode}-${index}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => playEpisode(episode)}
                        className="cursor-pointer group overflow-hidden atomic-hover-scale w-48 h-72 rounded-lg relative flex-shrink-0"
                        data-testid={`card-recent-${episode.animeId}`}
                      >
                        <img
                          src={episode.image}
                          alt={episode.animeTitle}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity absolute inset-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${episode.animeId}.jpg`;
                          }}
                        />
                        {/* Badges */}
                        <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
                          <div className={`text-white text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm ${
                            episode.language === 'VF' ? 'bg-green-500/90' :
                            episode.language === 'VOSTFR' ? 'bg-blue-500/90' :
                            'bg-purple-500/90'
                          }`}>
                            {episode.language}
                          </div>
                          {episode.isFinale && (
                            <div className="bg-red-500/90 text-white text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
                              FINALE
                            </div>
                          )}
                        </div>
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3">
                          <h3 className="text-white font-semibold text-sm leading-tight mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {episode.animeTitle}
                          </h3>
                          <p className="text-cyan-400 text-xs font-medium">
                            S{episode.season} Ép{episode.episode}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section Animes Populaires - Classiques */}
            {popularAnimes?.categories?.classiques?.anime?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="mb-6">
                  <h2 className="atomic-gradient-text text-3xl md:text-4xl font-extrabold flex items-center gap-3 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                    <span className="text-4xl md:text-5xl">🏆</span>
                    <span className="tracking-tight">Les Classiques</span>
                  </h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-transparent mt-3 rounded-full"></div>
                </div>
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex gap-4 w-max">
                    {popularAnimes.categories.classiques.anime.map((anime: any, index: number) => (
                      <motion.div
                        key={`classique-${anime.id}-${index}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => loadAnimeDetails(anime.id)}
                        className="cursor-pointer group overflow-hidden atomic-hover-scale w-48 h-72 rounded-lg relative flex-shrink-0"
                        data-testid={`card-classique-${anime.id}`}
                      >
                        <img
                          src={anime.image}
                          alt={anime.title}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity absolute inset-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${anime.id}.jpg`;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3">
                          <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {anime.title}
                          </h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section Animes Populaires - Pépites */}
            {popularAnimes?.categories?.pepites?.anime?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="mb-6">
                  <h2 className="atomic-gradient-text text-3xl md:text-4xl font-extrabold flex items-center gap-3 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                    <span className="text-4xl md:text-5xl">💎</span>
                    <span className="tracking-tight">Pépites</span>
                  </h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-transparent mt-3 rounded-full"></div>
                </div>
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex gap-4 w-max">
                    {popularAnimes.categories.pepites.anime.map((anime: any, index: number) => (
                      <motion.div
                        key={`pepite-${anime.id}-${index}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => loadAnimeDetails(anime.id)}
                        className="cursor-pointer group overflow-hidden atomic-hover-scale w-48 h-72 rounded-lg relative flex-shrink-0"
                        data-testid={`card-pepite-${anime.id}`}
                      >
                        <img
                          src={anime.image}
                          alt={anime.title}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity absolute inset-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${anime.id}.jpg`;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3">
                          <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {anime.title}
                          </h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section Recommandations */}
            {recommendations.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="mb-6">
                  <h2 className="atomic-gradient-text text-3xl md:text-4xl font-extrabold flex items-center gap-3 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                    <span className="text-4xl md:text-5xl">✨</span>
                    <span className="tracking-tight">Découvertes</span>
                  </h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-transparent mt-3 rounded-full"></div>
                </div>
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex gap-4 w-max">
                    {recommendations.slice(0, 20).map((anime: any, index: number) => (
                      <motion.div
                        key={`rec-${anime.id}-${index}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => loadAnimeDetails(anime.id)}
                        className="cursor-pointer group overflow-hidden atomic-hover-scale w-48 h-72 rounded-lg relative flex-shrink-0"
                        data-testid={`card-recommendation-${anime.id}`}
                      >
                        <img
                          src={anime.image}
                          alt={anime.title}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity absolute inset-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${anime.id}.jpg`;
                          }}
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3">
                          <h3 className="text-white font-semibold text-sm leading-tight group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {anime.title}
                          </h3>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Section Planning du jour */}
            {planning?.items?.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <div className="mb-6">
                  <h2 className="atomic-gradient-text text-3xl md:text-4xl font-extrabold flex items-center gap-3 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                    <span className="text-4xl md:text-5xl">📅</span>
                    <span className="tracking-tight">Aujourd'hui ({planning.day})</span>
                  </h2>
                  <div className="h-1 w-32 bg-gradient-to-r from-cyan-400 to-transparent mt-3 rounded-full"></div>
                </div>
                <div className="overflow-x-auto pb-4 scrollbar-hide">
                  <div className="flex gap-4 w-max">
                    {planning.items.map((item: any, index: number) => (
                      <motion.div
                        key={`planning-${item.animeId}-${index}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05, duration: 0.3 }}
                        onClick={() => loadAnimeDetails(item.animeId)}
                        className="cursor-pointer group overflow-hidden atomic-hover-scale w-48 h-72 rounded-lg relative flex-shrink-0"
                        data-testid={`card-planning-${item.animeId}`}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:opacity-90 transition-opacity absolute inset-0"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/${item.animeId}.jpg`;
                          }}
                        />
                        {/* Badge heure */}
                        <div className="absolute top-2 left-2 bg-cyan-500/90 text-white text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
                          {item.releaseTime}
                        </div>
                        {item.isReported && (
                          <div className="absolute top-2 right-2 bg-orange-500/90 text-white text-xs px-2 py-1 rounded-full font-semibold backdrop-blur-sm">
                            REPORTÉ
                          </div>
                        )}
                        
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent p-3">
                          <h3 className="text-white font-semibold text-sm leading-tight mb-1 group-hover:text-cyan-400 transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          <p className="text-gray-300 text-xs">{item.language}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
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
                    loadRecentEpisodes();
                  }}
                  className="mt-2 text-cyan-400 hover:text-cyan-300 transition-colors"
                >
                  Réessayer
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
