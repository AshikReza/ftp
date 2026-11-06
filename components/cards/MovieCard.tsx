'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Bookmark, Star, Clock } from 'lucide-react';
import { Content } from '@/lib/types/content';

interface MovieCardProps {
  movie: Content;
  priority?: boolean;
}

export function MovieCard({ movie }: MovieCardProps) {
  const [bookmarked, setBookmarked] = React.useState(false);

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!bookmarked) {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(movie)
        });
        setBookmarked(true);
      } else {
        await fetch(`/api/watchlist?contentId=${movie.id}`, { method: 'DELETE' });
        setBookmarked(false);
      }
    } catch (err) {
      console.error('Watchlist toggle failed:', err);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-[#0D0F17] border border-white/8 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/10 transition-all duration-300"
    >
      <Link href={`/movie/${movie.id}`} className="block relative aspect-[2/3] w-full overflow-hidden bg-[#141722]">
        {/* Poster Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={movie.posterUrl}
          alt={movie.name || movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Badges on Top */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          {movie.quality ? (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-600/90 text-white shadow-md">
              {movie.quality}
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-black/60 text-white/90 backdrop-blur-sm border border-white/10">
              BDIX
            </span>
          )}

          <button
            onClick={toggleBookmark}
            aria-label="Add to watchlist"
            className="p-1.5 rounded-full bg-black/60 hover:bg-red-600 text-white/90 backdrop-blur-md border border-white/10 transition-colors"
          >
            <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-red-500 text-red-500' : ''}`} />
          </button>
        </div>

        {/* Play Action Overlay Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-xl shadow-red-600/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Year and Language bottom overlay */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-gray-300 font-mono">
          <span>{movie.year || 'Cinema'}</span>
          {movie.views ? (
            <span className="text-gray-400">{movie.views} views</span>
          ) : null}
        </div>
      </Link>

      {/* Card Info */}
      <div className="p-3 flex flex-col flex-1">
        <Link href={`/movie/${movie.id}`}>
          <h3 className="text-sm font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-1" title={movie.name}>
            {movie.name}
          </h3>
        </Link>
        <p className="text-[11px] text-gray-400 line-clamp-1 mt-1">
          {movie.primaryCategoryName}
        </p>
      </div>
    </motion.div>
  );
}

