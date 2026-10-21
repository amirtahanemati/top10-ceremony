import React, { useState, useEffect } from 'react';
import { getRankLabel } from '../../utils/formatting';
import { CEREMONY_PHASES } from '../../hooks/useCeremonyEngine';
import { Sparkles, Zap, Flame, ShieldAlert, Heart } from 'lucide-react';

export const TeamNameScroller = ({
  targetRank,
  candidateNames = [],
  phase,
  usePersian = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [scrollCycleCount, setScrollCycleCount] = useState(0);

  // If candidateNames is empty or has 1 item, ensure safe fallback
  const names = candidateNames.length > 0 ? candidateNames : ["در حال گزینش..."];

  useEffect(() => {
    if (phase === CEREMONY_PHASES.DRAMATIC_PAUSE) return;

    let intervalMs = 50; // default hyper fast

    if (phase === CEREMONY_PHASES.TEASING) {
      intervalMs = 240; // fake slowdown teaser!
    } else if (phase === CEREMONY_PHASES.REACCEL) {
      intervalMs = 38; // hyper boost re-acceleration!
    } else if (phase === CEREMONY_PHASES.SLOWING) {
      intervalMs = 320; // final deceleration
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % names.length);
      setScrollCycleCount((prev) => prev + 1);
    }, intervalMs);

    return () => clearInterval(interval);
  }, [phase, names.length]);

  const currentDisplayName = names[currentIndex] || names[0];
  const prevName = names[(currentIndex - 1 + names.length) % names.length];
  const nextName = names[(currentIndex + 1) % names.length];

  const isTeasing = phase === CEREMONY_PHASES.TEASING;
  const isReaccel = phase === CEREMONY_PHASES.REACCEL;
  const isSlowing = phase === CEREMONY_PHASES.SLOWING;
  const isDramaticPause = phase === CEREMONY_PHASES.DRAMATIC_PAUSE;
  const isChampionDuel = targetRank === 1;

  // Status message
  let statusText = "گردش پرسرعت اسامی... گزینش از بین نامزدها";
  let statusColor = "text-cyan-400";

  if (isTeasing) {
    statusText = "کاهش ناگهانی سرعت... آیا این تیم برنده است؟!";
    statusColor = "text-amber-400 font-black animate-pulse";
  } else if (isReaccel) {
    statusText = "نه هنوز! شتاب مجدد گردونه رقابت!";
    statusColor = "text-purple-400 font-black animate-bounce";
  } else if (isSlowing) {
    statusText = "کاهش سرعت نهایی... آماده‌باش برای ثبت امتیاز!";
    statusColor = "text-amber-300 font-extrabold";
  } else if (isDramaticPause) {
    statusText = "سکوت مطلق صحنه... رونمایی قطعی!";
    statusColor = "text-yellow-300 font-black animate-pulse";
  }

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto h-full min-h-[72vh] select-none">
      {/* Target Rank Header */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
        <div
          className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full border shadow-2xl backdrop-blur-xl ${
            isChampionDuel
              ? 'bg-amber-500/20 border-amber-400 text-yellow-300 box-glow-gold'
              : 'bg-slate-900/90 border-cyan-500/60 text-cyan-300 box-glow-cyan'
          }`}
        >
          {isChampionDuel ? (
            <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
          ) : (
            <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          )}
          <span className="font-rokh font-black text-lg md:text-2xl tracking-wide">
            {isChampionDuel ? "دوئل نهایی فینال: تعیین قهرمان مسابقه" : `در حال تعیین: ${getRankLabel(targetRank)}`}
          </span>
        </div>

        {/* Remaining Candidate Count Badge */}
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-slate-900/80 border border-slate-700/80 text-slate-300 text-xs md:text-sm font-dana font-semibold">
          <ShieldAlert className="w-4 h-4 text-purple-400" />
          <span>تعداد تیم‌های باقی‌مانده در گردونه:</span>
          <span className="font-numeric font-black text-purple-300 text-base">
            {names.length} تیم
          </span>
        </div>
      </div>

      {/* Main High-Suspense Reel Container */}
      <div
        className={`relative w-full max-w-3xl py-10 px-8 rounded-3xl bg-slate-950/90 border-2 shadow-2xl backdrop-blur-3xl overflow-hidden transition-all duration-300 ${
          isDramaticPause
            ? 'border-yellow-400/90 box-glow-gold scale-105'
            : isTeasing
            ? 'border-amber-500/80 box-glow-gold'
            : isReaccel
            ? 'border-purple-500/80 box-glow-purple'
            : 'border-cyan-500/50 box-glow-cyan'
        }`}
      >
        {/* Horizontal Scanner Beam */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent pointer-events-none" />

        {/* Top Fade Mask */}
        <div className="absolute top-0 inset-x-0 h-20 bg-gradient-to-b from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none" />

        {/* Central Selection Reticle Brackets */}
        <div
          className={`absolute top-1/2 inset-x-4 -translate-y-1/2 h-24 md:h-28 border-y-2 rounded-2xl pointer-events-none z-10 flex items-center justify-between px-4 transition-all duration-200 ${
            isDramaticPause
              ? 'border-yellow-400 bg-yellow-400/15 shadow-[0_0_35px_rgba(250,204,21,0.6)]'
              : isTeasing
              ? 'border-amber-400 bg-amber-500/15 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
              : 'border-cyan-400/80 bg-cyan-500/10 shadow-[0_0_25px_rgba(6,182,212,0.4)]'
          }`}
        >
          <div className="flex items-center gap-1">
            <div className={`w-3 h-8 rounded-sm ${isDramaticPause ? 'bg-yellow-400' : 'bg-cyan-400'}`} />
            <div className={`w-1.5 h-4 rounded-sm ${isDramaticPause ? 'bg-yellow-300' : 'bg-cyan-300'}`} />
          </div>
          <div className="flex items-center gap-1">
            <div className={`w-1.5 h-4 rounded-sm ${isDramaticPause ? 'bg-yellow-300' : 'bg-cyan-300'}`} />
            <div className={`w-3 h-8 rounded-sm ${isDramaticPause ? 'bg-yellow-400' : 'bg-cyan-400'}`} />
          </div>
        </div>

        {/* 3D Rolling Names */}
        <div className="flex flex-col items-center justify-center gap-4 md:gap-7 py-6">
          {/* Top Ghost Candidate Name */}
          <div
            className={`font-dana text-slate-500 text-lg md:text-2xl font-semibold transition-all duration-100 ${
              !isSlowing && !isDramaticPause && !isTeasing ? 'blur-[2px] opacity-30' : 'opacity-50'
            }`}
          >
            {prevName}
          </div>

          {/* Central Active Candidate Name */}
          <div
            className={`relative z-20 py-2 px-6 font-rokh font-black tracking-tight transition-all duration-150 transform ${
              isDramaticPause
                ? 'scale-115 text-yellow-300 drop-shadow-[0_0_40px_rgba(250,204,21,0.9)] text-3xl md:text-6xl'
                : isTeasing
                ? 'scale-105 text-amber-300 drop-shadow-[0_0_30px_rgba(245,158,11,0.8)] text-2xl md:text-5xl'
                : isReaccel
                ? 'scale-100 text-purple-200 blur-[0.7px] text-2xl md:text-5xl'
                : isSlowing
                ? 'scale-105 text-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.7)] text-2xl md:text-5xl'
                : 'text-white blur-[1px] text-2xl md:text-5xl'
            }`}
          >
            {currentDisplayName}
          </div>

          {/* Bottom Ghost Candidate Name */}
          <div
            className={`font-dana text-slate-500 text-lg md:text-2xl font-semibold transition-all duration-100 ${
              !isSlowing && !isDramaticPause && !isTeasing ? 'blur-[2px] opacity-30' : 'opacity-50'
            }`}
          >
            {nextName}
          </div>
        </div>

        {/* Bottom Fade Mask */}
        <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent z-10 pointer-events-none" />
      </div>

      {/* Tension Phase Subtitle & Heartbeat Indicator */}
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 text-sm md:text-base font-peyda">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 animate-heartbeat shrink-0" />
          <span className="text-slate-400 font-dana text-xs">ضربان هیجان مسابقه:</span>
        </div>

        <div className="flex items-center gap-2.5 px-5 py-2 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <Zap className="w-4 h-4 text-amber-400" />
          <span className={statusColor}>{statusText}</span>
        </div>
      </div>
    </div>
  );
};
