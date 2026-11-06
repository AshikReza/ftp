'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, HardDrive, ExternalLink, Zap } from 'lucide-react';
import { DIRECT_FTP_DATA, DirectFtpCategory } from '@/lib/data/direct-ftp';

export function DirectFtpDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string>('movies');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeCategory = DIRECT_FTP_DATA.find(c => c.id === activeCategoryId) || DIRECT_FTP_DATA[0];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button matching CircleFTP style */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all font-mono ${
          isOpen
            ? 'text-pink-400 bg-pink-500/15 border border-pink-500/30 shadow-md shadow-pink-500/10'
            : 'text-white/75 hover:text-pink-400 hover:bg-white/[0.05]'
        }`}
      >
        <span>Direct Link</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-pink-400' : 'text-pink-500'}`}
        />
      </button>

      {/* Cascading 2-Column Flyout Popover with True Glassmorphism & No Ugly Scrollbars */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-full mt-3 z-50 flex rounded-2xl glass-dropdown overflow-hidden"
            style={{ width: '660px', maxWidth: '94vw' }}
          >
            {/* Left Column: Categories List */}
            <div className="w-56 bg-white/[0.02] border-r border-white/[0.06] p-2.5 space-y-1 max-h-[460px] overflow-y-auto no-scrollbar">
              <div className="px-3 py-1.5 mb-1 text-[10px] font-mono font-bold uppercase tracking-widest text-gray-400 border-b border-white/[0.04] flex items-center justify-between">
                <span>Direct Channels</span>
                <span className="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse" />
              </div>

              {DIRECT_FTP_DATA.map(cat => {
                const isActive = cat.id === activeCategoryId;
                if (!cat.hasChildren && cat.directUrl) {
                  return (
                    <a
                      key={cat.id}
                      href={cat.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onMouseEnter={() => setActiveCategoryId(cat.id)}
                      onClick={() => setIsOpen(false)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono transition-all text-left group ${
                        isActive
                          ? 'bg-pink-600/20 text-pink-300 border border-pink-500/20 shadow-sm'
                          : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                      }`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <ExternalLink className="w-3 h-3 text-gray-500 group-hover:text-pink-400 transition-colors shrink-0" />
                    </a>
                  );
                }

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onMouseEnter={() => setActiveCategoryId(cat.id)}
                    onClick={() => setActiveCategoryId(cat.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider font-mono transition-all text-left ${
                      isActive
                        ? 'bg-pink-600/25 text-pink-300 border border-pink-500/30 shadow-md shadow-pink-600/10'
                        : 'text-gray-300 hover:text-white hover:bg-white/[0.05]'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isActive ? 'text-pink-400 translate-x-0.5' : 'text-gray-600'}`} />
                  </button>
                );
              })}
            </div>

            {/* Right Column: Cascading Sub-Items (FTP Servers) */}
            <div className="flex-1 p-3.5 max-h-[460px] overflow-y-auto no-scrollbar flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between px-2 pb-2 mb-2 border-b border-white/[0.04]">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-pink-400 flex items-center gap-1.5">
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>{activeCategory.name} Mirrors</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>Gigabit Local</span>
                  </span>
                </div>

                {activeCategory.items && activeCategory.items.length > 0 ? (
                  <div className="space-y-1.5">
                    {activeCategory.items.map((item, idx) => (
                      <a
                        key={idx}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.04] hover:border-pink-500/30 transition-all group shadow-sm"
                      >
                        <span className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors truncate pr-2">
                          {item.title}
                        </span>
                        <div className="flex items-center gap-1.5 shrink-0">
                          {item.server && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-white/[0.08] text-gray-300 group-hover:text-pink-300 border border-white/[0.08] group-hover:border-pink-500/30 transition-colors">
                              {item.server}
                            </span>
                          )}
                          <ExternalLink className="w-3.5 h-3.5 text-gray-500 group-hover:text-pink-400 transition-colors" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : activeCategory.directUrl ? (
                  <div className="p-6 text-center">
                    <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                      High-speed dedicated BDIX storage repository for {activeCategory.name}
                    </p>
                    <a
                      href={activeCategory.directUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsOpen(false)}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-bold text-xs font-mono shadow-lg shadow-pink-600/30 transition-all hover:scale-105 active:scale-95"
                    >
                      <HardDrive className="w-4 h-4" />
                      <span>Launch Storage Mirror</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                ) : null}
              </div>

              {/* Bottom Peering Footer */}
              <div className="mt-3 pt-2.5 border-t border-white/[0.04] px-2 flex items-center justify-between text-[10px] font-mono text-gray-400">
                <span>Verified Direct FTP Peering</span>
                <span className="text-emerald-400 font-bold">Online • 100%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
