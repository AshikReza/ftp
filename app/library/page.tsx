'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Clock,
  Play,
  Trash2,
  Search,
  Sparkles,
  Film,
  Tv,
  Gamepad2,
  BookOpen,
  ArrowRight,
  Download,
  Share2,
  HardDrive
} from 'lucide-react';
import { Content, ViewingProgress, WatchlistItem } from '@/lib/types/content';
import { formatDuration } from '@/lib/utils';
import { MovieCard } from '@/components/cards/MovieCard';
import { SeriesCard } from '@/components/cards/SeriesCard';

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'continue' | 'watchlist' | 'history'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [progressList, setProgressList] = useState<ViewingProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [wRes, pRes] = await Promise.all([
          fetch('/api/watchlist').then(r => r.json()).catch(() => []),
          fetch('/api/progress').then(r => r.json()).catch(() => []),
        ]);
        setWatchlist(Array.isArray(wRes) ? wRes : []);
        setProgressList(Array.isArray(pRes) ? pRes : []);
      } catch (err) {
        console.error('Failed to load library:', err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleRemoveWatchlist = async (contentId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await fetch(`/api/watchlist?contentId=${contentId}`, { method: 'DELETE' });
      setWatchlist(prev => prev.filter(w => w.contentId !== contentId));
      window.dispatchEvent(new Event('watchlist_updated'));
    } catch (e) {
      console.error(e);
    }
  };

  const handleExportBackup = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify({ watchlist, progressList }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nexora_library_backup_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filter items based on search query
  const filteredWatchlist = watchlist.filter(item =>
    item.content.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.primaryCategoryName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredProgress = progressList.filter(item =>
    (item.contentTitle || item.contentId).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* 1. Header Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-red-400">
              Personal Vault
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            My Digital Library
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1 max-w-xl">
            Unified access to your saved movies, in-progress streams, and verified bookmarks.
          </p>
        </div>

        {/* Quick Tools */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportBackup}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.05] hover:bg-white/[0.1] text-gray-300 hover:text-white border border-white/[0.06] text-xs font-mono transition-all"
            title="Download JSON backup of your watchlist & progress"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Backup</span>
          </button>
        </div>
      </div>

      {/* 2. Controls & Tabs Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
          {[
            { id: 'all', label: 'All Saved', count: watchlist.length + progressList.length },
            { id: 'continue', label: 'Continue Watching', count: progressList.length },
            { id: 'watchlist', label: 'Watchlist', count: watchlist.length },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === tab.id ? 'bg-black/30 text-white' : 'bg-white/[0.08] text-gray-400'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search saved titles..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 transition-colors"
          />
        </div>
      </div>

      {/* 3. Section: Continue Watching Rail */}
      {(activeTab === 'all' || activeTab === 'continue') && filteredProgress.length > 0 && (
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Resume In-Progress Streams
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredProgress.map(p => {
              const percent = Math.min(100, Math.round((p.currentTimeSeconds / (p.durationSeconds || 1)) * 100));
              return (
                <div
                  key={p.contentId}
                  className="rounded-2xl bg-white/[0.02] border border-white/[0.06] overflow-hidden hover:border-white/[0.12] transition-all group flex flex-col justify-between"
                >
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">
                        {percent}% Watched
                      </span>
                      <span className="text-[10px] font-mono text-gray-500">
                        {formatDuration(p.currentTimeSeconds)} / {formatDuration(p.durationSeconds || 0)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition-colors line-clamp-1 mb-1">
                      {p.contentTitle || `Content ${p.contentId}`}
                    </h3>
                  </div>

                  <div>
                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-white/[0.06]">
                      <div className="h-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
                    </div>

                    <div className="p-3 bg-black/40 flex items-center justify-between">
                      <Link
                        href={`/movie/${p.contentId}`}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
                      >
                        <Play className="w-3.5 h-3.5 fill-emerald-400" />
                        <span>Resume</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 4. Section: Watchlist & Saved Catalog */}
      {(activeTab === 'all' || activeTab === 'watchlist') && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-mono">
                Saved to Watchlist ({filteredWatchlist.length})
              </h2>
            </div>
          </div>

          {filteredWatchlist.length === 0 ? (
            <div className="py-20 text-center text-gray-500 rounded-3xl bg-white/[0.02] border border-white/[0.04]">
              <Bookmark className="w-10 h-10 stroke-[1.5] mx-auto mb-3 text-gray-600" />
              <h3 className="text-base font-bold text-white mb-1">No Saved Titles Found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto mb-4">
                Browse our cinematic catalog and click the bookmark icon on any title to save it for easy access.
              </p>
              <Link
                href="/movies"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors"
              >
                <span>Explore Movies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredWatchlist.map(item => (
                <div key={item.contentId} className="relative group/item">
                  <MovieCard movie={item.content} />
                  <button
                    type="button"
                    onClick={(e) => handleRemoveWatchlist(item.contentId, e)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-black/75 hover:bg-red-600 text-white border border-white/10 opacity-0 group-hover/item:opacity-100 transition-all z-30"
                    title="Remove from Watchlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
