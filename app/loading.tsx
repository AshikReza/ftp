import React from 'react';

export default function Loading() {
  return (
    <div className="w-full min-h-screen bg-[#08090D] flex flex-col pt-4 pb-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative w-full h-[60vh] max-h-[700px] rounded-3xl bg-[#0D0F17] border border-white/5 overflow-hidden animate-pulse flex items-end p-8 sm:p-12">
          <div className="space-y-4 max-w-xl">
            <div className="w-32 h-6 bg-white/10 rounded-full" />
            <div className="w-96 h-12 bg-white/10 rounded-xl" />
            <div className="w-full h-16 bg-white/5 rounded-xl" />
            <div className="flex gap-3 pt-2">
              <div className="w-36 h-11 bg-white/15 rounded-xl" />
              <div className="w-28 h-11 bg-white/10 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 w-full mt-12 space-y-4">
        <div className="flex justify-between items-center">
          <div className="w-48 h-8 bg-white/10 rounded-xl animate-pulse" />
          <div className="w-24 h-5 bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-[2/3] rounded-xl bg-[#0D0F17] border border-white/5 animate-pulse" />
          ))}
        </div>
      </div>
    </div>
  );
}

