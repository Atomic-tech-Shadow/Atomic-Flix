import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';
import { StatusBar } from 'expo-status-bar';

import { Season, AnimeData } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type AnimeDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AnimeDetail'>;
type AnimeDetailScreenRouteProp = RouteProp<RootStackParamList, 'AnimeDetail'>;

const { width } = Dimensions.get('window');

// Adaptation directe du code anime.tsx
const AnimeDetailScreen: React.FC = () => {
  const navigation = useNavigation<AnimeDetailScreenNavigationProp>();
  const route = useRoute<AnimeDetailScreenRouteProp>();
  const { animeUrl, animeTitle } = route.params;

  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Configuration API externe (identique au site web)
  const API_BASE_URL = 'https://anime-sama-scraper.vercel.app';

  // Fonction pour les requêtes API avec timeout (identique au site web)
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
      console.log('Données reçues:', data);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Timeout: La requête a pris trop de temps');
      }
      throw error;
    }
  };

  // Charger les données d'anime (identique au site web)
  const loadAnimeData = async () => {
    if (!animeUrl) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest(`/api/anime?url=${encodeURIComponent(animeUrl)}`);
      
      if (response && response.success && response.data) {
        console.log('Données anime reçues:', response.data);
        setAnimeData(response.data);
      } else {
        throw new Error('Données anime invalides');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
      console.error('Erreur chargement anime:', errorMessage);
      
      if (errorMessage.includes('Timeout')) {
        setError('Le chargement prend trop de temps. Vérifiez votre connexion internet.');
      } else if (errorMessage.includes('404')) {
        setError('Cet anime n\'existe pas ou n\'est plus disponible.');
      } else if (errorMessage.includes('500')) {
        setError('Erreur temporaire du serveur. Veuillez réessayer plus tard.');
      } else {
        setError('Impossible de charger les détails de l\'anime. Veuillez réessayer.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Charger les données au montage du composant
  useEffect(() => {
    loadAnimeData();
  }, [animeUrl]);

  const handleSeasonPress = (season: Season) => {
    if (season.available) {
      navigation.navigate('AnimePlayer', {
        animeUrl,
        seasonData: season,
        animeTitle,
      });
    } else {
      Alert.alert('Non disponible', 'Cette saison n\'est pas encore disponible.');
    }
  };

  const handleMangaPress = () => {
    navigation.navigate('MangaReader', {
      mangaUrl: animeUrl,
      mangaTitle: animeTitle,
    });
  };

  const getAvailableLanguages = () => {
    if (!animeData?.success || !animeData.data.seasons) return [];
    const languages = new Set<string>();
    animeData.data.seasons.forEach(season => {
      season.languages.forEach(lang => languages.add(lang));
    });
    return Array.from(languages);
  };

  const getFilteredSeasons = () => {
    if (!animeData?.success || !animeData.data.seasons) return [];
    return animeData.data.seasons.filter(season => 
      season.languages.includes(selectedLanguage)
    );
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0ea5e9" />
        <Text style={{ color: '#94a3b8', marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }

  if (error || !animeData?.success) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Icon name="alert-circle" size={48} color="#ef4444" />
        <Text style={{ color: '#ef4444', marginTop: 10, textAlign: 'center' }}>
          Erreur lors du chargement des détails
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#0ea5e9',
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

  const anime = animeData.data;
  const availableLanguages = getAvailableLanguages();
  const filteredSeasons = getFilteredSeasons();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#0f172a' }}>
      {/* Image de couverture avec overlay */}
      <View style={{ position: 'relative', height: 300 }}>
        <Image
          source={{ uri: anime.image }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(15, 23, 42, 0.8)', '#0f172a']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 150,
          }}
        />
      </View>

      <View style={{ padding: 20 }}>
        {/* Titre et informations de base */}
        <Text style={{ color: '#f8fafc', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
          {anime.title}
        </Text>

        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 }}>
          <View style={{
            backgroundColor: '#0ea5e9',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            marginRight: 8,
            marginBottom: 8,
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {anime.status}
            </Text>
          </View>
          <View style={{
            backgroundColor: '#d946ef',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
            marginRight: 8,
            marginBottom: 8,
          }}>
            <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
              {anime.year}
            </Text>
          </View>
        </View>

        {/* Genres */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
          {anime.genres.map((genre, index) => (
            <View
              key={index}
              style={{
                backgroundColor: '#334155',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 6,
                marginRight: 8,
                marginBottom: 8,
              }}
            >
              <Text style={{ color: '#94a3b8', fontSize: 12 }}>{genre}</Text>
            </View>
          ))}
        </View>

        {/* Synopsis */}
        <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
          Synopsis
        </Text>
        <Text style={{ color: '#94a3b8', fontSize: 14, lineHeight: 20, marginBottom: 20 }}>
          {anime.synopsis}
        </Text>

        {/* Sélecteur de langue */}
        {availableLanguages.length > 1 && (
          <>
            <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
              Langue
            </Text>
            <View style={{ flexDirection: 'row', marginBottom: 20 }}>
              {availableLanguages.map((language) => (
                <TouchableOpacity
                  key={language}
                  onPress={() => setSelectedLanguage(language)}
                  style={{
                    backgroundColor: selectedLanguage === language ? '#0ea5e9' : '#334155',
                    paddingHorizontal: 15,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 10,
                  }}
                >
                  <Text style={{
                    color: selectedLanguage === language ? 'white' : '#94a3b8',
                    fontWeight: selectedLanguage === language ? 'bold' : 'normal',
                  }}>
                    {language}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {/* Bouton Manga (si disponible) */}
        <TouchableOpacity
          onPress={handleMangaPress}
          style={{
            backgroundColor: '#d946ef',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 15,
            borderRadius: 25,
            marginBottom: 20,
          }}
        >
          <Icon name="book" size={20} color="white" style={{ marginRight: 8 }} />
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
            Lire le Manga
          </Text>
        </TouchableOpacity>

        {/* Liste des saisons */}
        <Text style={{ color: '#f8fafc', fontSize: 16, fontWeight: 'bold', marginBottom: 15 }}>
          Saisons disponibles
        </Text>

        {filteredSeasons.length === 0 ? (
          <View style={{
            backgroundColor: '#1e293b',
            padding: 20,
            borderRadius: 12,
            alignItems: 'center',
          }}>
            <Icon name="warning" size={32} color="#f59e0b" />
            <Text style={{ color: '#f59e0b', marginTop: 10, textAlign: 'center' }}>
              Aucune saison disponible en {selectedLanguage}
            </Text>
          </View>
        ) : (
          filteredSeasons.map((season, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleSeasonPress(season)}
              disabled={!season.available}
              style={{
                backgroundColor: season.available ? '#1e293b' : '#374151',
                padding: 15,
                borderRadius: 12,
                marginBottom: 10,
                opacity: season.available ? 1 : 0.6,
              }}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{
                    color: season.available ? '#f8fafc' : '#94a3b8',
                    fontSize: 16,
                    fontWeight: 'bold',
                    marginBottom: 4,
                  }}>
                    {season.name}
                  </Text>
                  <Text style={{
                    color: '#94a3b8',
                    fontSize: 14,
                  }}>
                    {season.episodeCount} épisodes • {season.languages.join(', ')}
                  </Text>
                </View>
                <Icon
                  name={season.available ? "play-circle" : "lock-closed"}
                  size={24}
                  color={season.available ? "#0ea5e9" : "#6b7280"}
                />
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default AnimeDetailScreen;