'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('NEXORA Application error caught:', error);
  }, [error]);

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#0D0F17] border border-white/10 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 text-red-500 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          Temporary Peering or Render Error
        </h2>
        <p className="text-xs text-gray-400 mb-6 leading-relaxed">
          {error?.message || 'A network or layout error occurred while retrieving catalog resources from BDIX mirrors.'}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs transition-colors shadow-lg shadow-red-600/30"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Request</span>
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-medium text-xs border border-white/10 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

