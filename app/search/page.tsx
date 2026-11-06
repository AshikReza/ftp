'use client';

import React, { useState, useEffect } from 'react';
import { Search, Loader2, Film, Tv, BookOpen, Gamepad2, Laptop, ChevronRight } from 'lucide-react';
import { Content } from '@/lib/types/content';
import { MovieCard } from '@/components/cards/MovieCard';
import { SeriesCard } from '@/components/cards/SeriesCard';
import { CourseCard } from '@/components/cards/CourseCard';
import { GameCard } from '@/components/cards/GameCard';
import { SoftwareCard } from '@/components/cards/SoftwareCard';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'movies' | 'series' | 'courses' | 'games' | 'software'>('all');

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.all || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const filtered = results.filter(r => {
    if (activeTab === 'all') return true;
    if (activeTab === 'movies') return r.category === 'movie' || r.category === 'anime';
    if (activeTab === 'series') return r.category === 'series';
    if (activeTab === 'courses') return r.category === 'course';
    if (activeTab === 'games') return r.category === 'game';
    if (activeTab === 'software') return r.category === 'software' || r.category === 'app';
    return true;
  });

  const renderCard = (item: Content) => {
    switch (item.category) {
      case 'series': return <SeriesCard key={item.id} series={item} />;
      case 'course': return <CourseCard key={item.id} course={item} />;
      case 'game': return <GameCard key={item.id} game={item} />;
      case 'software':
      case 'app': return <SoftwareCard key={item.id} software={item} />;
      default: return <MovieCard key={item.id} movie={item} />;
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Search Input Hero */}
      <div className="max-w-3xl mx-auto mb-10 text-center">
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Global BDIX Search
        </h1>
        <p className="text-sm text-gray-400 mb-6">
          Instantly query tens of thousands of indexed movies, TV shows, anime episodes, courses, games &amp; software.
        </p>

        <div className="relative flex items-center bg-[#0D0F17] border border-white/10 rounded-2xl shadow-2xl p-2 group focus-within:border-red-500/50 transition-colors">
          <Search className="w-5 h-5 text-gray-400 ml-3 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type any movie, series, game, software, instructor..."
            className="w-full bg-transparent text-white px-3 py-2 text-sm sm:text-base outline-none font-medium placeholder-gray-500"
            autoFocus
          />
          {loading && <Loader2 className="w-5 h-5 text-red-500 animate-spin mr-3 flex-shrink-0" />}
        </div>
      </div>

      {/* Tabs */}
      {results.length > 0 && (
        <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'all', label: `All (${results.length})` },
            { id: 'movies', label: 'Movies & Anime' },
            { id: 'series', label: 'Series' },
            { id: 'courses', label: 'Courses' },
            { id: 'games', label: 'Games' },
            { id: 'software', label: 'Software' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
                  : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Results grid */}
      {query && !loading && filtered.length === 0 && (
        <div className="py-20 text-center text-gray-500">
          <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filtered.map(renderCard)}
      </div>
    </div>
  );
}

