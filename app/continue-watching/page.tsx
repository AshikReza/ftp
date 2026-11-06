'use client';

import React, { useState, useEffect } from 'react';
import { Play, Clock, Film, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { ViewingProgress, Content } from '@/lib/types/content';
import { formatDuration } from '@/lib/utils';

export default function ContinueWatchingPage() {
  const [progressList, setProgressList] = useState<ViewingProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => {
        setProgressList(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 sm:pt-28 sm:pb-16">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/8">
        <div className="p-2.5 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
          <Play className="w-6 h-6 fill-emerald-500" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Continue Watching
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Resume recently streamed movies, series episodes, and tutorials
          </p>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center text-gray-400">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-red-500" />
          Loading your playback sessions...
        </div>
      ) : progressList.length === 0 ? (
        <div className="py-24 text-center text-gray-500 max-w-md mx-auto">
          <Clock className="w-12 h-12 stroke-[1.5] mx-auto mb-3 text-gray-600" />
          <h3 className="text-base font-bold text-white mb-1">No Active Playback Sessions</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            When you watch movies or series, your exact timestamps and progress are recorded here for instant resumption.
          </p>
          <Link
            href="/movies"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg transition-colors"
          >
            <span>Start Watching</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {progressList.map(item => {
            const percent = item.durationSeconds > 0
              ? Math.min(100, Math.floor((item.currentTimeSeconds / item.durationSeconds) * 100))
              : 0;
            return (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-[#0D0F17] border border-white/8 hover:border-emerald-500/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-gray-400 font-mono mb-2">
                    <span>{item.episodeId ? 'Series Episode' : 'Feature Movie'}</span>
                    <span>{percent}% Complete</span>
                  </div>
                  <h4 className="text-sm font-semibold text-white line-clamp-1 mb-1">
                    {item.contentId.replace(/^cftp_/, 'BDIX Item #')}
                  </h4>
                  <p className="text-xs text-gray-400 font-mono">
                    Resume at {formatDuration(item.currentTimeSeconds)} / {formatDuration(item.durationSeconds)}
                  </p>
                </div>

                <div className="mt-4">
                  <div className="w-full h-1.5 rounded-full bg-white/10 overflow-hidden mb-3">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <Link
                    href={`/movie/${item.contentId}`}
                    className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white font-semibold text-xs transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Resume Playback</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

