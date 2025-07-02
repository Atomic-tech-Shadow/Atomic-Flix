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

// Direct adaptation of anime.tsx
const AnimeDetailScreen: React.FC = () => {
  const navigation = useNavigation<AnimeDetailScreenNavigationProp>();
  const route = useRoute<AnimeDetailScreenRouteProp>();
  const { animeUrl, animeTitle } = route.params;

  const [animeData, setAnimeData] = useState<AnimeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // External API configuration (identical to web version)
  const API_BASE_URL = 'https://anime-sama-scraper.vercel.app';

  // API request function with timeout (identical to web version)
  const apiRequest = async (endpoint: string, timeoutMs = 20000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    try {
      console.log('API Request:', endpoint);
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
      console.log('Data received:', data);
      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Timeout: Request took too long');
      }
      throw error;
    }
  };

  // Load anime data (identical to web version)
  const loadAnimeData = async () => {
    if (!animeUrl) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest(`/api/anime?url=${encodeURIComponent(animeUrl)}`);
      
      if (response && response.success && response.data) {
        console.log('Anime data received:', response.data);
        setAnimeData(response.data);
      } else {
        throw new Error('Invalid anime data');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('Error loading anime:', errorMessage);
      
      if (errorMessage.includes('Timeout')) {
        setError('Loading takes too long. Check your internet connection.');
      } else if (errorMessage.includes('404')) {
        setError('This anime doesn\'t exist or is no longer available.');
      } else if (errorMessage.includes('500')) {
        setError('Temporary server error. Please try again later.');
      } else {
        setError('Unable to load anime details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Navigation function (identical to goToPlayer from anime.tsx)
  const goToPlayer = (season: Season) => {
    const isManga = season.name.toLowerCase().includes('scan') || 
                   season.name.toLowerCase().includes('manga') ||
                   season.name.toLowerCase().includes('tome') ||
                   season.name.toLowerCase().includes('chapitre');
    
    if (isManga) {
      navigation.navigate('MangaReader', {
        mangaUrl: animeUrl,
        mangaTitle: animeTitle,
      });
    } else {
      navigation.navigate('AnimePlayer', {
        animeUrl: animeUrl,
        seasonData: season,
        animeTitle: animeTitle,
      });
    }
  };

  // Load data on component mount
  useEffect(() => {
    loadAnimeData();
  }, [animeUrl]);

  // Loading state (identical to anime.tsx)
  if (loading && !animeData) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#22d3ee" />
        <Text style={{ color: '#94a3b8', marginTop: 10 }}>
          Chargement des détails de l'anime...
        </Text>
      </View>
    );
  }

  if (!animeData) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Icon name="alert-circle" size={48} color="#ef4444" />
        <Text style={{ color: '#ef4444', marginTop: 10, textAlign: 'center' }}>
          Erreur lors du chargement des détails
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
      
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Anime Banner (identical to anime.tsx structure) */}
        <View style={{ position: 'relative', overflow: 'hidden' }}>
          <Image
            source={{ uri: animeData.image }}
            style={{
              width: '100%',
              height: 300,
            }}
            resizeMode="cover"
            onError={() => {
              // Handle image error
            }}
          />
          
          {/* Gradient overlay (identical to web version) */}
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 150,
            }}
          />
          
          {/* Title and info overlay (identical to anime.tsx) */}
          <View style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: 16,
          }}>
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: '#f8fafc',
              marginBottom: 8,
            }}>
              {animeData.title}
            </Text>
            
            {/* Info badges (identical to web version) */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
              marginBottom: 12,
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(34, 211, 238, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
                gap: 8,
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#22d3ee',
                  borderRadius: 4,
                }} />
                <Text style={{
                  color: '#22d3ee',
                  fontSize: 12,
                  fontWeight: '500',
                }}>
                  {animeData.seasons.length} saisons
                </Text>
              </View>
              
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                paddingHorizontal: 12,
                paddingVertical: 4,
                borderRadius: 20,
                gap: 8,
              }}>
                <View style={{
                  width: 8,
                  height: 8,
                  backgroundColor: '#3b82f6',
                  borderRadius: 4,
                }} />
                <Text style={{
                  color: '#3b82f6',
                  fontSize: 12,
                  fontWeight: '500',
                }}>
                  {animeData.year}
                </Text>
              </View>
            </View>
            
            {/* Genres (identical to web version) */}
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 8,
            }}>
              {animeData.genres.map((genre, index) => (
                <View
                  key={index}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 4,
                    backgroundColor: 'rgba(34, 211, 238, 0.2)',
                    borderWidth: 1,
                    borderColor: 'rgba(34, 211, 238, 0.3)',
                    borderRadius: 20,
                  }}
                >
                  <Text style={{
                    color: '#22d3ee',
                    fontSize: 12,
                  }}>
                    {genre}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Synopsis section (identical to anime.tsx) */}
        <View style={{ padding: 16, paddingTop: 24 }}>
          <View style={{
            backgroundColor: 'rgba(30, 41, 59, 0.8)',
            padding: 16,
            borderRadius: 12,
            marginBottom: 24,
          }}>
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: '#f8fafc',
              marginBottom: 12,
            }}>
              📖 Synopsis
            </Text>
            <Text style={{
              color: '#d1d5db',
              fontSize: 14,
              lineHeight: 20,
            }}>
              {animeData.synopsis}
            </Text>
          </View>
        </View>

        <View style={{ padding: 16 }}>
          {/* Error message (identical to web version) */}
          {error && (
            <View style={{
              backgroundColor: 'rgba(220, 38, 38, 0.2)',
              borderWidth: 1,
              borderColor: 'rgba(220, 38, 38, 0.3)',
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Icon name="alert-circle" size={16} color="#fca5a5" style={{ marginRight: 8 }} />
                <Text style={{ color: '#fca5a5', fontSize: 14 }}>
                  {error}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => loadAnimeData()}
                style={{
                  backgroundColor: '#dc2626',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: 'white', fontSize: 14, fontWeight: '500' }}>
                  Réessayer
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Seasons section (identical to anime.tsx) */}
          <View>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: '#f8fafc',
              marginBottom: 24,
            }}>
              🎬 Saisons et Films
            </Text>
            
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 16,
            }}>
              {animeData.seasons.map((season, index) => {
                const isManga = season.name.toLowerCase().includes('scan') || 
                               season.name.toLowerCase().includes('manga') ||
                               season.name.toLowerCase().includes('tome') ||
                               season.name.toLowerCase().includes('chapitre');
                
                const borderColor = isManga ? '#fb923c' : '#22d3ee';
                
                return (
                  <TouchableOpacity
                    key={`season-${index}-${season.name}`}
                    onPress={() => goToPlayer(season)}
                    style={{
                      width: (width - 48) / 2,
                      height: 120,
                      borderRadius: 16,
                      overflow: 'hidden',
                      borderWidth: 2,
                      borderColor: borderColor,
                      position: 'relative',
                    }}
                    activeOpacity={0.8}
                  >
                    <Image
                      source={{ uri: animeData.image }}
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      resizeMode="cover"
                    />
                    
                    <View style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0,0,0,0.6)',
                    }} />
                    
                    <View style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 16,
                    }}>
                      <View style={{ alignItems: 'center' }}>
                        <Text style={{
                          color: 'white',
                          fontWeight: 'bold',
                          fontSize: 14,
                          textAlign: 'center',
                          marginBottom: 4,
                        }}>
                          {season.name}
                        </Text>
                        
                        {isManga ? (
                          <Text style={{
                            color: '#fb923c',
                            fontSize: 12,
                            fontWeight: '500',
                          }}>
                            📖 MANGA
                          </Text>
                        ) : (
                          <Text style={{
                            color: '#22d3ee',
                            fontSize: 12,
                            fontWeight: '500',
                          }}>
                            🎥 ANIME
                          </Text>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AnimeDetailScreen;