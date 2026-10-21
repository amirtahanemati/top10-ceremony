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
    this.tensionInterval = null;

    // Custom audio element cache if external audio paths are specified
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

    // Sub-bass oscillator
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(32, now + 2.5);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(130, now);
    osc2.frequency.exponentialRampToValueAtTime(65, now + 2.0);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, now);
    filter.frequency.exponentialRampToValueAtTime(800, now + 0.4);
    filter.frequency.exponentialRampToValueAtTime(100, now + 2.8);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.8, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 3.3);
    osc2.stop(now + 3.3);
  }

  /**
   * 2. Suspense Ambient Tension Drone (Heartbeat / Low Frequency pulse)
   */
  startTensionDrone() {
    this.init();
    if (!this.ctx || this.ambientNode) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(55, now);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(150, now);

    const initialGain = this.isMuted ? 0 : this.getEffectiveVolume('music') * 0.22;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(initialGain, now + 1.0);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    this.ambientNode = osc;
    this.ambientGain = gain;
  }

  stopTensionDrone() {
    if (this.ambientNode && this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 0.5);
      setTimeout(() => {
        try {
          this.ambientNode?.stop();
          this.ambientNode?.disconnect();
          this.ambientNode = null;
          this.ambientGain = null;
        } catch {
          // Ignore
        }
      }, 550);
    }
  }

  /**
   * 3. Team Scroll Mechanical/Cyber Tick
   * High rate during fast scrolling, lower pitch/frequency during deceleration
   */
  playScrollTick(intensity = 1.0) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx') * (0.2 + intensity * 0.3);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const freq = 420 + Math.random() * 80 + intensity * 250;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(160, now + 0.04);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
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
      // High triumphant punch
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1320, now + 0.25);
      gain.gain.setValueAtTime(vol * 0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } else {
      // Standard cinematic countdown pip
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      gain.gain.setValueAtTime(vol * 0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.19);
    }
  }

  /**
   * 5. Tension Riser (ascending pitch and sweep towards reveal)
   */
  playTensionRiser(durationSec = 2.0) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx');

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + durationSec);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2400, now + durationSec);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol * 0.6, now + durationSec * 0.85);
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
    const vol = this.getEffectiveVolume('sfx') * 0.4;

    // Subtle reverse cymbal swoosh or low suction thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.3);

    gain.gain.setValueAtTime(vol, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  /**
   * 7. Team Rank Reveal Impact (Big impact thud + high sweep)
   */
  playRevealImpact(rank = 10) {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx');

    // Sub-bass hit
    const subOsc = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    subOsc.type = 'sine';
    subOsc.frequency.setValueAtTime(140, now);
    subOsc.frequency.exponentialRampToValueAtTime(35, now + 0.6);

    subGain.gain.setValueAtTime(vol * 0.9, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 0.95);

    // Metallic chime overlay
    const chime = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();
    chime.type = 'triangle';
    const baseFreq = rank === 3 ? 659.25 : 587.33;
    chime.frequency.setValueAtTime(baseFreq, now);

    chimeGain.gain.setValueAtTime(vol * 0.45, now);
    chimeGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

    chime.connect(chimeGain);
    chimeGain.connect(this.ctx.destination);
    chime.start(now);
    chime.stop(now + 0.85);
  }

  /**
   * 8. Champion Fanfare (Rank 1 Golden Victory)
   * Grand cinematic brassy arpeggio chord progression
   */
  playChampionFanfare() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('music');

    // Major triumphant chord (D4, F#4, A4, D5)
    const notes = [293.66, 369.99, 440.00, 587.33, 739.99, 880.00];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      const noteStart = now + idx * 0.12;
      const noteDuration = 2.4 - idx * 0.15;

      osc.type = idx % 2 === 0 ? 'sawtooth' : 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(400, noteStart);
      filter.frequency.exponentialRampToValueAtTime(2500, noteStart + 0.3);
      filter.frequency.exponentialRampToValueAtTime(800, noteStart + noteDuration);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(vol * 0.35, noteStart + 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration + 0.1);
    });

    // Sub rumble
    const sub = this.ctx.createOscillator();
    const subGain = this.ctx.createGain();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(80, now);
    sub.frequency.exponentialRampToValueAtTime(45, now + 2.5);
    subGain.gain.setValueAtTime(vol * 0.8, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
    sub.connect(subGain);
    subGain.connect(this.ctx.destination);
    sub.start(now);
    sub.stop(now + 3.1);
  }

  /**
   * 9. Runner-Up Fanfare (Rank 2 Silver Triumph)
   */
  playRunnerUpFanfare() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('music');

    // Regal minor to major cadence (A3, C#4, E4, A4)
    const notes = [220.0, 277.18, 329.63, 440.0, 554.37];

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteStart = now + idx * 0.14;
      const noteDuration = 2.0;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(vol * 0.32, noteStart + 0.09);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + noteDuration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + noteDuration + 0.1);
    });
  }

  /**
   * 10. Final Table Staggered Entry Glissando
   */
  playLeaderboardEntry() {
    this.init();
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const vol = this.getEffectiveVolume('sfx') * 0.45;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(261.63, now); // C4
    osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.35); // E5

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(vol, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.42);
  }

  /**
   * Quick sound test preview trigger
   */
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
        this.playScrollTick(0.8);
        break;
      case 'reveal':
        this.playRevealImpact(10);
        break;
      case 'champion':
        this.playChampionFanfare();
        break;
      case 'runnerUp':
        this.playRunnerUpFanfare();
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
