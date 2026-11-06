'use client';

import React, { useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import {
  Film,
  Tv,
  BookOpen,
  Gamepad2,
  Laptop,
  Download,
  Copy,
  Check,
  Bookmark,
  Share2,
  ExternalLink,
  ShieldCheck,
  HardDrive,
  Calendar,
  Eye,
  FileText,
  Clock,
  Cpu,
  Monitor,
  Disc,
  CheckCircle2,
  ChevronDown,
  Sparkles,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Content } from '@/lib/types/content';
import { MediaPlayer } from '@/components/player/MediaPlayer';

interface ContentDetailsProps {
  content: Content;
}

export function ContentDetails({ content }: ContentDetailsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const posterRef = useRef<HTMLDivElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [expandedModule, setExpandedModule] = useState<number | null>(0);

  // GSAP Entrance
  useGSAP(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(posterRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out'
      });
      gsap.from(infoRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.8,
        delay: 0.15,
        ease: 'power3.out'
      });
    }, containerRef);
    return () => ctx.revert();
  }, [content]);

  const copyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleBookmark = async () => {
    try {
      if (!bookmarked) {
        await fetch('/api/watchlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(content)
        });
        setBookmarked(true);
      } else {
        await fetch(`/api/watchlist?contentId=${content.id}`, { method: 'DELETE' });
        setBookmarked(false);
      }
      window.dispatchEvent(new Event('watchlist_updated'));
    } catch (err) {
      console.error(err);
    }
  };

  const isStreamable = content.type === 'singleVideo' || content.type === 'series';

  // Demo curriculum for course category
  const courseCurriculum = [
    {
      title: 'Module 1: Orientation & Foundations',
      duration: '45m',
      lessons: [
        '01. Environment Setup & Tooling Installation (12m)',
        '02. Core Architecture Overview & Design Patterns (18m)',
        '03. First Practical Implementation & Code walkthrough (15m)'
      ]
    },
    {
      title: 'Module 2: Core Engineering & Deep Dive',
      duration: '1h 35m',
      lessons: [
        '04. State Management, APIs, and Data Pipelines (25m)',
        '05. Asynchronous Workflows & Performance Optimization (30m)',
        '06. Database Schema Design & Caching Strategies (40m)'
      ]
    },
    {
      title: 'Module 3: Production Testing, Security & Deployment',
      duration: '1h 10m',
      lessons: [
        '07. Security Auditing, JWT, and Access Control (22m)',
        '08. Automated Testing & Continuous Integration (28m)',
        '09. Production Deployment, Monitoring & Scaling (20m)'
      ]
    }
  ];

  return (
    <div ref={containerRef} className="relative min-h-screen bg-[#08090D] pt-24 pb-24">
      {/* Dynamic atmospheric backdrop artwork */}
      <div
        className="absolute top-0 left-0 right-0 h-[65vh] bg-cover bg-center pointer-events-none opacity-20 filter blur-2xl"
        style={{ backgroundImage: `url(${content.backdropUrl || content.posterUrl})` }}
      />
      <div className="absolute top-0 left-0 right-0 h-[65vh] bg-gradient-to-b from-transparent via-[#08090D]/80 to-[#08090D] pointer-events-none" />

      <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header / Info Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-10">
          {/* Left Poster Column */}
          <div ref={posterRef} className="w-full lg:w-72 xl:w-80 flex-shrink-0">
            <div className="relative aspect-[2/3] w-full max-w-[280px] mx-auto lg:max-w-none rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-[#141722]">
              <img
                src={content.posterUrl}
                alt={content.name || content.title}
                className="w-full h-full object-cover"
              />
              {content.quality && (
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                  {content.quality}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-center gap-2 mt-4 max-w-[280px] mx-auto lg:max-w-none">
              <button
                type="button"
                onClick={toggleBookmark}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
                  bookmarked
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border-white/5'
                }`}
              >
                <Bookmark className="w-4 h-4" />
                <span>{bookmarked ? 'Saved' : 'Watchlist'}</span>
              </button>

              <button
                type="button"
                onClick={copyLink}
                className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-colors"
                title="Copy Page URL"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Right Editorial Info Column */}
          <div ref={infoRef} className="flex-1 min-w-0">
            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase bg-red-600/20 text-red-400 border border-red-500/30">
                {content.primaryCategoryName}
              </span>
              {content.year && (
                <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                  <Calendar className="w-3.5 h-3.5" />
                  {content.year}
                </span>
              )}
              {content.views ? (
                <span className="flex items-center gap-1 text-xs text-gray-400 font-mono">
                  <Eye className="w-3.5 h-3.5" />
                  {content.views.toLocaleString()} views
                </span>
              ) : null}
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-4">
              {content.name || content.title}
            </h1>

            {/* Description */}
            <div className="prose prose-invert max-w-3xl mb-6">
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {content.overview ||
                  'High-speed digital resource indexed across regional gigabit peering mirrors. Verified clean release.'}
              </p>
            </div>

            {/* Meta details list */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-white/5 border border-white/5 max-w-2xl mb-6 text-xs">
              <div>
                <span className="text-gray-500 block">Content Type</span>
                <span className="text-white font-mono font-semibold capitalize">{content.type}</span>
              </div>
              <div>
                <span className="text-gray-500 block">Storage Source</span>
                <span className="text-white font-mono font-semibold">BDIX Storage</span>
              </div>
              <div>
                <span className="text-gray-500 block">Status</span>
                <span className="text-emerald-400 font-mono font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified &amp; Clean
                </span>
              </div>
            </div>

            {/* Tags */}
            {content.tags && content.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 mb-6">
                {content.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[11px] bg-white/5 text-gray-400 border border-white/5"
                  >
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {/* Download Links / Non-streamable direct files */}
            {!isStreamable && content.mediaFiles.length > 0 && (
              <div className="flex flex-col gap-3 p-5 rounded-2xl bg-[#0D0F17] border border-white/10 max-w-2xl mb-8">
                <div className="flex items-center gap-2">
                  <Download className="w-5 h-5 text-emerald-400" />
                  <h4 className="text-base font-bold text-white">Authorized Download Mirrors</h4>
                </div>
                <p className="text-xs text-gray-400">
                  Direct gigabit download mirrors with multi-thread acceleration support.
                </p>
                <div className="space-y-2 mt-2">
                  {content.mediaFiles.map((file, idx) => (
                    <a
                      key={file.id || idx}
                      href={file.url}
                      download
                      className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs text-white transition-colors group"
                    >
                      <span className="font-medium truncate group-hover:text-emerald-400 transition-colors">
                        {file.title || `Download Mirror ${idx + 1}`}
                      </span>
                      <div className="flex items-center gap-2 text-emerald-400 font-mono text-[11px] flex-shrink-0">
                        <span>Direct Download</span>
                        <Download className="w-4 h-4" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Category Enhancement: Course Curriculum Accordion */}
            {content.category === 'course' && (
              <div className="mt-8 border-t border-white/8 pt-8 max-w-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-indigo-400" />
                    <h3 className="text-lg font-bold text-white tracking-tight">Course Curriculum &amp; Modules</h3>
                  </div>
                  <span className="text-xs text-gray-400 font-mono">3 Modules • 9 Lessons</span>
                </div>

                <div className="space-y-3">
                  {courseCurriculum.map((mod, mIdx) => {
                    const isExpanded = expandedModule === mIdx;
                    return (
                      <div
                        key={mIdx}
                        className="rounded-xl border border-white/8 bg-[#0D0F17] overflow-hidden transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => setExpandedModule(isExpanded ? null : mIdx)}
                          className="w-full p-4 text-left flex items-center justify-between hover:bg-white/[0.02] transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-md bg-indigo-500/10 text-indigo-400 font-mono text-xs font-bold flex items-center justify-center">
                              0{mIdx + 1}
                            </span>
                            <span className="text-sm font-semibold text-white">{mod.title}</span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-gray-400 font-mono">
                            <span>{mod.duration}</span>
                            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {isExpanded && (
                          <div className="p-4 pt-1 border-t border-white/5 space-y-2 bg-black/20">
                            {mod.lessons.map((lesson, lIdx) => (
                              <div
                                key={lIdx}
                                className="flex items-center justify-between p-2 rounded-lg text-xs text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                              >
                                <div className="flex items-center gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{lesson}</span>
                                </div>
                                <span className="text-[10px] text-gray-500 font-mono">Video</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Category Enhancement: Game / Software System Requirements */}
            {(content.category === 'game' || content.category === 'software') && (
              <div className="mt-8 border-t border-white/8 pt-8 max-w-3xl">
                <div className="flex items-center gap-2 mb-4">
                  <Cpu className="w-5 h-5 text-cyan-400" />
                  <h3 className="text-lg font-bold text-white tracking-tight">System Requirements &amp; Architecture</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Minimum */}
                  <div className="p-4 rounded-xl bg-[#0D0F17] border border-white/8">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider font-mono block mb-3">
                      Minimum Requirements
                    </span>
                    <ul className="space-y-2 text-xs text-gray-300 font-mono">
                      <li className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">OS:</span>
                        <span>Windows 10 64-bit</span>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">Processor:</span>
                        <span>Intel Core i5-6600K / Ryzen 5 1600</span>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">Memory:</span>
                        <span>8 GB RAM</span>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">Graphics:</span>
                        <span>GTX 1060 (6GB) / RX 580</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">DirectX:</span>
                        <span>Version 12</span>
                      </li>
                    </ul>
                  </div>

                  {/* Recommended */}
                  <div className="p-4 rounded-xl bg-[#0D0F17] border border-white/8">
                    <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider font-mono block mb-3">
                      Recommended Requirements
                    </span>
                    <ul className="space-y-2 text-xs text-gray-300 font-mono">
                      <li className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">OS:</span>
                        <span>Windows 11 64-bit</span>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">Processor:</span>
                        <span>Intel Core i7-10700K / Ryzen 7 5800X</span>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">Memory:</span>
                        <span>16 GB RAM</span>
                      </li>
                      <li className="flex justify-between border-b border-white/5 pb-1">
                        <span className="text-gray-500">Graphics:</span>
                        <span>RTX 3070 (8GB) / RX 6800</span>
                      </li>
                      <li className="flex justify-between">
                        <span className="text-gray-500">Storage:</span>
                        <span>High-Speed SSD</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Video Player Section for Movies & Series */}
        {isStreamable && (
          <div className="mt-8 border-t border-white/8 pt-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-4 flex items-center gap-2">
              <Film className="w-5 h-5 text-red-500" />
              <span>Cinematic Playback Experience</span>
            </h2>
            <MediaPlayer content={content} />
          </div>
        )}
      </div>
    </div>
  );
}
