import { NextRequest, NextResponse } from 'next/server';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const cleanId = id.replace(/^cftp_/, '');

    // Check if in DB cache first
    const cached = dbRepository.getContentById(id.startsWith('cftp_') ? id : `cftp_${id}`);

    try {
      const detail = await circleClient.getPostDetail(cleanId);
      const normalized = normalizeCirclePost(detail);
      dbRepository.upsertContent(normalized);
      return NextResponse.json(normalized);
    } catch (err: any) {
      if (cached) {
        return NextResponse.json(cached);
      }
      return NextResponse.json({ error: `Content not found: ${err.message}` }, { status: 404 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

