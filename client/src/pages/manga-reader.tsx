import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, ArrowLeft, ZoomIn, ZoomOut, RotateCw, BookOpen, List, Book } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import MainLayout from '@/components/layout/main-layout';

interface MangaChapter {
  id: string;
  title: string;
  number: number;
  url: string;
  pages: string[];
  available: boolean;
  language: string;
}

interface MangaSeason {
  number: number;
  name: string;
  value: string;
  type: string;
  languages: string[];
  available: boolean;
  contentType: string;
  url: string;
  fullUrl: string;
}

interface MangaData {
  id: string;
  title: string;
  synopsis: string;
  image: string;
  genres: string[];
  status: string;
  year: string;
  seasons: MangaSeason[];
  url: string;
}

const MangaReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  
  // Récupérer les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const targetChapter = urlParams.get('chapter');
  const targetSeason = urlParams.get('season') || 'scan';
  const targetLanguage = urlParams.get('language') || 'VF';
  
  // États pour les données
  const [mangaData, setMangaData] = useState<MangaData | null>(null);
  const [mangaSeasons, setMangaSeasons] = useState<MangaSeason[]>([]);
  const [selectedSeason, setSelectedSeason] = useState<MangaSeason | null>(null);
  const [chapters, setChapters] = useState<MangaChapter[]>([]);
  const [selectedChapter, setSelectedChapter] = useState<MangaChapter | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [loadingChapters, setLoadingChapters] = useState(false);
  const [loadingPages, setLoadingPages] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showChapterList, setShowChapterList] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [readingMode, setReadingMode] = useState<'single' | 'double'>('single');

  // Fonction pour les requêtes API externes uniquement
  const apiRequest = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Service externe indisponible: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Erreur API:', error);
      throw error;
    }
  };

  // Charger les détails du manga et ses saisons
  useEffect(() => {
    if (!id) return;
    
    const loadMangaData = async () => {
      try {
        setLoading(true);
        console.log('Chargement des données manga pour:', id);
        
        // Charger d'abord les informations générales
        const animeResponse = await apiRequest(`https://anime-sama-scraper.vercel.app/api/anime/${id}`);
        
        if (animeResponse && animeResponse.success && animeResponse.data) {
          setMangaData(animeResponse.data);
          
          // Charger les saisons pour trouver les scans
          const seasonsResponse = await apiRequest(`https://anime-sama-scraper.vercel.app/api/seasons/${id}`);
          
          if (seasonsResponse && seasonsResponse.success && seasonsResponse.seasons) {
            // Filtrer uniquement les scans (manga)
            const scans = seasonsResponse.seasons.filter((season: any) => season.contentType === 'manga');
            console.log('Scans trouvés:', scans);
            
            setMangaSeasons(scans);
            
            if (scans.length > 0) {
              // Sélectionner la saison demandée ou la première disponible
              let seasonToSelect = scans.find((s: any) => s.value === targetSeason) || scans[0];
              setSelectedSeason(seasonToSelect);
              
              // Charger les chapitres de cette saison
              await loadSeasonChapters(seasonToSelect, targetLanguage);
            } else {
              setError('Aucun scan disponible pour cet anime');
            }
          }
        }
      } catch (err) {
        console.error('Erreur chargement manga:', err);
        setError('Erreur lors du chargement du manga');
      } finally {
        setLoading(false);
      }
    };

    loadMangaData();
  }, [id]);

  // Charger les chapitres d'une saison/scan
  const loadSeasonChapters = async (season: MangaSeason, language: string = 'VF') => {
    try {
      setLoadingChapters(true);
      console.log('Chargement des chapitres pour:', season.value, 'langue:', language);
      
      const response = await apiRequest(
        `https://anime-sama-scraper.vercel.app/api/episodes/${id}?season=${season.value}&language=${language}`
      );
      
      if (response && response.success && response.episodes) {
        const chapterList = response.episodes.map((ep: any) => ({
          id: ep.id,
          title: ep.title,
          number: ep.number,
          url: ep.url,
          pages: [],
          available: ep.available,
          language: language
        }));
        
        console.log('Chapitres chargés:', chapterList);
        setChapters(chapterList);
        
        if (chapterList.length > 0) {
          // Si un chapitre spécifique est demandé, le sélectionner
          if (targetChapter) {
            const requestedChapter = chapterList.find(
              (c: any) => c.number === parseInt(targetChapter)
            );
            if (requestedChapter) {
              setSelectedChapter(requestedChapter);
              await loadChapterPages(requestedChapter);
            }
          }
          // Sinon, laisser l'utilisateur choisir depuis la liste
        }
      } else {
        setError('Aucun chapitre trouvé pour ce scan');
      }
    } catch (error) {
      console.error('Erreur chargement chapitres:', error);
      setError('Erreur lors du chargement des chapitres');
    } finally {
      setLoadingChapters(false);
    }
  };

  // Charger les pages d'un chapitre
  const loadChapterPages = async (chapter: MangaChapter) => {
    try {
      setLoadingPages(true);
      console.log('Chargement des pages pour le chapitre:', chapter.number);
      
      // Pour l'instant, l'API des pages n'est pas disponible
      // On affiche directement le chapitre sans essayer de charger les pages
      setSelectedChapter(chapter);
      setCurrentPageIndex(0);
      setError(null);
      
    } catch (error) {
      console.error('Erreur chargement pages:', error);
      // En cas d'erreur, on affiche quand même le chapitre
      setSelectedChapter(chapter);
      setCurrentPageIndex(0);
      setError(null);
    } finally {
      setLoadingPages(false);
    }
  };

  // Navigation entre les pages
  const nextPage = () => {
    if (selectedChapter && currentPageIndex < selectedChapter.pages.length - 1) {
      setCurrentPageIndex(prev => prev + 1);
    } else {
      nextChapter();
    }
  };

  const prevPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(prev => prev - 1);
    } else {
      prevChapter();
    }
  };

  // Navigation entre les chapitres
  const nextChapter = () => {
    if (!chapters || !selectedChapter) return;
    
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
    if (currentIndex < chapters.length - 1) {
      const nextChap = chapters[currentIndex + 1];
      setSelectedChapter(nextChap);
      loadChapterPages(nextChap);
    }
  };

  const prevChapter = () => {
    if (!chapters || !selectedChapter) return;
    
    const currentIndex = chapters.findIndex(c => c.id === selectedChapter.id);
    if (currentIndex > 0) {
      const prevChap = chapters[currentIndex - 1];
      setSelectedChapter(prevChap);
      loadChapterPages(prevChap);
    }
  };

  // Gestion du zoom
  const zoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const zoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  // Gestion des touches clavier
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowRight':
        case ' ':
          e.preventDefault();
          nextPage();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          prevPage();
          break;
        case '+':
        case '=':
          e.preventDefault();
          zoomIn();
          break;
        case '-':
          e.preventDefault();
          zoomOut();
          break;
        case 'Escape':
          setShowChapterList(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentPageIndex, selectedChapter]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Chargement du manga...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!mangaData && !loading) {
    return (
      <MainLayout>
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-xl mb-4">{error || 'Manga non trouvé'}</p>
            <Link href="/anime-sama">
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors">
                Retour à la recherche
              </button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-black text-white -mx-4 -my-6">
        {/* Header fixe optimisé mobile */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between p-2 sm:p-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
              <Link href="/anime-sama">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors flex-shrink-0"
                >
                  <ArrowLeft size={18} />
                </motion.button>
              </Link>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-sm sm:text-lg font-bold truncate">{mangaData?.title || 'Manga'}</h1>
                {selectedChapter && (
                  <p className="text-xs sm:text-sm text-gray-400 truncate">
                    Ch. {selectedChapter.number} - Page {currentPageIndex + 1}/{selectedChapter.pages?.length || 0}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Contrôles de zoom - masqués sur très petit écran */}
              <div className="hidden sm:flex items-center gap-1">
                <button
                  onClick={zoomOut}
                  className="p-1.5 sm:p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  title="Zoom arrière"
                >
                  <ZoomOut size={14} />
                </button>
                
                <span className="text-xs px-1">{Math.round(zoom * 100)}%</span>
                
                <button
                  onClick={zoomIn}
                  className="p-1.5 sm:p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  title="Zoom avant"
                >
                  <ZoomIn size={14} />
                </button>
              </div>

              {/* Liste des chapitres */}
              <button
                onClick={() => setShowChapterList(!showChapterList)}
                className="p-1.5 sm:p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors relative"
                title="Liste des chapitres"
              >
                <List size={16} />
                {chapters.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {chapters.length > 99 ? '99+' : chapters.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Liste des chapitres (sidebar responsive) */}
        <AnimatePresence>
          {showChapterList && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed top-0 right-0 h-full w-full sm:w-80 bg-gray-900 border-l border-gray-800 z-40 overflow-y-auto"
            >
              <div className="p-3 sm:p-4 border-b border-gray-800 sticky top-0 bg-gray-900">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Chapitres ({chapters.length})</h3>
                  <button
                    onClick={() => setShowChapterList(false)}
                    className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    ✕
                  </button>
                </div>
                {mangaSeasons.length > 1 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-400">
                      Type: {selectedSeason?.name || 'Scans'}
                    </p>
                  </div>
                )}
              </div>
              <div className="p-2 pb-20">
                {chapters.map((chapter, index) => (
                  <button
                    key={`chapter-${chapter.number}-${index}`}
                    onClick={() => {
                      setSelectedChapter(chapter);
                      loadChapterPages(chapter);
                      setShowChapterList(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg mb-2 transition-colors ${
                      selectedChapter?.id === chapter.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <div className="font-medium">Chapitre {chapter.number}</div>
                    <div className="text-sm opacity-70 truncate">{chapter.title}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone de lecture principale optimisée mobile */}
        <div className="pt-14 sm:pt-20 pb-16 sm:pb-4">
          {loadingPages ? (
            <div className="flex items-center justify-center min-h-[60vh]">
              <div className="text-center">
                <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-white">Chargement des pages...</p>
              </div>
            </div>
          ) : selectedChapter && selectedChapter.pages?.length > 0 ? (
            <div className="flex justify-center items-center min-h-[calc(100vh-8rem)]">
              <div 
                className="relative max-w-full overflow-auto touch-pan-x touch-pan-y"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              >
                <img
                  src={selectedChapter.pages[currentPageIndex]}
                  alt={`Page ${currentPageIndex + 1}`}
                  className="max-w-full h-auto cursor-pointer select-none"
                  onClick={nextPage}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x1200/1a1a1a/ffffff?text=Page+Non+Disponible';
                    target.onerror = () => {};
                  }}
                  draggable={false}
                />
              </div>
            </div>
          ) : selectedChapter ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <Book size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">{selectedChapter.title}</h3>
              <p className="text-gray-400 mb-4">Chapitre {selectedChapter.number}</p>
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 sm:p-4 max-w-sm sm:max-w-md">
                <p className="text-yellow-400 text-sm">
                  Les pages de ce chapitre seront bientôt disponibles. 
                  L'API des images de manga est en cours de développement.
                </p>
              </div>
              {selectedChapter.url && (
                <a 
                  href={selectedChapter.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Lire sur anime-sama.fr
                </a>
              )}
            </div>
          ) : chapters.length > 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
              <List size={48} className="text-gray-600 mb-4" />
              <h3 className="text-lg sm:text-xl font-bold text-white mb-2">Sélectionnez un chapitre</h3>
              <p className="text-gray-400 mb-4">{chapters.length} chapitres disponibles</p>
              <button
                onClick={() => setShowChapterList(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2"
              >
                <List size={16} />
                Voir la liste des chapitres
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center min-h-[60vh]">
              <p className="text-gray-400">Aucun chapitre disponible</p>
            </div>
          )}
        </div>

        {/* Contrôles de navigation en bas optimisés mobile */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-sm border-t border-gray-800 sm:hidden">
          <div className="flex items-center justify-between p-2">
            <button
              onClick={prevPage}
              disabled={currentPageIndex === 0}
              className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
            >
              <ChevronLeft size={14} />
              <span className="hidden xs:inline">Préc</span>
            </button>

            <div className="flex items-center gap-2 flex-1 justify-center">
              <span className="text-xs text-gray-400">
                {currentPageIndex + 1} / {selectedChapter?.pages?.length || 0}
              </span>
              
              {/* Barre de progression */}
              <div className="w-20 sm:w-32 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ 
                    width: `${((currentPageIndex + 1) / (selectedChapter?.pages?.length || 1)) * 100}%` 
                  }}
                />
              </div>
            </div>

            <button
              onClick={nextPage}
              disabled={!selectedChapter || (currentPageIndex === selectedChapter.pages.length - 1)}
              className="flex items-center gap-1 px-3 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors text-sm"
            >
              <span className="hidden xs:inline">Suiv</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Contrôles desktop */}
        <div className="hidden sm:block fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={prevPage}
              disabled={currentPageIndex === 0}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <ChevronLeft size={16} />
              Précédent
            </button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-400">
                {currentPageIndex + 1} / {selectedChapter?.pages?.length || 0}
              </span>
              
              {/* Barre de progression */}
              <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300"
                  style={{ 
                    width: `${((currentPageIndex + 1) / (selectedChapter?.pages?.length || 1)) * 100}%` 
                  }}
                />
              </div>
            </div>

            <button
              onClick={nextPage}
              disabled={!selectedChapter || (currentPageIndex === selectedChapter.pages.length - 1)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              Suivant
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Overlay pour fermer la liste des chapitres */}
        {showChapterList && (
          <div 
            className="fixed inset-0 bg-black/50 z-30"
            onClick={() => setShowChapterList(false)}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default MangaReaderPage;