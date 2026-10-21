import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Building, Users, Flame } from 'lucide-react';
import { formatScore, toPersianDigits } from '../../utils/formatting';

export const ChampionRevealCard = ({ team, usePersian = true }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = team.score;
    const duration = 1400;
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

  const displayRank = usePersian ? toPersianDigits(1) : '1';

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-5xl mx-auto h-full min-h-[75vh] select-none">
      {/* Massive Golden Volumetric Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/25 via-yellow-400/20 to-orange-500/20 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Champion Card */}
      <div className="relative w-full max-w-4xl py-12 px-8 md:px-12 rounded-3xl bg-slate-950/90 border-2 border-amber-400/80 box-glow-gold backdrop-blur-3xl overflow-hidden">
        {/* Shimmer sweep effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-300/15 to-transparent animate-sweep pointer-events-none" />

        {/* Crown & Champion Badge */}
        <div className="relative inline-flex items-center gap-3 px-8 py-3 rounded-full bg-gradient-to-r from-amber-500/30 via-yellow-500/40 to-amber-500/30 border border-amber-400 text-amber-300 shadow-xl mb-8">
          <Crown className="w-7 h-7 text-yellow-300 animate-bounce" />
          <span className="text-xl md:text-3xl font-black tracking-wider text-glow-gold">
            قهرمان مسابقه
          </span>
          <Flame className="w-6 h-6 text-orange-400" />
        </div>

        {/* Rank 1 Big Medallion */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-28 h-28 md:w-36 md:h-36 rounded-full bg-gradient-to-tr from-yellow-300 via-amber-400 to-amber-600 flex items-center justify-center shadow-[0_0_50px_rgba(245,158,11,0.7)] border-4 border-yellow-200 relative">
            <span className="text-6xl md:text-8xl font-black font-numeric text-slate-950">
              {displayRank}
            </span>
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-white animate-spin" style={{ animationDuration: '8s' }} />
          </div>
        </div>

        {/* Champion Team Name */}
        <h1 className="text-4xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-amber-300 tracking-tight mb-8 drop-shadow-[0_0_35px_rgba(251,191,36,0.6)]">
          {team.name}
        </h1>

        {/* Team Details */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8 text-slate-200 text-base md:text-lg">
          {team.org && (
            <div className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-2xl border border-amber-500/30">
              <Building className="w-5 h-5 text-amber-400" />
              <span>{team.org}</span>
            </div>
          )}
          {team.members && (
            <div className="flex items-center gap-2 bg-slate-900/80 px-5 py-2.5 rounded-2xl border border-amber-500/30">
              <Users className="w-5 h-5 text-amber-400" />
              <span>{team.members}</span>
            </div>
          )}
        </div>

        {/* Champion Score Display */}
        <div className="inline-flex flex-col items-center justify-center px-12 py-5 rounded-2xl bg-gradient-to-b from-amber-950/60 to-slate-900/90 border-2 border-amber-500/60 shadow-2xl">
          <span className="text-sm md:text-base text-amber-300/90 font-bold mb-1 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            امتیاز زرین قهرمانی
          </span>
          <div className="text-5xl md:text-7xl font-black font-numeric text-yellow-300 text-glow-gold">
            {formatScore(animatedScore, usePersian)}
          </div>
        </div>
      </div>
    </div>
  );
};
