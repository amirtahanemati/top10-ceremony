import React from 'react';
import { soundEngine } from '../../services/soundEngine';
import {
  Volume2,
  VolumeX,
  Play,
  CheckCircle,
  Sparkles,
  Music,
  Headphones,
  Sliders,
  Bell,
  Crown,
  Medal,
  Trophy,
} from 'lucide-react';

export const AudioSettings = ({ config, onConfigChange }) => {
  const isMuted = config.enableSound === false;

  const handleMuteToggle = () => {
    const next = !isMuted;
    soundEngine.setMuted(next);
    onConfigChange({ ...config, enableSound: !next });
  };

  const handleVolumeChange = (channel, val) => {
    const num = parseFloat(val);
    const updated = { ...config, [channel]: num };
    onConfigChange(updated);
    soundEngine.setVolumes({
      master: updated.masterVolume,
      sfx: updated.sfxVolume,
      music: updated.musicVolume,
    });
  };

  const playTest = (type) => {
    soundEngine.init();
    soundEngine.testSound(type);
  };

  return (
    <div className="flex flex-col gap-6 text-right select-none animate-fade-in">
      {/* Sound System Status & Master Switch */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">موتور صوتی استودیویی (Web Audio API)</h3>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>۱۰۰٪ آفلاین و آماده</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              تولید سینتایزری با کیفیت برودکست، تأخیر صفر میلی‌ثانیه و بدون وابستگی به اینترنت
            </p>
          </div>
        </div>

        <button
          onClick={handleMuteToggle}
          className={`px-5 py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 shadow-lg transition cursor-pointer ${
            isMuted
              ? 'bg-red-600/30 border border-red-500/60 text-red-300 hover:bg-red-600/40'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
          }`}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          <span>{isMuted ? "صدا قطع است (فعالسازی)" : "سیستم صوتی فعال است"}</span>
        </button>
      </div>

      {/* Volume Channel Sliders */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <h3 className="text-base font-bold text-white mb-5 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <span>کانال‌های کنترل شدت صدا</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Master Volume */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-cyan-400" />
                صدای کلی (Master):
              </span>
              <span className="font-numeric font-bold text-cyan-400 text-sm">
                {Math.round((config.masterVolume ?? 0.85) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.masterVolume ?? 0.85}
              onChange={(e) => handleVolumeChange('masterVolume', e.target.value)}
              className="w-full accent-cyan-500 cursor-pointer"
            />
          </div>

          {/* SFX Volume */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Bell className="w-4 h-4 text-purple-400" />
                جلوه‌های صوتی و ضربه‌ها (SFX):
              </span>
              <span className="font-numeric font-bold text-purple-400 text-sm">
                {Math.round((config.sfxVolume ?? 0.9) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.sfxVolume ?? 0.9}
              onChange={(e) => handleVolumeChange('sfxVolume', e.target.value)}
              className="w-full accent-purple-500 cursor-pointer"
            />
          </div>

          {/* Music Volume */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
              <span className="flex items-center gap-1.5">
                <Music className="w-4 h-4 text-amber-400" />
                موسیقی و فضاپردازی (Music):
              </span>
              <span className="font-numeric font-bold text-amber-400 text-sm">
                {Math.round((config.musicVolume ?? 0.7) * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.musicVolume ?? 0.7}
              onChange={(e) => handleVolumeChange('musicVolume', e.target.value)}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Soundboard Preview & Testing */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>میز آزمایش و پیش‌نمایش افکت‌های صوتی مسابقه</span>
        </h3>
        <p className="text-xs text-slate-400 mb-5">
          پیش از اجرای رسمی، خروجی صداها را تست کنید تا از اتصال باندها و سطح صدای مناسب مطمئن شوید:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => playTest('start')}
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-right flex items-center justify-between transition group cursor-pointer"
          >
            <div>
              <span className="block font-bold text-xs md:text-sm text-white">۱. شروع مراسم</span>
              <span className="block text-[11px] text-slate-400">بیس دراپ سینمایی</span>
            </div>
            <Play className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition" />
          </button>

          <button
            onClick={() => playTest('countdown')}
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-right flex items-center justify-between transition group cursor-pointer"
          >
            <div>
              <span className="block font-bold text-xs md:text-sm text-white">۲. شمارش معکوس</span>
              <span className="block text-[11px] text-slate-400">بوق پالس زمانی</span>
            </div>
            <Play className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition" />
          </button>

          <button
            onClick={() => playTest('tick')}
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-right flex items-center justify-between transition group cursor-pointer"
          >
            <div>
              <span className="block font-bold text-xs md:text-sm text-white">۳. تیک اسکرول</span>
              <span className="block text-[11px] text-slate-400">حرکت نام تیم‌ها</span>
            </div>
            <Play className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition" />
          </button>

          <button
            onClick={() => playTest('reveal')}
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-right flex items-center justify-between transition group cursor-pointer"
          >
            <div>
              <span className="block font-bold text-xs md:text-sm text-white">۴. ضربه رونمایی</span>
              <span className="block text-[11px] text-slate-400">انفجار و ووش رتبه‌ها</span>
            </div>
            <Play className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition" />
          </button>

          <button
            onClick={() => playTest('champion')}
            className="p-3.5 rounded-xl bg-amber-950/30 hover:bg-amber-900/40 border border-amber-500/40 text-right flex items-center justify-between transition group cursor-pointer"
          >
            <div>
              <span className="block font-bold text-xs md:text-sm text-yellow-300">۵. مارش قهرمان</span>
              <span className="block text-[11px] text-amber-400/80">فانفار زرین رتبه اول</span>
            </div>
            <Crown className="w-4 h-4 text-yellow-400 group-hover:scale-125 transition" />
          </button>

          <button
            onClick={() => playTest('runnerUp')}
            className="p-3.5 rounded-xl bg-slate-800/40 hover:bg-slate-700/50 border border-slate-500/40 text-right flex items-center justify-between transition group cursor-pointer"
          >
            <div>
              <span className="block font-bold text-xs md:text-sm text-slate-200">۶. مارش نایب‌قهرمان</span>
              <span className="block text-[11px] text-slate-400">تم نقره‌ای رتبه دوم</span>
            </div>
            <Medal className="w-4 h-4 text-slate-300 group-hover:scale-125 transition" />
          </button>

          <button
            onClick={() => playTest('table')}
            className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-right flex items-center justify-between transition group cursor-pointer"
          >
            <div>
              <span className="block font-bold text-xs md:text-sm text-white">۷. ورود جدول نهایی</span>
              <span className="block text-[11px] text-slate-400">گلیساندوی پایانی</span>
            </div>
            <Trophy className="w-4 h-4 text-cyan-400 group-hover:scale-125 transition" />
          </button>
        </div>
      </div>
    </div>
  );
};
