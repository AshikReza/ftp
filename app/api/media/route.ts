import { NextRequest, NextResponse } from 'next/server';
import { circleClient } from '@/lib/sources/circleftp/client';
import { fetchHomePageCatalog, fetchCategoryCatalog } from '@/lib/sources/circleftp/catalog-parser';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';

// Category mapping helper
const CATEGORY_MAP: Record<string, number> = {
  movies: 6,       // English Movies default (or 1, 2, 3, etc.)
  animation: 1,
  series: 9,       // English & Foreign TV Series
  anime: 21,      // Anime Series
  courses: 12,     // Tutorial & Courses
  games: 13,       // PC & Console Games
  software: 11,    // Software & Tools
  apps: 14,        // Mobile Apps
  documentaries: 85 // Documentaries
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '24', 10);
    const year = searchParams.get('year');
    const searchTerm = searchParams.get('searchTerm');

    // If home feed requested
    if (!category && !searchTerm) {
      try {
        const catalog = await fetchHomePageCatalog();
        const allCategoryItems = Object.values(catalog.byCategory).flat();

        // Cache in dbRepository
        dbRepository.upsertManyContent([...catalog.latest, ...catalog.mostVisited, ...allCategoryItems]);

        return NextResponse.json({
          featured: catalog.featured,
          latest: catalog.latest.slice(0, 16),
          mostVisited: catalog.mostVisited.slice(0, 16),
          categoryPosts: allCategoryItems.slice(0, 24)
        });
      } catch (err: any) {
        // Fallback to local db cache
        const all = dbRepository.getAllContent();
        return NextResponse.json({
          featured: all.slice(0, 5),
          latest: all.slice(0, 16),
          mostVisited: all.slice(0, 16),
          categoryPosts: all.slice(0, 16)
        });
      }
    }

    // If category requested
    let exactCategoryId: number | undefined = undefined;
    if (category) {
      if (!isNaN(Number(category))) {
        exactCategoryId = Number(category);
      } else if (CATEGORY_MAP[category.toLowerCase()]) {
        exactCategoryId = CATEGORY_MAP[category.toLowerCase()];
      }
    }

    try {
      const res = await circleClient.getPosts({
        categoryExact: exactCategoryId,
        searchTerm: searchTerm || undefined,
        page,
        limit,
        order: 'desc'
      });

      const normalized = (res.posts || []).map(normalizeCirclePost);
      if (normalized.length > 0) {
        dbRepository.upsertManyContent(normalized);
      }

      return NextResponse.json({
        items: normalized,
        pagination: res.pagination || {
          total: normalized.length,
          active: page,
          limit,
          pages: Math.ceil(normalized.length / limit) || 1
        }
      });
    } catch (err: any) {
      // Local fallback
      let filtered = dbRepository.getAllContent();
      if (exactCategoryId) {
        filtered = filtered.filter(c => c.categoryIds.includes(exactCategoryId!));
      }
      if (searchTerm) {
        filtered = filtered.filter(c =>
          c.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      return NextResponse.json({
        items: paginated,
        pagination: {
          total: filtered.length,
          active: page,
          limit,
          pages: Math.max(1, Math.ceil(filtered.length / limit))
        }
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
