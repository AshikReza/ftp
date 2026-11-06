'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Play,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Info
} from 'lucide-react';
import { Content } from '@/lib/types/content';

interface HeroSpotlightProps {
  items: Content[];
}

const AUTOPLAY_DURATION = 7500; // 7.5 seconds per slide

export function HeroSpotlight({ items }: HeroSpotlightProps) {
  const heroItems = items && items.length > 0 ? items.slice(0, 6) : [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [progress, setProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const artworkRef = useRef<HTMLDivElement>(null);

  const current = heroItems[currentIndex] || heroItems[0];

  // Auto-rotation timer with smooth 50ms progress update
  useEffect(() => {
    if (heroItems.length <= 1 || isPaused) return;

    const intervalTime = 50;
    const step = (intervalTime / AUTOPLAY_DURATION) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setCurrentIndex(curr => (curr + 1) % heroItems.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [heroItems.length, isPaused, currentIndex]);

  // Reset progress when index changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  // Sync watchlist state from localStorage
  useEffect(() => {
    if (!current) return;
    try {
      const stored = localStorage.getItem('nexora_watchlist');
      if (stored) {
        const list = JSON.parse(stored);
        setBookmarked(Array.isArray(list) && list.some((i: any) => i.id === current.id));
      } else {
        setBookmarked(false);
      }
    } catch {
      setBookmarked(false);
    }
  }, [current]);

  // Subtle interactive parallax on mouse move
  useGSAP(() => {
    const container = containerRef.current;
    const artwork = artworkRef.current;
    if (!container || !artwork) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const xPercent = (e.clientX - rect.left) / rect.width - 0.5;
      const yPercent = (e.clientY - rect.top) / rect.height - 0.5;

      gsap.to(artwork, {
        x: -xPercent * 16,
        y: -yPercent * 12,
        duration: 0.8,
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      gsap.to(artwork, {
        x: 0,
        y: 0,
        duration: 1,
        ease: 'power2.out',
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [currentIndex]);

  const handleSelectSlide = (idx: number) => {
    if (idx === currentIndex) return;
    setCurrentIndex(idx);
    setProgress(0);
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % heroItems.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + heroItems.length) % heroItems.length);
    setProgress(0);
  };

  const toggleWatchlist = async () => {
    if (!current) return;
    try {
      if (!bookmarked) {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(current)
        });
        setBookmarked(true);
      } else {
        await fetch(`/api/watchlist?contentId=${current.id}`, { method: 'DELETE' });
        setBookmarked(false);
      }
      window.dispatchEvent(new Event('watchlist_updated'));
    } catch (err) {
      console.error('Failed to toggle watchlist:', err);
    }
  };

  if (!current) return null;

  const targetLink =
    current.category === 'series'
      ? `/series/${current.id}`
      : current.category === 'game'
      ? `/game/${current.id}`
      : current.category === 'course'
      ? `/course/${current.id}`
      : current.category === 'software'
      ? `/software/${current.id}`
      : `/movie/${current.id}`;

  const isStreamable = current.type === 'singleVideo' || current.type === 'series';
  const rawStream = current.mediaFiles[0]?.url || current.movieMetadata?.streamUrl || '';

  // Extract clean genre / category string
  const genreList =
    current.tags && current.tags.length > 0
      ? current.tags.slice(0, 3).join(' • ')
      : current.primaryCategoryName || 'Cinema • Feature';

  // Format quality text cleanly
  const qualityText = current.quality
    ? current.quality.includes('4K') || current.quality.includes('2160')
      ? '4K UHD'
      : current.quality.includes('1080')
      ? '1080p FHD'
      : current.quality
    : '4K UHD';

  // Clean editorial synopsis
  const synopsis =
    current.overview &&
    !current.overview.includes('Indexed from BDIX') &&
    current.overview.length > 25
      ? current.overview
      : current.category === 'movie'
      ? `Experience ${current.name || current.title} in pristine master audio and high definition streaming.`
      : current.category === 'series'
      ? `Watch all complete seasons and episodes of ${current.name || current.title} in crystal-clear master quality.`
      : `Discover ${current.name || current.title} in stunning high definition.`;

  const posterImage = current.posterUrl || current.backdropUrl;

  return (
    <section
      ref={containerRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative w-full h-[88vh] min-h-[640px] max-h-[920px] overflow-hidden bg-[#08090D] flex flex-col justify-end select-none group/hero"
    >
      {/* =========================================================================
          1. FULL HERO BACKGROUND COVER WITH NATURAL ASPECT RATIO PRESERVATION
          ========================================================================= */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        
        {/* Layer A: Full-Bleed Atmospheric Base - Fills entire width with rich color/mood */}
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={`ambient-${current.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85 }}
            className="absolute inset-0 bg-cover bg-center filter blur-[80px] opacity-35 scale-110"
            style={{ backgroundImage: `url(${posterImage})` }}
          />
        </AnimatePresence>

        {/* Layer B: Main Hero Cover Artwork - Fills the background area, blended seamlessly */}
        <div ref={artworkRef} className="absolute inset-0 flex items-center justify-end">
          <AnimatePresence initial={false} mode="sync">
            <motion.div
              key={`cover-${current.id}`}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full md:w-[75%] lg:w-[68%] xl:w-[62%] h-full flex items-center justify-end"
              style={{
                // Smooth multi-edge mask: dissolves left into dark typography scrim, dissolves top and bottom into floor
                maskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 15%, black 40%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, rgba(0,0,0,0.5) 15%, black 40%, black 95%, transparent 100%), linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
                maskComposite: 'intersect',
                WebkitMaskComposite: 'destination-in'
              }}
            >
              <img
                src={posterImage}
                alt={current.name || current.title}
                className="h-full w-full object-cover object-[center_top_10%] md:object-[right_top_8%] drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)] opacity-95"
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Layer C: Cinematic Vignette Gradients for Text Contrast and Seamless Layout Integration */}
        {/* Top Vignette for Navbar Legibility */}
        <div className="absolute top-0 inset-x-0 h-36 bg-gradient-to-b from-[#08090D]/95 via-[#08090D]/50 to-transparent z-10" />

        {/* Left Side Scrim: Guarantees 100% white text contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08090D] via-[#08090D]/85 md:via-[#08090D]/55 to-transparent w-full md:w-3/5 z-10" />

        {/* Deep Bottom Floor: Seamless transition into category rails */}
        <div className="absolute bottom-0 inset-x-0 h-48 sm:h-56 bg-gradient-to-t from-[#08090D] via-[#08090D]/80 to-transparent z-10" />
      </div>

      {/* =========================================================================
          2. HERO CONTENT STAGE (Bottom-Left Waqana / Apple TV Style)
          ========================================================================= */}
      <div className="relative z-20 max-w-2xl px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={`content-${current.id}`}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Display Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.08] drop-shadow-2xl line-clamp-2">
              {current.name || current.title}
            </h1>

            {/* Metadata Line: Genres • Age • Quality • Year */}
            <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300 font-medium mt-3.5 flex-wrap">
              <span>{genreList}</span>
              <span className="px-1.5 py-0.5 rounded border border-white/20 text-xs font-mono text-gray-200">
                14+
              </span>
              <span className="px-1.5 py-0.5 rounded border border-white/20 text-xs font-mono text-emerald-400 font-bold">
                {qualityText}
              </span>
              {current.year && (
                <span className="text-xs font-mono text-gray-400">
                  {current.year}
                </span>
              )}
            </div>

            {/* Restrained 2-Line Editorial Synopsis */}
            <p className="mt-3.5 text-xs sm:text-sm text-gray-300/90 leading-relaxed max-w-xl font-normal drop-shadow-md line-clamp-2">
              {synopsis}
            </p>

            {/* Action Buttons Cluster: Pure White Play Pill + Circular Bookmark + Details + VLC */}
            <div className="mt-6 sm:mt-7 flex items-center gap-3.5 flex-wrap">
              {/* PRIMARY: Pure White Capsule Watch Button */}
              <Link
                href={targetLink}
                className="bg-white hover:bg-white/90 text-black font-bold px-7 py-3.5 rounded-full shadow-xl shadow-white/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2.5 text-sm"
              >
                <Play className="w-4 h-4 fill-black text-black" />
                <span>{isStreamable ? 'Watch Now' : 'Explore Resource'}</span>
              </Link>

              {/* SECONDARY: Circular Frosted Glass Button */}
              <button
                type="button"
                onClick={toggleWatchlist}
                className={`w-12 h-12 rounded-full border transition-all backdrop-blur-xl flex items-center justify-center hover:scale-105 active:scale-95 ${
                  bookmarked
                    ? 'bg-amber-500/25 text-amber-300 border-amber-500/50 shadow-lg shadow-amber-500/20'
                    : 'bg-white/10 hover:bg-white/20 border-white/15 text-white'
                }`}
                title={bookmarked ? 'Saved in Watchlist' : 'Add to Watchlist'}
              >
                {bookmarked ? (
                  <Check className="w-5 h-5 text-amber-400" />
                ) : (
                  <Bookmark className="w-5 h-5" />
                )}
              </button>

              {/* Tertiary: Details Link */}
              <Link
                href={targetLink}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-xl text-gray-300 hover:text-white text-xs font-semibold transition-all"
                title="View Details"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Details</span>
              </Link>

              {/* Direct VLC Player Shortcut */}
              {rawStream && (
                <a
                  href={`vlc://${rawStream}`}
                  className="hidden md:inline-flex items-center gap-1.5 px-4 py-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 backdrop-blur-xl text-gray-300 hover:text-orange-400 text-xs font-mono transition-all"
                  title="Direct stream in VLC"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>VLC</span>
                </a>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* =========================================================================
          3. FLOATING NAVIGATION CHEVRONS (Left & Right Edges)
          ========================================================================= */}
      {heroItems.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrev}
            className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 backdrop-blur-md flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95 shadow-lg"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/25 border border-white/15 backdrop-blur-md flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 shadow-xl"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* =========================================================================
          4. BOTTOM-CENTER SEGMENTED PAGINATION PROGRESS DASHES
          ========================================================================= */}
      {heroItems.length > 1 && (
        <div className="absolute bottom-8 inset-x-0 z-20 flex justify-center items-center gap-2.5">
          {heroItems.map((_, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className="relative h-1 transition-all duration-300 rounded-full overflow-hidden"
                style={{ width: isActive ? '36px' : '26px' }}
                aria-label={`Slide ${idx + 1}`}
              >
                <div
                  className={`absolute inset-0 rounded-full ${
                    isActive ? 'bg-white/30' : 'bg-white/20 hover:bg-white/50'
                  }`}
                />
                {isActive && (
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.9)]"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'linear' }}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
