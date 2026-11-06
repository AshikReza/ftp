'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Compass, Bookmark, Tv, Shield } from 'lucide-react';

export function MobileNavigation() {
  const pathname = usePathname();

  const links = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/discover', label: 'Discover', icon: Compass },
    { href: '/live-tv', label: 'Live TV', icon: Tv },
    { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
    { href: '/admin', label: 'Admin', icon: Shield },
  ];

  return (
    <nav className="sm:hidden fixed bottom-3 inset-x-3 z-40">
      <div className="bg-[#090B12]/90 backdrop-blur-2xl rounded-full px-4 py-2 border border-white/[0.05] shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center justify-around">
        {links.map(link => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-full transition-colors ${
                isActive ? 'text-red-500 font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[9px] tracking-tight">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
