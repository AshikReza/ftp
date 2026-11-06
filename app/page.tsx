import React from 'react';
import { circleClient } from '@/lib/sources/circleftp/client';
import { normalizeCirclePost } from '@/lib/sources/circleftp/normalizer';
import { dbRepository } from '@/lib/db/repository';
import { HeroSpotlight } from '@/components/discovery/HeroSpotlight';
import { EditorialSection } from '@/components/discovery/EditorialSection';
import { ContinueWatchingRail } from '@/components/discovery/ContinueWatchingRail';
import { Content } from '@/lib/types/content';
import { CIRCLE_CATEGORIES } from '@/lib/data/categories';
import Link from 'next/link';
import { Sparkles, BookOpen, Gamepad2, Laptop, Film, Tv, ArrowRight, Layers } from 'lucide-react';

export default async function HomePage() {
  let featured: Content[] = [];
  let latest: Content[] = [];
  let mostVisited: Content[] = [];
  let categoryPosts: Content[] = [];

  try {
    const homeData = await circleClient.getHomePagePosts();
    latest = (homeData.latestPost || []).map(normalizeCirclePost);
    mostVisited = (homeData.mostVisitedPosts || []).map(normalizeCirclePost);

    // Unpack posts from each category group in categoryPosts
    if (Array.isArray(homeData.categoryPosts)) {
      for (const group of homeData.categoryPosts) {
        if ('posts' in group && Array.isArray((group as any).posts)) {
          for (const post of (group as any).posts) {
            const postWithCat = {
              ...post,
              categories: post.categories && post.categories.length > 0
                ? post.categories
                : (group.id ? [{ id: group.id, name: group.name, type: 'main' }] : [])
            };
            categoryPosts.push(normalizeCirclePost(postWithCat));
          }
        } else if ('title' in group || 'name' in group) {
          categoryPosts.push(normalizeCirclePost(group as any));
        }
      }
    }

    // Save to local repository for caching & offline resilience
    dbRepository.upsertManyContent([...latest, ...mostVisited, ...categoryPosts]);
    featured = mostVisited.slice(0, 5);
  } catch (err) {
    console.warn('Live CircleFTP fetch failed, falling back to local database repository:', err);
    const cached = dbRepository.getAllContent();
    featured = cached.slice(0, 5);
    latest = cached.slice(0, 16);
    mostVisited = cached.slice(0, 16);
    categoryPosts = cached;
  }

  // Filter collections
  const movies = categoryPosts.filter(c => c.category === 'movie' || c.categoryIds.some(id => [1,2,3,4,6,7,8,20].includes(id)));
  const series = categoryPosts.filter(c => c.category === 'series' || c.type === 'series');
  const anime = categoryPosts.filter(c => c.category === 'anime' || c.categoryIds.includes(21));
  const courses = categoryPosts.filter(c => c.category === 'course' || c.categoryIds.includes(12));
  const games = categoryPosts.filter(c => c.category === 'game' || c.categoryIds.includes(13));
  const software = categoryPosts.filter(c => c.category === 'software' || c.categoryIds.includes(11));

  // Top featured categories for the quick directory grid
  const spotlightCategories = CIRCLE_CATEGORIES.filter(c => [6, 2, 9, 21, 13, 11, 4, 12].includes(c.id));

  return (
    <div className="flex flex-col w-full pb-16">
      {/* 1. Cinematic Hero Spotlight */}
      <HeroSpotlight items={featured.length > 0 ? featured : latest.slice(0, 5)} />

      {/* 2. Category Quick Gateway */}
      <section className="relative z-20 pt-10 sm:pt-14 pb-4 max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-gray-300">
              Browse Directories
            </h2>
          </div>
          <Link
            href="/discover"
            className="text-xs font-mono text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 group"
          >
            <span>All 24 Channels</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 p-3.5 rounded-2xl bg-[#0D0F17]/80 backdrop-blur-xl border border-white/[0.04] shadow-2xl">
          {[
            { href: '/category/6', label: 'English Movies', icon: Film, count: '1080p UHD', color: 'text-red-500' },
            { href: '/category/2', label: 'Hindi Movies', icon: Film, count: 'Bollywood', color: 'text-amber-500' },
            { href: '/category/9', label: 'TV Series', icon: Tv, count: 'Episodes', color: 'text-blue-500' },
            { href: '/category/21', label: 'Anime Vault', icon: Sparkles, count: 'Sub & Dub', color: 'text-purple-400' },
            { href: '/category/13', label: 'PC Games', icon: Gamepad2, count: 'Repacks', color: 'text-cyan-400' },
            { href: '/category/11', label: 'Software', icon: Laptop, count: 'Packages', color: 'text-emerald-400' },
          ].map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.href}
                href={cat.href}
                className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.02] hover:bg-white/[0.06] transition-all group border border-white/[0.02] hover:border-white/[0.06]"
              >
                <div className={`p-2 rounded-lg bg-white/5 ${cat.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                    {cat.label}
                  </h4>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {cat.count}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Continue Watching */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8">
        <ContinueWatchingRail />
      </div>

      {/* 4. Recently Added Catalog */}
      <EditorialSection
        badge="FRESHLY INDEXED"
        title="Recently Added"
        subtitle="Live streams and high-definition releases freshly indexed"
        viewAllLink="/discover"
        items={latest}
        categoryType="auto"
      />

      {/* 5. Trending Cinema & Feature Films */}
      <EditorialSection
        badge="CINEMATIC DISCOVERY"
        title="Trending Cinema &amp; Feature Films"
        subtitle="High-definition 1080p movies with multi-language dubbed audio and surround sound"
        viewAllLink="/movies"
        items={movies.length > 0 ? movies : latest.filter(c => c.category === 'movie')}
        categoryType="movie"
      />

      {/* 6. TV & Web Series Collection */}
      <EditorialSection
        badge="EPISODIC CONTENT"
        title="Binge-Worthy TV &amp; Web Series"
        subtitle="Complete seasons and episodes with instant playback switching"
        viewAllLink="/series"
        items={series.length > 0 ? series : latest.filter(c => c.category === 'series')}
        categoryType="series"
      />

      {/* 7. Category Directory */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full my-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 pb-3 border-b border-white/5 gap-2">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 font-mono text-[10px] uppercase tracking-wider mb-1.5">
              <Layers className="w-3 h-3" />
              <span>CHANNELS &amp; CATEGORIES</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              Explore by Category
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Instant discovery across entertainment, cinema, learning, and digital libraries
            </p>
          </div>
          <Link
            href="/discover"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors group"
          >
            <span>All 24 Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {spotlightCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className="group relative p-4 rounded-xl bg-[#0D0F17] hover:bg-[#141722] border border-white/5 hover:border-white/15 transition-all duration-200 overflow-hidden shadow-lg"
              >
                <div
                  className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10 blur-xl group-hover:opacity-20 transition-opacity"
                  style={{ backgroundColor: cat.accent }}
                />
                <div className="flex items-center justify-between mb-3">
                  <div
                    className="p-2.5 rounded-lg bg-white/5 group-hover:scale-110 transition-transform"
                    style={{ color: cat.accent }}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase px-2 py-0.5 rounded bg-black/40 border border-white/5">
                    Cat #{cat.id}
                  </span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-gray-400 line-clamp-2 mt-1 leading-snug">
                  {cat.description}
                </p>
                <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-400 group-hover:text-white">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 8. Popular Anime */}
      {anime.length > 0 && (
        <EditorialSection
          badge="ANIME ARCHIVE"
          title="Popular Anime &amp; Animation"
          subtitle="Subbed &amp; dubbed anime episodes in master quality"
          viewAllLink="/category/21"
          items={anime}
          categoryType="movie"
        />
      )}

      {/* 9. Professional Courses & Tutorials */}
      <EditorialSection
        badge="DIGITAL ACADEMY"
        title="Educational Courses &amp; Skill Mastery"
        subtitle="Software engineering, AI modeling, graphics design, and enterprise certification curriculums"
        viewAllLink="/category/12"
        items={courses.length > 0 ? courses : latest.filter(c => c.category === 'course')}
        categoryType="course"
      />

      {/* 10. PC Gaming & Emulators */}
      <EditorialSection
        badge="GAMING VAULT"
        title="PC Games &amp; Digital Resources"
        subtitle="High-speed direct game archives, ISOs, and update packages without speed throttling"
        viewAllLink="/category/13"
        items={games.length > 0 ? games : latest.filter(c => c.category === 'game')}
        categoryType="game"
      />

      {/* 11. Essential Desktop Software */}
      <EditorialSection
        badge="SOFTWARE REPOSITORY"
        title="Essential Software &amp; Operating Systems"
        subtitle="Clean developer toolchains, utilities, creative suites, and system packages"
        viewAllLink="/category/11"
        items={software.length > 0 ? software : latest.filter(c => c.category === 'software')}
        categoryType="software"
      />
    </div>
  );
}
