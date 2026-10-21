import React, { useState, useEffect } from 'react';
import { getRankLabel } from '../../utils/formatting';
import { Sparkles, Zap } from 'lucide-react';

export const TeamNameScroller = ({
  targetRank,
  teams,
  isSlowing = false,
  isDramaticPause = false,
  usePersian = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Pool of team names to cycle through
  const namePool = teams.map((t) => t.name);

  useEffect(() => {
    if (isDramaticPause) return;

    // Interval changes based on phase (fast rolling vs slowing down)
    const intervalMs = isSlowing ? 220 : 80;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % namePool.length);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isSlowing, isDramaticPause, namePool.length]);

  const currentDisplayName = namePool[currentIndex] || "در حال پردازش...";

  // Get previous and next names to give a 3-item reel depth
  const prevName = namePool[(currentIndex - 1 + namePool.length) % namePool.length];
  const nextName = namePool[(currentIndex + 1) % namePool.length];

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto h-full min-h-[70vh] select-none">
      {/* Target Rank Header */}
      <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-slate-900/90 border border-cyan-500/50 text-cyan-300 text-base md:text-xl font-bold mb-8 shadow-xl backdrop-blur-md">
        <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
        <span>در حال رونمایی از: {getRankLabel(targetRank)}</span>
      </div>

      {/* Main Reel Container */}
      <div className="relative w-full max-w-2xl py-8 px-6 rounded-3xl bg-slate-950/80 border border-slate-800 shadow-[0_0_60px_-15px_rgba(6,182,212,0.25)] backdrop-blur-2xl overflow-hidden">
        {/* Horizontal Scanner Beam */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none" />

        {/* Top Fade Mask */}
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />

        {/* Central Selection Reticle Lines */}
        <div className="absolute top-1/2 inset-x-4 -translate-y-1/2 h-20 md:h-24 border-y-2 border-cyan-400/60 bg-cyan-500/10 rounded-xl pointer-events-none z-10 shadow-[0_0_25px_rgba(6,182,212,0.35)] flex items-center justify-between px-3">
          <div className="w-2.5 h-6 bg-cyan-400 rounded-sm" />
          <div className="w-2.5 h-6 bg-cyan-400 rounded-sm" />
        </div>

        {/* 3D Rolling Names */}
        <div className="flex flex-col items-center justify-center gap-4 md:gap-6 py-4">
          {/* Top subtle name */}
          <div
            className={`text-slate-500 text-lg md:text-2xl font-medium transition-all duration-100 ${
              !isSlowing && !isDramaticPause ? 'blur-[1.5px] opacity-40' : 'opacity-60'
            }`}
          >
            {prevName}
          </div>

          {/* Central Active Candidate Name */}
          <div
            className={`relative z-20 py-2 px-6 text-2xl md:text-5xl font-black transition-all duration-150 transform ${
              isDramaticPause
                ? 'scale-110 text-amber-300 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)]'
                : isSlowing
                ? 'scale-105 text-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.7)]'
                : 'text-white blur-[0.6px]'
            }`}
          >
            {currentDisplayName}
          </div>

          {/* Bottom subtle name */}
          <div
            className={`text-slate-500 text-lg md:text-2xl font-medium transition-all duration-100 ${
              !isSlowing && !isDramaticPause ? 'blur-[1.5px] opacity-40' : 'opacity-60'
            }`}
          >
            {nextName}
          </div>
        </div>

        {/* Bottom Fade Mask */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Tension Phase Subtitle */}
      <div className="mt-8 flex items-center gap-3 text-slate-400 text-sm md:text-base font-medium">
        <Zap
          className={`w-4 h-4 ${
            isDramaticPause ? 'text-amber-400 animate-bounce' : 'text-cyan-400 animate-pulse'
          }`}
        />
        <span>
          {isDramaticPause
            ? "مکث نهایی... لحظه رونمایی فرا رسید!"
            : isSlowing
            ? "کاهش سرعت اسکرول... شناسایی نتیجه داوری..."
            : "گردش اسامی تیم‌های نامزد..."}
        </span>
      </div>
    </div>
  );
};
