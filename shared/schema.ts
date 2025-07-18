// Schema simplifié pour ATOMIC FLIX - utilisation API Jikan (MyAnimeList)
// Plus de base de données locale nécessaire

export interface JikanResponse<T> {
  data: T;
  pagination?: {
    last_visible_page: number;
    has_next_page: boolean;
    current_page: number;
    items: {
      count: number;
      total: number;
      per_page: number;
    };
  };
}

export interface JikanImage {
  jpg: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
  webp: {
    image_url: string;
    small_image_url: string;
    large_image_url: string;
  };
}

export interface JikanGenre {
  mal_id: number;
  type: string;
  name: string;
  url: string;
}

export interface SearchResult {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  url: string;
  type: string;
  status: string;
  images: JikanImage;
  score?: number;
  episodes?: number;
  year?: number;
  genres: JikanGenre[];
  synopsis?: string;
}

export interface Episode {
  id: string;
  title: string;
  episodeNumber: number;
  url: string;
  language: string;
  available: boolean;
  streamingSources?: VideoSource[];
}

export interface VideoSource {
  url: string;
  server: string;
  quality: string;
  language: string;
  type: string;
  serverIndex: number;
}

export interface Season {
  number: number;
  name: string;
  value: string;
  languages: string[];
  episodeCount: number;
  url: string;
  available: boolean;
}

export interface AnimeData {
  mal_id: number;
  title: string;
  title_english?: string;
  title_japanese?: string;
  synopsis: string;
  images: JikanImage;
  genres: JikanGenre[];
  status: string;
  year?: number;
  episodes?: number;
  score?: number;
  scored_by?: number;
  rank?: number;
  popularity?: number;
  members?: number;
  favorites?: number;
  type: string;
  source: string;
  rating?: string;
  duration?: string;
  url: string;
  trailer?: {
    youtube_id: string;
    url: string;
    embed_url: string;
  };
  seasons?: Season[];
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

export interface MangaChapter {
  id: string;
  title: string;
  number: number;
  url: string;
  pages: string[];
  available: boolean;
  language: string;
}

export interface MangaSeason {
  number: number;
  name: string;
  value: string;
  type: string;
  languages: string[];
  available: boolean;
  contentType: string;
  url: string;
  fullUrl: string;
}

export interface MangaData {
  id: string;
  title: string;
  synopsis: string;
  image: string;
  genres: string[];
  status: string;
  year: string;
  seasons: MangaSeason[];
  url: string;
}