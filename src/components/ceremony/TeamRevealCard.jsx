import React, { useState, useEffect } from 'react';
import { getRankBadgeColors, getRankLabel, formatScore, toPersianDigits } from '../../utils/formatting';
import { Award, Users, Building, Sparkles } from 'lucide-react';

export const TeamRevealCard = ({ team, usePersian = true }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const badgeStyle = getRankBadgeColors(team.rank);

  // Score counter animation
  useEffect(() => {
    let start = 0;
    const end = team.score;
    const duration = 1200;
    const startTime = performance.now();

    const updateScore = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / duration);
      // Ease out cubic
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

  const displayRank = usePersian ? toPersianDigits(team.rank) : team.rank;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto h-full min-h-[70vh] select-none animate-fade-in">
      {/* Background Volumetric Aura */}
      <div
        className={`absolute w-80 h-80 rounded-full blur-[100px] pointer-events-none opacity-40 ${
          team.rank === 3 ? 'bg-amber-600/30' : 'bg-cyan-500/25'
        }`}
      />

      {/* Main Card */}
      <div
        className={`relative w-full max-w-3xl py-10 px-8 rounded-3xl bg-slate-950/85 border-2 ${badgeStyle.border} ${badgeStyle.shadow} backdrop-blur-2xl overflow-hidden`}
      >
        {/* Subtle Ambient Sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-sweep pointer-events-none" />

        {/* Rank Header Ribbon */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-slate-900/90 border border-slate-700 shadow-md mb-8">
          <Award className={`w-5 h-5 ${badgeStyle.text}`} />
          <span className={`text-base md:text-xl font-bold ${badgeStyle.text}`}>
            {getRankLabel(team.rank)}
          </span>
        </div>

        {/* Big Rank Number & Badge */}
        <div className="flex items-center justify-center mb-6">
          <div
            className={`w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-gradient-to-tr ${badgeStyle.badgeBg} flex items-center justify-center shadow-2xl relative`}
          >
            <span className="text-5xl md:text-6xl font-black font-numeric text-slate-950 drop-shadow-md">
              {displayRank}
            </span>
          </div>
        </div>

        {/* Team Name */}
        <h2 className="text-3xl md:text-6xl font-black text-white tracking-tight mb-6 drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          {team.name}
        </h2>

        {/* Team Meta: Organization & Members */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mb-8 text-slate-300 text-sm md:text-base">
          {team.org && (
            <div className="flex items-center gap-2 bg-slate-900/70 px-4 py-2 rounded-xl border border-slate-800">
              <Building className="w-4 h-4 text-cyan-400" />
              <span>{team.org}</span>
            </div>
          )}
          {team.members && (
            <div className="flex items-center gap-2 bg-slate-900/70 px-4 py-2 rounded-xl border border-slate-800">
              <Users className="w-4 h-4 text-purple-400" />
              <span>{team.members}</span>
            </div>
          )}
        </div>

        {/* Final Score Section */}
        <div className="inline-flex flex-col items-center justify-center px-10 py-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-inner">
          <span className="text-xs md:text-sm text-slate-400 font-semibold mb-1 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            امتیاز نهایی کسب‌شده
          </span>
          <div className="text-4xl md:text-6xl font-black font-numeric text-amber-300 text-glow-gold">
            {formatScore(animatedScore, usePersian)}
          </div>
        </div>
      </div>
    </div>
  );
};
