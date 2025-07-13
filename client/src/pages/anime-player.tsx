import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, ChevronDown, Download, Shield, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { SectionLoading } from '@/components/ui/loading-spinner';
// BreadcrumbNav import disponible si nécessaire
// import { BreadcrumbNav } from '@/components/navigation/breadcrumb-nav';

interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  url: string;
  language: string;
  available: boolean;
  streamingSources?: VideoSource[];
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

const AnimePlayerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [, ] = useLocation();
  
  // Récupérer les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const targetSeason = urlParams.get('season');
  const targetEpisode = urlParams.get('episode');
  const targetLang = urlParams.get('lang');
  
  // États pour les données
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<'VF' | 'VOSTFR'>(
    targetLang === 'vf' ? 'VF' : 'VOSTFR'
  );
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodeDetails, setEpisodeDetails] = useState<EpisodeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [episodeLoading, setEpisodeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

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

  // Fonction pour charger les détails d'un anime via l'API externe
  const getAnimeDetails = async (animeId: string) => {
    try {
      const response = await apiRequest(`https://anime-sama-scraper.vercel.app/api/anime/${animeId}`);
      
      if (!response || !response.success) {
        console.error('Erreur API anime details:', response);
        return null;
      }
      
      return response;
    } catch (error) {
      console.error('Erreur chargement anime API:', error);
      return null;
    }
  };



  // Fonction pour charger les saisons d'un anime selon la documentation API
  const getAnimeSeasons = async (animeId: string) => {
    try {
      const response = await apiRequest(`https://anime-sama-scraper.vercel.app/api/seasons/${animeId}`);
      return response;
    } catch (error) {
      console.error('Erreur chargement saisons:', error);
      return null;
    }
  };

  // Utilisation des fonctions définies pour éviter les erreurs TypeScript
  console.log('Fonction saisons prête:', getAnimeSeasons);

  // Charger les données de l'anime
  useEffect(() => {
    if (!id) return;
    
    const loadAnimeData = async () => {
      try {
        setLoading(true);
        
        // Charger les données de base de l'anime avec API robuste
        const animeData = await getAnimeDetails(id);
        
        if (animeData && animeData.success && animeData.data) {
          setAnimeData(animeData.data);
          
          // Utiliser les saisons retournées par l'API
          if (animeData.data.seasons && animeData.data.seasons.length > 0) {
            // Utiliser toutes les saisons retournées par l'API sans filtrage
            const seasons = animeData.data.seasons;
            
            // Sélectionner la saison demandée ou la première disponible
            let seasonToSelect = seasons[0];
            console.log('Saisons disponibles:', seasons.length);
            console.log('Première saison:', seasonToSelect);
            
            if (targetSeason) {
              const requestedSeason = seasons.find((s: any) => s.value === targetSeason || s.number === parseInt(targetSeason));
              if (requestedSeason) {
                seasonToSelect = requestedSeason;
              }
            }
            
            console.log('Saison sélectionnée:', seasonToSelect);
            setSelectedSeason(seasonToSelect);
            console.log('Début chargement épisodes pour saison:', seasonToSelect?.name);
            
            // Charger les épisodes via l'API automatiquement avec la langue par défaut
            if (seasonToSelect) {
              console.log('Chargement épisodes via API...');
              // S'assurer qu'une langue est sélectionnée par défaut
              const defaultLanguage = seasonToSelect.languages.includes('VF') ? 'VF' : 
                                    seasonToSelect.languages.includes('VOSTFR') ? 'VOSTFR' : 
                                    seasonToSelect.languages[0] || 'VF';
              
              setSelectedLanguage(defaultLanguage as 'VF' | 'VOSTFR');
              
              // Charger directement avec la langue par défaut
              await loadSeasonEpisodesDirectly(animeData.data, seasonToSelect, true, defaultLanguage);
            }
          }
        }
      } catch (err) {
        console.error('Erreur chargement anime:', err);
        setError('Erreur lors du chargement de l\'anime');
      } finally {
        setLoading(false);
      }
    };

    loadAnimeData();
  }, [id]);



  // Fonction pour charger les épisodes via API externe uniquement
  const loadSeasonEpisodesDirectly = async (animeDataObj: any, season: Season, autoLoadEpisode = false, customLanguage?: string) => {
    try {
      setEpisodeLoading(true);
      const languageToUse = customLanguage || selectedLanguage;
      const languageCode = languageToUse.toLowerCase();
      
      console.log('Chargement épisodes pour:', animeDataObj.id, 'saison:', season.value, 'langue:', languageToUse);
      
      // Utiliser uniquement l'API externe
      const data = await apiRequest(`https://anime-sama-scraper.vercel.app/api/episodes/${animeDataObj.id}?season=${season.value}&language=${languageCode}`);
      console.log('Épisodes reçus de l\'API:', data);
      
      if (!data || !data.success) {
        console.error('Erreur API épisodes:', data);
        setError('Erreur lors du chargement des épisodes depuis l\'API');
        return;
      }
      
      if (data.episodes && Array.isArray(data.episodes) && data.episodes.length > 0) {
        // Adapter les données de l'API au format attendu avec validation
        const formattedEpisodes: Episode[] = data.episodes.map((ep: any, index: number) => {
          const episodeNumber = ep.number || (index + 1);
          const episodeTitle = ep.title || `Épisode ${episodeNumber}`;
          const episodeUrl = ep.url || `https://anime-sama.fr/catalogue/${animeDataObj.id}/${season.value}/${languageCode}/episode-${episodeNumber}`;
          
          return {
            id: `${animeDataObj.id}-${season.value}-ep${episodeNumber}-${languageCode}`,
            title: episodeTitle,
            episodeNumber: episodeNumber,
            url: episodeUrl,
            language: data.language ? data.language.toUpperCase() : languageToUse.toUpperCase(),
            available: ep.available !== false, // Default à true si non spécifié
            streamingSources: ep.streamingSources || []
          };
        });
        
        console.log('Épisodes formatés depuis API:', formattedEpisodes.length);
        setEpisodes(formattedEpisodes);
        
        // Sélectionner l'épisode spécifié ou le premier
        let episodeToSelect = formattedEpisodes[0];
        
        if (targetEpisode) {
          const requestedEpisode = formattedEpisodes.find(
            (ep: any) => ep.episodeNumber === parseInt(targetEpisode)
          );
          if (requestedEpisode) {
            episodeToSelect = requestedEpisode;
          }
        }
        
        console.log('Épisode sélectionné:', episodeToSelect.title);
        setSelectedEpisode(episodeToSelect);
        
        // Auto-charger l'épisode avec l'API embed
        if (autoLoadEpisode) {
          try {
            const response = await fetch(`https://anime-sama-scraper.vercel.app/api/embed?url=${encodeURIComponent(episodeToSelect.url)}`);
            
            if (response.ok) {
              const embedData = await response.json();
              console.log('Sources embed reçues:', embedData);
              
              if (embedData.success && embedData.sources && embedData.sources.length > 0) {
                setEpisodeDetails({
                  id: episodeToSelect.id,
                  title: episodeToSelect.title,
                  animeTitle: animeDataObj.title,
                  episodeNumber: episodeToSelect.episodeNumber,
                  sources: embedData.sources,
                  availableServers: embedData.sources.map((s: any) => s.server),
                  url: episodeToSelect.url
                });
                console.log('Épisode chargé avec sources API embed:', embedData.sources.length, 'sources');
              } else {
                console.warn('Aucune source trouvée dans la réponse embed:', embedData);
                setError('Aucune source de streaming trouvée pour cet épisode');
              }
            } else {
              console.error('Erreur HTTP embed API:', response.status, response.statusText);
              setError('Erreur lors du chargement des sources de streaming');
            }
          } catch (embedError) {
            console.error('Erreur auto-chargement embed:', embedError);
            setError('Erreur lors du chargement automatique des sources');
          }
        }
      } else {
        setError('Aucun épisode trouvé pour cette saison et langue');
      }
    } catch (err) {
      console.error('Erreur chargement épisodes API:', err);
      setError('Erreur lors du chargement des épisodes depuis l\'API');
    } finally {
      setEpisodeLoading(false);
    }
  };



  const loadSeasonEpisodes = async (season: Season, autoLoadEpisode = false) => {
    if (!animeData) {
      console.log('Pas de données anime disponibles pour charger les épisodes');
      return;
    }
    
    try {
      setEpisodeLoading(true);
      const languageCode = selectedLanguage.toLowerCase();
      
      console.log('Chargement épisodes pour:', animeData.id, 'saison:', season.value, 'langue:', selectedLanguage);
      
      const data = await apiRequest(`https://anime-sama-scraper.vercel.app/api/episodes/${animeData.id}?season=${season.value}&language=${languageCode}`);
      console.log('Épisodes reçus de l\'API:', data);
      
      if (!data || !data.success) {
        console.error('Erreur API épisodes:', data);
        setError('Erreur lors du chargement des épisodes depuis l\'API');
        return;
      }
      
      if (data.episodes && Array.isArray(data.episodes) && data.episodes.length > 0) {
        const formattedEpisodes: Episode[] = data.episodes.map((ep: any, index: number) => {
          const episodeNumber = ep.number || (index + 1);
          const episodeTitle = ep.title || `Épisode ${episodeNumber}`;
          const episodeUrl = ep.url || `https://anime-sama.fr/catalogue/${animeData.id}/${season.value}/${languageCode}/episode-${episodeNumber}`;
          
          return {
            id: `${animeData.id}-${season.value}-ep${episodeNumber}-${languageCode}`,
            title: episodeTitle,
            episodeNumber: episodeNumber,
            url: episodeUrl,
            language: data.language ? data.language.toUpperCase() : selectedLanguage.toUpperCase(),
            available: ep.available !== false,
            streamingSources: ep.streamingSources || []
          };
        });
        
        console.log('Épisodes formatés depuis API:', formattedEpisodes.length);
        setEpisodes(formattedEpisodes);
        
        let episodeToSelect = formattedEpisodes[0];
        
        if (targetEpisode) {
          const requestedEpisode = formattedEpisodes.find(
            (ep: any) => ep.episodeNumber === parseInt(targetEpisode)
          );
          if (requestedEpisode) {
            episodeToSelect = requestedEpisode;
          }
        }
        
        setSelectedEpisode(episodeToSelect);
        
        if (autoLoadEpisode) {
          try {
            const response = await fetch(`https://anime-sama-scraper.vercel.app/api/embed?url=${encodeURIComponent(episodeToSelect.url)}`);
            
            if (response.ok) {
              const embedData = await response.json();
              console.log('Sources embed reçues:', embedData);
              
              if (embedData.success && embedData.sources && embedData.sources.length > 0) {
                setEpisodeDetails({
                  id: episodeToSelect.id,
                  title: episodeToSelect.title,
                  animeTitle: animeData.title,
                  episodeNumber: episodeToSelect.episodeNumber,
                  sources: embedData.sources,
                  availableServers: embedData.sources.map((s: any) => s.server),
                  url: episodeToSelect.url
                });
                console.log('Épisode chargé avec sources API embed:', embedData.sources.length, 'sources');
              } else {
                console.warn('Aucune source trouvée dans la réponse embed:', embedData);
                setError('Aucune source de streaming trouvée pour cet épisode');
              }
            } else {
              console.error('Erreur HTTP embed API:', response.status, response.statusText);
              setError('Erreur lors du chargement des sources de streaming');
            }
          } catch (embedError) {
            console.error('Erreur auto-chargement embed:', embedError);
            setError('Erreur lors du chargement automatique des sources');
          }
        }
      } else {
        setError('Aucun épisode trouvé pour cette saison et langue');
      }
    } catch (err) {
      console.error('Erreur chargement épisodes API:', err);
      setError('Erreur lors du chargement des épisodes depuis l\'API');
    } finally {
      setEpisodeLoading(false);
    }
  };


  // Charger les sources directes via l'API embed uniquement
  const loadEpisodeSources = async (episode: Episode) => {
    if (!episode || !animeData) return;
    
    try {
      setEpisodeLoading(true);
      
      console.log('Récupération sources streaming pour épisode:', episode.episodeNumber);
      
      // Utiliser uniquement l'API embed externe selon la documentation
      const response = await fetch(`https://anime-sama-scraper.vercel.app/api/embed?url=${encodeURIComponent(episode.url)}`);
      
      if (!response.ok) {
        console.error(`Erreur API embed: ${response.status}`);
        setError('Erreur lors du chargement des sources de streaming');
        return;
      }
      
      const embedData = await response.json();
      console.log('Sources streaming reçues de l\'API:', embedData);
      
      if (embedData.success && embedData.sources && embedData.sources.length > 0) {
        // Utiliser uniquement les sources authentiques de l'API
        setEpisodeDetails({
          id: episode.id,
          title: episode.title,
          animeTitle: animeData.title,
          episodeNumber: episode.episodeNumber,
          sources: embedData.sources,
          availableServers: embedData.sources.map((s: any) => s.server),
          url: episode.url
        });
        setSelectedPlayer(0);
        console.log('Sources streaming chargées:', embedData.sources.length, 'serveurs disponibles');
      } else {
        console.error('Aucune source trouvée dans la réponse API');
        setError('Aucune source de streaming disponible pour cet épisode');
      }
    } catch (err) {
      console.error('Erreur récupération sources API:', err);
      setError('Erreur lors du chargement des sources de streaming');
    } finally {
      setEpisodeLoading(false);
    }
  };

  // Navigation entre épisodes
  const navigateEpisode = async (direction: 'prev' | 'next') => {
    if (!selectedEpisode) return;
    
    const currentIndex = episodes.findIndex(ep => ep.id === selectedEpisode.id);
    let newIndex = direction === 'next' ? currentIndex + 1 : currentIndex - 1;
    
    if (newIndex >= 0 && newIndex < episodes.length) {
      const newEpisode = episodes[newIndex];
      setSelectedEpisode(newEpisode);
      // ✅ Utiliser l'ID complet de l'épisode
      loadEpisodeSources(newEpisode);
    }
  };

  // Changer de langue
  const changeLanguage = (newLanguage: 'VF' | 'VOSTFR') => {
    setSelectedLanguage(newLanguage);
    if (selectedSeason && animeData) {
      // Recharger les épisodes avec la nouvelle langue
      loadSeasonEpisodesDirectly(animeData, selectedSeason, true, newLanguage);
    }
  };

  // Système de téléchargement automatique
  const downloadVideoAutomatic = async (quality: 'faible' | 'moyenne' | 'HD') => {
    if (!episodeDetails || !episodeDetails.sources.length) {
      console.error('Aucun épisode ou source disponible');
      return;
    }

    try {
      setShowDownloadMenu(false);
      
      const embedUrl = episodeDetails.sources[selectedPlayer]?.url;
      const serverName = episodeDetails.sources[selectedPlayer]?.server;
      
      if (!embedUrl) {
        throw new Error('Aucune source sélectionnée');
      }
      
      const qualityLabels = {
        'faible': '360p',
        'moyenne': '720p', 
        'HD': '1080p'
      };
      
      const fileName = `${episodeDetails.animeTitle} - Episode ${episodeDetails.episodeNumber} (${qualityLabels[quality]}).mp4`;
      
      console.log(`Démarrage téléchargement automatique ${quality} pour:`, fileName);
      
      // Méthode 1: Essayer de télécharger directement via service worker
      if ('serviceWorker' in navigator && 'MessageChannel' in window) {
        try {
          const messageChannel = new MessageChannel();
          const swRegistration = await navigator.serviceWorker.ready;
          
          if (swRegistration.active) {
            // Envoyer la demande de téléchargement au service worker
            swRegistration.active.postMessage({
              type: 'DOWNLOAD_VIDEO',
              url: embedUrl,
              fileName: fileName,
              quality: quality
            }, [messageChannel.port2]);
            
            // Écouter la réponse
            messageChannel.port1.onmessage = (event) => {
              if (event.data.success) {
                console.log('Téléchargement démarré via service worker');
                return;
              } else {
                console.log('Service worker échec, tentative méthode 2');
                downloadWithFetch();
              }
            };
            
            // Timeout après 3 secondes
            setTimeout(() => {
              console.log('Service worker timeout, tentative méthode 2');
              downloadWithFetch();
            }, 3000);
            
            return;
          }
        } catch (swError) {
          console.log('Service worker non disponible, tentative méthode 2');
        }
      }
      
      // Méthode 2: Téléchargement direct avec fetch et blob
      async function downloadWithFetch() {
        try {
          console.log('Tentative de téléchargement direct...');
          
          // Créer un iframe caché pour charger la page embed
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = embedUrl;
          document.body.appendChild(iframe);
          
          // Attendre que l'iframe se charge
          await new Promise((resolve) => {
            iframe.onload = resolve;
            setTimeout(resolve, 5000); // Timeout après 5 secondes
          });
          
          try {
            // Essayer d'extraire l'URL de la vidéo depuis l'iframe
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
            if (iframeDoc) {
              const videoElements = iframeDoc.querySelectorAll('video source, video');
              let videoUrl = null;
              
              for (const element of videoElements) {
                const src = element.getAttribute('src') || element.getAttribute('data-src');
                if (src && (src.includes('.mp4') || src.includes('.m3u8') || src.includes('video'))) {
                  videoUrl = src.startsWith('http') ? src : new URL(src, embedUrl).href;
                  break;
                }
              }
              
              if (videoUrl) {
                console.log('URL vidéo trouvée:', videoUrl);
                
                // Télécharger la vidéo
                const response = await fetch(videoUrl, {
                  mode: 'cors',
                  headers: {
                    'Referer': embedUrl,
                    'Origin': new URL(embedUrl).origin
                  }
                });
                
                if (response.ok) {
                  const blob = await response.blob();
                  const downloadUrl = URL.createObjectURL(blob);
                  
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = fileName;
                  link.style.display = 'none';
                  
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                  
                  URL.revokeObjectURL(downloadUrl);
                  document.body.removeChild(iframe);
                  
                  console.log('Téléchargement automatique réussi!');
                  return;
                }
              }
            }
          } catch (extractError) {
            console.log('Extraction échouée:', extractError);
          }
          
          // Nettoyer l'iframe
          document.body.removeChild(iframe);
          
          // Méthode 3: Fallback - Ouvrir la page avec instructions
          console.log('Méthode automatique échouée, ouverture manuelle...');
          
          const newWindow = window.open(embedUrl, '_blank');
          if (newWindow) {
            setTimeout(() => {
              alert(`Téléchargement automatique impossible pour ce serveur (${serverName}).\n\nLa page vidéo s'est ouverte dans un nouvel onglet.\n\nInstructions:\n1. Attendez que la vidéo se charge\n2. Clic droit sur la vidéo\n3. "Enregistrer la vidéo sous..."\n4. Nommez le fichier: ${fileName}`);
            }, 1000);
          }
          
        } catch (fetchError) {
          console.error('Erreur téléchargement fetch:', fetchError);
          
          // Dernier recours: Copier l'URL dans le presse-papiers
          try {
            await navigator.clipboard.writeText(embedUrl);
            alert(`Téléchargement automatique impossible.\n\nL'URL a été copiée dans votre presse-papiers:\n${embedUrl}\n\nCollez-la dans un téléchargeur vidéo comme yt-dlp ou une extension de navigateur.`);
          } catch (clipboardError) {
            alert(`Téléchargement automatique impossible pour ce serveur.\n\nVeuillez utiliser une extension de navigateur ou copier manuellement cette URL:\n${embedUrl}`);
          }
        }
      }
      
      // Démarrer le téléchargement
      downloadWithFetch();
      
    } catch (error) {
      console.error('Erreur téléchargement automatique:', error);
      setShowDownloadMenu(false);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur lors du téléchargement automatique: ${errorMessage}`);
    }
  };

  // Fonction pour télécharger la vidéo avec qualité choisie
  const downloadVideo = async (quality: 'faible' | 'moyenne' | 'HD') => {
    // Lancer le téléchargement automatique
    await downloadVideoAutomatic(quality);
  };

  // Système de blocage des publicités
  const adBlockerPatterns = [
    // Domaines de publicité communs
    'googleads', 'googlesyndication', 'doubleclick', 'adsystem',
    'amazon-adsystem', 'googletag', 'adsense', 'adnxs', 'adsystem',
    'facebook.com/tr', 'google-analytics', 'googletagmanager',
    // Patterns spécifiques aux sites de streaming
    'ads', 'advertisement', 'popup', 'banner', 'sponsor',
    'promo', 'marketing', 'tracking', 'analytics',
    // Extensions d'annonces
    '.ads.', '-ads-', '/ads/', 'ads.js', 'ads.css',
    'adblock', 'advert', 'commercial', 'promotion'
  ];

  const blockAds = () => {
    if (!iframeRef.current) return;

    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        // Bloquer les scripts de publicité silencieusement
        const scripts = iframeDoc.querySelectorAll('script');
        scripts.forEach(script => {
          const src = script.src || script.innerHTML;
          if (adBlockerPatterns.some(pattern => src.toLowerCase().includes(pattern))) {
            script.remove();
          }
        });

        // Bloquer les iframes de publicité silencieusement
        const iframes = iframeDoc.querySelectorAll('iframe');
        iframes.forEach(frame => {
          const src = frame.src;
          if (adBlockerPatterns.some(pattern => src.toLowerCase().includes(pattern))) {
            frame.remove();
          }
        });

        // Bloquer les overlays et popups qui apparaissent au clic
        const popupSelectors = [
          '[class*="ad"]', '[id*="ad"]', '[class*="advertisement"]',
          '[id*="advertisement"]', '[class*="sponsor"]', '[id*="sponsor"]',
          '[class*="popup"]', '[id*="popup"]', '[class*="banner"]',
          '[id*="banner"]', '.promo', '#promo', '[class*="overlay"]',
          '[id*="overlay"]', '[class*="modal"]', '[id*="modal"]',
          '[style*="position: fixed"]', '[style*="position: absolute"]',
          '[style*="z-index: 999"]', '[style*="z-index: 9999"]'
        ];

        popupSelectors.forEach(selector => {
          const elements = iframeDoc.querySelectorAll(selector);
          elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const style = window.getComputedStyle(element);
            const hasAdKeywords = adBlockerPatterns.some(pattern => 
              element.className.toLowerCase().includes(pattern) ||
              element.id.toLowerCase().includes(pattern)
            );
            
            // Détecter les overlays/popups par leur style
            const isOverlay = style.position === 'fixed' || 
                             style.position === 'absolute' ||
                             parseInt(style.zIndex) > 100 ||
                             (rect.width > window.innerWidth * 0.3 && rect.height > window.innerHeight * 0.3);
            
            if (hasAdKeywords || isOverlay) {
              element.style.display = 'none';
              element.remove();
            }
          });
        });

        // Bloquer window.open et les nouvelles fenêtres popup
        if (iframeDoc.defaultView) {
          const originalOpen = iframeDoc.defaultView.open;
          iframeDoc.defaultView.open = function() {
            return null; // Bloquer tous les window.open
          };
        }

        // Intercepter tous les clics pour empêcher les popups
        const blockPopupClicks = (e: Event) => {
          const target = e.target as Element;
          if (target) {
            // Vérifier si l'élément cliqué pourrait déclencher une popup
            const href = target.getAttribute('href');
            const onclick = target.getAttribute('onclick');
            
            if (href && adBlockerPatterns.some(pattern => href.toLowerCase().includes(pattern))) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
            
            if (onclick && (onclick.includes('window.open') || onclick.includes('popup'))) {
              e.preventDefault();
              e.stopPropagation();
              return false;
            }
          }
        };

        // Ajouter l'intercepteur de clics
        iframeDoc.addEventListener('click', blockPopupClicks, true);
        iframeDoc.addEventListener('mousedown', blockPopupClicks, true);

        // Observer pour bloquer les nouveaux éléments automatiquement
        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                  const element = node as Element;
                  
                  // Bloquer immédiatement les nouveaux scripts/iframes suspects
                  if (element.tagName === 'SCRIPT' || element.tagName === 'IFRAME') {
                    const src = element.getAttribute('src') || '';
                    if (adBlockerPatterns.some(pattern => src.toLowerCase().includes(pattern))) {
                      element.remove();
                    }
                  }
                  
                  // Bloquer les nouveaux overlays/popups
                  if (element.tagName === 'DIV' || element.tagName === 'SPAN') {
                    const style = window.getComputedStyle(element);
                    if (style.position === 'fixed' && parseInt(style.zIndex) > 100) {
                      element.remove();
                    }
                  }
                }
              });
            }
          });
        });

        observer.observe(iframeDoc.body, {
          childList: true,
          subtree: true
        });
      }
    } catch (error) {
      // Blocage silencieux des erreurs CORS
    }
  };

  // Ajouter du CSS dans l'iframe pour bloquer les popups
  const injectAdBlockCSS = () => {
    if (!iframeRef.current) return;

    try {
      const iframe = iframeRef.current;
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      
      if (iframeDoc) {
        // Créer le style CSS pour bloquer les overlays
        const style = iframeDoc.createElement('style');
        style.textContent = `
          /* Bloquer tous les overlays suspects */
          [class*="ad"], [id*="ad"],
          [class*="popup"], [id*="popup"],
          [class*="overlay"], [id*="overlay"],
          [class*="modal"], [id*="modal"],
          [class*="banner"], [id*="banner"],
          [class*="sponsor"], [id*="sponsor"],
          .promo, #promo {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            pointer-events: none !important;
          }
          
          /* Bloquer les éléments en position fixed avec z-index élevé */
          *[style*="position: fixed"][style*="z-index"],
          *[style*="position: absolute"][style*="z-index"] {
            display: none !important;
          }
          
          /* Empêcher les clics sur les overlays */
          body::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 99999;
            pointer-events: none;
          }
        `;
        
        // Ajouter le style au head de l'iframe
        const head = iframeDoc.head || iframeDoc.getElementsByTagName('head')[0];
        if (head) {
          head.appendChild(style);
        }
      }
    } catch (error) {
      // Erreur silencieuse
    }
  };

  // Effet pour activer le bloqueur de pub automatiquement et silencieusement
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      
      const enableSilentAdBlocker = () => {
        injectAdBlockCSS(); // Injecter le CSS d'abord
        setTimeout(blockAds, 500); // Premier passage rapide
        setTimeout(blockAds, 1500); // Deuxième passage
        setTimeout(blockAds, 3000); // Troisième passage pour les ads tardives
        setTimeout(blockAds, 5000); // Quatrième passage pour les ads dynamiques
        setTimeout(blockAds, 8000); // Cinquième passage pour les ads très tardives
        setTimeout(blockAds, 12000); // Sixième passage pour les ads post-interaction
      };

      iframe.addEventListener('load', enableSilentAdBlocker);
      enableSilentAdBlocker(); // Premier passage immédiat

      return () => {
        iframe.removeEventListener('load', enableSilentAdBlocker);
      };
    }
  }, [episodeDetails, selectedPlayer]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (error && !animeData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-red-500 text-xl flex items-center gap-2">
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
      <div className="-mx-4 -my-6">
        {/* Bannière avec titre de la saison - Pleine largeur */}
        <div className="relative overflow-hidden">
          <div 
            className="h-48 sm:h-56 md:h-64 bg-cover bg-center"
            style={{
              backgroundImage: `url(${animeData.image})`,
            }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="absolute bottom-4 left-4">
            <h2 className="text-white text-2xl font-bold">{animeData.title}</h2>
            <h3 className="text-gray-300 text-lg uppercase">{selectedSeason?.name}</h3>
          </div>
        </div>

      <div className="p-4 space-y-6">

        {/* Sélecteur de langue - Style anime-sama rectangulaire */}
        {selectedSeason && selectedSeason.languages.length > 1 && (
          <div className="flex gap-2">
            {selectedSeason.languages.map((lang) => (
              <motion.button
                key={lang}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => changeLanguage(lang as 'VF' | 'VOSTFR')}
                className={`relative px-4 py-2 rounded-md font-bold text-sm border-2 transition-all overflow-hidden ${
                  selectedLanguage === lang
                    ? 'border-white text-white shadow-lg opacity-100'
                    : 'border-gray-500 text-gray-300 hover:border-gray-300 opacity-50 hover:opacity-75'
                }`}
              >
                {/* Drapeau de fond */}
                {lang === 'VF' ? (
                  <div className="absolute inset-0 flex">
                    <div className="w-1/3 bg-blue-600"></div>
                    <div className="w-1/3 bg-white"></div>
                    <div className="w-1/3 bg-red-600"></div>
                  </div>
                ) : (
                  <div className="absolute inset-0 bg-red-600 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                    </div>
                  </div>
                )}
                
                {/* Texte de la langue */}
                <span className="relative z-10 text-white font-bold text-shadow-strong" style={{
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)'
                }}>
                  {lang === 'VOSTFR' ? 'VO' : lang}
                </span>
              </motion.button>
            ))}
          </div>
        )}

        {/* Sélecteurs - Style anime-sama */}
        {episodes.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {/* Sélecteur d'épisode */}
            <div className="relative">
              <select
                value={selectedEpisode?.id || ''}
                onChange={(e) => {
                  const episode = episodes.find(ep => ep.id === e.target.value);
                  if (episode) {
                    setSelectedEpisode(episode);
                    loadEpisodeSources(episode);
                  }
                }}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg appearance-none cursor-pointer border-2 border-blue-500 font-bold uppercase text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                {episodes.map((episode) => (
                  <option key={episode.id} value={episode.id}>
                    ÉPISODE {episode.episodeNumber}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" size={20} />
            </div>

            {/* Sélecteur de serveur */}
            {episodeDetails && episodeDetails.sources.length > 0 && (
              <div className="relative">
                <select
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(parseInt(e.target.value))}
                  className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg appearance-none cursor-pointer border-2 border-blue-500 font-bold uppercase text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  {episodeDetails.sources.map((source, index) => (
                    <option key={`server-${index}-${source.server}`} value={index}>
                      {source.server} ({source.quality})
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white pointer-events-none" size={20} />
              </div>
            )}
          </div>
        )}

        {/* Dernière sélection */}
        {selectedEpisode && (
          <div className="text-gray-300 text-sm">
            <span className="font-bold">DERNIÈRE SÉLECTION :</span> ÉPISODE {selectedEpisode.episodeNumber}
          </div>
        )}

        {/* Lecteur vidéo - URLs directes via API externe embed */}
        {episodeDetails && episodeDetails.sources.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-900 rounded-lg overflow-hidden border-2 border-gray-700"
          >
            <div className="aspect-video relative">
              <iframe
                ref={iframeRef}
                key={`player-${selectedPlayer}-${selectedEpisode?.id}`}
                src={episodeDetails.sources[selectedPlayer]?.url}
                className="w-full h-full"
                allowFullScreen
                frameBorder="0"
                title={`${episodeDetails?.title} - ${episodeDetails.sources[selectedPlayer]?.server}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation"
                referrerPolicy="no-referrer-when-downgrade"
              />
              
              {/* Overlay avec informations de l'épisode */}
              <div className="absolute top-4 left-4 bg-black/70 rounded-lg px-3 py-2">
                <div className="text-white text-sm font-bold">
                  {episodeDetails.animeTitle}
                </div>
                <div className="text-gray-300 text-xs">
                  Épisode {episodeDetails.episodeNumber} • {episodeDetails.sources[selectedPlayer]?.server} • {episodeDetails.sources[selectedPlayer]?.quality}
                </div>
              </div>


            </div>


          </motion.div>
        )}

        {/* Navigation entre épisodes - Style anime-sama */}
        {selectedEpisode && (
          <div className="flex justify-center items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateEpisode('prev')}
              disabled={!selectedEpisode || episodes.findIndex(ep => ep.id === selectedEpisode.id) === 0}
              className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={24} className="text-white" />
            </motion.button>
            
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="p-3 bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download size={24} className="text-white" />
              </motion.button>
              
              {/* Menu de téléchargement */}
              <AnimatePresence>
                {showDownloadMenu && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                    className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-800 rounded-lg border border-gray-700 shadow-xl overflow-hidden"
                  >
                    <div className="p-2 bg-gray-700 text-center">
                      <span className="text-white text-sm font-bold">Télécharger en :</span>
                    </div>
                    <div className="space-y-1 p-2">
                      <motion.button
                        whileHover={{ backgroundColor: '#374151' }}
                        onClick={() => downloadVideo('faible')}
                        className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded transition-colors flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <span>Qualité Faible (360p)</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: '#374151' }}
                        onClick={() => downloadVideo('moyenne')}
                        className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded transition-colors flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span>Qualité Moyenne (720p)</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ backgroundColor: '#374151' }}
                        onClick={() => downloadVideo('HD')}
                        className="w-full text-left px-3 py-2 text-white hover:bg-gray-700 rounded transition-colors flex items-center gap-2"
                      >
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>Qualité HD (1080p)</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigateEpisode('next')}
              disabled={!selectedEpisode || episodes.findIndex(ep => ep.id === selectedEpisode.id) === episodes.length - 1}
              className="p-3 bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={24} className="text-white" />
            </motion.button>
          </div>
        )}

        {/* Message d'erreur de pub */}
        {selectedEpisode && (
          <div className="text-center text-gray-300 text-sm italic">
            ⚛️I AM ATOMIC⚛️<br />
            <span className="font-bold">Trop de pub🙄? Changez de lecteur.</span>
          </div>
        )}

        <AnimatePresence>
          {episodeLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <SectionLoading message="Chargement des épisodes..." />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Gestion des erreurs */}
        {error && episodeDetails === null && (
          <div className="text-center py-8">
            <div className="text-red-500 text-lg">{error}</div>
            <div className="text-gray-400 text-sm mt-2">
              Essayez de changer d'épisode ou de langue
            </div>
          </div>
        )}
      </div>
      </div>
    </MainLayout>
  );
};

export default AnimePlayerPage;
