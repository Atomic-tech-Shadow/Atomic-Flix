// Schema EXACT pour ATOMIC FLIX - Basé sur les tests réels de l'API
// Base URL: https://anime-sama-scraper.vercel.app/api

// ============================================
// POPULAR ANIMES (/popular)
// ============================================

export interface PopularAnime {
  id: string;
  title: string;
  image: string;
  url: string;
  category?: string;
  extractedFrom?: string;
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
  languages?: string[];
  category?: string;
  extractedFrom?: string;
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
  day?: string;
  isReported?: boolean;
  status?: string;
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
// SEARCH (/search) - ATTENTION: retourne "animes" pas "results"!
// ============================================

export interface SearchAnime {
  id: string;
  title: string;
  url: string;
  image: string;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  count: number;
  animes: SearchAnime[];  // ⚠️ C'est "animes" pas "results"!
}

// ============================================
// ANIME DETAILS (/anime/{id}) - ATTENTION: retourne "data"!
// ============================================

export interface AnimeSeason {
  number: number;
  name: string;
  value: string;
  type: string;  // "Saison", "Film", "Scan"
  url: string;
  fullUrl: string;
  languages: string[];
  available: boolean;
  contentType: string;  // "anime" ou "manga"
  apiIndex?: number;
}

export interface AnimeDetailsData {
  id: string;
  title: string;
  alternativeTitles: string | null;
  synopsis: string;
  image: string;
  genres: string[];
  status: string;
  progressInfo?: string;
  correspondence?: string;
  year: string;
  type: string;
  seasons: AnimeSeason[];
  totalSeasons: number;
  availableLanguages: string[];
  hasFilms: boolean;
  hasOAV: boolean;
  hasSpecials: boolean;
  url: string;
  lastUpdated: string;
}

export interface AnimeDetailsResponse {
  success: boolean;
  data: AnimeDetailsData;  // ⚠️ Les données sont dans "data"!
}

// ============================================
// SEASONS (/seasons/{animeId})
// ============================================

export interface Season {
  number: number;
  name: string;
  value: string;
  type: string;  // "Saison", "Film", "Scan"
  languages: string[];
  available: boolean;
  contentType: string;  // "anime" ou "manga"
  url: string;
  fullUrl: string;
}

export interface SeasonsResponse {
  success: boolean;
  animeId: string;
  title: string;
  synopsis: string;
  image: string;
  genres: string[];
  status: string;
  year: string;
  count: number;
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
// TYPES D'USAGE COURANT
// ============================================

export interface VideoSource {
  url: string;
  server: string;
  quality: string;
  language: string;
  type: string;
  serverNumber: number;
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
