import React, { useState, useEffect, useCallback } from 'react';
import { CeremonyStage } from './components/ceremony/CeremonyStage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { useCeremonyEngine } from './hooks/useCeremonyEngine';
import { DEFAULT_TEAMS } from './data/defaultTeams';
import { storageService, DEFAULT_CONFIG } from './services/storageService';
import { syncService } from './services/syncService';
import { soundEngine } from './services/soundEngine';
import { Sliders, Maximize2, Minimize2, Tv } from 'lucide-react';

export default function App() {
  // Check if opened as dedicated projector window (?mode=stage)
  const isStandaloneStageWindow = new URLSearchParams(window.location.search).get('mode') === 'stage';

  const [teams, setTeams] = useState(() => storageService.loadTeams(DEFAULT_TEAMS));
  const [config, setConfig] = useState(() => storageService.loadConfig());
  const [viewMode, setViewMode] = useState(isStandaloneStageWindow ? 'stage' : 'admin');
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Initialize and persist configs
  const handleConfigChange = (newConfig) => {
    setConfig(newConfig);
    storageService.saveConfig(newConfig);
    soundEngine.setVolumes({
      master: newConfig.masterVolume,
      sfx: newConfig.sfxVolume,
      music: newConfig.musicVolume,
    });
    soundEngine.setMuted(!newConfig.enableSound);
    syncService.broadcast('CONFIG_UPDATE', newConfig);
  };

  const handleUpdateTeams = (newTeams) => {
    setTeams(newTeams);
    storageService.saveTeams(newTeams);
    syncService.broadcast('TEAMS_UPDATE', newTeams);
  };

  const engine = useCeremonyEngine(teams, config, handleConfigChange);

  // Synced receiver for standalone stage window on projector
  useEffect(() => {
    const unsubscribe = syncService.subscribe(({ action, payload }) => {
      if (action === 'TEAMS_UPDATE') {
        setTeams(payload);
      } else if (action === 'CONFIG_UPDATE') {
        setConfig(payload);
      }
    });
    return unsubscribe;
  }, []);

  // Fullscreen toggle handler
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch((err) => {
        console.warn("Fullscreen request error:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.().catch((err) => {
        console.warn("Exit fullscreen error:", err);
      });
      setIsFullscreen(false);
    }
  }, []);

  // Listen to fullscreenchange event
  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  // Keyboard shortcut 'F' for fullscreen
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.key === 'f' || e.key === 'F' || e.key === 'ب') {
        e.preventDefault();
        toggleFullscreen();
      }
      if (e.key === 'Escape' && viewMode === 'stage' && !isStandaloneStageWindow) {
        setViewMode('admin');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen, viewMode, isStandaloneStageWindow]);

  // If in dedicated presentation stage mode
  if (viewMode === 'stage' || isStandaloneStageWindow) {
    return (
      <div className="relative w-full min-h-screen bg-[#04060c]">
        <CeremonyStage
          phase={engine.phase}
          currentStep={engine.currentStep}
          currentTeam={engine.currentTeam}
          countdownNum={engine.countdownNum}
          teams={teams}
          config={config}
          isPaused={engine.isPaused}
          onStart={engine.startCeremony}
        />

        {/* Discreet Operator Floating Controls for Same-Screen Mode */}
        {!isStandaloneStageWindow && (
          <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 opacity-20 hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => setViewMode('admin')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white text-xs font-semibold backdrop-blur-md shadow-lg"
              title="بازگشت به پنل مدیریت (Esc)"
            >
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>پنل مدیریت</span>
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-white backdrop-blur-md shadow-lg"
              title="تمام‌صفحه (F)"
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>
    );
  }

  // Otherwise render Operator Admin Dashboard
  return (
    <AdminDashboard
      teams={teams}
      onUpdateTeams={handleUpdateTeams}
      config={config}
      onConfigChange={handleConfigChange}
      engine={engine}
      isFullscreen={isFullscreen}
      onToggleFullscreen={toggleFullscreen}
      onSwitchToStageView={() => setViewMode('stage')}
    />
  );
}
