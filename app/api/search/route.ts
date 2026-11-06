import { NextRequest, NextResponse } from 'next/server';
import { searchCircleFTP } from '@/lib/sources/circleftp/search-parser';
import { dbRepository } from '@/lib/db/repository';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || searchParams.get('query') || '';

    if (!q.trim()) {
      return NextResponse.json({
        all: [],
        movies: [],
        series: [],
        anime: [],
        courses: [],
        games: [],
        software: [],
        documentaries: [],
        total: 0
      });
    }

    try {
      const results = await searchCircleFTP(q);
      // Cache results in repository
      if (results.all.length > 0) {
        dbRepository.upsertManyContent(results.all);
      }
      return NextResponse.json(results);
    } catch (err: any) {
      // Local repository search fallback
      const localMatches = dbRepository.searchContent(q);
      return NextResponse.json({
        all: localMatches,
        movies: localMatches.filter(c => c.category === 'movie'),
        series: localMatches.filter(c => c.category === 'series'),
        anime: localMatches.filter(c => c.category === 'anime'),
        courses: localMatches.filter(c => c.category === 'course'),
        games: localMatches.filter(c => c.category === 'game'),
        software: localMatches.filter(c => c.category === 'software' || c.category === 'app'),
        documentaries: localMatches.filter(c => c.category === 'documentary'),
        total: localMatches.length,
        cached: true
      });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

