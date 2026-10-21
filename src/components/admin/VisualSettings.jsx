import React from 'react';
import { Palette, Clock, Type, Sparkles, Sliders, Check, Zap } from 'lucide-react';

export const VisualSettings = ({ config, onConfigChange }) => {
  const themes = [
    {
      id: 'cyber-blue',
      name: 'آبی سایبری (پیش‌فرض)',
      primary: '#00d2ff',
      accent: '#3b82f6',
      bg: 'from-blue-900/40 to-cyan-950/60',
    },
    {
      id: 'royal-gold',
      name: 'طلایی سلطنتی',
      primary: '#fbbf24',
      accent: '#f59e0b',
      bg: 'from-amber-950/40 to-yellow-950/60',
    },
    {
      id: 'neon-purple',
      name: 'بنفش نئونی و فیوچریستیک',
      primary: '#c084fc',
      accent: '#a855f7',
      bg: 'from-purple-950/40 to-indigo-950/60',
    },
    {
      id: 'emerald-tech',
      name: 'زمردی فناورانه',
      primary: '#34d399',
      accent: '#10b981',
      bg: 'from-emerald-950/40 to-teal-950/60',
    },
  ];

  const update = (key, val) => {
    onConfigChange({ ...config, [key]: val });
  };

  return (
    <div className="flex flex-col gap-6 text-right select-none font-dana animate-fade-in">
      {/* Contest Title & Branding Card */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <h3 className="text-base font-peyda font-bold text-white mb-4 flex items-center gap-2">
          <Type className="w-5 h-5 text-cyan-400" />
          <span>عنوان رویداد و هویت بصری مراسم</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium font-dana">عنوان کامل مسابقه:</label>
            <input
              type="text"
              value={config.contestTitle || ''}
              onChange={(e) => update('contestTitle', e.target.value)}
              placeholder="مسابقه برنامه‌نویسی و هوش مصنوعی..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition font-dana"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 font-medium font-dana">نام برگزارکننده یا نهاد:</label>
            <input
              type="text"
              value={config.organizer || ''}
              onChange={(e) => update('organizer', e.target.value)}
              placeholder="دبیرخانه مسابقات ملی..."
              className="w-full bg-slate-950 border border-slate-700 focus:border-cyan-500 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none transition font-dana"
            />
          </div>
        </div>
      </div>

      {/* Typography Showcase */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <h3 className="text-base font-peyda font-bold text-white mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>تایپوگرافی سینمایی فعال (قلم‌های اختصاصی نصب‌شده)</span>
        </h3>
        <p className="text-xs text-slate-400 mb-4 font-dana">
          قلم‌های اختصاصی فارسی از پوشه فونت بارگذاری و در سراسر سیستم اعمال شده‌اند:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
            <span className="text-xs text-amber-400 font-bold font-peyda">قلم رخ (Rokh UltraBold)</span>
            <span className="font-rokh font-black text-xl text-white">قهرمان مسابقه ۱۲۳</span>
            <span className="text-[11px] text-slate-500 font-dana">مخصوص تیترهای اصلی، ارقام و رتبه‌ها</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
            <span className="text-xs text-cyan-400 font-bold font-peyda">قلم پیدا (Peyda Bold)</span>
            <span className="font-peyda font-black text-xl text-white">آیین رسمی اختتامیه</span>
            <span className="text-[11px] text-slate-500 font-dana">مخصوص زیرعنوان‌ها، دکمه‌ها و نشان‌ها</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col gap-1">
            <span className="text-xs text-purple-400 font-bold font-peyda">قلم دانا (Dana Medium)</span>
            <span className="font-dana font-bold text-xl text-white">اسامی تیم‌ها و متن‌ها</span>
            <span className="text-[11px] text-slate-500 font-dana">مخصوص خوانایی دقیق مشخصات و جداول</span>
          </div>
        </div>
      </div>

      {/* Visual Themes */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <h3 className="text-base font-peyda font-bold text-white mb-4 flex items-center gap-2">
          <Palette className="w-5 h-5 text-cyan-400" />
          <span>سبک بصری و تم رنگی صحنه</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 font-peyda">
          {themes.map((th) => {
            const isSelected = config.theme === th.id;
            return (
              <button
                key={th.id}
                onClick={() => update('theme', th.id)}
                className={`p-4 rounded-xl border text-right transition flex flex-col justify-between gap-3 relative cursor-pointer ${
                  isSelected
                    ? 'border-cyan-400 bg-slate-800 shadow-lg'
                    : 'border-slate-800 bg-slate-950 hover:bg-slate-900 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-sm text-white">{th.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: th.primary }} />
                  <div className="w-5 h-5 rounded-full" style={{ backgroundColor: th.accent }} />
                  <div className={`w-12 h-5 rounded-md bg-gradient-to-r ${th.bg}`} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Timing & Suspense Duration Sliders */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl">
        <h3 className="text-base font-peyda font-bold text-white mb-2 flex items-center gap-2">
          <Clock className="w-5 h-5 text-cyan-400" />
          <span>تنظیم زمان‌بندی تعلیق و افزایش تدریجی استرس</span>
        </h3>
        <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30 mb-5 flex items-center gap-2 text-xs text-cyan-300 font-dana">
          <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>سیستم تعلیق تصاعدی:</strong> هرچه تعداد تیم‌ها کمتر شده و به رتبه‌های برتر (به ویژه قهرمان) نزدیک می‌شویم، ثانیه‌های گردش اسامی و مکث‌ها به طور خودکار تا ۳.۵ الی ۴ برابر افزایش پیدا می‌کند تا هیجان سالن به اوج برسد.
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-dana">
          {/* Countdown seconds */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>مدت شمارش معکوس اولیه:</span>
              <span className="font-numeric font-bold text-cyan-400 text-sm">
                {config.countdownSeconds || 5} ثانیه
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="10"
              value={config.countdownSeconds || 5}
              onChange={(e) => update('countdownSeconds', parseInt(e.target.value, 10))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">پیش‌فرض: ۵ ثانیه</span>
          </div>

          {/* Scrolling duration base */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>مدت پایه چرخش اسامی (رتبه ۱۰):</span>
              <span className="font-numeric font-bold text-cyan-400 text-sm">
                {config.scrollDurationSeconds || 5.0} ثانیه
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="12"
              step="0.5"
              value={config.scrollDurationSeconds || 5.0}
              onChange={(e) => update('scrollDurationSeconds', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">
              برای رتبه‌های اول به بیش از ۱۸ ثانیه می‌رسد
            </span>
          </div>

          {/* Hold duration */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80">
            <div className="flex items-center justify-between text-xs text-slate-300 font-semibold mb-2">
              <span>مدت نمایش کارت تیم معرفیشده:</span>
              <span className="font-numeric font-bold text-cyan-400 text-sm">
                {config.holdDurationSeconds || 5.0} ثانیه
              </span>
            </div>
            <input
              type="range"
              min="3"
              max="15"
              step="0.5"
              value={config.holdDurationSeconds || 5.0}
              onChange={(e) => update('holdDurationSeconds', parseFloat(e.target.value))}
              className="w-full accent-cyan-500 cursor-pointer"
            />
            <span className="text-[11px] text-slate-500 mt-1 block">زمان مکث تماشای نتیجه</span>
          </div>
        </div>
      </div>

      {/* Persian Digits & Particle Switches */}
      <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-xl font-dana">
        <h3 className="text-base font-peyda font-bold text-white mb-4 flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <span>تنظیمات عمومی نمایش</span>
        </h3>
        <div className="flex flex-col gap-4">
          {/* Persian Digits Switch */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div>
              <span className="block font-bold text-sm text-white">نمایش ارقام فارسی با قلم رخ:</span>
              <span className="block text-xs text-slate-400 mt-0.5">
                تبدیل خودکار ارقام رتبه‌ها، شمارش معکوس و امتیازها به ارقام فارسی زیبا
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.usePersianDigits !== false}
                onChange={(e) => update('usePersianDigits', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>

          {/* Particle Effects Switch */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800/80">
            <div>
              <span className="block font-bold text-sm text-white">افکت ذرات معلق و نورپردازی پس‌زمینه:</span>
              <span className="block text-xs text-slate-400 mt-0.5">
                انیمیشن ذرات کانواس و پرتوهای نوری در پس‌زمینه سالن
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enableParticles !== false}
                onChange={(e) => update('enableParticles', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
