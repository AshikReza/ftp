'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, GraduationCap, Download, CheckCircle2 } from 'lucide-react';
import { Content } from '@/lib/types/content';

interface CourseCardProps {
  course: Content;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-[#0D0F17] border border-white/8 hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300"
    >
      <Link href={`/course/${course.id}`} className="block relative aspect-[16/10] w-full overflow-hidden bg-[#141722]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.posterUrl}
          alt={course.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-transparent to-black/20 opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-indigo-600 text-white shadow-md flex items-center gap-1">
            <GraduationCap className="w-3 h-3" />
            ACADEMY
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white/90 backdrop-blur-sm border border-white/10">
            BDIX Fast
          </span>
        </div>

        {/* Bottom Curriculum info */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-gray-300">
          <span className="flex items-center gap-1 text-indigo-300 font-medium">
            <BookOpen className="w-3.5 h-3.5" />
            Full Course
          </span>
          <span className="text-gray-400 font-mono text-[10px]">Verified Resource</span>
        </div>
      </Link>

      <div className="p-3.5 flex flex-col flex-1 justify-between">
        <div>
          <Link href={`/course/${course.id}`}>
            <h3 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors line-clamp-2 leading-snug" title={course.name}>
              {course.name}
            </h3>
          </Link>
          <p className="text-xs text-gray-400 line-clamp-2 mt-1.5 leading-relaxed">
            {course.overview}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs">
          <span className="text-[11px] font-mono text-gray-400">Direct Download</span>
          <Link
            href={`/course/${course.id}`}
            className="flex items-center gap-1 text-indigo-400 font-medium hover:underline text-[11px]"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

