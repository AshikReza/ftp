import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { CatalogView } from '@/components/discovery/CatalogView';



export default async function DocumentariesPage() {
  let items = [];
  try {
    // Documentary (Category ID: 85)
    const res = await circleClient.getPosts({ categoryExact: 85, page: 1, limit: 48, order: 'desc' });
    items = (res.posts || []).map(normalizeCirclePost);
    dbRepository.upsertManyContent(items);
  } catch (err) {
    items = dbRepository.getAllContent().filter(c => c.category === 'documentary');
  }

  return (
    <CatalogView
      initialItems={items}
      categoryTitle="Documentaries &amp; Specials"
      categorySubtitle="In-depth factual filmmaking covering nature, science, history, and human stories"
      badge="DOCUMENTARY VAULT"
      categoryType="movie"
    />
  );
}
