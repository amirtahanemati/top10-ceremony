/**
 * Storage Service for persisting settings and contest data
 */

const STORAGE_KEY_TEAMS = "top10_ceremony_teams_v1";
const STORAGE_KEY_CONFIG = "top10_ceremony_config_v1";
const STORAGE_KEY_PROGRESS = "top10_ceremony_progress_v1";

export const DEFAULT_CONFIG = {
  contestTitle: "مسابقه بزرگ برنامه‌نویسی و هوش مصنوعی ایران",
  organizer: "کمیته ملی المپیاد و رویدادهای فناوری",
  theme: "cyber-blue", // cyber-blue, royal-gold, emerald-tech, neon-purple
  countdownSeconds: 5,
  scrollDurationSeconds: 4,
  holdDurationSeconds: 4.5,
  autoAdvance: false, // operator manual control default
  championFirst: true, // Reveal Rank 1 FIRST, then Rank 2 as requested!
  usePersianDigits: true,
  enableParticles: true,
  enableSound: true,
  masterVolume: 0.85,
  sfxVolume: 0.9,
  musicVolume: 0.7,
};

export const storageService = {
  loadTeams(fallback) {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_TEAMS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Error loading teams from storage:", e);
    }
    return fallback;
  },

  saveTeams(teams) {
    try {
      localStorage.setItem(STORAGE_KEY_TEAMS, JSON.stringify(teams));
    } catch (e) {
      console.warn("Error saving teams:", e);
    }
  },

  loadConfig() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn("Error loading config:", e);
    }
    return { ...DEFAULT_CONFIG };
  },

  saveConfig(config) {
    try {
      localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch (e) {
      console.warn("Error saving config:", e);
    }
  },

  loadProgress() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Ignore
    }
    return null;
  },

  saveProgress(state) {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(state));
    } catch {
      // Ignore
    }
  },

  clearAll() {
    localStorage.removeItem(STORAGE_KEY_TEAMS);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    localStorage.removeItem(STORAGE_KEY_PROGRESS);
  },
};
