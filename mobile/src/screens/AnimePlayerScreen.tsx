import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { useQuery } from '@tanstack/react-query';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { animeAPI } from '../services/api';
import { Episode, VideoSource, Season } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type AnimePlayerScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AnimePlayer'>;
type AnimePlayerScreenRouteProp = RouteProp<RootStackParamList, 'AnimePlayer'>;

const { width, height } = Dimensions.get('window');

const AnimePlayerScreen: React.FC = () => {
  const navigation = useNavigation<AnimePlayerScreenNavigationProp>();
  const route = useRoute<AnimePlayerScreenRouteProp>();
  const { animeUrl, seasonData, animeTitle } = route.params;

  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [currentEpisode, setCurrentEpisode] = useState<Episode | null>(null);
  const [selectedServer, setSelectedServer] = useState<VideoSource | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('VF');
  const [showEpisodeList, setShowEpisodeList] = useState(false);

  // Chargement des données de l'anime pour obtenir les épisodes
  const { data: animeData, isLoading: isAnimeLoading } = useQuery({
    queryKey: ['anime', animeUrl],
    queryFn: () => animeAPI.getAnimeData(animeUrl),
    retry: 2,
  });

  // Chargement des détails de l'épisode sélectionné
  const { data: episodeData, isLoading: isEpisodeLoading } = useQuery({
    queryKey: ['episode', currentEpisode?.url],
    queryFn: () => currentEpisode ? animeAPI.getEpisodeDetails(currentEpisode.url) : null,
    enabled: !!currentEpisode,
    retry: 2,
  });

  useEffect(() => {
    if (animeData?.success && seasonData) {
      // Simuler le chargement des épisodes de la saison sélectionnée
      // En production, ceci devrait utiliser l'API pour charger les épisodes réels
      const mockEpisodes: Episode[] = Array.from({ length: seasonData.episodeCount }, (_, i) => ({
        id: `${seasonData.value}-ep-${i + 1}`,
        title: `Épisode ${i + 1}`,
        episodeNumber: i + 1,
        url: `${seasonData.url}/episode-${i + 1}`,
        language: selectedLanguage,
        available: true,
      }));
      
      setEpisodes(mockEpisodes);
      if (mockEpisodes.length > 0) {
        setCurrentEpisode(mockEpisodes[0]);
      }
    }
  }, [animeData, seasonData, selectedLanguage]);

  useEffect(() => {
    if (episodeData?.success && episodeData.data.sources.length > 0) {
      setSelectedServer(episodeData.data.sources[0]);
    }
  }, [episodeData]);

  const handleEpisodeSelect = (episode: Episode) => {
    setCurrentEpisode(episode);
    setShowEpisodeList(false);
  };

  const handleServerSelect = (server: VideoSource) => {
    setSelectedServer(server);
  };

  const handleNextEpisode = () => {
    if (currentEpisode && episodes.length > 0) {
      const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
      if (currentIndex < episodes.length - 1) {
        setCurrentEpisode(episodes[currentIndex + 1]);
      }
    }
  };

  const handlePreviousEpisode = () => {
    if (currentEpisode && episodes.length > 0) {
      const currentIndex = episodes.findIndex(ep => ep.id === currentEpisode.id);
      if (currentIndex > 0) {
        setCurrentEpisode(episodes[currentIndex - 1]);
      }
    }
  };

  if (isAnimeLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={{ color: '#94a3b8', marginTop: 10 }}>Chargement des épisodes...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Lecteur vidéo */}
      <View style={{ height: height * 0.3, backgroundColor: '#000' }}>
        {isEpisodeLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={{ color: '#94a3b8', marginTop: 10 }}>Chargement du lecteur...</Text>
          </View>
        ) : selectedServer ? (
          <WebView
            source={{ uri: selectedServer.url }}
            style={{ flex: 1 }}
            allowsFullscreenVideo
            mediaPlaybackRequiresUserAction={false}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }}>
                <ActivityIndicator size="large" color="#0ea5e9" />
              </View>
            )}
          />
        ) : (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Icon name="tv" size={48} color="#6b7280" />
            <Text style={{ color: '#94a3b8', marginTop: 10 }}>Aucun serveur disponible</Text>
          </View>
        )}
      </View>

      {/* Contrôles et informations */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        {/* Titre de l'épisode */}
        <Text style={{ color: '#f8fafc', fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
          {currentEpisode?.title || 'Sélectionnez un épisode'}
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, marginBottom: 20 }}>
          {animeTitle} • Saison {seasonData.number}
        </Text>

        {/* Contrôles de navigation des épisodes */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
          <TouchableOpacity
            onPress={handlePreviousEpisode}
            disabled={!currentEpisode || episodes.findIndex(ep => ep.id === currentEpisode.id) === 0}
            style={{
              backgroundColor: '#334155',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 20,
              opacity: (!currentEpisode || episodes.findIndex(ep => ep.id === currentEpisode.id) === 0) ? 0.5 : 1,
            }}
          >
            <Icon name="chevron-back" size={16} color="#f8fafc" />
            <Text style={{ color: '#f8fafc', marginLeft: 5 }}>Précédent</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setShowEpisodeList(!showEpisodeList)}
            style={{
              backgroundColor: '#0ea5e9',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 20,
            }}
          >
            <Icon name="list" size={16} color="white" />
            <Text style={{ color: 'white', marginLeft: 5 }}>Épisodes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNextEpisode}
            disabled={!currentEpisode || episodes.findIndex(ep => ep.id === currentEpisode.id) === episodes.length - 1}
            style={{
              backgroundColor: '#334155',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingVertical: 10,
              borderRadius: 20,
              opacity: (!currentEpisode || episodes.findIndex(ep => ep.id === currentEpisode.id) === episodes.length - 1) ? 0.5 : 1,
            }}
          >
            <Text style={{ color: '#f8fafc', marginRight: 5 }}>Suivant</Text>
            <Icon name="chevron-forward" size={16} color="#f8fafc" />
          </TouchableOpacity>
        </View>

        {/* Sélecteur de serveur */}
        {episodeData?.success && episodeData.data.sources.length > 0 && (
          <>
            <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Serveurs disponibles
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
              {episodeData.data.sources.map((server, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleServerSelect(server)}
                  style={{
                    backgroundColor: selectedServer?.server === server.server ? '#0ea5e9' : '#334155',
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                >
                  <Text style={{
                    color: selectedServer?.server === server.server ? 'white' : '#94a3b8',
                    fontWeight: selectedServer?.server === server.server ? 'bold' : 'normal',
                  }}>
                    {server.server} - {server.quality}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </>
        )}

        {/* Liste des épisodes */}
        {showEpisodeList && (
          <>
            <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Liste des épisodes
            </Text>
            {episodes.map((episode, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleEpisodeSelect(episode)}
                style={{
                  backgroundColor: currentEpisode?.id === episode.id ? '#0ea5e9' : '#1e293b',
                  padding: 15,
                  borderRadius: 12,
                  marginBottom: 10,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Text style={{
                  color: currentEpisode?.id === episode.id ? 'white' : '#f8fafc',
                  fontSize: 16,
                  fontWeight: currentEpisode?.id === episode.id ? 'bold' : 'normal',
                }}>
                  {episode.title}
                </Text>
                {currentEpisode?.id === episode.id && (
                  <Icon name="play-circle" size={20} color="white" />
                )}
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default AnimePlayerScreen;