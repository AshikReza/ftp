'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Gamepad2, Download, HardDrive } from 'lucide-react';
import { Content } from '@/lib/types/content';

interface GameCardProps {
  game: Content;
}

export function GameCard({ game }: GameCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-[#0D0F17] border border-white/8 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-500/10 transition-all duration-300"
    >
      <Link href={`/game/${game.id}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-[#141722]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={game.posterUrl}
          alt={game.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-transparent to-black/20 opacity-80" />

        {/* Top platform badge */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-600 text-white shadow-md flex items-center gap-1">
            <Gamepad2 className="w-3 h-3" />
            PC / CONSOLE
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white/90 backdrop-blur-sm border border-white/10">
            High Speed
          </span>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-gray-300 font-mono">
          <span className="flex items-center gap-1 text-cyan-300">
            <HardDrive className="w-3.5 h-3.5" />
            Direct Storage
          </span>
          <span>{game.year || 'Game'}</span>
        </div>
      </Link>

      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/game/${game.id}`}>
            <h3 className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors line-clamp-1" title={game.name}>
              {game.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
            {game.overview}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-[11px] text-gray-400 font-mono">Verified Mirror</span>
          <Link
            href={`/game/${game.id}`}
            className="flex items-center gap-1 text-cyan-400 font-medium hover:underline text-[11px]"
          >
            <Download className="w-3 h-3" />
            Download
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

