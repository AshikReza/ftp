import React from 'react';
import Link from 'next/link';
import { Compass, Home, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#0D0F17] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 text-gray-400 flex items-center justify-center mx-auto mb-5">
          <Compass className="w-7 h-7 text-red-500 animate-spin-slow" />
        </div>
        <span className="text-4xl font-black text-white font-mono tracking-wider block mb-2">
          404
        </span>
        <h2 className="text-lg font-bold text-white mb-2">
          Resource Not Located
        </h2>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          The requested media item, collection, or catalog endpoint does not exist in the active BDIX index.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
          <Link
            href="/search"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-xs border border-white/10 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>Search Catalog</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

