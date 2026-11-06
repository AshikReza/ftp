import React from 'react';
import Link from 'next/link';
import { circleClient } from '@/lib/sources/circleftp/client';
import { fetchHomePageCatalog } from '@/lib/sources/circleftp/catalog-parser';
import { dbRepository } from '@/lib/db/repository';
import { MovieCard } from '@/components/cards/MovieCard';
import { SeriesCard } from '@/components/cards/SeriesCard';
import { GameCard } from '@/components/cards/GameCard';
import { CourseCard } from '@/components/cards/CourseCard';
import { SoftwareCard } from '@/components/cards/SoftwareCard';
import { Content } from '@/lib/types/content';
import {
  Sparkles,
  Film,
  Tv,
  Gamepad2,
  BookOpen,
  Laptop,
  Flame,
  ArrowRight,
  Layers
} from 'lucide-react';

export default async function CollectionsPage() {
  let catalogItems: Content[] = [];

  try {
    const catalog = await fetchHomePageCatalog();
    catalogItems = [
      ...catalog.featured,
      ...catalog.latest,
      ...catalog.mostVisited,
      ...Object.values(catalog.byCategory).flat()
    ];
  } catch (e) {
    catalogItems = dbRepository.getAllContent();
  }

  // Curated collections
  const collections = [
    {
      id: 'weekend-cinema',
      title: 'Weekend Cinema',
      badge: 'BLOCKBUSTERS',
      subtitle: 'High-definition 1080p feature films with multi-channel surround audio',
      accent: '#F0142F',
      icon: Film,
      items: catalogItems.filter(c => c.category === 'movie').slice(0, 6)
    },
    {
      id: 'binge-series',
      title: 'Critically Acclaimed Series',
      badge: 'EPISODIC',
      subtitle: 'Complete seasons of prestige television and web drama',
      accent: '#2F80ED',
      icon: Tv,
      items: catalogItems.filter(c => c.category === 'series').slice(0, 6)
    },
    {
      id: 'anime-masterpieces',
      title: 'Anime Masterpieces',
      badge: 'VAULT',
      subtitle: 'Subbed & dubbed anime series streaming at gigabit line rate',
      accent: '#BB6BD9',
      icon: Sparkles,
      items: catalogItems.filter(c => c.category === 'anime' || c.categoryIds.includes(21)).slice(0, 6)
    },
    {
      id: 'pc-gaming',
      title: 'PC Gaming Vault',
      badge: 'GAMES',
      subtitle: 'Direct high-speed game archives and update packages',
      accent: '#00F2FE',
      icon: Gamepad2,
      items: catalogItems.filter(c => c.category === 'game').slice(0, 6)
    },
    {
      id: 'developer-essentials',
      title: 'Developer Essentials & Bootcamps',
      badge: 'ACADEMY',
      subtitle: 'Software engineering, cloud architecture, and AI courses',
      accent: '#7957F5',
      icon: BookOpen,
      items: catalogItems.filter(c => c.category === 'course').slice(0, 6)
    },
    {
      id: 'desktop-tooling',
      title: 'Essential Software & Systems',
      badge: 'SOFTWARE',
      subtitle: 'Operating systems, clean developer toolchains, and creative utilities',
      accent: '#10B981',
      icon: Laptop,
      items: catalogItems.filter(c => c.category === 'software').slice(0, 6)
    }
  ];

  return (
    <div className="min-h-screen bg-[#08090D] pt-24 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1440px] mx-auto w-full">
      {/* Header */}
      <div className="relative rounded-2xl bg-gradient-to-r from-[#0D0F17] via-[#141722] to-[#0D0F17] border border-white/5 p-6 sm:p-10 mb-12 overflow-hidden shadow-2xl">
        <div className="absolute right-0 top-0 w-80 h-80 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600/10 border border-red-500/20 text-red-400 font-mono text-[10px] uppercase tracking-wider mb-2">
            <Layers className="w-3 h-3" />
            <span>EDITORIAL BUNDLES</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Curated Collections
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-2 leading-relaxed">
            Hand-picked selections spanning blockbuster cinema, binge-worthy television, professional bootcamps, and digital gaming resources.
          </p>
        </div>
      </div>

      {/* Collections Rails */}
      <div className="space-y-16">
        {collections.map(col => {
          const Icon = col.icon;
          if (col.items.length === 0) return null;
          return (
            <section key={col.id} className="relative">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-3 border-b border-white/5 gap-2">
                <div className="flex items-start gap-3">
                  <div
                    className="p-2.5 rounded-xl bg-white/5 mt-0.5"
                    style={{ color: col.accent }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="px-2 py-0.5 rounded text-[9.5px] font-mono font-bold uppercase tracking-wider bg-white/5"
                        style={{ color: col.accent }}
                      >
                        {col.badge}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                      {col.title}
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">{col.subtitle}</p>
                  </div>
                </div>

                <Link
                  href={`/discover`}
                  className="inline-flex items-center gap-1 text-xs font-semibold hover:underline text-gray-400 hover:text-white transition-colors"
                >
                  <span>Explore Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {col.items.map(item => {
                  if (item.category === 'series') return <SeriesCard key={item.id} series={item} />;
                  if (item.category === 'game') return <GameCard key={item.id} game={item} />;
                  if (item.category === 'course') return <CourseCard key={item.id} course={item} />;
                  if (item.category === 'software') return <SoftwareCard key={item.id} software={item} />;
                  return <MovieCard key={item.id} movie={item} />;
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

