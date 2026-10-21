import React, { useState } from 'react';
import { CEREMONY_PHASES } from '../../hooks/useCeremonyEngine';
import { getRankLabel } from '../../utils/formatting';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  RotateCcw,
  Zap,
  Trophy,
  ExternalLink,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Keyboard,
  Clock,
  Flame,
} from 'lucide-react';

export const CeremonyControls = ({
  engine,
  config,
  onConfigChange,
  isFullscreen,
  onToggleFullscreen,
}) => {
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const {
    phase,
    currentStepIndex,
    currentStep,
    currentTeam,
    sequenceSteps,
    isPaused,
    startCeremony,
    togglePause,
    nextStep,
    prevStep,
    replayCurrentStep,
    instantReveal,
    jumpToFinalTable,
    resetCeremony,
  } = engine;

  const isIdle = phase === CEREMONY_PHASES.IDLE;
  const isFinalTable = phase === CEREMONY_PHASES.FINAL_TABLE;

  // Open independent projector stage window
  const openProjectorWindow = () => {
    const url = `${window.location.origin}${window.location.pathname}?mode=stage`;
    window.open(
      url,
      'CeremonyStageWindow',
      'width=1280,height=720,menubar=no,toolbar=no,location=no,status=no'
    );
  };

  // Phase badge label and color
  const getPhaseDetails = () => {
    switch (phase) {
      case CEREMONY_PHASES.IDLE:
        return { label: 'در انتظار شروع', color: 'bg-slate-700 text-slate-200' };
      case CEREMONY_PHASES.INTRO:
        return { label: 'تیتراژ آغازین', color: 'bg-blue-600 text-white animate-pulse' };
      case CEREMONY_PHASES.COUNTDOWN:
        return { label: 'شمارش معکوس', color: 'bg-cyan-600 text-white animate-pulse' };
      case CEREMONY_PHASES.SCROLLING:
        return { label: 'اسکرول نام‌ها', color: 'bg-indigo-600 text-white' };
      case CEREMONY_PHASES.SLOWING:
        return { label: 'کاهش سرعت اسکرول', color: 'bg-purple-600 text-white' };
      case CEREMONY_PHASES.DRAMATIC_PAUSE:
        return { label: 'مکث نهایی پیش از رونمایی', color: 'bg-amber-600 text-white' };
      case CEREMONY_PHASES.REVEAL:
      case CEREMONY_PHASES.HOLDING:
        return { label: `رونمایی ${getRankLabel(currentStep.rank)}`, color: 'bg-emerald-600 text-white' };
      case CEREMONY_PHASES.FINALE_PREP:
        return { label: 'آماده‌سازی فینال ۲ تیم برتر', color: 'bg-amber-500 text-slate-950 font-bold' };
      case CEREMONY_PHASES.CHAMPION_REVEAL:
        return { label: 'رونمایی قهرمان مسابقه (رتبه اول)', color: 'bg-yellow-400 text-slate-950 font-black' };
      case CEREMONY_PHASES.RUNNER_UP_REVEAL:
        return { label: 'رونمایی نایب‌قهرمان (رتبه دوم)', color: 'bg-slate-300 text-slate-950 font-black' };
      case CEREMONY_PHASES.FINAL_TABLE:
        return { label: 'جدول کامل ۱۰ تیم برتر', color: 'bg-teal-500 text-slate-950 font-bold' };
      case CEREMONY_PHASES.PAUSED:
        return { label: 'متوقف‌شده', color: 'bg-red-600 text-white' };
      default:
        return { label: phase, color: 'bg-slate-800 text-slate-300' };
    }
  };

  const phaseDetails = getPhaseDetails();

  return (
    <div className="flex flex-col gap-6 text-right select-none animate-fade-in">
      {/* Live Stage Status Monitor Box */}
      <div className="p-6 rounded-3xl bg-slate-950/90 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-amber-500" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">وضعیت زنده صحنه:</span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${phaseDetails.color}`}>
                {phaseDetails.label}
              </span>
              {isPaused && (
                <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 text-xs font-bold border border-red-500/30 animate-pulse">
                  PAUSED
                </span>
              )}
            </div>
            <h2 className="text-xl md:text-3xl font-black text-white tracking-tight flex items-center gap-2">
              <span>گام فعلی:</span>
              <span className="text-cyan-400">
                {currentStep.type === 'rank'
                  ? `${getRankLabel(currentStep.rank)}`
                  : currentStep.type === 'champion'
                  ? 'رونمایی تیم قهرمان (رتبه ۱)'
                  : currentStep.type === 'runner_up'
                  ? 'رونمایی نایب‌قهرمان (رتبه ۲)'
                  : currentStep.type === 'finale_prep'
                  ? 'آماده‌سازی فینال'
                  : 'جدول کامل اختتامیه'}
              </span>
            </h2>
            {currentTeam && currentStep.type !== 'final_table' && currentStep.type !== 'finale_prep' && (
              <p className="text-xs md:text-sm text-slate-400">
                تیم در حال نمایش: <strong className="text-slate-200">{currentTeam.name}</strong> (امتیاز داوری: {currentTeam.score})
              </p>
            )}
          </div>

          {/* Quick Dual-Screen / Fullscreen launchers */}
          <div className="flex items-center gap-2.5 self-end md:self-auto">
            <button
              onClick={openProjectorWindow}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white border border-slate-700 shadow transition font-semibold text-xs md:text-sm cursor-pointer"
              title="باز کردن صحنه مراسم در پنجره مستقل برای ویدیو پروژکتور"
            >
              <ExternalLink className="w-4 h-4" />
              <span>پنجره نمایش پروژکتور</span>
            </button>

            <button
              onClick={onToggleFullscreen}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition text-xs md:text-sm"
              title="تمام‌صفحه (F)"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Step Progression Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>پیشرفت مراحل اختتامیه:</span>
            <span className="font-numeric font-bold text-cyan-400">
              مرحله {currentStepIndex + 1} از {sequenceSteps.length}
            </span>
          </div>
          <div className="grid grid-cols-11 gap-1.5 h-2.5 rounded-full overflow-hidden bg-slate-900 p-0.5">
            {sequenceSteps.map((s, idx) => {
              const isPast = idx < currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              let bg = "bg-slate-800";
              if (isPast) bg = "bg-cyan-600/70";
              if (isCurrent) bg = "bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]";
              if (s.type === 'champion' && (isPast || isCurrent)) bg = "bg-yellow-400";
              if (s.type === 'runner_up' && (isPast || isCurrent)) bg = "bg-slate-300";

              return (
                <div
                  key={idx}
                  className={`h-full rounded-sm transition-all duration-300 ${bg}`}
                  title={`مرحله ${idx + 1}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Big Control Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
        {/* Start / Pause / Resume */}
        {isIdle ? (
          <button
            onClick={startCeremony}
            className="col-span-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-black text-base md:text-lg shadow-xl shadow-emerald-950 flex items-center justify-center gap-3 transition cursor-pointer transform hover:scale-[1.02]"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>شروع رسمی مراسم</span>
          </button>
        ) : (
          <button
            onClick={togglePause}
            className={`col-span-2 py-4 px-6 rounded-2xl font-black text-base md:text-lg shadow-xl flex items-center justify-center gap-3 transition cursor-pointer transform hover:scale-[1.02] ${
              isPaused
                ? 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-emerald-950'
                : 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-amber-950'
            }`}
          >
            {isPaused ? <Play className="w-6 h-6 fill-current" /> : <Pause className="w-6 h-6 fill-current" />}
            <span>{isPaused ? "ادامه اجرای مراسم" : "توقف موقت مراسم"}</span>
          </button>
        )}

        {/* Next Step */}
        <button
          onClick={nextStep}
          disabled={isFinalTable}
          className={`py-4 px-4 rounded-2xl border font-bold text-sm md:text-base flex items-center justify-center gap-2 transition ${
            isFinalTable
              ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-cyan-300 hover:text-white shadow cursor-pointer'
          }`}
          title="مرحله بعد (کلید جهت‌نما راست)"
        >
          <SkipForward className="w-5 h-5" />
          <span>مرحله بعد</span>
        </button>

        {/* Previous Step */}
        <button
          onClick={prevStep}
          disabled={currentStepIndex === 0}
          className={`py-4 px-4 rounded-2xl border font-bold text-sm md:text-base flex items-center justify-center gap-2 transition ${
            currentStepIndex === 0
              ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300 hover:text-white shadow cursor-pointer'
          }`}
          title="مرحله قبل (کلید جهت‌نما چپ)"
        >
          <SkipBack className="w-5 h-5" />
          <span>مرحله قبل</span>
        </button>

        {/* Replay Current Step */}
        <button
          onClick={replayCurrentStep}
          disabled={isIdle}
          className="py-4 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow transition cursor-pointer"
          title="اجرای مجدد مرحله جاری (R)"
        >
          <RotateCcw className="w-5 h-5 text-amber-400" />
          <span>اجرای مجدد</span>
        </button>

        {/* Instant Reveal (Skip suspense scroll) */}
        <button
          onClick={instantReveal}
          disabled={isIdle || isFinalTable}
          className="py-4 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-amber-300 hover:text-amber-200 font-bold text-sm md:text-base flex items-center justify-center gap-2 shadow transition cursor-pointer"
          title="رونمایی آنی بدون انتظار برای اسکرول"
        >
          <Zap className="w-5 h-5 text-amber-400" />
          <span>رونمایی فوری</span>
        </button>
      </div>

      {/* Secondary Fast Jumps & Execution Mode */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Jump directly to final leaderboard */}
        <button
          onClick={jumpToFinalTable}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-200 flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition">
              <Trophy className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="block font-bold text-sm text-white">پرش مستقیم به جدول نهایی</span>
              <span className="block text-xs text-slate-400">نمایش یکپارچه کارنامه تمام ۱۰ تیم</span>
            </div>
          </div>
          <SkipForward className="w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition" />
        </button>

        {/* Auto Advance Mode Switch */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="block font-bold text-sm text-white">حالت اجرای خودکار</span>
              <span className="block text-xs text-slate-400">
                {config.autoAdvance ? "پیشروی خودکار با زمان‌سنج" : "کنترل دستی با دکمه و کیبورد"}
              </span>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={config.autoAdvance}
              onChange={(e) => onConfigChange({ ...config, autoAdvance: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
          </label>
        </div>

        {/* Reset to Start */}
        <button
          onClick={() => setResetConfirmOpen(true)}
          className="p-4 rounded-2xl bg-slate-900/80 hover:bg-red-950/40 border border-slate-800 hover:border-red-500/40 text-slate-400 hover:text-red-300 flex items-center justify-between transition group"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 group-hover:scale-110 transition">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="text-right">
              <span className="block font-bold text-sm text-white group-hover:text-red-200">
                بازنشانی کامل مراسم
              </span>
              <span className="block text-xs text-slate-400">بازگشت به صفحه آماده‌سازی اول</span>
            </div>
          </div>
        </button>
      </div>

      {/* Keyboard Shortcuts Cheatsheet Card */}
      <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Keyboard className="w-4 h-4 text-cyan-400" />
          <span>کلیدهای میانبر مجری در حین اجرای زنده:</span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono font-bold">Space</kbd>
            <span>توقف / ادامه</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono font-bold">→</kbd>
            <span>مرحله بعد</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono font-bold">←</kbd>
            <span>مرحله قبل</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono font-bold">R</kbd>
            <span>تکرار مرحله</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono font-bold">M</kbd>
            <span>قطع/وصل صدا</span>
          </span>
          <span className="flex items-center gap-1.5">
            <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-slate-200 font-mono font-bold">F</kbd>
            <span>تمام‌صفحه</span>
          </span>
        </div>
      </div>

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full text-right shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-2">تأیید بازنشانی وضعیت مراسم</h3>
            <p className="text-sm text-slate-300 mb-6">
              آیا مطمئن هستید که می‌خواهید مراسم را از گام اول و صفحه آغازین بازنشانی کنید؟ در طول پخش زنده این کار مراحل را از نو آغاز خواهد کرد.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl text-slate-400 hover:text-white text-sm"
              >
                انصراف
              </button>
              <button
                onClick={() => {
                  resetCeremony();
                  setResetConfirmOpen(false);
                }}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm shadow-lg"
              >
                بله، بازنشانی مراسم
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
