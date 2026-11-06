'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  Film,
  Tv,
  BookOpen,
  Gamepad2,
  Laptop,
  Play,
  ChevronRight,
  Loader2,
  History,
  Trash2,
  CornerDownLeft
} from 'lucide-react';
import Link from 'next/link';
import { Content } from '@/lib/types/content';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const RECENT_SEARCHES_KEY = 'aura_recent_searches';
const MAX_RECENT_SEARCHES = 8;

export function SearchDialog({ isOpen, onClose }: SearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Content[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  const filteredResults = activeCategory === 'all'
    ? results
    : results.filter(r => r.category === activeCategory);

  // Load recent searches on mount / open
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch {
        setRecentSearches([]);
      }
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(-1);
    } else {
      setQuery('');
      setResults([]);
      setSelectedIndex(-1);
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    setRecentSearches(prev => {
      const updated = [trimmed, ...prev.filter(t => t.toLowerCase() !== trimmed.toLowerCase())].slice(0, MAX_RECENT_SEARCHES);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {}
  };

  // Keyboard navigation (ArrowDown, ArrowUp, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === 'Escape') {
        onClose();
        return;
      }

      if (filteredResults.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev < filteredResults.length - 1 ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredResults.length - 1));
      } else if (e.key === 'Enter') {
        if (selectedIndex >= 0 && selectedIndex < filteredResults.length) {
          e.preventDefault();
          const target = filteredResults[selectedIndex];
          saveRecentSearch(query);
          onClose();
          router.push(getContentLink(target));
        } else if (query.trim()) {
          saveRecentSearch(query);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex, query, onClose, router]);

  // Scroll active item into view
  useEffect(() => {
    if (selectedIndex >= 0 && resultsContainerRef.current) {
      const activeEl = resultsContainerRef.current.children[selectedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex]);

  // Debounced live search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      setSelectedIndex(-1);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data.all || []);
        setSelectedIndex(-1);
      } catch (err) {
        console.error('Search query failed:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'movie': return <Film className="w-3.5 h-3.5 text-red-500" />;
      case 'series': return <Tv className="w-3.5 h-3.5 text-blue-500" />;
      case 'anime': return <Film className="w-3.5 h-3.5 text-purple-500" />;
      case 'course': return <BookOpen className="w-3.5 h-3.5 text-indigo-400" />;
      case 'game': return <Gamepad2 className="w-3.5 h-3.5 text-cyan-400" />;
      case 'software':
      case 'app': return <Laptop className="w-3.5 h-3.5 text-emerald-400" />;
      default: return <Film className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const getContentLink = (item: Content) => {
    switch (item.category) {
      case 'movie': return `/movie/${item.id}`;
      case 'series': return `/series/${item.id}`;
      case 'anime': return `/anime/${item.id}`;
      case 'course': return `/course/${item.id}`;
      case 'game': return `/game/${item.id}`;
      case 'software': return `/software/${item.id}`;
      case 'app': return `/app/${item.id}`;
      case 'documentary': return `/documentary/${item.id}`;
      default: return `/movie/${item.id}`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-2xl bg-[#0D0F17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[82vh]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center px-4 py-3.5 border-b border-white/8 gap-3 bg-[#141722]/70">
              <Search className="w-5 h-5 text-gray-400 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search movies, TV series, anime, games, software, courses..."
                className="w-full bg-transparent text-white placeholder-gray-500 text-sm sm:text-base outline-none font-medium"
              />
              {loading && <Loader2 className="w-4 h-4 text-gray-400 animate-spin flex-shrink-0" />}
              {query && !loading && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-gray-400 bg-white/5 border border-white/10 rounded">
                ESC
              </kbd>
            </div>

            {/* Category Filter Pills (When results exist) */}
            {results.length > 0 && (
              <div className="flex items-center gap-1.5 px-4 py-2 border-b border-white/5 bg-[#08090D]/50 overflow-x-auto text-xs no-scrollbar">
                {[
                  { id: 'all', label: 'All Results' },
                  { id: 'movie', label: 'Movies' },
                  { id: 'series', label: 'Series' },
                  { id: 'anime', label: 'Anime' },
                  { id: 'course', label: 'Courses' },
                  { id: 'game', label: 'Games' },
                  { id: 'software', label: 'Software' },
                ].map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                      activeCategory === cat.id
                        ? 'bg-red-500/20 text-red-400 border border-red-500/40 font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            )}

            {/* Results or Empty State View */}
            <div ref={resultsContainerRef} className="flex-1 overflow-y-auto p-2 space-y-1">
              {loading && results.length === 0 && (
                <div className="py-12 text-center text-gray-400 text-sm">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-red-500" />
                  Searching digital index...
                </div>
              )}

              {!loading && query && filteredResults.length === 0 && (
                <div className="py-12 text-center text-gray-500 text-sm">
                  No verified items found for &ldquo;{query}&rdquo;
                </div>
              )}

              {/* Default State: Recent Searches & Trending Suggestions */}
              {!query && (
                <div className="py-6 px-4 space-y-6">
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                          <History className="w-3.5 h-3.5 text-amber-400" />
                          <span>Recent Searches</span>
                        </span>
                        <button
                          type="button"
                          onClick={clearRecentSearches}
                          className="text-[11px] text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Clear</span>
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map(term => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => setQuery(term)}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 text-xs font-medium transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5 font-mono uppercase tracking-wider mb-2.5">
                      <span>Trending Searches</span>
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {['Mirzapur', 'Deadpool', 'Dune', 'GTA', 'Python', 'Anime', 'Photoshop', 'Oppenheimer'].map(term => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => setQuery(term)}
                          className="px-3 py-1.5 rounded-lg bg-white/[0.03] hover:bg-white/10 text-gray-400 hover:text-red-400 border border-white/5 text-xs font-medium transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Results List */}
              {filteredResults.map((item, idx) => {
                const isSelected = idx === selectedIndex;
                return (
                  <Link
                    key={item.id}
                    href={getContentLink(item)}
                    onClick={() => {
                      saveRecentSearch(query || item.name || item.title);
                      onClose();
                    }}
                    className={`flex items-center gap-3 p-2.5 rounded-xl transition-all group ${
                      isSelected
                        ? 'bg-red-600/20 border border-red-500/40 text-white'
                        : 'hover:bg-white/5 border border-transparent text-gray-300'
                    }`}
                  >
                    <div className="w-12 h-16 rounded-lg bg-[#141722] flex-shrink-0 overflow-hidden relative border border-white/5">
                      <img
                        src={item.posterUrl}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        loading="lazy"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {getCategoryIcon(item.category)}
                        <span className="text-[10px] font-mono uppercase text-gray-400">
                          {item.primaryCategoryName}
                        </span>
                        {item.year && (
                          <span className="text-[10px] font-mono text-gray-500">
                            • {item.year}
                          </span>
                        )}
                        {item.quality && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                            {item.quality}
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                        {item.name || item.title}
                      </h4>
                      <p className="text-xs text-gray-400 truncate mt-0.5">
                        {item.overview}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 group-hover:text-white flex-shrink-0">
                      {isSelected && (
                        <span className="text-[10px] font-mono text-red-400 hidden sm:inline flex items-center gap-0.5">
                          <CornerDownLeft className="w-3 h-3" />
                          <span>Enter</span>
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Footer Navigation Hints */}
            <div className="px-4 py-2.5 border-t border-white/5 bg-[#08090D]/80 flex items-center justify-between text-[11px] text-gray-500 font-mono">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.2 bg-white/5 rounded border border-white/10">↑</kbd>
                  <kbd className="px-1 py-0.2 bg-white/5 rounded border border-white/10">↓</kbd>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 py-0.2 bg-white/5 rounded border border-white/10">↵</kbd>
                  <span>Select</span>
                </span>
              </div>
              <span>{results.length > 0 ? `${results.length} results` : 'Instant Search'}</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
