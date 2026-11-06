import { circleClient } from './client';
import { normalizeCirclePost } from './normalizer';
import { Content } from '@/lib/types/content';

export async function fetchContentDetails(id: string | number): Promise<Content> {
  const detail = await circleClient.getPostDetail(id);
  return normalizeCirclePost(detail);
}

