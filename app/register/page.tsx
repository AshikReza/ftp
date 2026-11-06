'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/profile');
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#0D0F17] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-red-500/20">
            <span className="font-bold text-white text-base">N</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Create NEXORA Account
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Join the ultra-premium BDIX streaming &amp; learning ecosystem
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-mono uppercase text-gray-400 block mb-1.5">
              Full Name
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs focus-within:border-red-500/50 transition-colors">
              <User className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full bg-transparent text-white placeholder-gray-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-gray-400 block mb-1.5">
              Email Address
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs focus-within:border-red-500/50 transition-colors">
              <Mail className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-transparent text-white placeholder-gray-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase text-gray-400 block mb-1.5">
              Password
            </label>
            <div className="flex items-center px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs focus-within:border-red-500/50 transition-colors">
              <Lock className="w-4 h-4 text-gray-400 mr-2.5 flex-shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-transparent text-white placeholder-gray-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition-all mt-2"
          >
            <span>{loading ? 'Creating Account...' : 'Get Started'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/5 text-center text-xs text-gray-400">
          <span>Already registered? </span>
          <Link href="/login" className="text-red-400 hover:underline font-semibold">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

