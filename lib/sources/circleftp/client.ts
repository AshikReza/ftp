import { CircleCategory, CirclePostDetail, CirclePostSummary } from './validators';

const BASE_URL = process.env.CIRCLE_FTP_API_URL || 'http://new.circleftp.net:5000/api';
const TIMEOUT_MS = 9000;

export interface PostListResponse {
  posts: CirclePostSummary[];
  pagination: {
    total: number;
    active: number;
    limit: number;
    pages: number;
  };
}

export interface CircleCategoryPostGroup {
  id: number;
  name: string;
  type?: string;
  parentId?: number | null;
  posts: CirclePostSummary[];
}

export interface HomePagePostsResponse {
  latestPost: CirclePostSummary[];
  categoryPosts: (CircleCategoryPostGroup | CirclePostSummary)[];
  mostVisitedPosts: CirclePostSummary[];
}

export class CircleFTPClient {
  private baseUrl: string;

  constructor(baseUrl: string = BASE_URL) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  private async fetchWithRetry<T>(endpoint: string, retries = 2): Promise<T> {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    
    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      try {
        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) NEXORA/1.0',
          },
          next: { revalidate: 300 } // Next.js cache revalidation
        });

        clearTimeout(timer);

        if (!res.ok) {
          throw new Error(`CircleFTP HTTP ${res.status}: ${res.statusText}`);
        }

        return await res.json() as T;
      } catch (err: any) {
        clearTimeout(timer);
        if (attempt === retries) {
          throw new Error(`Failed to fetch ${url} after ${retries + 1} attempts: ${err.message}`);
        }
        // Exponential backoff
        await new Promise(r => setTimeout(r, 400 * Math.pow(2, attempt)));
      }
    }

    throw new Error('Unexpected network failure');
  }

  async getCategories(): Promise<CircleCategory[]> {
    return this.fetchWithRetry<CircleCategory[]>('/categories');
  }

  async getCategory(id: number | string): Promise<CircleCategory> {
    const cleanId = String(id).replace(/^cftp_/, '');
    return this.fetchWithRetry<CircleCategory>(`/categories/${cleanId}`);
  }

  async getSubCategories(): Promise<CircleCategory[]> {
    return this.fetchWithRetry<CircleCategory[]>('/sub-categories');
  }

  async getHomePagePosts(): Promise<HomePagePostsResponse> {
    return this.fetchWithRetry<HomePagePostsResponse>('/home-page/getHomePagePosts');
  }

  async getPosts(options: {
    categoryExact?: string | number;
    searchTerm?: string;
    page?: number;
    limit?: number;
    order?: 'desc' | 'asc';
  } = {}): Promise<PostListResponse> {
    const params = new URLSearchParams();
    if (options.categoryExact !== undefined && options.categoryExact !== '') {
      params.append('categoryExact', String(options.categoryExact));
    }
    if (options.searchTerm) {
      params.append('searchTerm', options.searchTerm);
    }
    if (options.page) {
      params.append('page', String(options.page));
    }
    if (options.limit) {
      params.append('limit', String(options.limit));
    }
    if (options.order) {
      params.append('order', options.order);
    } else {
      params.append('order', 'desc');
    }

    return this.fetchWithRetry<PostListResponse>(`/posts?${params.toString()}`);
  }

  async getPostDetail(id: number | string): Promise<CirclePostDetail> {
    const cleanId = String(id).replace(/^cftp_/, '');
    return this.fetchWithRetry<CirclePostDetail>(`/posts/${cleanId}`);
  }

  async getIndexLinks(): Promise<any> {
    return this.fetchWithRetry<any>('/index-links');
  }
}

export const circleClient = new CircleFTPClient();
