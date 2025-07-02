import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useQuery } from '@tanstack/react-query';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { animeAPI } from '../services/api';
import { SearchResult } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 colonnes avec marges

const HomeScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const { data: searchResults, isLoading, error } = useQuery({
    queryKey: ['search', searchTerm],
    queryFn: () => animeAPI.search(searchTerm),
    enabled: searchTerm.length > 2,
    retry: 2,
  });

  const handleSearch = () => {
    if (searchQuery.trim().length > 2) {
      setSearchTerm(searchQuery.trim());
    } else {
      Alert.alert('Recherche', 'Veuillez saisir au moins 3 caractères');
    }
  };

  const handleAnimePress = (anime: SearchResult) => {
    navigation.navigate('AnimeDetail', {
      animeUrl: anime.url,
      animeTitle: anime.title,
    });
  };

  const renderAnimeCard = (anime: SearchResult) => (
    <TouchableOpacity
      key={anime.id}
      style={{
        width: cardWidth,
        marginBottom: 20,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
      onPress={() => handleAnimePress(anime)}
      activeOpacity={0.8}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: anime.image }}
          style={{
            width: '100%',
            height: 220,
            backgroundColor: '#334155',
          }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 60,
          }}
        />
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: anime.type === 'ANIME' ? '#0ea5e9' : '#d946ef',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {anime.type}
          </Text>
        </View>
      </View>
      
      <View style={{ padding: 12 }}>
        <Text
          style={{
            color: '#f8fafc',
            fontSize: 14,
            fontWeight: 'bold',
            marginBottom: 4,
          }}
          numberOfLines={2}
        >
          {anime.title}
        </Text>
        <Text
          style={{
            color: '#94a3b8',
            fontSize: 12,
          }}
        >
          {anime.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <StatusBar style="light" />
      
      {/* Header avec logo et recherche */}
      <LinearGradient
        colors={['#0f172a', '#1e293b']}
        style={{
          paddingTop: 20,
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        {/* Logo ATOMIC FLIX */}
        <View style={{ alignItems: 'center', marginBottom: 20 }}>
          <LinearGradient
            colors={['#0ea5e9', '#d946ef']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 25,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              ATOMIC FLIX
            </Text>
          </LinearGradient>
        </View>

        {/* Barre de recherche */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#334155',
            borderRadius: 25,
            paddingHorizontal: 15,
            paddingVertical: 5,
            alignItems: 'center',
          }}
        >
          <TextInput
            style={{
              flex: 1,
              color: '#f8fafc',
              fontSize: 16,
              paddingVertical: 10,
            }}
            placeholder="Rechercher un anime ou manga..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            onPress={handleSearch}
            style={{
              backgroundColor: '#0ea5e9',
              borderRadius: 20,
              padding: 10,
              marginLeft: 10,
            }}
          >
            <Icon name="search" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Contenu principal */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          padding: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* État de chargement */}
        {isLoading && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <ActivityIndicator size="large" color="#0ea5e9" />
            <Text style={{ color: '#94a3b8', marginTop: 10 }}>
              Recherche en cours...
            </Text>
          </View>
        )}

        {/* Erreur */}
        {error && !isLoading && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Icon name="alert-circle" size={48} color="#ef4444" />
            <Text style={{ color: '#ef4444', marginTop: 10, textAlign: 'center' }}>
              Erreur lors de la recherche
            </Text>
            <TouchableOpacity
              onPress={handleSearch}
              style={{
                backgroundColor: '#0ea5e9',
                paddingHorizontal: 20,
                paddingVertical: 10,
                borderRadius: 20,
                marginTop: 10,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Réessayer
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Résultats de recherche */}
        {searchResults?.success && searchResults.data && (
          <>
            <Text
              style={{
                color: '#f8fafc',
                fontSize: 18,
                fontWeight: 'bold',
                marginBottom: 20,
              }}
            >
              Résultats pour "{searchTerm}" ({searchResults.data.length})
            </Text>
            
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              {searchResults.data.map(renderAnimeCard)}
            </View>
          </>
        )}

        {/* Message d'accueil */}
        {!searchTerm && !isLoading && (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Icon name="tv" size={64} color="#0ea5e9" />
            <Text
              style={{
                color: '#f8fafc',
                fontSize: 20,
                fontWeight: 'bold',
                marginTop: 20,
                textAlign: 'center',
              }}
            >
              Bienvenue sur ATOMIC FLIX
            </Text>
            <Text
              style={{
                color: '#94a3b8',
                fontSize: 16,
                marginTop: 10,
                textAlign: 'center',
                paddingHorizontal: 20,
              }}
            >
              Découvrez des milliers d'animes et mangas en streaming gratuit
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;