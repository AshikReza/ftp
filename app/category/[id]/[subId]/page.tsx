import React from 'react';
import CategoryPage from '../page';

interface SubCategoryPageProps {
  params: Promise<{ id: string; subId: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function SubCategoryRoute({ params, searchParams }: SubCategoryPageProps) {
  const { id, subId } = await params;
  const sParams = await searchParams;

  // Re-use CategoryPage with sub set to subId
  return (
    <CategoryPage
      params={Promise.resolve({ id })}
      searchParams={Promise.resolve({ ...sParams, sub: subId })}
    />
  );
}

