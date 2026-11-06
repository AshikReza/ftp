'use client';

import React from 'react';
import Link from 'next/link';
import { User, Bookmark, Clock, Settings, ShieldCheck, HardDrive, Play, ArrowRight } from 'lucide-react';

export default function ProfilePage() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Profile Header Card */}
      <div className="p-6 sm:p-8 rounded-2xl bg-[#0D0F17] border border-white/8 shadow-2xl mb-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 via-rose-600 to-amber-500 flex items-center justify-center text-white text-2xl font-bold shadow-xl shadow-red-500/20">
          N
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
            <h1 className="text-2xl font-bold text-white">NEXORA Member</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-red-600/20 text-red-400 border border-red-600/30 font-semibold">
              PRO ACCESS
            </span>
          </div>
          <p className="text-xs text-gray-400 font-mono">member@nexora.bdix • 10 Gbps Peering Connected</p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/settings"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-medium transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </Link>
        </div>
      </div>

      {/* Profile Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <Link href="/watchlist" className="p-5 rounded-2xl bg-[#0D0F17] border border-white/8 hover:border-red-500/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-gray-400">WATCHLIST</span>
            <Bookmark className="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-white">Manage Saved Titles</div>
          <span className="text-xs text-gray-400 mt-1 flex items-center gap-1 group-hover:text-red-400">
            Open Watchlist <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link href="/history" className="p-5 rounded-2xl bg-[#0D0F17] border border-white/8 hover:border-blue-500/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-gray-400">HISTORY</span>
            <Clock className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-white">Viewing History</div>
          <span className="text-xs text-gray-400 mt-1 flex items-center gap-1 group-hover:text-blue-400">
            View History <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>

        <Link href="/continue-watching" className="p-5 rounded-2xl bg-[#0D0F17] border border-white/8 hover:border-emerald-500/30 transition-all group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-mono text-gray-400">RESUME</span>
            <Play className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-bold text-white">Continue Watching</div>
          <span className="text-xs text-gray-400 mt-1 flex items-center gap-1 group-hover:text-emerald-400">
            Resume Media <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

