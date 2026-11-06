'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Database,
  Search,
  Filter,
  ArrowRight,
  ExternalLink,
  Film,
  Tv,
  Gamepad2,
  BookOpen,
  Laptop,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';
import { Content } from '@/lib/types/content';

export default function AdminCatalogPage() {
  const [items, setItems] = useState<Content[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/media?limit=100')
      .then(res => res.json())
      .then(data => {
        setItems(Array.isArray(data.items) ? data.items : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter(item => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (search.trim() && !item.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/[0.06] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Link href="/admin" className="text-xs font-mono text-gray-400 hover:text-white">
              Admin
            </Link>
            <span className="text-gray-600">/</span>
            <span className="text-xs font-mono text-red-400 font-bold">Catalog</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            Indexed Catalog Registry
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Browse, inspect, and verify all titles normalized into the local PostgreSQL / JSON repository.
          </p>
        </div>

        <div className="text-xs font-mono text-gray-400">
          Showing <span className="text-white font-bold">{filtered.length}</span> of {items.length} items
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {['all', 'movie', 'series', 'anime', 'game', 'software', 'course'].map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                  : 'bg-white/[0.04] text-gray-400 hover:text-white hover:bg-white/[0.08]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by title..."
            className="w-full pl-9 pr-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.06] text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50"
          />
        </div>
      </div>

      {/* Table view */}
      <div className="rounded-2xl border border-white/[0.06] bg-[#0A0D15]/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-white/[0.02] border-b border-white/[0.04] text-gray-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Title & Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Quality</th>
                <th className="py-3 px-4">Source ID</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03] text-gray-300">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-10 rounded bg-cover bg-center shrink-0 border border-white/[0.08]"
                        style={{ backgroundImage: `url(${item.posterUrl})` }}
                      />
                      <div>
                        <p className="font-bold text-white line-clamp-1">{item.name || item.title}</p>
                        <p className="text-[10px] text-gray-500 font-mono">{item.year || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/[0.04] text-gray-300 border border-white/[0.05]">
                      {item.primaryCategoryName}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-emerald-400">
                    {item.quality || '1080p'}
                  </td>
                  <td className="py-3 px-4 font-mono text-gray-500">
                    #{item.sourceId}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Indexed</span>
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <Link
                      href={item.category === 'series' ? `/series/${item.id}` : `/movie/${item.id}`}
                      className="inline-flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-mono"
                    >
                      <span>View</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

