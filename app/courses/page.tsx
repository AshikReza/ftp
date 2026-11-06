import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { CatalogView } from '@/components/discovery/CatalogView';



export default async function CoursesPage() {
  let items = [];
  try {
    // Tutorial & Courses (Category ID: 12)
    const res = await circleClient.getPosts({ categoryExact: 12, page: 1, limit: 48, order: 'desc' });
    items = (res.posts || []).map(normalizeCirclePost);
    dbRepository.upsertManyContent(items);
  } catch (err) {
    items = dbRepository.getAllContent().filter(c => c.category === 'course');
  }

  return (
    <CatalogView
      initialItems={items}
      categoryTitle="Educational Courses &amp; Skill Academy"
      categorySubtitle="Curated engineering, software development, cloud computing, and creative design courses"
      badge="PROFESSIONAL CURRICULUM"
      categoryType="course"
    />
  );
}
