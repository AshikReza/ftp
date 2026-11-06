import { circleClient, HomePagePostsResponse, PostListResponse } from './client';
import { normalizeCirclePost } from './normalizer';
import { Content } from '@/lib/types/content';

export interface CatalogSyncResult {
  featured: Content[];
  latest: Content[];
  mostVisited: Content[];
  byCategory: Record<string, Content[]>;
}

export async function fetchHomePageCatalog(): Promise<CatalogSyncResult> {
  const data: HomePagePostsResponse = await circleClient.getHomePagePosts();

  const latest = (data.latestPost || []).map(normalizeCirclePost);
  const mostVisited = (data.mostVisitedPosts || []).map(normalizeCirclePost);

  const categoryPosts: Content[] = [];
  if (Array.isArray(data.categoryPosts)) {
    for (const group of data.categoryPosts) {
      if ('posts' in group && Array.isArray((group as any).posts)) {
        for (const post of (group as any).posts) {
          const postWithCat = {
            ...post,
            categories: post.categories && post.categories.length > 0
              ? post.categories
              : (group.id ? [{ id: group.id, name: group.name, type: 'main' }] : [])
          };
          categoryPosts.push(normalizeCirclePost(postWithCat));
        }
      } else if ('title' in group || 'name' in group) {
        categoryPosts.push(normalizeCirclePost(group as any));
      }
    }
  }

  // Featured are top visited or latest with high views
  const featured = mostVisited.slice(0, 5);

  const byCategory: Record<string, Content[]> = {};
  categoryPosts.forEach(item => {
    if (!byCategory[item.category]) {
      byCategory[item.category] = [];
    }
    byCategory[item.category].push(item);
  });

  return {
    featured,
    latest,
    mostVisited,
    byCategory
  };
}

export async function fetchCategoryCatalog(
  categoryExact: string | number,
  page = 1,
  limit = 24
): Promise<{ items: Content[]; total: number; pages: number }> {
  const res: PostListResponse = await circleClient.getPosts({
    categoryExact,
    page,
    limit,
    order: 'desc'
  });

  return {
    items: (res.posts || []).map(normalizeCirclePost),
    total: res.pagination?.total || (res.posts || []).length,
    pages: res.pagination?.pages || 1
  };
}
