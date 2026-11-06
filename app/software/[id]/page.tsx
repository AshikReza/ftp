import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { ContentDetails } from '@/components/details/ContentDetails';
import { notFound } from 'next/navigation';

export default async function SoftwareDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const cleanId = id.replace(/^cftp_/, '');

  const cached = dbRepository.getContentById(id.startsWith('cftp_') ? id : `cftp_${id}`);
  const hasDetails = cached && cached.mediaFiles && cached.mediaFiles.length > 0;

  let content = hasDetails ? cached : undefined;

  if (!content) {
    try {
      const detail = await circleClient.getPostDetail(cleanId);
      content = normalizeCirclePost(detail);
      dbRepository.upsertContent(content);
    } catch (err) {
      if (cached) content = cached;
    }
  }

  if (!content) {
    notFound();
  }

  return <ContentDetails content={content} />;
}
