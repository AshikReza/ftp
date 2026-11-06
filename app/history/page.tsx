'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Film, Trash2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { ViewingProgress } from '@/lib/types/content';
import { formatDuration } from '@/lib/utils';

export default function HistoryPage() {
  const [history, setHistory] = useState<ViewingProgress[]>([]);

  useEffect(() => {
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => {
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/8">
        <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Viewing &amp; Playback History
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
            Log of previously streamed digital titles and learning sessions
          </p>
        </div>
      </div>

      {history.length === 0 ? (
        <div className="py-24 text-center text-gray-500 max-w-md mx-auto">
          <Clock className="w-12 h-12 stroke-[1.5] mx-auto mb-3 text-gray-600" />
          <h3 className="text-base font-bold text-white mb-1">No History Recorded</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Content you stream will automatically appear in your chronological viewing record.
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
        <div className="space-y-3">
          {history.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 rounded-xl bg-[#0D0F17] border border-white/5 hover:border-white/10 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">
                    {item.contentId.replace(/^cftp_/, 'BDIX Item #')}
                  </h4>
                  <span className="text-xs text-gray-400 font-mono">
                    Watched up to {formatDuration(item.currentTimeSeconds)} • Last accessed {new Date(item.lastWatchedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <Link
                href={`/movie/${item.contentId}`}
                className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-medium text-xs border border-white/10 transition-colors"
              >
                Watch Again
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

