import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { CatalogView } from '@/components/discovery/CatalogView';



export default async function AnimePage() {
  let items = [];
  try {
    // English & Foreign Anime Series (Category ID: 21)
    const res = await circleClient.getPosts({ categoryExact: 21, page: 1, limit: 48, order: 'desc' });
    items = (res.posts || []).map(normalizeCirclePost);
    dbRepository.upsertManyContent(items);
  } catch (err) {
    items = dbRepository.getAllContent().filter(c => c.category === 'anime');
  }

  return (
    <CatalogView
      initialItems={items}
      categoryTitle="Anime Vault"
      categorySubtitle="Subbed and dubbed Japanese anime series, OVA releases, and animated cinema"
      badge="ANIME ARCHIVES"
      categoryType="movie"
    />
  );
}
