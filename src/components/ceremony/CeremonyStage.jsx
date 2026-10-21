import React from 'react';
import { ParticleBackground } from './ParticleBackground';
import { StageIntro } from './StageIntro';
import { StageCountdown } from './StageCountdown';
import { TeamNameScroller } from './TeamNameScroller';
import { TeamRevealCard } from './TeamRevealCard';
import { ChampionRevealCard } from './ChampionRevealCard';
import { RunnerUpRevealCard } from './RunnerUpRevealCard';
import { FinalLeaderboard } from './FinalLeaderboard';
import { CEREMONY_PHASES } from '../../hooks/useCeremonyEngine';
import { Flame, Pause, Trophy } from 'lucide-react';

export const CeremonyStage = ({
  phase,
  currentStep,
  currentTeam,
  countdownNum,
  teams,
  config,
  isPaused,
  onStart,
}) => {
  const usePersian = config.usePersianDigits !== false;

  return (
    <div className="relative w-full min-h-screen bg-[#04060c] text-slate-100 overflow-hidden flex flex-col justify-center items-center select-none font-sans">
      {/* Dynamic Particle & Volumetric Canvas Background */}
      <ParticleBackground
        theme={config.theme}
        active={config.enableParticles !== false}
      />

      {/* Atmospheric Vignette & Corner Shadows */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none z-[1] opacity-70" />

      {/* Presentation Stage Content Router */}
      <main className="relative z-10 w-full h-full flex flex-col items-center justify-center py-6 px-4">
        {/* PHASE: IDLE (Pre-start) */}
        {phase === CEREMONY_PHASES.IDLE && (
          <StageIntro config={config} onStart={onStart} />
        )}

        {/* PHASE: INTRO (Cinematic Title Card) */}
        {phase === CEREMONY_PHASES.INTRO && (
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto h-full min-h-[70vh] animate-fade-in">
            <div className="w-24 h-24 rounded-3xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center box-glow-cyan mb-8 animate-pulse">
              <Trophy className="w-12 h-12 text-cyan-300" />
            </div>
            <h1 className="text-3xl md:text-6xl font-black text-white text-glow-cyan mb-4 tracking-tight">
              ۱۰ تیم برتر مسابقه
            </h1>
            <p className="text-lg md:text-2xl text-cyan-400/90 font-bold">
              آغاز آیین رسمی رونمایی و معرفی برترین‌ها
            </p>
          </div>
        )}

        {/* PHASE: COUNTDOWN */}
        {phase === CEREMONY_PHASES.COUNTDOWN && (
          <StageCountdown count={countdownNum} usePersian={usePersian} />
        )}

        {/* PHASE: SCROLLING / SLOWING / DRAMATIC_PAUSE (Ranks 10..3) */}
        {(phase === CEREMONY_PHASES.SCROLLING ||
          phase === CEREMONY_PHASES.SLOWING ||
          phase === CEREMONY_PHASES.DRAMATIC_PAUSE) && (
          <TeamNameScroller
            targetRank={currentStep.rank}
            teams={teams}
            isSlowing={phase === CEREMONY_PHASES.SLOWING}
            isDramaticPause={phase === CEREMONY_PHASES.DRAMATIC_PAUSE}
            usePersian={usePersian}
          />
        )}

        {/* PHASE: REVEAL or HOLDING (Ranks 10..3) */}
        {(phase === CEREMONY_PHASES.REVEAL || phase === CEREMONY_PHASES.HOLDING) &&
          currentStep.type === 'rank' &&
          currentTeam && (
            <TeamRevealCard team={currentTeam} usePersian={usePersian} />
          )}

        {/* PHASE: FINALE_PREP (Tension screen before Rank 1 and 2) */}
        {phase === CEREMONY_PHASES.FINALE_PREP && (
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto h-full min-h-[70vh] animate-fade-in">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-amber-500/20 border border-amber-400/60 text-amber-300 text-sm md:text-base font-bold mb-6">
              <Flame className="w-5 h-5 text-amber-400 animate-bounce" />
              <span>فینال بزرگ رقابت‌ها</span>
            </div>
            <h2 className="text-3xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-amber-500 mb-6 drop-shadow-[0_0_40px_rgba(245,158,11,0.6)]">
              تنها دو تیم باقی مانده‌اند!
            </h2>
            <p className="text-lg md:text-2xl text-slate-300 font-medium max-w-2xl">
              کدام تیم جام قهرمانی و کدام تیم نشان نایب‌قهرمانی مسابقات را به دست آورده است؟
            </p>
          </div>
        )}

        {/* PHASE: CHAMPION_REVEAL (Rank 1 Revealed First!) */}
        {phase === CEREMONY_PHASES.CHAMPION_REVEAL && currentTeam && (
          <ChampionRevealCard team={currentTeam} usePersian={usePersian} />
        )}

        {/* PHASE: RUNNER_UP_REVEAL (Rank 2 Revealed Second!) */}
        {phase === CEREMONY_PHASES.RUNNER_UP_REVEAL && currentTeam && (
          <RunnerUpRevealCard team={currentTeam} usePersian={usePersian} />
        )}

        {/* PHASE: FINAL_TABLE */}
        {phase === CEREMONY_PHASES.FINAL_TABLE && (
          <FinalLeaderboard teams={teams} config={config} />
        )}
      </main>

      {/* PAUSE OVERLAY */}
      {isPaused && (
        <div className="absolute inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex flex-col items-center justify-center select-none animate-fade-in">
          <div className="p-6 rounded-full bg-slate-900 border border-amber-500/50 text-amber-400 shadow-2xl mb-4 animate-pulse">
            <Pause className="w-12 h-12" />
          </div>
          <h3 className="text-2xl md:text-4xl font-extrabold text-white text-glow-gold mb-2">
            مراسم موقتاً متوقف شده است
          </h3>
          <p className="text-slate-400 text-sm md:text-base">
            برای ادامه، کلید Space یا دکمه «ادامه» در پنل اپراتور را بفشارید.
          </p>
        </div>
      )}
    </div>
  );
};
