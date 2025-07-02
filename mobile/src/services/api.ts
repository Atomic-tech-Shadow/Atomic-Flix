import { ApiResponse, SearchResult, AnimeData, EpisodeDetails, MangaData, MangaChapter } from '../types';

const API_BASE_URL = 'https://anime-sama-scraper.vercel.app/api';

export const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

export const animeAPI = {
  search: async (query: string): Promise<ApiResponse<SearchResult[]>> => {
    return apiRequest(`/search?query=${encodeURIComponent(query)}`);
  },

  getAnimeData: async (url: string): Promise<ApiResponse<AnimeData>> => {
    return apiRequest(`/anime?url=${encodeURIComponent(url)}`);
  },

  getEpisodeDetails: async (url: string): Promise<ApiResponse<EpisodeDetails>> => {
    return apiRequest(`/episode?url=${encodeURIComponent(url)}`);
  },

  getMangaData: async (url: string): Promise<ApiResponse<MangaData>> => {
    return apiRequest(`/manga?url=${encodeURIComponent(url)}`);
  },

  getMangaChapters: async (url: string, language: string = 'VF'): Promise<ApiResponse<MangaChapter[]>> => {
    return apiRequest(`/manga/chapters?url=${encodeURIComponent(url)}&language=${language}`);
  },

  getMangaPages: async (chapterUrl: string): Promise<ApiResponse<string[]>> => {
    return apiRequest(`/manga/pages?url=${encodeURIComponent(chapterUrl)}`);
  }
};