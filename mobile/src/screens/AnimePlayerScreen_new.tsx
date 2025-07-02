import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { Episode, VideoSource, Season, AnimeData, EpisodeDetails } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type AnimePlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AnimePlayer'>;
type AnimePlayerScreenRouteProp = RouteProp<RootStackParamList, 'AnimePlayer'>;

const { width, height } = Dimensions.get('window');

// Direct adaptation of anime-player.tsx
const AnimePlayerScreen: React.FC = () => {
  const navigation = useNavigation<AnimePlayerScreenNavigationProp>();
  const route = useRoute<AnimePlayerScreenRouteProp>();
  const { animeUrl, seasonData, animeTitle } = route.params;

  // States (identical to web version)
  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<Season | null>(seasonData);
  const [selectedLanguage, setSelectedLanguage] = useState<'VF' | 'VOSTFR'>('VOSTFR');
  const [selectedEpisode, setSelectedEpisode] = useState<Episode | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<number>(0);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [episodeDetails, setEpisodeDetails] = useState<EpisodeDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [episodeLoading, setEpisodeLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // External API configuration (identical to web version)
  const API_BASE_URL = 'https://anime-sama-scraper.vercel.app';

  // API request function (identical to web version)
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
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  };

  // Load season episodes directly (identical to web version logic)
  const loadSeasonEpisodesDirectly = async (animeDataObj: any, season: Season, autoLoadEpisode = false, customLanguage?: string) => {
    setEpisodeLoading(true);
    setError(null);
    
    try {
      const language = customLanguage || selectedLanguage;
      const endpoint = `${API_BASE_URL}/api/episodes?url=${encodeURIComponent(animeUrl)}&season=${encodeURIComponent(season.value)}&lang=${language}`;
      
      console.log('Loading episodes from:', endpoint);
      
      const response = await apiRequest(endpoint);
      
      if (response && response.success && response.data && Array.isArray(response.data.episodes)) {
        const episodeList = response.data.episodes;
        console.log(`Found ${episodeList.length} episodes for ${season.name} in ${language}`);
        
        setEpisodes(episodeList);
        
        // Auto-load first episode if requested
        if (autoLoadEpisode && episodeList.length > 0) {
          const firstEpisode = episodeList[0];
          setSelectedEpisode(firstEpisode);
          await loadEpisodeSources(firstEpisode);
        }
      } else {
        console.warn('No episodes found in response');
        setEpisodes([]);
      }
    } catch (err) {
      console.error('Error loading episodes:', err);
      setError(err instanceof Error ? err.message : 'Unknown error loading episodes');
      setEpisodes([]);
    } finally {
      setEpisodeLoading(false);
    }
  };

  // Load episode sources (identical to web version logic)
  const loadEpisodeSources = async (episode: Episode) => {
    setEpisodeLoading(true);
    setError(null);
    
    try {
      const endpoint = `${API_BASE_URL}/api/episode-sources?url=${encodeURIComponent(episode.url)}`;
      console.log('Loading episode sources from:', endpoint);
      
      const response = await apiRequest(endpoint);
      
      if (response && response.success && response.data) {
        console.log('Episode sources loaded:', response.data);
        setEpisodeDetails(response.data);
        setSelectedPlayer(0); // Reset to first server
      } else {
        throw new Error('No streaming sources found');
      }
    } catch (err) {
      console.error('Error loading episode sources:', err);
      setError(err instanceof Error ? err.message : 'Error loading streaming sources');
      setEpisodeDetails(null);
    } finally {
      setEpisodeLoading(false);
    }
  };

  // Episode selection handler (identical to web version)
  const handleEpisodeSelect = (episode: Episode) => {
    setSelectedEpisode(episode);
    loadEpisodeSources(episode);
  };

  // Server selection handler (identical to web version)
  const handleServerSelect = (server: VideoSource) => {
    const serverIndex = episodeDetails?.sources.findIndex(s => s.url === server.url) || 0;
    setSelectedPlayer(serverIndex);
  };

  // Load anime data and episodes on mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load anime data
        const animeResponse = await apiRequest(`${API_BASE_URL}/api/anime?url=${encodeURIComponent(animeUrl)}`);
        
        if (animeResponse && animeResponse.success && animeResponse.data) {
          setAnimeData(animeResponse.data);
          
          // Load episodes for the selected season
          if (selectedSeason) {
            await loadSeasonEpisodesDirectly(animeResponse.data, selectedSeason, true);
          }
        }
      } catch (err) {
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [animeUrl, selectedSeason]);

  // Loading state
  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={{ color: '#94a3b8', marginTop: 10 }}>
          Chargement du lecteur...
        </Text>
      </View>
    );
  }

  // Error state
  if (error && !episodeDetails) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Icon name="alert-circle" size={48} color="#ef4444" />
        <Text style={{ color: '#ef4444', marginTop: 10, textAlign: 'center' }}>
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#22d3ee',
            paddingHorizontal: 20,
            paddingVertical: 10,
            borderRadius: 20,
            marginTop: 20,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Retour</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <StatusBar style="light" backgroundColor="#0f172a" />
      
      {/* Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Icon name="arrow-back" size={24} color="#22d3ee" />
          <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: '600' }}>
            {animeTitle}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Video Player */}
        {episodeDetails && episodeDetails.sources.length > 0 && (
          <View style={{
            height: width * 9 / 16, // 16:9 aspect ratio
            backgroundColor: '#000',
            margin: 16,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
            {episodeLoading ? (
              <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <ActivityIndicator size="large" color="#22d3ee" />
                <Text style={{ color: '#94a3b8', marginTop: 10 }}>
                  Chargement de la vidéo...
                </Text>
              </View>
            ) : (
              <WebView
                source={{ uri: episodeDetails.sources[selectedPlayer]?.url || '' }}
                style={{ flex: 1 }}
                allowsFullscreenVideo={true}
                mediaPlaybackRequiresUserAction={false}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                startInLoadingState={true}
                renderLoading={() => (
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#000',
                  }}>
                    <ActivityIndicator size="large" color="#22d3ee" />
                  </View>
                )}
              />
            )}
          </View>
        )}

        {/* Episode Info */}
        {selectedEpisode && (
          <View style={{ padding: 16 }}>
            <Text style={{
              color: '#f8fafc',
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 8,
            }}>
              Épisode {selectedEpisode.episodeNumber}: {selectedEpisode.title}
            </Text>
            
            <Text style={{
              color: '#94a3b8',
              fontSize: 14,
            }}>
              {selectedSeason?.name} • {selectedLanguage}
            </Text>
          </View>
        )}

        {/* Language Selection */}
        <View style={{ padding: 16 }}>
          <Text style={{
            color: '#f8fafc',
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 12,
          }}>
            Langue
          </Text>
          
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {['VF', 'VOSTFR'].map((lang) => (
              <TouchableOpacity
                key={lang}
                onPress={() => {
                  setSelectedLanguage(lang as 'VF' | 'VOSTFR');
                  if (selectedSeason && animeData) {
                    loadSeasonEpisodesDirectly(animeData, selectedSeason, false, lang);
                  }
                }}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedLanguage === lang ? '#22d3ee' : 'rgba(30, 41, 59, 0.8)',
                  borderWidth: 1,
                  borderColor: selectedLanguage === lang ? '#22d3ee' : 'rgba(30, 41, 59, 0.8)',
                }}
              >
                <Text style={{
                  color: selectedLanguage === lang ? '#0f172a' : '#94a3b8',
                  fontWeight: selectedLanguage === lang ? '600' : '400',
                }}>
                  {lang}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Server Selection */}
        {episodeDetails && episodeDetails.sources.length > 0 && (
          <View style={{ padding: 16 }}>
            <Text style={{
              color: '#f8fafc',
              fontSize: 16,
              fontWeight: '600',
              marginBottom: 12,
            }}>
              Serveurs ({episodeDetails.sources.length})
            </Text>
            
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                {episodeDetails.sources.map((source, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setSelectedPlayer(index)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      backgroundColor: selectedPlayer === index ? '#22d3ee' : 'rgba(30, 41, 59, 0.8)',
                      borderWidth: 1,
                      borderColor: selectedPlayer === index ? '#22d3ee' : 'rgba(30, 41, 59, 0.8)',
                    }}
                  >
                    <Text style={{
                      color: selectedPlayer === index ? '#0f172a' : '#94a3b8',
                      fontWeight: selectedPlayer === index ? '600' : '400',
                    }}>
                      {source.server} - {source.quality}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Episodes List */}
        <View style={{ padding: 16 }}>
          <Text style={{
            color: '#f8fafc',
            fontSize: 16,
            fontWeight: '600',
            marginBottom: 12,
          }}>
            Épisodes ({episodes.length})
          </Text>
          
          {episodeLoading ? (
            <View style={{ alignItems: 'center', padding: 20 }}>
              <ActivityIndicator size="large" color="#22d3ee" />
              <Text style={{ color: '#94a3b8', marginTop: 10 }}>
                Chargement des épisodes...
              </Text>
            </View>
          ) : (
            <FlatList
              data={episodes}
              scrollEnabled={false}
              keyExtractor={(item, index) => `episode-${index}`}
              renderItem={({ item: episode, index }) => (
                <TouchableOpacity
                  onPress={() => handleEpisodeSelect(episode)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 12,
                    marginBottom: 8,
                    borderRadius: 12,
                    backgroundColor: selectedEpisode?.id === episode.id ? 'rgba(34, 211, 238, 0.2)' : 'rgba(30, 41, 59, 0.8)',
                    borderWidth: 1,
                    borderColor: selectedEpisode?.id === episode.id ? '#22d3ee' : 'transparent',
                  }}
                >
                  <View style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    backgroundColor: selectedEpisode?.id === episode.id ? '#22d3ee' : '#475569',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 12,
                  }}>
                    <Text style={{
                      color: selectedEpisode?.id === episode.id ? '#0f172a' : '#f8fafc',
                      fontWeight: 'bold',
                      fontSize: 14,
                    }}>
                      {episode.episodeNumber}
                    </Text>
                  </View>
                  
                  <View style={{ flex: 1 }}>
                    <Text style={{
                      color: selectedEpisode?.id === episode.id ? '#22d3ee' : '#f8fafc',
                      fontWeight: '600',
                      fontSize: 14,
                    }}>
                      Épisode {episode.episodeNumber}
                    </Text>
                    {episode.title && (
                      <Text style={{
                        color: '#94a3b8',
                        fontSize: 12,
                        marginTop: 2,
                      }}>
                        {episode.title}
                      </Text>
                    )}
                  </View>
                  
                  {selectedEpisode?.id === episode.id && (
                    <Icon name="play" size={20} color="#22d3ee" />
                  )}
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default AnimePlayerScreen;