'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Tv, Play, Bookmark } from 'lucide-react';
import { Content } from '@/lib/types/content';

interface SeriesCardProps {
  series: Content;
}

export function SeriesCard({ series }: SeriesCardProps) {
  const seasonsCount = series.seriesMetadata?.totalSeasons || 1;
  const episodesCount = series.seriesMetadata?.totalEpisodes || series.mediaFiles.length;

  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-[#0D0F17] border border-white/8 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
    >
      <Link href={`/series/${series.id}`} className="block relative aspect-[2/3] w-full overflow-hidden bg-[#141722]">
        {/* Poster Image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={series.posterUrl}
          alt={series.name || series.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-transparent to-black/30 opacity-70 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-blue-600/90 text-white shadow-md flex items-center gap-1">
            <Tv className="w-3 h-3" />
            SERIES
          </span>
          {series.quality && (
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white/90 backdrop-blur-sm border border-white/10">
              {series.quality}
            </span>
          )}
        </div>

        {/* Play Icon on Hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl shadow-blue-600/40 transform scale-75 group-hover:scale-100 transition-transform duration-300">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Episodes badge */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-gray-300 font-mono">
          <span>{seasonsCount > 1 ? `${seasonsCount} Seasons` : 'Season 1'}</span>
          <span className="text-blue-400 font-semibold">{episodesCount > 0 ? `${episodesCount} Episodes` : 'BDIX Stream'}</span>
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link href={`/series/${series.id}`}>
          <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1" title={series.name}>
            {series.name}
          </h3>
        </Link>
        <p className="text-[11px] text-gray-400 line-clamp-1 mt-1">
          {series.primaryCategoryName} {series.year ? `• ${series.year}` : ''}
        </p>
      </div>
    </motion.div>
  );
}

