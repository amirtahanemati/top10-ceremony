import React from 'react';
import { toPersianDigits } from '../../utils/formatting';

export const StageCountdown = ({ count, usePersian = true }) => {
  const displayNum = usePersian ? toPersianDigits(count) : count;

  return (
    <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 h-full min-h-[70vh] select-none font-dana">
      {/* Background Energy Ring */}
      <div className="relative flex items-center justify-center">
        <div className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-cyan-500/20 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="absolute w-56 h-56 md:w-80 md:h-80 rounded-full border-2 border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '12s' }} />
        <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-slate-900/90 border-2 border-cyan-400/80 flex items-center justify-center box-glow-cyan backdrop-blur-xl">
          {/* Animated Countdown Digit with Rokh UltraBold font */}
          <span
            key={count}
            className="font-rokh text-7xl md:text-9xl font-black font-numeric text-cyan-300 drop-shadow-[0_0_35px_rgba(6,182,212,0.9)] animate-countdown-pop"
          >
            {displayNum}
          </span>
        </div>
      </div>

      {/* Tension text */}
      <div className="mt-10">
        <h3 className="font-peyda text-xl md:text-3xl font-extrabold text-slate-100 tracking-wide text-glow-cyan mb-2">
          شمارش معکوس آغاز مراسم
        </h3>
        <p className="font-dana text-sm md:text-base text-cyan-400/80 font-medium">
          سکوت صحنه و آغاز رقابت ۱۰ تیم برتر...
        </p>
      </div>
    </div>
  );
};
