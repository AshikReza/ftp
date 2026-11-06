'use client';

import React, { useState } from 'react';
import { Settings, Shield, Sliders, HardDrive, Check } from 'lucide-react';

export default function SettingsPage() {
  const [autoplay, setAutoplay] = useState(true);
  const [preferVlc, setPreferVlc] = useState(false);
  const [bdixSpeedCap, setBdixSpeedCap] = useState('Unlimited (Line Rate)');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/8">
        <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300">
          <Settings className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Playback &amp; Ecosystem Settings
          </h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Configure default streaming preferences, external protocol handlers &amp; BDIX options
          </p>
        </div>
      </div>

      <div className="space-y-6 bg-[#0D0F17] border border-white/8 rounded-2xl p-6 sm:p-8 shadow-2xl">
        {/* Playback Autoplay */}
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div>
            <h4 className="text-sm font-semibold text-white">Autoplay Next Episode</h4>
            <p className="text-xs text-gray-400 mt-0.5">Automatically stream the next TV or anime episode upon conclusion</p>
          </div>
          <button
            onClick={() => setAutoplay(!autoplay)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${autoplay ? 'bg-red-600' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${autoplay ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* External Player Default */}
        <div className="flex items-center justify-between py-3 border-b border-white/5">
          <div>
            <h4 className="text-sm font-semibold text-white">Prefer External Player Launch</h4>
            <p className="text-xs text-gray-400 mt-0.5">Prompt desktop launch (VLC/PotPlayer/MPV) automatically for MKV/HEVC files</p>
          </div>
          <button
            onClick={() => setPreferVlc(!preferVlc)}
            className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${preferVlc ? 'bg-red-600' : 'bg-white/10'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${preferVlc ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        {/* Bandwidth Priority */}
        <div className="py-3 border-b border-white/5">
          <h4 className="text-sm font-semibold text-white mb-1">BDIX Throughput Profile</h4>
          <p className="text-xs text-gray-400 mb-3">Control localized Internet Exchange cache buffering behavior</p>
          <select
            value={bdixSpeedCap}
            onChange={e => setBdixSpeedCap(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white outline-none cursor-pointer"
          >
            <option value="Unlimited (Line Rate)" className="bg-[#0D0F17]">Unlimited (Line Rate • 10 Gbps Peering)</option>
            <option value="Balanced High-Def" className="bg-[#0D0F17]">Balanced High-Def (100 Mbps Smooth)</option>
            <option value="Conserve Bandwidth" className="bg-[#0D0F17]">Conserve Bandwidth (Standard HD 1080p)</option>
          </select>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold text-xs shadow-lg shadow-red-600/30 transition-all"
          >
            {saved ? <Check className="w-4 h-4 text-white" /> : null}
            <span>{saved ? 'Preferences Saved' : 'Save Preferences'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

