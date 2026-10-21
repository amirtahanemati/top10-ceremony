import React, { useState, useEffect } from 'react';
import { Medal, Sparkles, Building, Users } from 'lucide-react';
import { formatScore, toPersianDigits } from '../../utils/formatting';

export const RunnerUpRevealCard = ({ team, usePersian = true }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = team.score;
    const duration = 1300;
    const startTime = performance.now();

    const updateScore = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setAnimatedScore(start + (end - start) * eased);

      if (progress < 1) {
        requestAnimationFrame(updateScore);
      } else {
        setAnimatedScore(end);
      }
    };

    requestAnimationFrame(updateScore);
  }, [team.score]);

  const displayRank = usePersian ? toPersianDigits(2) : '2';

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto h-full min-h-[75vh] select-none">
      {/* Silver Volumetric Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-gradient-to-tr from-slate-400/20 via-cyan-400/15 to-blue-500/15 rounded-full blur-[130px] pointer-events-none" />

      {/* Main Runner Up Card */}
      <div className="relative w-full max-w-4xl py-12 px-8 md:px-12 rounded-3xl bg-slate-950/90 border-2 border-slate-300/80 box-glow-silver backdrop-blur-3xl overflow-hidden">
        {/* Shimmer sweep effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent animate-sweep pointer-events-none" />

        {/* Runner-Up Badge */}
        <div className="relative inline-flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-slate-600/30 via-slate-400/40 to-slate-600/30 border border-slate-300 text-slate-100 shadow-xl mb-8">
          <Medal className="w-7 h-7 text-slate-200" />
          <span className="text-xl md:text-3xl font-black tracking-wider drop-shadow-md">
            نایب قهرمان مسابقه
          </span>
        </div>

        {/* Rank 2 Medallion */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-26 h-26 md:w-32 md:h-32 rounded-full bg-gradient-to-tr from-slate-200 via-slate-300 to-zinc-400 flex items-center justify-center shadow-[0_0_45px_rgba(203,213,225,0.6)] border-4 border-white relative">
            <span className="text-5xl md:text-7xl font-black font-numeric text-slate-950">
              {displayRank}
            </span>
          </div>
        </div>

        {/* Team Name */}
        <h2 className="text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300 tracking-tight mb-8 drop-shadow-[0_0_30px_rgba(255,255,255,0.5)]">
          {team.name}
        </h2>

        {/* Team Details */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8 text-slate-300 text-base md:text-lg">
          {team.org && (
            <div className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-2xl border border-slate-700/60">
              <Building className="w-5 h-5 text-slate-300" />
              <span>{team.org}</span>
            </div>
          )}
          {team.members && (
            <div className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-2xl border border-slate-700/60">
              <Users className="w-5 h-5 text-slate-300" />
              <span>{team.members}</span>
            </div>
          )}
        </div>

        {/* Score Display */}
        <div className="inline-flex flex-col items-center justify-center px-12 py-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border-2 border-slate-400/60 shadow-2xl">
          <span className="text-sm md:text-base text-slate-300 font-bold mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-slate-200" />
            امتیاز درخشان نایب قهرمانی
          </span>
          <div className="text-4xl md:text-6xl font-black font-numeric text-slate-100 drop-shadow-md">
            {formatScore(animatedScore, usePersian)}
          </div>
        </div>
      </div>
    </div>
  );
};
