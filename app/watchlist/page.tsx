'use client';

import React, { useState, useEffect } from 'react';
import { Bookmark, Film, Play, Trash2, Loader2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { WatchlistItem } from '@/lib/types/content';
import { MovieCard } from '@/components/cards/MovieCard';

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWatchlist = async () => {
    try {
      const res = await fetch('/api/watchlist');
      const data = await res.json();
      setWatchlist(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const handleRemove = async (contentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`/api/watchlist?contentId=${contentId}`, { method: 'DELETE' });
      setWatchlist(prev => prev.filter(w => w.contentId !== contentId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/8">
        <div className="p-2.5 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30">
          <Bookmark className="w-6 h-6 fill-red-500" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Personal Watchlist &amp; Bookmarks
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Saved movies, TV series, courses, and gaming resources
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
          Loading your personal watchlist...
        </div>
      ) : watchlist.length === 0 ? (
        <div className="py-24 text-center text-gray-500 max-w-md mx-auto">
          <Bookmark className="w-12 h-12 stroke-[1.5] mx-auto mb-3 text-gray-600" />
          <h3 className="text-base font-bold text-white mb-1">Your Watchlist is Empty</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Discover films, series, tutorials, and games across NEXORA and click the bookmark icon to save them for later.
          </p>
          <Link
            href="/discover"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg transition-colors"
          >
            <span>Explore Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
          {watchlist.map(item => (
            <div key={item.id} className="relative group">
              <MovieCard movie={item.content} />
              <button
                onClick={(e) => handleRemove(item.contentId, e)}
                title="Remove from Watchlist"
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/80 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-all z-20"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

