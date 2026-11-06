import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { getCategoryById } from '@/lib/data/categories';
import { MovieCard } from '@/components/cards/MovieCard';
import { SeriesCard } from '@/components/cards/SeriesCard';
import { GameCard } from '@/components/cards/GameCard';
import { CourseCard } from '@/components/cards/CourseCard';
import { SoftwareCard } from '@/components/cards/SoftwareCard';
import { Content } from '@/lib/types/content';
import {
  Film,
  Layers,
  ChevronRight,
  Filter,
  Grid,
  ListFilter,
  ExternalLink,
  Sparkles
} from 'lucide-react';

interface CategoryPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; sub?: string; sort?: string }>;
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { id } = await params;
  const { page: pageStr = '1', sub: subParam, sort = 'desc' } = await searchParams;

  const categoryId = parseInt(id, 10);
  if (isNaN(categoryId)) {
    notFound();
  }

  const page = Math.max(1, parseInt(pageStr, 10) || 1);
  const activeSubId = subParam ? parseInt(subParam, 10) : undefined;
  const targetFilterId = activeSubId || categoryId;

  const categoryMeta = getCategoryById(categoryId);

  let categoryDetail: any = null;
  let items: Content[] = [];
  let totalCount = 0;
  let totalPages = 1;

  try {
    // 1. Fetch category with its subcategories
    categoryDetail = await circleClient.getCategory(categoryId);

    // 2. Fetch posts under active subcategory or main category
    const postsRes = await circleClient.getPosts({
      categoryExact: targetFilterId,
      page,
      limit: 24,
      order: sort === 'asc' ? 'asc' : 'desc'
    });

    items = (postsRes.posts || []).map(normalizeCirclePost);
    totalCount = postsRes.pagination?.total || items.length;
    totalPages = postsRes.pagination?.pages || Math.ceil(totalCount / 24) || 1;

    // Cache items locally
    if (items.length > 0) {
      dbRepository.upsertManyContent(items);
    }
  } catch (err) {
    console.warn(`Live CircleFTP category fetch failed for category ${categoryId}:`, err);
    // Offline / fallback cache
    const cached = dbRepository.getAllContent().filter(c =>
      c.categoryIds.includes(targetFilterId) || c.categoryIds.includes(categoryId)
    );
    items = cached.slice((page - 1) * 24, page * 24);
    totalCount = cached.length;
    totalPages = Math.max(1, Math.ceil(totalCount / 24));
  }

  const categoryTitle = categoryDetail?.name || categoryMeta?.name || `Category #${categoryId}`;
  const subCategories: Array<{ id: number; name: string }> = categoryDetail?.subCategory || [];

  const CategoryIcon = categoryMeta?.icon || Film;

  const renderCard = (content: Content) => {
    switch (content.category) {
      case 'series':
        return <SeriesCard key={content.id} series={content} />;
      case 'game':
        return <GameCard key={content.id} game={content} />;
      case 'course':
        return <CourseCard key={content.id} course={content} />;
      case 'software':
      case 'app':
        return <SoftwareCard key={content.id} software={content} />;
      case 'movie':
      case 'anime':
      case 'documentary':
      default:
        return <MovieCard key={content.id} movie={content} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-gray-400 mb-6 font-mono">
        <Link href="/" className="hover:text-white transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <Link href="/discover" className="hover:text-white transition-colors">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
        <span className="text-white font-semibold">{categoryTitle}</span>
        {activeSubId && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-red-400">
              {subCategories.find(s => s.id === activeSubId)?.name || `Sub #${activeSubId}`}
            </span>
          </>
        )}
      </nav>

      {/* Hero Category Banner */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0D0F17] via-[#141722] to-[#0D0F17] border border-white/10 p-6 sm:p-8 mb-8 overflow-hidden shadow-2xl">
        <div
          className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ backgroundColor: categoryMeta?.accent || '#F0142F' }}
        />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <div
              className="p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-lg text-white"
              style={{ color: categoryMeta?.accent || '#F0142F' }}
            >
              <CategoryIcon className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-red-500/10 text-red-400 border border-red-500/20">
                  Category #{categoryId}
                </span>
                <span className="text-xs text-gray-400 font-mono">
                  {totalCount.toLocaleString()} Titles Indexed
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {categoryTitle}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 mt-1.5 max-w-2xl leading-relaxed">
                {categoryMeta?.description || 'Browse genuine high-definition media, verified downloads, and high-speed video streams.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start md:self-center">
            <Link
              href={`/api/media?category=${categoryId}`}
              target="_blank"
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-xs font-mono flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-red-400" />
              <span>JSON Feed</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Subcategory Pills / Chips Navigation */}
      {subCategories.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-red-400" />
              <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider font-mono">
                Filter by Subcategory / Release Year
              </h3>
            </div>
            <span className="text-[11px] text-gray-500 font-mono">
              {subCategories.length} available filters
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
            <Link
              href={`/category/${categoryId}`}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                !activeSubId
                  ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                  : 'bg-[#0D0F17] text-gray-400 hover:text-white border-white/5 hover:border-white/20'
              }`}
            >
              All Titles
            </Link>
            {subCategories.map(sub => {
              const isSelected = activeSubId === sub.id;
              return (
                <Link
                  key={sub.id}
                  href={`/category/${categoryId}/${sub.id}`}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-red-600 text-white border-red-500 shadow-md shadow-red-600/30'
                      : 'bg-[#0D0F17] text-gray-400 hover:text-white border-white/5 hover:border-white/20'
                  }`}
                >
                  {sub.name}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Controls Bar: Results Count & Order */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/5">
        <div className="text-xs text-gray-400">
          Showing <span className="text-white font-semibold">{items.length}</span> of{' '}
          <span className="text-white font-semibold">{totalCount}</span> titles
          {activeSubId && (
            <span className="ml-1 text-red-400">
              in {subCategories.find(s => s.id === activeSubId)?.name}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <ListFilter className="w-3.5 h-3.5" />
            <span>Order:</span>
            <Link
              href={`/category/${categoryId}${activeSubId ? `/${activeSubId}` : ''}?sort=desc`}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                sort !== 'asc' ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Newest
            </Link>
            <Link
              href={`/category/${categoryId}${activeSubId ? `/${activeSubId}` : ''}?sort=asc`}
              className={`px-2.5 py-1 rounded text-xs transition-colors ${
                sort === 'asc' ? 'bg-white/10 text-white font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              Oldest
            </Link>
          </div>
        </div>
      </div>

      {/* Media Cards Grid */}
      {items.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#0D0F17]/50 border border-white/5 p-8">
          <Film className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white mb-1">No items found in this section</h3>
          <p className="text-xs text-gray-400 max-w-sm mx-auto mb-6">
            The requested category or filter does not have indexed titles currently available.
          </p>
          <Link
            href={`/category/${categoryId}`}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-600/30"
          >
            Clear Subcategory Filter
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map(renderCard)}
        </div>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="mt-12 flex items-center justify-center gap-1.5 flex-wrap">
          {page > 1 && (
            <Link
              href={`/category/${categoryId}${activeSubId ? `/${activeSubId}` : ''}?page=${page - 1}&sort=${sort}`}
              className="px-3 py-1.5 rounded-lg bg-[#0D0F17] hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-xs font-semibold"
            >
              ‹ Prev
            </Link>
          )}

          {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
            let pNum = i + 1;
            if (totalPages > 7) {
              if (page > 4) {
                pNum = page - 3 + i;
              }
              if (pNum > totalPages) {
                pNum = totalPages - 6 + i;
              }
            }
            if (pNum < 1 || pNum > totalPages) return null;

            const isCurrent = pNum === page;
            return (
              <Link
                key={pNum}
                href={`/category/${categoryId}${activeSubId ? `/${activeSubId}` : ''}?page=${pNum}&sort=${sort}`}
                className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-semibold transition-all ${
                  isCurrent
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/40 border border-red-500'
                    : 'bg-[#0D0F17] hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {pNum}
              </Link>
            );
          })}

          {page < totalPages && (
            <Link
              href={`/category/${categoryId}${activeSubId ? `/${activeSubId}` : ''}?page=${page + 1}&sort=${sort}`}
              className="px-3 py-1.5 rounded-lg bg-[#0D0F17] hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-xs font-semibold"
            >
              Next ›
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
