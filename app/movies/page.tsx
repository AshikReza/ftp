import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { CatalogView } from '@/components/discovery/CatalogView';



export default async function MoviesPage() {
  let items = [];
  try {
    // English Movies (Category ID: 6) + Animation (ID: 1)
    const res = await circleClient.getPosts({ categoryExact: 6, page: 1, limit: 48, order: 'desc' });
    items = (res.posts || []).map(normalizeCirclePost);
    dbRepository.upsertManyContent(items);
  } catch (err) {
    items = dbRepository.getAllContent().filter(c => c.category === 'movie');
  }

  return (
    <CatalogView
      initialItems={items}
      categoryTitle="Cinematic Movies"
      categorySubtitle="1080p Full HD films with surround audio, multi-language dubbing, and high-speed BDIX streams"
      badge="THEATRICAL &amp; STREAMING"
      categoryType="movie"
    />
  );
}
