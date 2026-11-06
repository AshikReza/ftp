import { NextRequest, NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db/repository';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const contentId = searchParams.get('contentId');

  if (contentId) {
    const prog = dbRepository.getProgress(contentId);
    return NextResponse.json(prog || null);
  }

  const all = dbRepository.getAllProgress();
  return NextResponse.json(all);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, episodeId, currentTimeSeconds, durationSeconds, completed } = body;

    if (!contentId || typeof currentTimeSeconds !== 'number') {
      return NextResponse.json({ error: 'Missing contentId or currentTimeSeconds' }, { status: 400 });
    }

    const saved = dbRepository.saveProgress({
      contentId,
      episodeId,
      currentTimeSeconds,
      durationSeconds: durationSeconds || 0,
      completed: completed || false
    });

    return NextResponse.json(saved);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

