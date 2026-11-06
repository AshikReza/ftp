'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Filter, Search, Loader2, Sparkles } from 'lucide-react';
import { Content } from '@/lib/types/content';
import { MovieCard } from '@/components/cards/MovieCard';
import { SeriesCard } from '@/components/cards/SeriesCard';
import { CourseCard } from '@/components/cards/CourseCard';
import { GameCard } from '@/components/cards/GameCard';
import { SoftwareCard } from '@/components/cards/SoftwareCard';

interface CatalogViewProps {
  initialItems: Content[];
  initialCategory?: string;
  categoryTitle: string;
  categorySubtitle?: string;
  badge?: string;
  showFilters?: boolean;
  categoryType?: 'movie' | 'series' | 'anime' | 'course' | 'game' | 'software' | 'auto';
}

export function CatalogView({
  initialItems,
  initialCategory,
  categoryTitle,
  categorySubtitle,
  badge = 'BDIX REPOSITORY',
  showFilters = true,
  categoryType = 'auto'
}: CatalogViewProps) {
  const [items, setItems] = useState<Content[]>(initialItems);
  const [loading, setLoading] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filter items locally or fetch
  const filteredItems = items.filter(item => {
    if (selectedYear !== 'all' && String(item.year) !== selectedYear) return false;
    if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const renderCard = (item: Content) => {
    const type = categoryType === 'auto' ? item.category : categoryType;
    switch (type) {
      case 'series':
        return <SeriesCard key={item.id} series={item} />;
      case 'course':
        return <CourseCard key={item.id} course={item} />;
      case 'game':
        return <GameCard key={item.id} game={item} />;
      case 'software':
      case 'app':
        return <SoftwareCard key={item.id} software={item} />;
      default:
        return <MovieCard key={item.id} movie={item} />;
    }
  };

  const isWideCard = categoryType === 'course' || categoryType === 'game' || categoryType === 'software';

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-16">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/8 mb-8">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-semibold mb-1 block">
            {badge}
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {categoryTitle}
          </h1>
          {categorySubtitle && (
            <p className="text-sm text-gray-400 mt-1 max-w-xl">
              {categorySubtitle}
            </p>
          )}
        </div>

        {/* Filter Controls */}
        {showFilters && (
          <div className="flex flex-wrap items-center gap-3">
            {/* Search filter within category */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
              <Search className="w-3.5 h-3.5 text-gray-400" />
              <input
                type="text"
                placeholder="Filter by title..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="bg-transparent text-white placeholder-gray-500 outline-none w-28 sm:w-36 text-xs"
              />
            </div>

            {/* Year filter */}
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-gray-300 outline-none cursor-pointer hover:bg-white/10 transition-colors"
            >
              <option value="all" className="bg-[#0D0F17]">All Years</option>
              {['2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2016'].map(y => (
                <option key={y} value={y} className="bg-[#0D0F17]">{y}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-24 text-center text-gray-500">
          <p className="text-sm">No items found matching the selected filters.</p>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.04 }
            }
          }}
          className={
            isWideCard
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4'
          }
        >
          {filteredItems.map(renderCard)}
        </motion.div>
      )}
    </div>
  );
}

