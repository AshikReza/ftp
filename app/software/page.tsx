import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { CatalogView } from '@/components/discovery/CatalogView';



export default async function SoftwarePage() {
  let items = [];
  try {
    // Software (Category ID: 11)
    const res = await circleClient.getPosts({ categoryExact: 11, page: 1, limit: 48, order: 'desc' });
    items = (res.posts || []).map(normalizeCirclePost);
    dbRepository.upsertManyContent(items);
  } catch (err) {
    items = dbRepository.getAllContent().filter(c => c.category === 'software');
  }

  return (
    <CatalogView
      initialItems={items}
      categoryTitle="Desktop Software &amp; Tools"
      categorySubtitle="Development kits, graphics software, multimedia editors, operating systems, and utilities"
      badge="SOFTWARE REPOSITORY"
      categoryType="software"
    />
  );
}
