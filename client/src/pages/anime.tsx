import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { ChevronLeft, ChevronRight, ChevronDown, Play, AlertCircle, ArrowLeft, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import MainLayout from '@/components/layout/main-layout';
import { SectionLoading, PageLoading } from '@/components/ui/loading-spinner';
import { FloatingBackButton } from '@/components/navigation/floating-back-button';
import { BreadcrumbNav } from '@/components/navigation/breadcrumb-nav';

interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  url: string;
  language: string;
  available: boolean;
}

interface VideoSource {
  url: string;
  server: string;
  quality: string;
  language: string;
  type: string;
  serverIndex: number;
}

interface Season {
  number: number;
  name: string;
  value: string;
  languages: string[];
  episodeCount: number;
  url: string;
  available: boolean;
}

interface AnimeData {
  id: string;
  title: string;
  synopsis: string;
  image: string;
  genres: string[];
  status: string;
  year: string;
  seasons: Season[];
  url: string;
}

interface EpisodeDetails {
  id: string;
  title: string;
  animeTitle: string;
  episodeNumber: number;
  sources: VideoSource[];
  availableServers: string[];
  url: string;
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
  meta?: any;
}

const AnimePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configuration API externe
  const API_BASE_URL = 'https://anime-sama-scraper.vercel.app';

  // Fonction pour les requêtes API avec timeout augmenté
  const apiRequest = async (endpoint: string, timeoutMs = 20000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      console.log('Requête API:', endpoint);
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Timeout: La requête a pris trop de temps');
      }
      throw error;
    }
  };

  // Charger les données de l'anime avec approche hybride
  useEffect(() => {
    if (!id) return;
    
    const loadAnimeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Essayer uniquement l'endpoint direct des détails anime
        console.log('Chargement des détails pour:', id);
        const apiResponse = await apiRequest(`/api/anime/${id}`, 20000);
        
        if (!apiResponse || !apiResponse.success) {
          const errorMsg = apiResponse?.error || apiResponse?.message || 'Anime non trouvé dans la base de données';
          throw new Error(errorMsg);
        }
        
        setAnimeData(apiResponse.data);
        
      } catch (err) {
        console.error('Erreur chargement anime:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
        
        if (errorMessage.includes('Timeout') || errorMessage.includes('timeout')) {
          setError('Le serveur met trop de temps à répondre. Cet anime pourrait nécessiter plus de temps de traitement.');
        } else if (errorMessage.includes('500')) {
          setError('Erreur temporaire du serveur. Veuillez réessayer.');
        } else if (errorMessage.includes('404') || errorMessage.includes('non trouvé')) {
          setError('Cet anime n\'a pas été trouvé. Vérifiez l\'orthographe ou essayez un autre anime.');
        } else {
          setError(`Impossible de charger l'anime: ${errorMessage}`);
        }
      } finally {
        setLoading(false);
      }
    };

    loadAnimeData();
  }, [id]);

  // Navigation vers la page de lecteur appropriée
  const goToPlayer = (season: Season) => {
    if (!id) return;
    
    // Vérifier si c'est un manga/scan basé sur le nom de la saison
    const isManga = season.name.toLowerCase().includes('scan') || 
                   season.name.toLowerCase().includes('manga') ||
                   season.name.toLowerCase().includes('tome') ||
                   season.name.toLowerCase().includes('chapitre');
    
    if (isManga) {
      // Rediriger vers le lecteur de manga
      navigate(`/manga/${id}/reader?season=${season.value}`);
    } else {
      // Rediriger vers le lecteur vidéo
      navigate(`/anime/${id}/player?season=${season.value}&episode=1&lang=vostfr`);
    }
  };




  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error && !animeData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl flex items-center gap-2">
          <AlertCircle size={24} />
          {error}
        </div>
      </div>
    );
  }

  if (!animeData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Anime non trouvé</div>
      </div>
    );
  }

  // État de chargement global
  if (loading && !animeData) {
    return (
      <MainLayout>
        <PageLoading message="Chargement des détails de l'anime..." />
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div>
        {/* Bouton de retour flottant */}
        <FloatingBackButton 
          onClick={() => navigate('/anime-sama')}
          show={true}
        />

      {/* Banner de l'anime */}
      <div className="relative atomic-fade-in overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10" />
        <img 
          src={animeData.image} 
          alt={animeData.title}
          className="w-full h-72 sm:h-80 md:h-96 object-cover transition-transform duration-700 hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Image+Non+Disponible';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 atomic-slide-in">
          <h2 className="text-xl sm:text-2xl font-bold atomic-gradient-text mb-2">{animeData.title}</h2>
          <p className="text-gray-300 text-sm mt-1 leading-relaxed">{animeData.synopsis}</p>
          
          {/* Informations intégrées */}
          <div className="flex flex-wrap items-center gap-3 mt-3 mb-3">
            <div className="flex items-center space-x-2 bg-cyan-500/20 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-cyan-300 text-xs font-medium">
                {animeData.seasons.length} saisons
              </span>
            </div>
            <div className="flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm rounded-full px-3 py-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-blue-300 text-xs font-medium">{animeData.year}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {animeData.genres.map((genre, index) => (
              <span key={index} className="px-3 py-1 bg-cyan-500/20 border border-cyan-500/30 rounded-full text-xs text-cyan-300 backdrop-blur-sm transition-all duration-300 hover:bg-cyan-500/30">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 pt-0 space-y-6">
        {/* Message d'erreur/info avec possibilité de réessayer */}
        {error && (
          <div className="bg-red-600/20 border border-red-600/30 rounded-lg p-4">
            <p className="text-red-200 text-sm flex items-center mb-3">
              <AlertCircle className="mr-2 flex-shrink-0" size={16} />
              {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Sélection des saisons */}
        <div className="atomic-fade-in">
          <h3 className="atomic-gradient-text text-xl font-bold mb-6 flex items-center gap-2">
            🎬 Saisons et Films
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {animeData.seasons.map((season, index) => {
              // Détecter si c'est un manga/scan
              const isManga = season.name.toLowerCase().includes('scan') || 
                             season.name.toLowerCase().includes('manga') ||
                             season.name.toLowerCase().includes('tome') ||
                             season.name.toLowerCase().includes('chapitre');
              
              // Couleur de bordure selon le type
              const borderColor = isManga ? 'border-orange-400 hover:border-orange-300 hover:shadow-orange-500/25' : 'border-cyan-400 hover:border-cyan-300 hover:shadow-cyan-500/25';
              
              return (
                <motion.button
                  key={`season-${index}-${season.name}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => goToPlayer(season)}
                  className={`relative overflow-hidden rounded-2xl h-28 group transition-all duration-300 border-2 ${borderColor} atomic-hover-glow backdrop-blur-sm bg-gray-900/30`}
                >
                  {/* Image de fond */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transform group-hover:scale-105 transition-transform duration-300"
                    style={{
                      backgroundImage: `url(${animeData.image})`,
                    }}
                  />
                  {/* Overlay avec gradient sombre */}
                  <div className="absolute inset-0 bg-black/60" />
                  
                  {/* Contenu centré */}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <div className="text-center">
                      <div className="text-white font-bold text-sm sm:text-base leading-tight drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                        {season.name}
                      </div>
                      {isManga && (
                        <div className="mt-1 text-orange-300 text-xs font-medium">
                          📖 MANGA
                        </div>
                      )}
                      {!isManga && (
                        <div className="mt-1 text-cyan-300 text-xs font-medium">
                          🎥 ANIME
                        </div>
                      )}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
      </div>
    </MainLayout>
  );
};

export default AnimePage;
