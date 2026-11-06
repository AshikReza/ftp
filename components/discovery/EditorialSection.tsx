'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { Content } from '@/lib/types/content';
import { MovieCard } from '@/components/cards/MovieCard';
import { SeriesCard } from '@/components/cards/SeriesCard';
import { CourseCard } from '@/components/cards/CourseCard';
import { GameCard } from '@/components/cards/GameCard';
import { SoftwareCard } from '@/components/cards/SoftwareCard';

interface EditorialSectionProps {
  title: string;
  subtitle?: string;
  badge?: string;
  viewAllLink?: string;
  items: Content[];
  categoryType?: 'movie' | 'series' | 'anime' | 'course' | 'game' | 'software' | 'auto';
}

export function EditorialSection({
  title,
  subtitle,
  badge,
  viewAllLink,
  items,
  categoryType = 'auto'
}: EditorialSectionProps) {
  if (!items || items.length === 0) return null;

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
      case 'movie':
      case 'anime':
      case 'documentary':
      default:
        return <MovieCard key={item.id} movie={item} />;
    }
  };

  const isWideCard = categoryType === 'course' || categoryType === 'game' || categoryType === 'software';

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-5 sm:mb-6">
          <div>
            {badge && (
              <span className="text-[11px] font-mono uppercase tracking-widest text-red-400 font-semibold mb-1 block">
                {badge}
              </span>
            )}
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllLink && (
            <Link
              href={viewAllLink}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors group"
            >
              <span>Explore All</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Card Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 }
            }
          }}
          className={
            isWideCard
              ? 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
              : 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4'
          }
        >
          {items.slice(0, isWideCard ? 8 : 12).map(renderCard)}
        </motion.div>
      </div>
    </section>
  );
}

