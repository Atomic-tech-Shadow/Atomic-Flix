import React, { useState, useEffect } from 'react';
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
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { SearchResult } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

const { width, height } = Dimensions.get('window');

// Reproduction exacte de anime-sama.tsx
const HomeScreen: React.FC = () => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [trendingAnimes, setTrendingAnimes] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Configuration API identique au site web
  const API_BASE_URL = 'https://anime-sama-scraper.vercel.app';

  // Fonction API identique au site web
  const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
    const maxRetries = 3;
    let attempt = 0;
    
    while (attempt < maxRetries) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          ...options
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error) {
        attempt++;
        console.log(`Tentative ${attempt}/${maxRetries} échouée:`, error);
        
        if (attempt >= maxRetries) {
          console.error('Erreur API après', maxRetries, 'tentatives:', error);
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  };

  // animeAPI identique au site web
  const animeAPI = {
    search: async (query: string) => {
      return await apiRequest(`/api/search?query=${encodeURIComponent(query)}`);
    },
    getTrending: async () => {
      return await apiRequest('/api/trending');
    }
  };

  // Charger les animes populaires (identique au site web)
  const loadPopularAnimes = async () => {
    try {
      const response = await animeAPI.getTrending();
      
      if (response && response.success && response.results) {
        setPopularAnimes(response.results.slice(0, 24));
        console.log('Contenu populaire chargé:', response.results.length, 'éléments');
      } else {
        console.warn('Réponse API trending échouée:', response);
        setPopularAnimes([]);
      }
    } catch (error) {
      console.error('Erreur chargement trending:', error);
      setPopularAnimes([]);
    }
  };

  // Recherche d'animes (identique au site web)
  const searchAnimes = async (query: string) => {
    if (query.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await animeAPI.search(query);
      
      if (response && response.success) {
        const results = response.results || [];
        if (Array.isArray(results)) {
          setSearchResults(results);
        } else {
          console.warn('Pas de résultats dans la réponse:', response);
          setSearchResults([]);
        }
      } else {
        throw new Error('Réponse API invalide');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erreur de recherche';
      console.error('Erreur recherche:', errorMessage);
      
      if (errorMessage.includes('504') || errorMessage.includes('timeout')) {
        setError('Le serveur anime-sama-scraper.vercel.app ne répond pas actuellement. Veuillez réessayer plus tard.');
      } else if (errorMessage.includes('500')) {
        setError('Erreur temporaire du serveur. Veuillez réessayer dans quelques instants.');
      } else {
        setError('Impossible de rechercher les animes. Vérifiez votre connexion internet.');
      }
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  // Navigation vers détails (adaptation mobile)
  const loadAnimeDetails = async (anime: SearchResult) => {
    // Détecter si c'est un manga pour rediriger vers le lecteur approprié
    if (anime.type === 'manga') {
      navigation.navigate('MangaReader', {
        mangaUrl: anime.url,
        mangaTitle: anime.title,
      });
    } else {
      navigation.navigate('AnimeDetail', {
        animeUrl: anime.url,
        animeTitle: anime.title,
      });
    }
  };

  // Charger l'historique au démarrage et les animes populaires
  useEffect(() => {
    loadPopularAnimes();
  }, []);

  // Gérer la recherche en temps réel (identique au site web)
  useEffect(() => {
    if (searchQuery) {
      const timeoutId = setTimeout(() => {
        searchAnimes(searchQuery);
      }, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Adapter le renderAnimeCard du site web (identical styling)
  const renderAnimeCard = (anime: SearchResult) => (
    <TouchableOpacity
      key={anime.id}
      style={{
        width: cardWidth,
        marginBottom: 16,
        backgroundColor: '#1e293b',
        borderRadius: 12,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      }}
      onPress={() => loadAnimeDetails(anime)}
      activeOpacity={0.8}
    >
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: anime.image }}
          style={{
            width: '100%',
            height: 240, // Hauteur identique au site web
            backgroundColor: '#334155',
          }}
          resizeMode="cover"
        />
        
        {/* Badge type identique au site web */}
        <View
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: anime.type && anime.type.toLowerCase().includes('manga') ? '#d946ef' : '#0ea5e9',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 6,
          }}
        >
          <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
            {anime.type || 'ANIME'}
          </Text>
        </View>

        {/* Gradient identique au site web */}
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
          {anime.status || 'Disponible'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#0f172a' }}>
      <StatusBar style="light" backgroundColor="#0f172a" />
      
      {/* Header avec navbar identique au site web */}
      <View style={{
        backgroundColor: 'rgba(15, 23, 42, 0.95)',
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          height: 64,
        }}>
          {/* Logo ATOMIC FLIX (identique au navbar.tsx) */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12,
          }}>
            <View style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <LinearGradient
                colors={['#22d3ee', '#a855f7']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{
                  color: 'white',
                  fontSize: 16,
                  fontWeight: 'bold',
                }}>A</Text>
              </LinearGradient>
            </View>
            
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#f8fafc',
            }}>
              ATOMIC FLIX
            </Text>
          </View>

          {/* Bouton recherche (identique au navbar.tsx) */}
          <TouchableOpacity
            onPress={() => setSearchQuery(searchQuery ? '' : 'search')}
            style={{
              width: 40,
              height: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
            }}
          >
            <Icon 
              name="search" 
              size={20} 
              color="#22d3ee" 
            />
          </TouchableOpacity>
        </View>
        
        {/* Barre de recherche permanente (adaptation de anime-sama.tsx) */}
        <View style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#1e293b',
            borderRadius: 25,
            paddingHorizontal: 16,
            paddingVertical: 12,
            gap: 12,
          }}>
            <Icon name="search" size={20} color="#22d3ee" />
            <TextInput
              style={{
                flex: 1,
                color: '#f8fafc',
                fontSize: 16,
                borderWidth: 0,
              }}
              placeholder="Rechercher des animes..."
              placeholderTextColor="#94a3b8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
          </View>
        </View>
      </View>
      
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 8, paddingHorizontal: 8 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Barre de recherche conditionnelle (identique au site web) */}
        {searchQuery && (
          <View style={{ marginBottom: 24, paddingHorizontal: 8 }}>
            <View style={{
              backgroundColor: 'rgba(51, 65, 85, 0.8)',
              borderRadius: 12,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}>
              <Icon name="search" size={20} color="#22d3ee" />
              <TextInput
                style={{
                  flex: 1,
                  color: '#f8fafc',
                  fontSize: 16,
                  borderWidth: 0,
                  outline: 'none',
                }}
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder="Rechercher des animes..."
                placeholderTextColor="#9ca3af"
                autoFocus
              />
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={{ padding: 4 }}
              >
                <Text style={{ color: '#9ca3af', fontSize: 18 }}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Affichage des états (identique au site web) */}
        {loading && (
          <View style={{ padding: 32, alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#22d3ee" />
            <Text style={{ color: '#9ca3af', marginTop: 12, fontSize: 14 }}>
              Recherche en cours...
            </Text>
          </View>
        )}

        {error && !loading && (
          <View style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.1)', 
            borderRadius: 12, 
            padding: 16, 
            margin: 8,
            alignItems: 'center'
          }}>
            <Icon name="alert-circle" size={32} color="#ef4444" />
            <Text style={{ color: '#ef4444', textAlign: 'center', marginTop: 8 }}>
              {error}
            </Text>
            <TouchableOpacity
              onPress={() => searchAnimes(searchQuery)}
              style={{
                backgroundColor: '#22d3ee',
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginTop: 12,
              }}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                Réessayer
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Résultats de recherche (logique identique au site web) */}
        {searchResults.length > 0 && (
          <>
            <Text style={{
              color: '#f8fafc',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 16,
              paddingHorizontal: 8,
            }}>
              Résultats pour "{searchQuery}" ({searchResults.length})
            </Text>
            
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              paddingHorizontal: 8,
            }}>
              {searchResults.map(renderAnimeCard)}
            </View>
          </>
        )}

        {/* Contenu populaire (identique au site web) */}
        {!searchQuery && !loading && popularAnimes.length > 0 && (
          <>
            <Text style={{
              color: '#f8fafc',
              fontSize: 20,
              fontWeight: 'bold',
              marginBottom: 16,
              paddingHorizontal: 8,
            }}>
              Contenu populaire
            </Text>
            
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              paddingHorizontal: 8,
            }}>
              {popularAnimes.map(renderAnimeCard)}
            </View>
          </>
        )}

        {/* Message d'accueil (identique au site web) */}
        {!searchQuery && !loading && popularAnimes.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 80, paddingHorizontal: 20 }}>
            <LinearGradient
              colors={['#0ea5e9', '#d946ef']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingHorizontal: 24,
                paddingVertical: 12,
                borderRadius: 25,
                marginBottom: 20,
              }}
            >
              <Text style={{
                color: 'white',
                fontSize: 24,
                fontWeight: 'bold',
                textAlign: 'center',
              }}>
                ATOMIC FLIX
              </Text>
            </LinearGradient>
            
            <Icon name="tv" size={64} color="#22d3ee" />
            <Text style={{
              color: '#f8fafc',
              fontSize: 20,
              fontWeight: 'bold',
              marginTop: 20,
              textAlign: 'center',
            }}>
              Bienvenue sur ATOMIC FLIX
            </Text>
            <Text style={{
              color: '#9ca3af',
              fontSize: 16,
              marginTop: 10,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Découvrez des milliers d'animes et mangas en streaming gratuit
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default HomeScreen;