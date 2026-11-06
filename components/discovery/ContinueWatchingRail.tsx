'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Clock, X, ChevronRight } from 'lucide-react';
import { ViewingProgress, Content } from '@/lib/types/content';
import { formatDuration } from '@/lib/utils';

interface ContinueItem extends ViewingProgress {
  title?: string;
  posterUrl?: string;
}

export function ContinueWatchingRail() {
  const [items, setItems] = useState<ContinueItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(async (data: ViewingProgress[]) => {
        if (!Array.isArray(data) || data.length === 0) {
          setItems([]);
          return;
        }

        // Fetch details for first 6 items to get artwork and title
        const enriched = await Promise.all(
          data.slice(0, 6).map(async (prog) => {
            try {
              const res = await fetch(`/api/media/${prog.contentId}`);
              if (res.ok) {
                const content: Content = await res.json();
                return {
                  ...prog,
                  title: content.name || content.title,
                  posterUrl: content.backdropUrl || content.posterUrl
                };
              }
            } catch (e) {
              // fallback
            }
            return {
              ...prog,
              title: prog.contentId.replace(/^cftp_/, 'Title #')
            };
          })
        );

        setItems(enriched);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || items.length === 0) return null;

  return (
    <section className="py-8 border-b border-white/5">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              Continue Watching
            </h2>
          </div>
          <Link
            href="/continue-watching"
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map(item => {
            const percent = item.durationSeconds > 0
              ? Math.min(100, Math.floor((item.currentTimeSeconds / item.durationSeconds) * 100))
              : 0;

            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -4 }}
                className="group relative rounded-xl overflow-hidden bg-[#0D0F17] border border-white/8 hover:border-emerald-500/40 transition-all shadow-lg"
              >
                <Link href={`/movie/${item.contentId}`} className="block relative aspect-[16/9] w-full bg-[#141722] overflow-hidden">
                  {item.posterUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.posterUrl}
                      alt={item.title || ''}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-500">
                      <Play className="w-8 h-8 opacity-40" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Play Hover Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Timestamp Badge */}
                  <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono text-gray-300">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-emerald-400" />
                      {formatDuration(item.currentTimeSeconds)}
                    </span>
                    <span>{percent}%</span>
                  </div>

                  {/* Progress Line */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10">
                    <div className="h-full bg-emerald-500 transition-all" style={{ width: `${percent}%` }} />
                  </div>
                </Link>

                <div className="p-3 flex items-center justify-between">
                  <div className="min-w-0 pr-2">
                    <h4 className="text-xs font-semibold text-white truncate group-hover:text-emerald-400 transition-colors">
                      {item.title}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-mono">
                      {item.episodeId ? 'Series Episode' : 'Feature Title'}
                    </span>
                  </div>
                  <Link
                    href={`/movie/${item.contentId}`}
                    className="p-1.5 rounded-lg bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

