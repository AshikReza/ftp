import { circleClient } from './client';
import { normalizeCirclePost } from './normalizer';
import { Content, ContentCategoryType } from '@/lib/types/content';

export interface GroupedSearchResults {
  all: Content[];
  movies: Content[];
  series: Content[];
  anime: Content[];
  courses: Content[];
  games: Content[];
  software: Content[];
  documentaries: Content[];
  total: number;
}

export async function searchCircleFTP(query: string, limit = 40): Promise<GroupedSearchResults> {
  if (!query || query.trim().length === 0) {
    return {
      all: [],
      movies: [],
      series: [],
      anime: [],
      courses: [],
      games: [],
      software: [],
      documentaries: [],
      total: 0
    };
  }

  const res = await circleClient.getPosts({
    searchTerm: query.trim(),
    limit,
    order: 'desc'
  });

  const normalized = (res.posts || []).map(normalizeCirclePost);

  return {
    all: normalized,
    movies: normalized.filter(c => c.category === 'movie'),
    series: normalized.filter(c => c.category === 'series'),
    anime: normalized.filter(c => c.category === 'anime'),
    courses: normalized.filter(c => c.category === 'course'),
    games: normalized.filter(c => c.category === 'game'),
    software: normalized.filter(c => c.category === 'software' || c.category === 'app'),
    documentaries: normalized.filter(c => c.category === 'documentary'),
    total: normalized.length
  };
}

