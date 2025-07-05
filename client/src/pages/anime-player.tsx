import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { ChevronLeft, ChevronRight, ChevronDown, Play, ArrowLeft, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
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
  const [, navigate] = useLocation();
  
  // Récupérer les paramètres de l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const targetSeason = urlParams.get('season');
  const targetEpisode = urlParams.get('episode');
  const targetLang = urlParams.get('lang');
  const isDirectLink = !!(targetSeason && targetEpisode && targetLang);
  
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
            
            // Charger les épisodes via l'API
            if (seasonToSelect) {
              console.log('Chargement épisodes via API...');
              await loadSeasonEpisodesDirectly(animeData.data, seasonToSelect, true);
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



  // Fonction de chargement des épisodes - utilise uniquement l'API
  const loadSeasonEpisodes = async (season: Season, autoLoadEpisode = false) => {
    if (!animeData) {
      console.log('Pas de données anime disponibles pour charger les épisodes');
      return;
    }
    
    try {
      setEpisodeLoading(true);
      const languageCode = selectedLanguage.toLowerCase();
      
      console.log('Chargement épisodes pour:', animeData.id, 'saison:', season.value, 'langue:', selectedLanguage);
      
      // Utiliser uniquement l'API selon la documentation
      const data = await apiRequest(`https://anime-sama-scraper.vercel.app/api/episodes/${animeData.id}?season=${season.value}&language=${languageCode}`);
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
          const episodeUrl = ep.url || `https://anime-sama.fr/catalogue/${animeData.id}/${season.value}/${languageCode}/episode-${episodeNumber}`;
          
          return {
            id: `${animeData.id}-${season.value}-ep${episodeNumber}-${languageCode}`,
            title: episodeTitle,
            episodeNumber: episodeNumber,
            url: episodeUrl,
            language: data.language ? data.language.toUpperCase() : selectedLanguage.toUpperCase(),
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
        
        setSelectedEpisode(episodeToSelect);
        
        // Auto-charger l'épisode avec l'API embed uniquement
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
            console.error('Erreur auto-chargement embed loadSeasonEpisodes:', embedError);
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

  // Système de téléchargement moderne avec outils externes
  const showDownloadOptions = async (quality: 'faible' | 'moyenne' | 'HD') => {
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
      
      const fileName = `${episodeDetails.animeTitle} - Episode ${episodeDetails.episodeNumber} (${qualityLabels[quality]})`;
      
      // Ouvrir une popup avec les options de téléchargement modernes
      const downloadWindow = window.open('', '_blank', 'width=900,height=700');
      
      if (!downloadWindow) {
        throw new Error('Popup bloquée - activez les popups pour le téléchargement');
      }
      
      downloadWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>ATOMIC FLIX - Options de téléchargement</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
              color: white; 
              margin: 0; 
              padding: 20px;
              line-height: 1.6;
            }
            .container { max-width: 800px; margin: 0 auto; }
            .header { text-align: center; margin-bottom: 30px; }
            .logo { color: #00ffff; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { color: #888; font-size: 14px; }
            .info-card {
              background: rgba(0,255,255,0.1);
              border: 1px solid #00ffff;
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 30px;
            }
            .method {
              background: rgba(255,255,255,0.05);
              border-radius: 12px;
              padding: 20px;
              margin-bottom: 20px;
              border-left: 4px solid #00ffff;
            }
            .method h3 { 
              color: #00ffff; 
              margin-top: 0; 
              display: flex; 
              align-items: center; 
              gap: 10px;
            }
            .code {
              background: #1a1a1a;
              border: 1px solid #333;
              border-radius: 8px;
              padding: 15px;
              font-family: 'Monaco', 'Consolas', monospace;
              font-size: 13px;
              margin: 10px 0;
              overflow-x: auto;
              position: relative;
            }
            .copy-btn {
              position: absolute;
              top: 10px;
              right: 10px;
              background: #00ffff;
              color: black;
              border: none;
              padding: 5px 10px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 11px;
              font-weight: bold;
            }
            .copy-btn:hover { background: #66ffff; }
            .extension-link {
              display: inline-block;
              background: linear-gradient(45deg, #00ffff, #ff00ff);
              color: white;
              text-decoration: none;
              padding: 10px 20px;
              border-radius: 8px;
              margin: 5px;
              font-weight: bold;
              transition: transform 0.2s;
            }
            .extension-link:hover { transform: scale(1.05); }
            .warning {
              background: rgba(255,165,0,0.1);
              border: 1px solid #ff8c00;
              border-radius: 8px;
              padding: 15px;
              margin: 20px 0;
            }
            .url-display {
              background: #2a2a2a;
              border: 1px solid #555;
              border-radius: 8px;
              padding: 10px;
              font-family: monospace;
              font-size: 12px;
              word-break: break-all;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">⚛️ ATOMIC FLIX</div>
              <div class="subtitle">Options de téléchargement modernes</div>
            </div>
            
            <div class="info-card">
              <strong>📹 ${episodeDetails.animeTitle}</strong><br>
              🎬 Épisode ${episodeDetails.episodeNumber}<br>
              🖥️ Serveur: ${serverName}<br>
              📊 Qualité demandée: ${qualityLabels[quality]}<br>
              📁 Nom suggéré: ${fileName}
            </div>

            <div class="method">
              <h3>🔗 Méthode 1: Extensions de navigateur (Recommandée)</h3>
              <p>Installez une extension de téléchargement vidéo et visitez directement la page:</p>
              <div class="url-display">${embedUrl}</div>
              <div style="text-align: center; margin: 15px 0;">
                <a href="https://chrome.google.com/webstore/detail/video-downloader-plus/njgehamdpphlbekcjofnhfjeamkoljpd" target="_blank" class="extension-link">Video Downloader Plus</a>
                <a href="https://chrome.google.com/webstore/detail/video-downloadhelper/lmjnegcaeklhafolokijcfjliaokphfk" target="_blank" class="extension-link">Video DownloadHelper</a>
                <a href="https://chrome.google.com/webstore/detail/flash-video-downloader/aiimdkdngfcipjohbjenkahhlhccpdbc" target="_blank" class="extension-link">Flash Video Downloader</a>
              </div>
              <button onclick="window.open('${embedUrl}', '_blank')" style="background: #00ffff; color: black; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-weight: bold; width: 100%;">
                🎬 Ouvrir la page vidéo
              </button>
            </div>

            <div class="method">
              <h3>⚡ Méthode 2: yt-dlp (Avancée)</h3>
              <p>Outil en ligne de commande le plus puissant pour télécharger des vidéos:</p>
              <div class="code">
                <button class="copy-btn" onclick="copyToClipboard('ytdlp-cmd')">Copier</button>
                <div id="ytdlp-cmd">yt-dlp "${embedUrl}" -o "${fileName}.%(ext)s" --format "best[height<=${qualityLabels[quality].replace('p', '')}]"</div>
              </div>
              <p><strong>Installation:</strong></p>
              <div class="code">
                <button class="copy-btn" onclick="copyToClipboard('install-cmd')">Copier</button>
                <div id="install-cmd"># Windows (avec chocolatey)
choco install yt-dlp

# macOS (avec brew)
brew install yt-dlp

# Linux (avec pip)
pip install yt-dlp</div>
              </div>
              <a href="https://github.com/yt-dlp/yt-dlp" target="_blank" class="extension-link">📥 Télécharger yt-dlp</a>
            </div>

            <div class="method">
              <h3>🌐 Méthode 3: Sites de téléchargement en ligne</h3>
              <p>Collez l'URL dans ces services en ligne:</p>
              <div style="text-align: center; margin: 15px 0;">
                <a href="https://savefrom.net/" target="_blank" class="extension-link">SaveFrom.net</a>
                <a href="https://9xbuddy.com/" target="_blank" class="extension-link">9xBuddy</a>
                <a href="https://keepvid.pro/" target="_blank" class="extension-link">KeepVid</a>
              </div>
              <div class="warning">
                ⚠️ Attention: Vérifiez que ces sites sont sûrs et évitez les publicités douteuses
              </div>
            </div>

            <div class="method">
              <h3>🛠️ Méthode 4: JDownloader 2</h3>
              <p>Logiciel de téléchargement automatique:</p>
              <div class="code">
                <button class="copy-btn" onclick="copyToClipboard('jd-url')">Copier URL</button>
                <div id="jd-url">${embedUrl}</div>
              </div>
              <p>1. Copiez l'URL ci-dessus<br>
              2. JDownloader la détectera automatiquement<br>
              3. Choisissez la qualité et téléchargez</p>
              <a href="https://jdownloader.org/download/index" target="_blank" class="extension-link">📥 Télécharger JDownloader 2</a>
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">
                ❌ Fermer
              </button>
            </div>
          </div>
          
          <script>
            function copyToClipboard(elementId) {
              const element = document.getElementById(elementId);
              const text = element.textContent;
              navigator.clipboard.writeText(text).then(() => {
                const btn = element.parentElement.querySelector('.copy-btn');
                const originalText = btn.textContent;
                btn.textContent = '✅ Copié';
                btn.style.background = '#00ff00';
                setTimeout(() => {
                  btn.textContent = originalText;
                  btn.style.background = '#00ffff';
                }, 2000);
              });
            }
          </script>
        </body>
        </html>
      `);
      
      console.log('Options de téléchargement modernes affichées pour:', fileName);
      
    } catch (error) {
      console.error('Erreur options téléchargement:', error);
      setShowDownloadMenu(false);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Erreur: ${errorMessage}`);
    }
  };

  // Fonction pour télécharger la vidéo avec qualité choisie
  const downloadVideo = async (quality: 'faible' | 'moyenne' | 'HD') => {
    // Afficher les options de téléchargement modernes
    await showDownloadOptions(quality);
  };

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
