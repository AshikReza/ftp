'use client';

import React, { useState } from 'react';
import { INITIAL_LIVE_CHANNELS } from '@/lib/data/live-channels';
import { LiveChannel } from '@/lib/types/content';
import { Tv, Play, Radio, Signal, Heart, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

export default function LiveTVPage() {
  const [channels] = useState<LiveChannel[]>(INITIAL_LIVE_CHANNELS);
  const [selectedChannel, setSelectedChannel] = useState<LiveChannel>(INITIAL_LIVE_CHANNELS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ['All', 'Sports', 'News', 'Entertainment', 'Infotainment'];

  const filteredChannels = channels.filter(ch => {
    if (activeCategory !== 'All' && ch.category !== activeCategory) return false;
    return true;
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="mb-8">
        <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-semibold mb-1 block">
          BROADCAST DIRECTORY
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Authorized Live Television
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          High-throughput, low-latency live channels streaming across authorized BDIX network peering
        </p>
      </div>

      {/* Main Player & Channel Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Video Player */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl flex items-center justify-center">
            <video
              key={selectedChannel.id}
              src={selectedChannel.streamUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs text-white">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span className="font-bold tracking-wider uppercase text-[10px]">LIVE</span>
              <span className="text-gray-400">•</span>
              <span className="font-mono text-gray-300">{selectedChannel.quality}</span>
            </div>
          </div>

          {/* Selected Channel Metadata */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-[#0D0F17] border border-white/8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 overflow-hidden flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedChannel.logo}
                  alt={selectedChannel.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">
                  {selectedChannel.name}
                </h3>
                <span className="text-xs text-gray-400">
                  {selectedChannel.category} • BDIX High Priority
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => toggleFavorite(selectedChannel.id, e)}
                className={`p-2 rounded-lg border transition-colors ${
                  favorites.includes(selectedChannel.id)
                    ? 'bg-red-500/20 text-red-400 border-red-500/30'
                    : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
                }`}
              >
                <Heart className={`w-4 h-4 ${favorites.includes(selectedChannel.id) ? 'fill-red-500' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Channel Directory */}
        <div className="flex flex-col bg-[#0D0F17] border border-white/8 rounded-2xl p-4 sm:p-5 h-[580px]">
          <div className="flex items-center justify-between pb-3 border-b border-white/5 mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-emerald-400" />
              Channel Lineup
            </h4>
            <span className="text-xs text-emerald-400 font-mono">
              {filteredChannels.length} Online
            </span>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 pb-3 border-b border-white/5 overflow-x-auto no-scrollbar mb-3">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? 'bg-emerald-600 text-white font-bold'
                    : 'bg-white/5 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Channel items list */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredChannels.map(ch => {
              const isSelected = selectedChannel.id === ch.id;
              return (
                <div
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'bg-emerald-600/15 border-emerald-500/40 text-white'
                      : 'bg-white/5 border-transparent hover:border-white/10 hover:bg-white/10 text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded bg-white/10 overflow-hidden flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ch.logo} alt={ch.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="truncate">
                      <h5 className="text-xs font-bold truncate">{ch.name}</h5>
                      <span className="text-[10px] text-gray-400 block font-mono">{ch.quality}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    )}
                    <button
                      onClick={(e) => toggleFavorite(ch.id, e)}
                      className="text-gray-400 hover:text-red-400 p-1"
                    >
                      <Heart className={`w-3.5 h-3.5 ${favorites.includes(ch.id) ? 'fill-red-500 text-red-500' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
