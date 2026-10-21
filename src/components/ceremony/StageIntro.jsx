import React from 'react';
import { Trophy, Sparkles, Award } from 'lucide-react';

export const StageIntro = ({ config, onStart }) => {
  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto h-full min-h-[75vh] select-none font-dana">
      {/* Ambient Top Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Organizer badge */}
      {config.organizer && (
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-slate-900/80 border border-slate-700/60 text-slate-300 text-sm md:text-base font-peyda font-medium mb-8 backdrop-blur-md shadow-lg animate-fade-in">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>{config.organizer}</span>
        </div>
      )}

      {/* Main Trophy Graphic */}
      <div className="relative mb-10 group">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl bg-gradient-to-tr from-cyan-600/30 via-blue-600/20 to-purple-600/30 border border-cyan-400/40 flex items-center justify-center backdrop-blur-xl shadow-2xl relative overflow-hidden animate-pulse-glow">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-sweep pointer-events-none" />
          <Trophy className="w-16 h-16 md:w-20 md:h-20 text-cyan-300 drop-shadow-[0_0_25px_rgba(6,182,212,0.8)]" />
        </div>
        <div className="absolute -bottom-3 -right-3 p-2 rounded-xl bg-slate-900/90 border border-amber-500/40 text-amber-400 shadow-lg">
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
      </div>

      {/* Contest Title */}
      <h1 className="font-rokh text-3xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-cyan-200 tracking-tight leading-tight mb-6 max-w-4xl">
        {config.contestTitle || "آیین اختتامیه مسابقه"}
      </h1>

      {/* Subtitle / Suspense Message */}
      <div className="flex items-center gap-3 text-cyan-400/90 text-lg md:text-2xl font-peyda font-bold tracking-wide mb-12">
        <span className="w-12 h-[2px] bg-gradient-to-r from-transparent to-cyan-400" />
        <span>رونمایی هیجان‌انگیز از ۱۰ تیم برتر مسابقه</span>
        <span className="w-12 h-[2px] bg-gradient-to-l from-transparent to-cyan-400" />
      </div>

      {/* Ready question Callout */}
      <div className="relative px-8 py-4 rounded-2xl bg-slate-900/70 border border-slate-700/60 backdrop-blur-md">
        <p className="font-dana text-slate-200 text-base md:text-xl font-medium">
          آماده‌اید برای آغاز لحظات حساس و نفس‌گیر اعلام نتایج؟
        </p>
        <span className="inline-block mt-2 text-xs text-slate-400 font-dana">
          (کنترل کامل مراحل از طریق پنل مدیریت یا کلید Space)
        </span>
      </div>
    </div>
  );
};
