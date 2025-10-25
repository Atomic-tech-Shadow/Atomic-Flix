// Schema complet pour ATOMIC FLIX - Correspondant exactement aux réponses de l'API
// Base URL: https://anime-sama-scraper.vercel.app/api

// ============================================
// INTERFACES GÉNÉRIQUES
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
  meta?: any;
}

// ============================================
// POPULAR ANIMES (/popular)
// ============================================

export interface PopularAnime {
  id: string;
  title: string;
  image: string;
  url: string;
}

export interface PopularCategory {
  count: number;
  anime: PopularAnime[];
}

export interface PopularResponse {
  success: boolean;
  totalCount: number;
  categories: {
    classiques?: PopularCategory;
    [key: string]: PopularCategory | undefined;
  };
}

// ============================================
// RECOMMENDATIONS (/recommendations)
// ============================================

export interface Recommendation {
  id: string;
  title: string;
  image: string;
  url: string;
  contentType: string;
  genres: string[];
}

export interface RecommendationsResponse {
  success: boolean;
  data: Recommendation[];
}

// ============================================
// PLANNING (/planning)
// ============================================

export interface PlanningItem {
  animeId: string;
  title: string;
  url: string;
  image: string;
  releaseTime: string;
  originalTime?: string;
  language: string;
  type: string;
}

export interface PlanningResponse {
  success: boolean;
  currentDay: string;
  extractedAt: string;
  day: string;
  count: number;
  items: PlanningItem[];
}

// ============================================
// RECENT EPISODES (/recent)
// ============================================

export interface RecentEpisode {
  animeId: string;
  animeTitle: string;
  season: number;
  episode: number;
  language: string;
  isFinale: boolean;
  isVFCrunchyroll: boolean;
  url: string;
  image: string;
  badgeInfo: string;
  addedAt: string;
  type: string;
}

export interface RecentEpisodesResponse {
  success: boolean;
  count: number;
  recentEpisodes: RecentEpisode[];
}

// ============================================
// SEARCH (/search)
// ============================================

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  image: string;
  synopsis: string;
  type: string;
  genres: string[];
  status: string;
  score: string;
  year: string;
}

export interface SearchResponse {
  success: boolean;
  results: SearchResult[];
}

// ============================================
// ANIME DETAILS (/anime/{id})
// ============================================

export interface AnimeSeason {
  seasonNumber: number;
  title: string;
  episodes: number;
}

export interface AnimeDetails {
  success: boolean;
  id: string;
  title: string;
  url: string;
  image: string;
  banner?: string;
  synopsis: string;
  type: string;
  genres: string[];
  status: string;
  score: string;
  year: string;
  studio?: string;
  seasons: AnimeSeason[];
  languages: string[];
}

// ============================================
// SEASONS (/seasons/{animeId})
// ============================================

export interface Season {
  seasonNumber: number;
  title: string;
  synopsis: string;
  episodes: number;
  languages: string[];
  animeId: string;
}

export interface SeasonsResponse {
  success: boolean;
  seasons: Season[];
}

// ============================================
// EPISODES (/episodes/{animeId})
// ============================================

export interface StreamingSource {
  server: string;
  url: string;
  quality: string;
  serverNumber: number;
}

export interface Episode {
  number: number;
  title: string;
  url: string;
  streamingSources: StreamingSource[];
  language: string;
  season: number;
  available: boolean;
}

export interface EpisodesResponse {
  success: boolean;
  animeId: string;
  season: string;
  language: string;
  contentType: string;
  count: number;
  episodes: Episode[];
}

// ============================================
// EMBED SOURCES (/embed)
// ============================================

export interface EmbedSource {
  server: string;
  url: string;
  quality: string;
  type: string;
  episode: number;
  serverNumber: number;
}

export interface EmbedSourcesResponse {
  success: boolean;
  url: string;
  sources: EmbedSource[];
}

// ============================================
// TYPES D'USAGE COURANT (Backward Compatibility)
// ============================================

export interface VideoSource {
  url: string;
  server: string;
  quality: string;
  language: string;
  type: string;
  serverNumber: number;
}

export interface AnimeData {
  id: string;
  title: string;
  synopsis: string;
  image: string;
  banner?: string;
  genres: string[];
  status: string;
  year: string;
  score: string;
  studio?: string;
  seasons: Season[];
  url: string;
  languages: string[];
  type: string;
}

export interface EpisodeDetails {
  id: string;
  title: string;
  animeTitle: string;
  episodeNumber: number;
  sources: VideoSource[];
  availableServers: string[];
  url: string;
}
