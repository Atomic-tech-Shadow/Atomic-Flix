import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  FlatList,
} from 'react-native';
import { Image } from 'expo-image';
import { useQuery } from '@tanstack/react-query';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/Ionicons';

import { animeAPI } from '../services/api';
import { MangaChapter, MangaSeason } from '../types';
import type { RootStackParamList } from '../navigation/AppNavigator';

type MangaReaderScreenNavigationProp = StackNavigationProp<RootStackParamList, 'MangaReader'>;
type MangaReaderScreenRouteProp = RouteProp<RootStackParamList, 'MangaReader'>;

const { width, height } = Dimensions.get('window');

const MangaReaderScreen: React.FC = () => {
  const navigation = useNavigation<MangaReaderScreenNavigationProp>();
  const route = useRoute<MangaReaderScreenRouteProp>();
  const { mangaUrl, mangaTitle } = route.params;

  const [chapters, setChapters] = useState<MangaChapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState<MangaChapter | null>(null);
  const [currentPages, setCurrentPages] = useState<string[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState('VF');
  const [showChapterList, setShowChapterList] = useState(false);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [readingMode, setReadingMode] = useState<'vertical' | 'horizontal'>('vertical');

  // Chargement des données du manga
  const { data: mangaData, isLoading: isMangaLoading } = useQuery({
    queryKey: ['manga', mangaUrl],
    queryFn: () => animeAPI.getMangaData(mangaUrl),
    retry: 2,
  });

  // Chargement des chapitres
  const { data: chaptersData, isLoading: isChaptersLoading } = useQuery({
    queryKey: ['manga-chapters', mangaUrl, selectedLanguage],
    queryFn: () => animeAPI.getMangaChapters(mangaUrl, selectedLanguage),
    enabled: !!mangaData?.success,
    retry: 2,
  });

  // Chargement des pages du chapitre actuel
  const { data: pagesData, isLoading: isPagesLoading } = useQuery({
    queryKey: ['manga-pages', currentChapter?.url],
    queryFn: () => currentChapter ? animeAPI.getMangaPages(currentChapter.url) : null,
    enabled: !!currentChapter,
    retry: 2,
  });

  useEffect(() => {
    if (chaptersData?.success) {
      setChapters(chaptersData.data);
      if (chaptersData.data.length > 0) {
        setCurrentChapter(chaptersData.data[0]);
      }
    }
  }, [chaptersData]);

  useEffect(() => {
    if (pagesData?.success) {
      setCurrentPages(pagesData.data);
      setCurrentPageIndex(0);
    }
  }, [pagesData]);

  const handleChapterSelect = (chapter: MangaChapter) => {
    setCurrentChapter(chapter);
    setShowChapterList(false);
    setCurrentPageIndex(0);
  };

  const handleNextChapter = () => {
    if (currentChapter && chapters.length > 0) {
      const currentIndex = chapters.findIndex(ch => ch.id === currentChapter.id);
      if (currentIndex < chapters.length - 1) {
        setCurrentChapter(chapters[currentIndex + 1]);
      }
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter && chapters.length > 0) {
      const currentIndex = chapters.findIndex(ch => ch.id === currentChapter.id);
      if (currentIndex > 0) {
        setCurrentChapter(chapters[currentIndex - 1]);
      }
    }
  };

  const handleNextPage = () => {
    if (currentPageIndex < currentPages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    } else {
      handleNextChapter();
    }
  };

  const handlePreviousPage = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    } else {
      handlePreviousChapter();
    }
  };

  const getAvailableLanguages = () => {
    if (!mangaData?.success || !mangaData.data.seasons) return [];
    const languages = new Set<string>();
    mangaData.data.seasons.forEach(season => {
      season.languages.forEach(lang => languages.add(lang));
    });
    return Array.from(languages);
  };

  const renderPage = ({ item, index }: { item: string; index: number }) => (
    <View style={{ width, height: height - 100, justifyContent: 'center', alignItems: 'center' }}>
      <Image
        source={{ uri: item }}
        style={{
          width: width - 20,
          height: height - 120,
          backgroundColor: '#1e293b',
        }}
        contentFit="contain"
        placeholder={{ blurhash: 'L6PZfSi_.AyE_3t7t7R**0o#DgR4' }}
        transition={200}
      />
      <Text style={{
        position: 'absolute',
        bottom: 10,
        color: '#94a3b8',
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 15,
      }}>
        {index + 1} / {currentPages.length}
      </Text>
    </View>
  );

  if (isMangaLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#d946ef" />
        <Text style={{ color: '#94a3b8', marginTop: 10 }}>Chargement du manga...</Text>
      </View>
    );
  }

  if (!mangaData?.success) {
    return (
      <View style={{ flex: 1, backgroundColor: '#0f172a', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Icon name="book" size={48} color="#d946ef" />
        <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: 'bold', marginTop: 20, textAlign: 'center' }}>
          Manga disponible prochainement
        </Text>
        <Text style={{ color: '#94a3b8', marginTop: 10, textAlign: 'center' }}>
          La fonctionnalité de lecture de manga sera bientôt disponible dans l'application.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            backgroundColor: '#d946ef',
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
      {/* Barre de contrôles supérieure */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#1e293b',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
      }}>
        <TouchableOpacity
          onPress={() => setShowChapterList(!showChapterList)}
          style={{
            backgroundColor: '#d946ef',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 10,
            paddingVertical: 5,
            borderRadius: 15,
          }}
        >
          <Icon name="list" size={16} color="white" />
          <Text style={{ color: 'white', marginLeft: 5, fontSize: 12 }}>Chapitres</Text>
        </TouchableOpacity>

        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#f8fafc', fontSize: 14, fontWeight: 'bold' }}>
            {currentChapter?.title || 'Sélectionnez un chapitre'}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setReadingMode(readingMode === 'vertical' ? 'horizontal' : 'vertical')}
          style={{
            backgroundColor: '#0ea5e9',
            padding: 8,
            borderRadius: 15,
          }}
        >
          <Icon 
            name={readingMode === 'vertical' ? 'swap-vertical' : 'swap-horizontal'} 
            size={16} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      {/* Lecteur de manga */}
      {isPagesLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#d946ef" />
          <Text style={{ color: '#94a3b8', marginTop: 10 }}>Chargement des pages...</Text>
        </View>
      ) : currentPages.length > 0 ? (
        readingMode === 'vertical' ? (
          <FlatList
            data={currentPages}
            renderItem={renderPage}
            keyExtractor={(item, index) => index.toString()}
            pagingEnabled
            showsVerticalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.y / (height - 100));
              setCurrentPageIndex(newIndex);
            }}
          />
        ) : (
          <FlatList
            data={currentPages}
            renderItem={renderPage}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
              setCurrentPageIndex(newIndex);
            }}
          />
        )
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Icon name="document-text" size={48} color="#6b7280" />
          <Text style={{ color: '#94a3b8', marginTop: 10 }}>Aucune page disponible</Text>
        </View>
      )}

      {/* Contrôles de navigation */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#1e293b',
        borderTopWidth: 1,
        borderTopColor: '#334155',
      }}>
        <TouchableOpacity
          onPress={handlePreviousPage}
          style={{
            backgroundColor: '#334155',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Icon name="chevron-back" size={16} color="#f8fafc" />
          <Text style={{ color: '#f8fafc', marginLeft: 5 }}>Précédent</Text>
        </TouchableOpacity>

        <Text style={{ color: '#94a3b8', fontSize: 14 }}>
          {currentPageIndex + 1} / {currentPages.length}
        </Text>

        <TouchableOpacity
          onPress={handleNextPage}
          style={{
            backgroundColor: '#334155',
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 15,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ color: '#f8fafc', marginRight: 5 }}>Suivant</Text>
          <Icon name="chevron-forward" size={16} color="#f8fafc" />
        </TouchableOpacity>
      </View>

      {/* Liste des chapitres */}
      {showChapterList && (
        <View style={{
          position: 'absolute',
          top: 60,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
        }}>
          <View style={{ flex: 1, padding: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 }}>
              <Text style={{ color: '#f8fafc', fontSize: 18, fontWeight: 'bold' }}>
                Chapitres disponibles
              </Text>
              <TouchableOpacity
                onPress={() => setShowChapterList(false)}
                style={{ backgroundColor: '#ef4444', padding: 8, borderRadius: 15 }}
              >
                <Icon name="close" size={16} color="white" />
              </TouchableOpacity>
            </View>

            {isChaptersLoading ? (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#d946ef" />
              </View>
            ) : (
              <ScrollView>
                {chapters.map((chapter, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleChapterSelect(chapter)}
                    style={{
                      backgroundColor: currentChapter?.id === chapter.id ? '#d946ef' : '#1e293b',
                      padding: 15,
                      borderRadius: 12,
                      marginBottom: 10,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{
                      color: currentChapter?.id === chapter.id ? 'white' : '#f8fafc',
                      fontSize: 16,
                      fontWeight: currentChapter?.id === chapter.id ? 'bold' : 'normal',
                    }}>
                      {chapter.title}
                    </Text>
                    {currentChapter?.id === chapter.id && (
                      <Icon name="bookmark" size={20} color="white" />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default MangaReaderScreen;