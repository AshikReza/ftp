import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { CatalogView } from '@/components/discovery/CatalogView';



export default async function DiscoverPage() {
  let items = [];
  try {
    const res = await circleClient.getPosts({ page: 1, limit: 48, order: 'desc' });
    items = (res.posts || []).map(normalizeCirclePost);
    dbRepository.upsertManyContent(items);
  } catch (err) {
    items = dbRepository.getAllContent();
  }

  return (
    <CatalogView
      initialItems={items}
      categoryTitle="Universal Discovery"
      categorySubtitle="Explore everything across Movies, TV Series, Anime, Tutorials, Games, and Desktop Software"
      badge="FULL SPECTRUM INDEX"
      categoryType="auto"
    />
  );
}
