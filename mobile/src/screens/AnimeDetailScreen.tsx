import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useQuery } from '@tanstack/react-query';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { animeAPI } from '../services/api';
import { Season } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type AnimeDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'AnimeDetail'>;
type AnimeDetailScreenRouteProp = RouteProp<RootStackParamList, 'AnimeDetail'>;

const { width } = Dimensions.get('window');

const AnimeDetailScreen: React.FC = () => {
  const navigation = useNavigation<AnimeDetailScreenNavigationProp>();
  const route = useRoute<AnimeDetailScreenRouteProp>();
  const { animeUrl, animeTitle } = route.params;

  const [selectedLanguage, setSelectedLanguage] = useState('VF');

  const { data: animeData, isLoading, error } = useQuery({
    queryKey: ['anime', animeUrl],
    queryFn: () => animeAPI.getAnimeData(animeUrl),
    retry: 2,
  });

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