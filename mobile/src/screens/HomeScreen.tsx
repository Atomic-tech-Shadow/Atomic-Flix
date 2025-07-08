import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

import { SearchResult } from '../types/index';
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
  const [refreshing, setRefreshing] = useState(false);

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
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!data.success) {
          throw new Error(data.error || 'API request failed');
        }
        return data;
      } catch (error) {
        attempt++;
        console.warn(`API request attempt ${attempt} failed:`, error);
        if (attempt >= maxRetries) {
          throw error;
        }
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  };

  // Charger les animes trending (identique au site web)
  const loadTrendingAnimes = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await apiRequest('/trending');
      setTrendingAnimes(response.data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des animes trending:', error);
      setError('Impossible de charger les animes populaires. Vérifiez votre connexion.');
    } finally {
      setLoading(false);
    }
  };

  // Recherche d'animes (identique au site web)
  const searchAnimes = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);
    setError(null);

    try {
      const response = await apiRequest(`/search?query=${encodeURIComponent(query.trim())}`);
      setSearchResults(response.data || []);
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      setError('Erreur lors de la recherche. Veuillez réessayer.');
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Navigation vers détails anime
  const navigateToAnime = (anime: SearchResult) => {
    navigation.navigate('AnimeDetail', {
      animeUrl: anime.url,
      animeTitle: anime.title,
    });
  };

  // Refresh control
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTrendingAnimes();
    setRefreshing(false);
  };

  // Effet initial identique au site web
  useEffect(() => {
    loadTrendingAnimes();
  }, []);

  // Effet de recherche avec debounce
  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchQuery.trim()) {
        searchAnimes(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(delayedSearch);
  }, [searchQuery]);

  // Composant Header avec logo ATOMIC FLIX
  const renderHeader = () => (
    <View style={styles.header}>
      <LinearGradient
        colors={['#0a0a0a', '#1a1a2e']}
        style={styles.headerGradient}
      >
        {/* Logo ATOMIC FLIX */}
        <View style={styles.logoContainer}>
          <View style={styles.atomicSymbol}>
            <View style={styles.atomicCore} />
            <View style={[styles.atomicRing, styles.ring1]} />
            <View style={[styles.atomicRing, styles.ring2]} />
          </View>
          <Text style={styles.logoText}>
            <Text style={styles.atomicText}>ATOMIC</Text>
            <Text style={styles.flixText}> FLIX</Text>
          </Text>
        </View>

        {/* Barre de recherche */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#6b7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un anime..."
              placeholderTextColor="#6b7280"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
              autoCorrect={false}
            />
            {searchLoading && (
              <ActivityIndicator size="small" color="#00ffff" style={styles.searchLoading} />
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  // Composant Carte Anime (identique au design web)
  const renderAnimeCard = (anime: SearchResult, index: number) => (
    <TouchableOpacity
      key={anime.id || index}
      style={styles.animeCard}
      onPress={() => navigateToAnime(anime)}
      activeOpacity={0.8}
    >
      <View style={styles.cardImageContainer}>
        <Image
          source={{ uri: anime.image }}
          style={styles.cardImage}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.cardGradient}
        />
      </View>
      
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {anime.title}
        </Text>
        <View style={styles.cardMeta}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{anime.status || anime.type}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Composant Section avec titre
  const renderSection = (title: string, data: SearchResult[], isLoading: boolean) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons 
          name={title.includes('Recherche') ? 'search' : 'flame'} 
          size={20} 
          color="#00ffff" 
        />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00ffff" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      ) : data.length > 0 ? (
        <View style={styles.animeGrid}>
          {data.map((anime, index) => renderAnimeCard(anime, index))}
        </View>
      ) : title.includes('Recherche') ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="search" size={48} color="#374151" />
          <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
        </View>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" backgroundColor="#0a0a0a" />
      
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#00ffff']}
            tintColor="#00ffff"
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}
        
        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="warning" size={24} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadTrendingAnimes}>
              <Text style={styles.retryText}>Réessayer</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Résultats de recherche */}
        {searchQuery.trim() && (
          renderSection(
            `🔍 Résultats de recherche pour "${searchQuery}"`,
            searchResults,
            searchLoading
          )
        )}

        {/* Contenu trending si pas de recherche */}
        {!searchQuery.trim() && (
          renderSection(
            '📥 derniers épisodes ajoutés',
            trendingAnimes,
            loading
          )
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    marginBottom: 20,
  },
  headerGradient: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    paddingTop: 40,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  atomicSymbol: {
    width: 40,
    height: 40,
    marginRight: 12,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  atomicCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00ffff',
    position: 'absolute',
  },
  atomicRing: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#00ffff',
    borderRadius: 50,
  },
  ring1: {
    width: 24,
    height: 24,
  },
  ring2: {
    width: 36,
    height: 36,
    opacity: 0.6,
  },
  logoText: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  atomicText: {
    color: '#00ffff',
  },
  flixText: {
    color: '#ff00ff',
  },
  searchContainer: {
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.3)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 16,
  },
  searchLoading: {
    marginLeft: 8,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginLeft: 8,
  },
  animeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  animeCard: {
    width: (width - 48) / 2,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,255,255,0.2)',
  },
  cardImageContainer: {
    position: 'relative',
    height: 240,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  cardGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  cardContent: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    lineHeight: 18,
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: 'rgba(0,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    color: '#00ffff',
    fontWeight: '600',
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    color: '#9ca3af',
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    color: '#6b7280',
    marginTop: 12,
    fontSize: 16,
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(239,68,68,0.1)',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 12,
  },
  errorText: {
    color: '#ef4444',
    marginTop: 8,
    textAlign: 'center',
    fontSize: 14,
  },
  retryButton: {
    marginTop: 12,
    backgroundColor: '#ef4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryText: {
    color: '#ffffff',
    fontWeight: '600',
  },
});

export default HomeScreen;