import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, ArrowLeft, ZoomIn, ZoomOut, RotateCw, BookOpen, List } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import MainLayout from '@/components/layout/main-layout';

interface MangaChapter {
  id: string;
  title: string;
  chapterNumber: number;
  url: string;
  pages: string[];
  available: boolean;
}

interface MangaData {
  id: string;
  title: string;
  description: string;
  image: string;
  genres: string[];
  status: string;
  author: string;
  chapters: MangaChapter[];
  url: string;
}

const MangaReaderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  
  // Récupérer les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const targetChapter = urlParams.get('chapter');
  
  // États pour les données
  const [mangaData, setMangaData] = useState<MangaData | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<MangaChapter | null>(null);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
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

  // Charger les détails du manga
  useEffect(() => {
    if (!id) return;
    
    const loadMangaData = async () => {
      try {
        setLoading(true);
        
        const response = await apiRequest(`/api/anime/${id}`);
        
        if (response && response.success && response.data) {
          setMangaData(response.data);
          
          // Sélectionner le chapitre demandé ou le premier disponible
          if (response.data.chapters && response.data.chapters.length > 0) {
            let chapterToSelect = response.data.chapters[0];
            
            if (targetChapter) {
              const requestedChapter = response.data.chapters.find(
                (c: any) => c.chapterNumber === parseInt(targetChapter)
              );
              if (requestedChapter) {
                chapterToSelect = requestedChapter;
              }
            }
            
            setSelectedChapter(chapterToSelect);
            await loadChapterPages(chapterToSelect);
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

  // Charger les pages d'un chapitre
  const loadChapterPages = async (chapter: MangaChapter) => {
    try {
      setLoading(true);
      
      const response = await apiRequest(`/api/manga/chapter/${chapter.id}`);
      
      if (response && response.success && response.pages) {
        const updatedChapter = { ...chapter, pages: response.pages };
        setSelectedChapter(updatedChapter);
        setCurrentPageIndex(0);
      } else {
        setError('Erreur lors du chargement des pages du chapitre');
      }
    } catch (error) {
      console.error('Erreur chargement pages:', error);
      setError('Erreur lors du chargement des pages du chapitre');
    } finally {
      setLoading(false);
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
    if (!mangaData || !selectedChapter) return;
    
    const currentIndex = mangaData.chapters.findIndex(c => c.id === selectedChapter.id);
    if (currentIndex < mangaData.chapters.length - 1) {
      const nextChap = mangaData.chapters[currentIndex + 1];
      setSelectedChapter(nextChap);
      loadChapterPages(nextChap);
    }
  };

  const prevChapter = () => {
    if (!mangaData || !selectedChapter) return;
    
    const currentIndex = mangaData.chapters.findIndex(c => c.id === selectedChapter.id);
    if (currentIndex > 0) {
      const prevChap = mangaData.chapters[currentIndex - 1];
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

  if (error || !mangaData) {
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
      <div className="min-h-screen bg-black text-white">
        {/* Header fixe */}
        <div className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              <Link href="/anime-sama">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <ArrowLeft size={20} />
                </motion.button>
              </Link>
              
              <div>
                <h1 className="text-lg font-bold truncate max-w-[200px]">{mangaData.title}</h1>
                {selectedChapter && (
                  <p className="text-sm text-gray-400">
                    Chapitre {selectedChapter.chapterNumber} - Page {currentPageIndex + 1}/{selectedChapter.pages?.length || 0}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Contrôles de zoom */}
              <button
                onClick={zoomOut}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Zoom arrière"
              >
                <ZoomOut size={16} />
              </button>
              
              <span className="text-sm px-2">{Math.round(zoom * 100)}%</span>
              
              <button
                onClick={zoomIn}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Zoom avant"
              >
                <ZoomIn size={16} />
              </button>

              {/* Liste des chapitres */}
              <button
                onClick={() => setShowChapterList(!showChapterList)}
                className="p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                title="Liste des chapitres"
              >
                <List size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Liste des chapitres (sidebar) */}
        <AnimatePresence>
          {showChapterList && (
            <motion.div
              initial={{ x: 300 }}
              animate={{ x: 0 }}
              exit={{ x: 300 }}
              className="fixed top-0 right-0 h-full w-80 bg-gray-900 border-l border-gray-800 z-40 overflow-y-auto"
            >
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-bold">Chapitres</h3>
                <button
                  onClick={() => setShowChapterList(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="p-2">
                {mangaData.chapters.map((chapter) => (
                  <button
                    key={chapter.id}
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
                    <div className="font-medium">Chapitre {chapter.chapterNumber}</div>
                    <div className="text-sm opacity-70">{chapter.title}</div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone de lecture principale */}
        <div className="pt-20 pb-4">
          {selectedChapter && selectedChapter.pages?.length > 0 ? (
            <div className="flex justify-center items-center min-h-[calc(100vh-6rem)]">
              <div 
                className="relative max-w-full overflow-auto"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              >
                <img
                  src={selectedChapter.pages[currentPageIndex]}
                  alt={`Page ${currentPageIndex + 1}`}
                  className="max-w-full h-auto cursor-pointer"
                  onClick={nextPage}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/800x1200/1a1a1a/ffffff?text=Page+Non+Disponible';
                    target.onerror = () => {};
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-96">
              <p className="text-gray-400">Aucune page disponible pour ce chapitre</p>
            </div>
          )}
        </div>

        {/* Contrôles de navigation en bas */}
        <div className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-sm border-t border-gray-800">
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