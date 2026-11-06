export type ContentCategoryType =
  | 'movie'
  | 'series'
  | 'anime'
  | 'course'
  | 'game'
  | 'software'
  | 'app'
  | 'documentary'
  | 'livetv';

export interface Content {
  id: string;
  sourceId: string;
  sourceType: 'circleftp' | 'bdix' | 'custom';
  title: string;
  name: string;
  category: ContentCategoryType;
  primaryCategoryName: string;
  categoryIds: number[];
  type: 'singleVideo' | 'series' | 'singleFile' | 'multiFile' | 'livetv';
  posterUrl: string;
  backdropUrl?: string;
  overview: string;
  year?: string | number;
  quality?: string;
  rating?: number;
  views?: number;
  tags?: string[];
  featured?: boolean;
  trending?: boolean;
  createdAt: string;
  updatedAt: string;
  
  // Specific Metadata
  movieMetadata?: MovieMetadata;
  seriesMetadata?: SeriesMetadata;
  courseMetadata?: CourseMetadata;
  gameMetadata?: GameMetadata;
  softwareMetadata?: SoftwareMetadata;
  appMetadata?: AppMetadata;
  documentaryMetadata?: DocumentaryMetadata;

  // Media files & direct access
  mediaFiles: MediaFile[];
}

export interface MediaFile {
  id: string;
  title: string;
  url: string;
  size?: string;
  format?: string;
  isStreamable: boolean;
  season?: number;
  episode?: number;
}

export interface MovieMetadata {
  durationMinutes?: number;
  audioLanguages?: string[];
  subtitles?: string[];
  codec?: string;
  resolution?: string;
  downloadUrl?: string;
  streamUrl?: string;
}

export interface SeriesMetadata {
  totalSeasons: number;
  totalEpisodes: number;
  seasons: SeasonData[];
}

export interface SeasonData {
  seasonNumber: number;
  name: string;
  episodes: EpisodeData[];
}

export interface EpisodeData {
  id: string;
  episodeNumber: number;
  seasonNumber: number;
  title: string;
  streamUrl: string;
  downloadUrl?: string;
  thumbnailUrl?: string;
  runtime?: string;
}

export interface CourseMetadata {
  instructor?: string;
  provider?: string;
  duration?: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  modulesCount?: number;
  lessonsCount?: number;
  downloadUrl?: string;
  curriculum?: { title: string; files: { title: string; link: string }[] }[];
}

export interface GameMetadata {
  platform: 'PC' | 'Console' | 'Linux' | 'Multi';
  version?: string;
  fileSize?: string;
  minRequirements?: {
    os?: string;
    cpu?: string;
    ram?: string;
    gpu?: string;
    storage?: string;
  };
  downloadLinks: { title: string; url: string }[];
}

export interface SoftwareMetadata {
  developer?: string;
  version?: string;
  os: 'Windows' | 'macOS' | 'Linux' | 'Cross-platform';
  architecture?: 'x64' | 'x86' | 'ARM' | 'Universal';
  fileSize?: string;
  downloadUrl: string;
}

export interface AppMetadata {
  packageName?: string;
  version?: string;
  minAndroidVersion?: string;
  fileSize?: string;
  downloadUrl: string;
}

export interface DocumentaryMetadata {
  subject?: string;
  network?: string;
  runtimeMinutes?: number;
  streamUrl?: string;
}

export interface LiveChannel {
  id: string;
  name: string;
  logo: string;
  category: 'Sports' | 'News' | 'Entertainment' | 'Movies' | 'Infotainment' | 'Kids' | 'Music';
  streamUrl: string;
  quality: string;
  isBDIX: boolean;
  status: 'online' | 'offline';
}

export interface WatchlistItem {
  id: string;
  contentId: string;
  content: Content;
  addedAt: string;
}

export interface ViewingProgress {
  id: string;
  contentId: string;
  contentTitle?: string;
  contentPoster?: string;
  episodeId?: string;
  currentTimeSeconds: number;
  durationSeconds: number;
  completed: boolean;
  lastWatchedAt: string;
}

export interface ScrapeJobRecord {
  id: string;
  source: string;
  type: 'full' | 'incremental' | 'category' | 'single';
  status: 'pending' | 'running' | 'completed' | 'failed';
  startedAt: string;
  finishedAt?: string;
  itemsProcessed: number;
  itemsAdded: number;
  itemsUpdated: number;
  errorMessage?: string;
}

