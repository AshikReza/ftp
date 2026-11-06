import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { CatalogView } from '@/components/discovery/CatalogView';



export default async function AppsPage() {
  let items = [];
  try {
    // Mobile Apps & Games (Category ID: 14)
    const res = await circleClient.getPosts({ categoryExact: 14, page: 1, limit: 48, order: 'desc' });
    items = (res.posts || []).map(normalizeCirclePost);
    dbRepository.upsertManyContent(items);
  } catch (err) {
    items = dbRepository.getAllContent().filter(c => c.category === 'app');
  }

  return (
    <CatalogView
      initialItems={items}
      categoryTitle="Mobile Applications"
      categorySubtitle="Android APKs, utilities, and mobile productivity tools"
      badge="MOBILE APPS"
      categoryType="software"
    />
  );
}
