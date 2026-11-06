'use client';

import React from 'react';
import Link from 'next/link';
import { BRAND_CONFIG } from '@/lib/config/brand';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/[0.04] bg-[#07080C] pt-12 pb-24 sm:pb-12 text-xs text-gray-500">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center">
                <span className="font-bold text-white text-xs">{BRAND_CONFIG.initial}</span>
              </div>
              <span className="text-sm font-bold text-white tracking-wider">{BRAND_CONFIG.name}</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-sm mb-4">
              Next-generation cinematic discovery, digital education, PC gaming vaults, and high-speed streaming platform.
            </p>
            <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>High-Throughput Peering Active</span>
            </div>
          </div>

          {/* Entertainment */}
          <div>
            <h5 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Entertainment</h5>
            <ul className="space-y-2">
              <li><Link href="/movies" className="hover:text-white transition-colors">Movies Catalog</Link></li>
              <li><Link href="/series" className="hover:text-white transition-colors">TV &amp; Web Series</Link></li>
              <li><Link href="/anime" className="hover:text-white transition-colors">Anime Vault</Link></li>
              <li><Link href="/documentaries" className="hover:text-white transition-colors">Documentaries</Link></li>
              <li><Link href="/live-tv" className="hover:text-white transition-colors">Authorized Live TV</Link></li>
            </ul>
          </div>

          {/* Knowledge & Gaming */}
          <div>
            <h5 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">Knowledge &amp; Tech</h5>
            <ul className="space-y-2">
              <li><Link href="/courses" className="hover:text-white transition-colors">Tutorials &amp; Courses</Link></li>
              <li><Link href="/games" className="hover:text-white transition-colors">PC &amp; Console Games</Link></li>
              <li><Link href="/software" className="hover:text-white transition-colors">Desktop Software</Link></li>
              <li><Link href="/apps" className="hover:text-white transition-colors">Mobile Applications</Link></li>
            </ul>
          </div>

          {/* System & Operations */}
          <div>
            <h5 className="text-white font-semibold text-xs mb-3 uppercase tracking-wider">System</h5>
            <ul className="space-y-2">
              <li><Link href="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link></li>
              <li><Link href="/admin/sync" className="hover:text-white transition-colors">Source Ingestion</Link></li>
              <li><Link href="/admin/jobs" className="hover:text-white transition-colors">Sync Jobs &amp; Logs</Link></li>
              <li><Link href="/watchlist" className="hover:text-white transition-colors">My Watchlist</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-gray-500">
          <p>© 2026 {BRAND_CONFIG.name}. All rights reserved. Indexed under authorized catalog protocols.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-gray-400">Terms of Service</span>
            <span className="hover:text-gray-400">Privacy Policy</span>
            <span className="hover:text-gray-400">DMCA Guidelines</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
