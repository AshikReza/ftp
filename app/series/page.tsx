import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { CatalogView } from '@/components/discovery/CatalogView';



export default async function SeriesPage() {
  let items = [];
  try {
    // English & Foreign TV Series (Category ID: 9)
    const res = await circleClient.getPosts({ categoryExact: 9, page: 1, limit: 48, order: 'desc' });
    items = (res.posts || []).map(normalizeCirclePost);
    dbRepository.upsertManyContent(items);
  } catch (err) {
    items = dbRepository.getAllContent().filter(c => c.category === 'series');
  }

  return (
    <CatalogView
      initialItems={items}
      categoryTitle="TV &amp; Web Series"
      categorySubtitle="Multi-season episodic narratives with strict season-aware filtering and continuous episode progression"
      badge="SEASONED EPISODES"
      categoryType="series"
    />
  );
}
