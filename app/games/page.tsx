import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { CatalogView } from '@/components/discovery/CatalogView';



export default async function GamesPage() {
  let items = [];
  try {
    // PC & Console Games (Category ID: 13)
    const res = await circleClient.getPosts({ categoryExact: 13, page: 1, limit: 48, order: 'desc' });
    items = (res.posts || []).map(normalizeCirclePost);
    dbRepository.upsertManyContent(items);
  } catch (err) {
    items = dbRepository.getAllContent().filter(c => c.category === 'game');
  }

  return (
    <CatalogView
      initialItems={items}
      categoryTitle="PC &amp; Console Games"
      categorySubtitle="Standalone game releases, game updates, mods, and high-speed BDIX mirrors"
      badge="GAMING ECOSYSTEM"
      categoryType="game"
    />
  );
}
