'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  Tv,
  Film,
  BookOpen,
  Gamepad2,
  Shield,
  Menu,
  X,
  ChevronDown,
  ExternalLink,
  ArrowRight,
  Clock,
  Settings,
  Compass,
  Bell,
  Sparkles
} from 'lucide-react';
import { SearchDialog } from '@/components/discovery/SearchDialog';
import { DirectFtpDropdown } from '@/components/layout/DirectFtpDropdown';
import { CIRCLE_CATEGORIES } from '@/lib/data/categories';
import { BRAND_CONFIG } from '@/lib/config/brand';

export function Navbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [browseDropdownOpen, setBrowseDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [watchlistCount, setWatchlistCount] = useState<number>(0);

  const browseDropdownRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isHomepage = pathname === '/';

  // Sync scroll position with hysteresis to eliminate any threshold flicker
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setIsScrolled(prev => {
            if (!prev && y > 24) return true;
            if (prev && y < 8) return false;
            return prev;
          });
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update watchlist count from localStorage
  useEffect(() => {
    const updateWatchlist = () => {
      try {
        const stored = localStorage.getItem('nexora_watchlist');
        if (stored) {
          const parsed = JSON.parse(stored);
          setWatchlistCount(Array.isArray(parsed) ? parsed.length : 0);
        } else {
          setWatchlistCount(0);
        }
      } catch {
        setWatchlistCount(0);
      }
    };

    updateWatchlist();
    window.addEventListener('storage', updateWatchlist);
    window.addEventListener('watchlist_updated', updateWatchlist);
    return () => {
      window.removeEventListener('storage', updateWatchlist);
      window.removeEventListener('watchlist_updated', updateWatchlist);
    };
  }, []);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        browseDropdownRef.current &&
        !browseDropdownRef.current.contains(e.target as Node)
      ) {
        setBrowseDropdownOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(e.target as Node)
      ) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setBrowseDropdownOpen(false);
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const cinemaCategories = CIRCLE_CATEGORIES.filter(c => c.group === 'cinema');
  const seriesCategories = CIRCLE_CATEGORIES.filter(c => c.group === 'series');
  const techCategories = CIRCLE_CATEGORIES.filter(c => c.group === 'tech');
  const learningCategories = CIRCLE_CATEGORIES.filter(c => c.group === 'learning' || c.group === 'special');

  return (
    <>
      {/* Top Navbar: borderless floating glass, transparent on home fold, solid frosted on scroll/inner pages */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          isHomepage
            ? isScrolled
              ? 'bg-[#08090D]/95 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.85)]'
              : 'bg-gradient-to-b from-black/85 via-black/40 to-transparent'
            : 'bg-[#08090D]/95 backdrop-blur-2xl shadow-[0_12px_36px_rgba(0,0,0,0.85)]'
        }`}
      >
        <div className="w-full max-w-[1520px] mx-auto px-4 sm:px-8 lg:px-14 h-20 flex items-center justify-between">
          {/* 1. Left: Stylized Rounded Logo & Brand Name */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 rounded-2xl bg-white text-black font-black text-lg flex items-center justify-center shadow-lg shadow-white/10 group-hover:scale-105 transition-all">
                <span>{BRAND_CONFIG.initial}</span>
              </div>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-red-400 transition-colors">
                {BRAND_CONFIG.name}
              </span>
            </Link>
          </div>

          {/* 2. Center: Pill-based Minimalist Navigation (Waqana style) */}
          <nav className="hidden lg:flex items-center gap-1.5">
            {/* Active Pill for Home */}
            <Link
              href="/"
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                pathname === '/'
                  ? 'bg-white/15 text-white backdrop-blur-md shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Home
            </Link>

            {/* DIRECT LINK Multi-Level Cascading Flyout with True Glassmorphism */}
            <DirectFtpDropdown />

            {/* Old FTP Link */}
            <a
              href="http://main.circleftp.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Old FTP
            </a>

            {/* HD Movie Link */}
            <a
              href="http://hd.circleftp.net/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              <span>HD Movie</span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500 text-black">
                4K
              </span>
            </a>

            <Link
              href="/movies"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/movies'
                  ? 'bg-white/15 text-white backdrop-blur-md shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Movies
            </Link>

            <Link
              href="/series"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/series'
                  ? 'bg-white/15 text-white backdrop-blur-md shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Series
            </Link>

            <Link
              href="/anime"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/anime'
                  ? 'bg-white/15 text-white backdrop-blur-md shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Anime
            </Link>

            <Link
              href="/live-tv"
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                pathname === '/live-tv'
                  ? 'bg-white/15 text-white backdrop-blur-md shadow-sm'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
              }`}
            >
              Live TV
            </Link>

            {/* Browse Mega Popover - Positioned with right-0 and true glassmorphism to prevent any right-edge cut-off */}
            <div className="relative" ref={browseDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  setBrowseDropdownOpen(!browseDropdownOpen);
                  setUserMenuOpen(false);
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  browseDropdownOpen || pathname?.startsWith('/category')
                    ? 'bg-white/15 text-white backdrop-blur-md shadow-sm'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.05]'
                }`}
              >
                <span>Browse</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${browseDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Categories Glassmorphism Popover Menu */}
              <AnimatePresence>
                {browseDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-3 w-[760px] max-w-[94vw] p-6 rounded-2xl glass-dropdown z-50 overflow-hidden"
                  >
                    <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                          Catalog Channels (24)
                        </span>
                      </div>
                      <Link
                        href="/discover"
                        onClick={() => setBrowseDropdownOpen(false)}
                        className="text-[11px] font-mono text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 group"
                      >
                        <span>Explore All Vaults</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    </div>

                    <div className="grid grid-cols-4 gap-4 max-h-[440px] overflow-y-auto no-scrollbar">
                      {/* Cinema */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 uppercase tracking-wider mb-2 font-mono">
                          <Film className="w-3.5 h-3.5" />
                          <span>Cinema</span>
                        </div>
                        <ul className="space-y-1">
                          {cinemaCategories.map(cat => (
                            <li key={cat.id}>
                              <Link
                                href={`/category/${cat.id}`}
                                onClick={() => setBrowseDropdownOpen(false)}
                                className="block px-2.5 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/[0.07] transition-all group"
                              >
                                <span className="group-hover:text-red-400 transition-colors">
                                  {cat.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* TV Series */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-blue-400 uppercase tracking-wider mb-2 font-mono">
                          <Tv className="w-3.5 h-3.5" />
                          <span>TV & Shows</span>
                        </div>
                        <ul className="space-y-1">
                          {seriesCategories.map(cat => (
                            <li key={cat.id}>
                              <Link
                                href={`/category/${cat.id}`}
                                onClick={() => setBrowseDropdownOpen(false)}
                                className="block px-2.5 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/[0.07] transition-all group"
                              >
                                <span className="group-hover:text-blue-400 transition-colors">
                                  {cat.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Gaming & Tech */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-2 font-mono">
                          <Gamepad2 className="w-3.5 h-3.5" />
                          <span>Games & Tech</span>
                        </div>
                        <ul className="space-y-1">
                          {techCategories.map(cat => (
                            <li key={cat.id}>
                              <Link
                                href={`/category/${cat.id}`}
                                onClick={() => setBrowseDropdownOpen(false)}
                                className="block px-2.5 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/[0.07] transition-all group"
                              >
                                <span className="group-hover:text-emerald-400 transition-colors">
                                  {cat.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Learning & Anime */}
                      <div>
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-purple-400 uppercase tracking-wider mb-2 font-mono">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Learning</span>
                        </div>
                        <ul className="space-y-1">
                          {learningCategories.map(cat => (
                            <li key={cat.id}>
                              <Link
                                href={`/category/${cat.id}`}
                                onClick={() => setBrowseDropdownOpen(false)}
                                className="block px-2.5 py-1.5 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/[0.07] transition-all group"
                              >
                                <span className="group-hover:text-purple-400 transition-colors">
                                  {cat.name}
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/[0.04] flex items-center justify-between text-[10px] font-mono text-gray-400">
                      <span>CircleFTP Media Index</span>
                      <span className="text-emerald-400 font-bold">100% Operational</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          {/* 3. Right: Three Circular Frosted Buttons (Exact match to screenshot) */}
          <div className="flex items-center gap-3">
            {/* Circular Search Button */}
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all shadow-md hover:scale-105 active:scale-95"
              title="Search (⌘K)"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Circular Watchlist / Notification Button */}
            <Link
              href="/watchlist"
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/80 hover:text-white transition-all shadow-md relative hover:scale-105 active:scale-95"
              title="Watchlist"
            >
              <Bell className="w-4 h-4" />
              {watchlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full bg-red-600 text-[9px] font-bold text-white shadow-md">
                  {watchlistCount}
                </span>
              )}
            </Link>

            {/* User Profile Avatar with PRO Badge */}
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setBrowseDropdownOpen(false);
                }}
                className="relative flex items-center hover:scale-105 transition-all"
                title="Account & Tools"
              >
                <div className="w-10 h-10 rounded-full overflow-hidden border border-white/20 bg-gradient-to-tr from-amber-600 to-rose-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                  <span>A</span>
                </div>
                {/* PRO Badge Pill */}
                <span className="absolute -bottom-1 -right-1 px-1.5 py-0.2 rounded-full text-[8px] font-bold font-mono bg-blue-600 text-white shadow-sm border border-black/40">
                  PRO
                </span>
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-56 p-2 rounded-2xl glass-dropdown z-50 text-xs"
                  >
                    <div className="px-3 py-2 border-b border-white/[0.04] mb-1">
                      <p className="font-bold text-white">{BRAND_CONFIG.name} User</p>
                      <p className="text-[10px] text-gray-400 font-mono">Personal Vault</p>
                    </div>

                    <div className="space-y-0.5">
                      <Link
                        href="/watchlist"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                      >
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span>Watchlist</span>
                        {watchlistCount > 0 && (
                          <span className="ml-auto text-[10px] font-mono text-gray-400">
                            {watchlistCount}
                          </span>
                        )}
                      </Link>

                      <Link
                        href="/continue-watching"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5 text-blue-400" />
                        <span>Continue Watching</span>
                      </Link>

                      <Link
                        href="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                      >
                        <Shield className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Admin Ingestion</span>
                      </Link>

                      <Link
                        href="/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.05] transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-gray-400" />
                        <span>Settings</span>
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Navigation Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full hover:bg-white/[0.06] text-gray-300 hover:text-white lg:hidden transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile App-Style Menu Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden w-full border-t border-white/[0.06] bg-[#08090D]/98 backdrop-blur-3xl px-4 sm:px-6 py-5 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
              {/* Quick links grid */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/discover', label: 'Discover' },
                  { href: '/movies', label: 'Movies' },
                  { href: '/series', label: 'Series' },
                  { href: '/anime', label: 'Anime' },
                  { href: '/live-tv', label: 'Live TV' },
                  { href: '/games', label: 'Games' },
                  { href: '/software', label: 'Software' },
                  { href: '/courses', label: 'Courses' },
                ].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2.5 rounded-xl bg-white/[0.03] text-center text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/[0.07] transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Direct Link Mirrors Quick Launch for Mobile */}
              <div className="pt-3 border-t border-white/[0.04]">
                <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-pink-400 mb-2">
                  Direct Storage Mirrors
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="http://main.circleftp.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-white/[0.03] text-xs font-mono text-gray-300 flex items-center justify-between"
                  >
                    <span>Old FTP</span>
                    <ExternalLink className="w-3 h-3 text-gray-500" />
                  </a>
                  <a
                    href="http://hd.circleftp.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-xl bg-amber-500/10 text-xs font-mono text-amber-300 flex items-center justify-between"
                  >
                    <span>HD 4K Movie</span>
                    <ExternalLink className="w-3 h-3 text-amber-400" />
                  </a>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Dialog Modal */}
      <SearchDialog isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
