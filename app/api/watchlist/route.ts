import { NextRequest, NextResponse } from 'next/server';
import { dbRepository } from '@/lib/db/repository';

export async function GET() {
  const watchlist = dbRepository.getWatchlist();
  return NextResponse.json(watchlist);
}

export async function POST(request: NextRequest) {
  try {
    const content = await request.json();
    if (!content || !content.id) {
      return NextResponse.json({ error: 'Valid content is required' }, { status: 400 });
    }
    const item = dbRepository.addToWatchlist(content);
    return NextResponse.json(item);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentId = searchParams.get('contentId');
    if (!contentId) {
      return NextResponse.json({ error: 'contentId parameter is required' }, { status: 400 });
    }
    dbRepository.removeFromWatchlist(contentId);
    return NextResponse.json({ success: true, contentId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

