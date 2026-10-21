/**
 * Studio Grade Web Audio API Sound Engine
 * Fully synthesized procedural SFX & cinematic soundscapes
 * 100% offline, 0ms latency, zero missing audio files, works in all modern browsers.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.masterVolume = 0.85;
    this.sfxVolume = 0.9;
    this.musicVolume = 0.7;

    this.ambientNode = null;
    this.ambientGain = null;
    this.ambientFilter = null;
    this.tensionInterval = null;

    this.customAudioCache = new Map();
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.ambientGain) {
      this.ambientGain.gain.setValueAtTime(muted ? 0 : this.musicVolume * 0.25, this.ctx?.currentTime || 0);
    }
  }

  setVolumes({ master, sfx, music }) {
    if (master !== undefined) this.masterVolume = Math.max(0, Math.min(1, master));
    if (sfx !== undefined) this.sfxVolume = Math.max(0, Math.min(1, sfx));
    if (music !== undefined) this.musicVolume = Math.max(0, Math.min(1, music));

    if (this.ambientGain && this.ctx && !this.isMuted) {
      this.ambientGain.gain.setValueAtTime(this.musicVolume * 0.25 * this.masterVolume, this.ctx.currentTime);
    }
  }

  getEffectiveVolume(type = 'sfx') {
    if (this.isMuted) return 0;
    const channel = type === 'music' ? this.musicVolume : this.sfxVolume;
    return this.masterVolume * channel;
  }

  /**
   * 1. Ceremony Start Cinematic Braam & Sub-Bass
   */
  playCeremonyStart() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('music');

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 2.8);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(130, now);
    osc2.frequency.exponentialRampToValueAtTime(65, now + 2.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(900, now + 0.4);
    filter.frequency.exponentialRampToValueAtTime(100, now + 3.0);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.85, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 3.5);
    osc2.stop(now + 3.5);
  }

  /**
   * 2. Suspense Ambient Tension Drone (with rank-based pitch scaling)
   */
  startTensionDrone(rank = 10) {
    this.init();
    if (!this.ctx || this.ambientNode) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Pitch rises as rank gets closer to 1!
    const baseFreq = 50 + (11 - rank) * 8; // from 58Hz at rank 10 up to 130Hz for Champion!
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(baseFreq, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180 + (11 - rank) * 20, now);

    const initialGain = this.isMuted ? 0 : this.getEffectiveVolume('music') * 0.25;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(initialGain, now + 1.2);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    this.ambientNode = osc;
    this.ambientGain = gain;
    this.ambientFilter = filter;
  }

  stopTensionDrone() {
    if (this.ambientNode && this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.4);
      setTimeout(() => {
        try {
          this.ambientNode?.stop();
          this.ambientNode?.disconnect();
          this.ambientNode = null;
          this.ambientGain = null;
          this.ambientFilter = null;
        } catch {
          // Ignore
        }
      }, 450);
    }
  }

  /**
   * 3. Mechanical / Cyber Reel Tick
   */
  playScrollTick(intensity = 1.0) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx') * (0.22 + intensity * 0.35);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = 460 + Math.random() * 90 + intensity * 300;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.035);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.045);
  }

  /**
   * Dramatic mechanical teaser brake / screech
   */
  playTeaseBrake() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx') * 0.55;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(580, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.4);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(900, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  }

  /**
   * 4. Countdown Beep (3, 2, 1) and Final GO Beep
   */
  playCountdownBeep(isFinal = false) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx');

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (isFinal) {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1400, now + 0.3);
      gain.gain.setValueAtTime(vol * 0.85, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now);
      gain.gain.setValueAtTime(vol * 0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    }
  }

  /**
   * 5. Tension Riser (ascending sweep towards reveal)
   */
  playTensionRiser(durationSec = 2.5) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx');

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(100, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + durationSec);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(2800, now + durationSec);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.65, now + durationSec * 0.85);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + durationSec + 0.05);
  }

  /**
   * 6. Tension Sudden Cutoff / Dramatic Pause
   */
  playDramaticPause() {
    this.stopTensionDrone();
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx') * 0.45;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(130, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.35);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  /**
   * 7. Team Rank Reveal Impact
   */
  playRevealImpact(rank = 10) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx');

    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(150, now);
    subOsc.frequency.exponentialRampToValueAtTime(30, now + 0.7);

    subGain.gain.setValueAtTime(vol * 0.95, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.0);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 1.05);

    const chime = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    chime.type = 'triangle';
    const baseFreq = rank === 3 ? 659.25 : 587.33;
    chime.frequency.setValueAtTime(baseFreq, now);

    chimeGain.gain.setValueAtTime(vol * 0.5, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    chime.connect(chimeGain);
    chimeGain.connect(this.ctx.destination);
    chime.start(now);
    chime.stop(now + 0.95);
  }

  /**
   * 8. Champion Grand Fanfare
   */
  playChampionFanfare() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('music');

    const notes = [293.66, 369.99, 440.00, 587.33, 739.99, 880.00, 1174.66];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const noteStart = now + idx * 0.12;
      const noteDuration = 2.8 - idx * 0.15;

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, noteStart);
      filter.frequency.exponentialRampToValueAtTime(2800, noteStart + 0.35);
      filter.frequency.exponentialRampToValueAtTime(800, noteStart + noteDuration);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(vol * 0.38, noteStart + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration + 0.1);
    });

    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(85, now);
    sub.frequency.exponentialRampToValueAtTime(40, now + 2.8);
    subGain.gain.setValueAtTime(vol * 0.85, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(now);
    sub.stop(now + 3.3);
  }

  /**
   * 9. Leaderboard Staggered Entry Glissando
   */
  playLeaderboardEntry() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx') * 0.5;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, now);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.45); // C4 to G5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.52);
  }

  testSound(type) {
    this.init();
    switch (type) {
      case 'start':
        this.playCeremonyStart();
        break;
      case 'countdown':
        this.playCountdownBeep(true);
        break;
      case 'tick':
        this.playScrollTick(0.9);
        break;
      case 'tease':
        this.playTeaseBrake();
        break;
      case 'reveal':
        this.playRevealImpact(10);
        break;
      case 'champion':
        this.playChampionFanfare();
        break;
      case 'table':
        this.playLeaderboardEntry();
        break;
      default:
        this.playRevealImpact(5);
        break;
    }
  }
}

export const soundEngine = new SoundEngine();
