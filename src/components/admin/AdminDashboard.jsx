import React, { useState } from 'react';
import { ResultsEditor } from './ResultsEditor';
import { CeremonyControls } from './CeremonyControls';
import { VisualSettings } from './VisualSettings';
import { AudioSettings } from './AudioSettings';
import {
  PlayCircle,
  FileSpreadsheet,
  Palette,
  Volume2,
  Tv,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard = ({
  teams,
  onUpdateTeams,
  config,
  onConfigChange,
  engine,
  isFullscreen,
  onToggleFullscreen,
  onSwitchToStageView,
}) => {
  const [activeTab, setActiveTab] = useState('controls'); // 'controls', 'results', 'visual', 'audio'

  const isValidData = teams.length === 10;

  const tabs = [
    {
      id: 'controls',
      name: 'اتاق فرمان و اجرای زنده',
      icon: PlayCircle,
      badge: engine.phase !== 'IDLE' ? 'فعال' : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'results',
      name: 'نتایج داوری ۱۰ تیم',
      icon: FileSpreadsheet,
      badge: isValidData ? 'تأیید' : 'نیاز به اصلاح',
      badgeColor: isValidData ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300',
    },
    {
      id: 'visual',
      name: 'تنظیمات نمایش و تم',
      icon: Palette,
      badge: null,
    },
    {
      id: 'audio',
      name: 'صدا و افکت‌های صوتی',
      icon: Volume2,
      badge: config.enableSound !== false ? 'روشن' : 'خاموش',
      badgeColor: config.enableSound !== false ? 'bg-cyan-500/20 text-cyan-300' : 'bg-red-500/20 text-red-300',
    },
  ];

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 flex flex-col select-none font-dana">
      {/* Top Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-950/90 border-b border-slate-800/90 backdrop-blur-xl px-4 md:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-lg shadow-cyan-950">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-sm md:text-base font-peyda font-black text-white flex items-center gap-2">
              <span>پنل مدیریت و اتاق فرمان اختتامیه</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-numeric font-bold">
                PRO EVENT V2.0
              </span>
            </h1>
            <p className="text-[11px] text-slate-400 font-dana">
              {config.contestTitle || "مسابقه ۱۰ تیم برتر"}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3 font-peyda">
          <button
            onClick={onSwitchToStageView}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs md:text-sm shadow-lg shadow-cyan-950 transition cursor-pointer"
          >
            <Tv className="w-4 h-4" />
            <span className="hidden sm:inline">مشاهده صحنه نمایش مراسم</span>
            <span className="sm:hidden">صحنه</span>
          </button>
        </div>
      </header>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 md:px-8 py-2 overflow-x-auto font-peyda">
        <div className="flex items-center gap-2 min-w-max">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs md:text-sm transition cursor-pointer ${
                  isActive
                    ? 'bg-cyan-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.name}</span>
                {tab.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full ${tab.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab View Container */}
      <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
        {activeTab === 'controls' && (
          <CeremonyControls
            engine={engine}
            config={config}
            onConfigChange={onConfigChange}
            isFullscreen={isFullscreen}
            onToggleFullscreen={onToggleFullscreen}
          />
        )}

        {activeTab === 'results' && (
          <ResultsEditor
            teams={teams}
            onUpdateTeams={onUpdateTeams}
          />
        )}

        {activeTab === 'visual' && (
          <VisualSettings
            config={config}
            onConfigChange={onConfigChange}
          />
        )}

        {activeTab === 'audio' && (
          <AudioSettings
            config={config}
            onConfigChange={onConfigChange}
          />
        )}
      </main>
    </div>
  );
};
