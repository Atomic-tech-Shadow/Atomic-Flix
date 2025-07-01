import React, { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { ChevronLeft, ChevronRight, ChevronDown, Play, AlertCircle, ArrowLeft, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'wouter';
import MainLayout from '@/components/layout/main-layout';

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

  // Navigation vers la page de lecteur avec auto-play du premier épisode
  const goToPlayer = (season: Season) => {
    if (!id) return;
    // Naviguer vers le lecteur avec les paramètres de la saison sélectionnée - utiliser season.value pas season.number
    navigate(`/anime/${id}/player?season=${season.value}&episode=1&lang=vostfr`);
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

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-900 text-white">
      {/* Header avec bouton retour */}
      <div className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center p-4">
          <Link href="/" className="mr-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700"
            >
              <ArrowLeft size={20} />
            </motion.button>
          </Link>
          <h1 className="text-lg font-semibold truncate">{animeData.title}</h1>
        </div>
      </div>

      {/* Banner de l'anime */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10" />
        <img 
          src={animeData.image} 
          alt={animeData.title}
          className="w-full h-48 sm:h-64 object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/800x400/1a1a1a/ffffff?text=Image+Non+Disponible';
          }}
        />
        <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
          <h2 className="text-xl sm:text-2xl font-bold">{animeData.title}</h2>
          <p className="text-gray-300 text-sm mt-1">{animeData.synopsis}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {animeData.genres.map((genre, index) => (
              <span key={index} className="px-2 py-1 bg-gray-800/80 rounded text-xs">
                {genre}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
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

        {/* Informations de l'anime */}
        <div className="bg-gray-800/50 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-400">Statut:</span>
              <span className="ml-2 text-white">{animeData.status}</span>
            </div>
            <div>
              <span className="text-gray-400">Année:</span>
              <span className="ml-2 text-white">{animeData.year}</span>
            </div>
          </div>
        </div>

        {/* Sélection des saisons */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Saisons et Films</h3>
          <div className="grid grid-cols-2 gap-4">
            {animeData.seasons.map((season, index) => (
              <motion.button
                key={`season-${index}-${season.name}`}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => goToPlayer(season)}
                className="relative overflow-hidden rounded-2xl h-24 group transition-all duration-300 border-4 border-blue-400 hover:border-blue-300 hover:shadow-lg"
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
                    <div className="text-white font-bold text-lg drop-shadow-lg">
                      {season.name}
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </div>


      </div>
      </div>
    </MainLayout>
  );
};

export default AnimePage;
