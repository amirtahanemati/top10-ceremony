import { useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine } from '../services/soundEngine';
import { fireChampionConfetti, fireRankBurst } from '../utils/confetti';
import { syncService } from '../services/syncService';

export const CEREMONY_PHASES = {
  IDLE: 'IDLE',
  INTRO: 'INTRO',
  COUNTDOWN: 'COUNTDOWN',
  SCROLLING: 'SCROLLING',
  TEASING: 'TEASING',       // Fake slow-down teaser!
  REACCEL: 'REACCEL',       // Sudden burst of speed again!
  SLOWING: 'SLOWING',       // Final deceleration
  DRAMATIC_PAUSE: 'DRAMATIC_PAUSE',
  REVEAL: 'REVEAL',
  HOLDING: 'HOLDING',
  FINALE_PREP: 'FINALE_PREP',
  CHAMPION_REVEAL: 'CHAMPION_REVEAL',
  FINAL_TABLE: 'FINAL_TABLE',
  PAUSED: 'PAUSED',
};

export function useCeremonyEngine(teams, config, onConfigChange) {
  const [phase, setPhase] = useState(CEREMONY_PHASES.IDLE);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [countdownNum, setCountdownNum] = useState(config.countdownSeconds || 5);
  const [scrollingNames, setScrollingNames] = useState([]);
  const [revealedRanks, setRevealedRanks] = useState(new Set());
  const [isPaused, setIsPaused] = useState(false);
  const [prevPhaseBeforePause, setPrevPhaseBeforePause] = useState(null);
  const [currentStepDuration, setCurrentStepDuration] = useState(0);

  const timerRef = useRef(null);
  const subTimersRef = useRef([]);
  const scrollTickIntervalRef = useRef(null);

  // Define ceremony sequence:
  // Ranks 10 down to 3 -> Finale Prep -> Champion (Rank 1) -> DIRECTLY Final Table!
  // (No separate scroll/countdown for runner-up, as requested)
  const buildSequence = useCallback(() => {
    const steps = [];
    // Ranks 10 down to 3
    for (let r = 10; r >= 3; r--) {
      steps.push({ type: 'rank', rank: r });
    }
    // Finale Prep
    steps.push({ type: 'finale_prep' });

    // Champion (Rank 1)
    steps.push({ type: 'champion', rank: 1 });

    // DIRECTLY TO FINAL TABLE (skipping runner-up scroll as requested)
    steps.push({ type: 'final_table' });
    return steps;
  }, []);

  const sequenceSteps = useRef(buildSequence());

  useEffect(() => {
    sequenceSteps.current = buildSequence();
  }, [buildSequence]);

  const clearAllTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    subTimersRef.current.forEach((t) => clearTimeout(t));
    subTimersRef.current = [];

    if (scrollTickIntervalRef.current) {
      clearInterval(scrollTickIntervalRef.current);
      scrollTickIntervalRef.current = null;
    }
  };

  const currentStep = sequenceSteps.current[currentStepIndex] || { type: 'rank', rank: 10 };
  const currentTeam = teams.find((t) => t.rank === currentStep.rank) || teams[0];

  // Calculate dynamic suspense duration based on rank:
  // As fewer teams remain (closer to 1), suspense time is dramatically increased!
  const getDynamicSuspenseDuration = useCallback((rank) => {
    const baseSeconds = config.scrollDurationSeconds || 5.0;
    // Multipliers for rank 10 down to 1
    const multipliers = {
      10: 1.0,   // e.g. 5.0s
      9: 1.2,    // e.g. 6.0s
      8: 1.45,   // e.g. 7.25s
      7: 1.75,   // e.g. 8.75s
      6: 2.1,    // e.g. 10.5s
      5: 2.5,    // e.g. 12.5s
      4: 2.95,   // e.g. 14.75s
      3: 3.4,    // e.g. 17.0s
      1: 4.2,    // e.g. 21.0s (Grand Champion Duel!)
    };
    const mult = multipliers[rank] || 1.5;
    return baseSeconds * mult * 1000;
  }, [config.scrollDurationSeconds]);

  // Broadcast current state to synced audience stage windows
  const broadcastCurrentState = useCallback((customState = {}) => {
    syncService.broadcast('STATE_UPDATE', {
      phase: customState.phase || phase,
      currentStepIndex: customState.currentStepIndex ?? currentStepIndex,
      currentStep: customState.currentStep || currentStep,
      countdownNum: customState.countdownNum ?? countdownNum,
      isPaused: customState.isPaused ?? isPaused,
      revealedRanks: Array.from(revealedRanks),
      config,
    });
  }, [phase, currentStepIndex, currentStep, countdownNum, isPaused, revealedRanks, config]);

  useEffect(() => {
    broadcastCurrentState();
  }, [phase, currentStepIndex, isPaused, countdownNum, revealedRanks, broadcastCurrentState]);

  // Handle countdown loop
  const startCountdown = useCallback(() => {
    clearAllTimers();
    let current = config.countdownSeconds || 5;
    setCountdownNum(current);
    setPhase(CEREMONY_PHASES.COUNTDOWN);
    soundEngine.playCountdownBeep(false);

    const runCount = () => {
      timerRef.current = setTimeout(() => {
        current -= 1;
        setCountdownNum(current);
        if (current > 0) {
          soundEngine.playCountdownBeep(false);
          runCount();
        } else {
          soundEngine.playCountdownBeep(true);
          // Start first step (Rank 10)
          startStep(0);
        }
      }, 1000);
    };
    runCount();
  }, [config.countdownSeconds]);

  // Start a step in the sequence
  const startStep = useCallback((stepIdx) => {
    clearAllTimers();
    setCurrentStepIndex(stepIdx);
    const step = sequenceSteps.current[stepIdx];

    if (!step) {
      setPhase(CEREMONY_PHASES.FINAL_TABLE);
      return;
    }

    if (step.type === 'finale_prep') {
      setPhase(CEREMONY_PHASES.FINALE_PREP);
      soundEngine.startTensionDrone(2);
      if (config.autoAdvance) {
        timerRef.current = setTimeout(() => {
          startStep(stepIdx + 1);
        }, 5500);
      }
      return;
    }

    if (step.type === 'final_table') {
      setPhase(CEREMONY_PHASES.FINAL_TABLE);
      soundEngine.playLeaderboardEntry();
      return;
    }

    // Step is rank reveal (10..3, or 1 champion)
    setPhase(CEREMONY_PHASES.SCROLLING);
    soundEngine.startTensionDrone(step.rank);

    // CRUCIAL REQUIREMENT: Filter out already revealed teams from the candidate pool!
    // As teams are revealed, they are permanently removed from the reel!
    const unrevealedTeams = teams.filter((t) => !revealedRanks.has(t.rank));
    const pool = unrevealedTeams.map((t) => t.name);
    // If somehow pool is empty, fallback to target team
    setScrollingNames(pool.length > 0 ? pool : [currentTeam.name]);

    // Compute prolonged dynamic suspense duration for this rank
    const totalDuration = getDynamicSuspenseDuration(step.rank);
    setCurrentStepDuration(totalDuration);

    // Start fast ticks
    let tickSpeed = 55;
    scrollTickIntervalRef.current = setInterval(() => {
      soundEngine.playScrollTick(1.0);
    }, tickSpeed);

    // Dynamic suspense timeline with multiple teasers:
    // 1. Initial hyper spin (0 to 40% of duration)
    // 2. Fake slow-down / teaser (at 40% of duration)
    // 3. Sudden re-acceleration (at 55% of duration)
    // 4. Final deceleration & riser (at 75% of duration)
    // 5. Dramatic pause cutoff (at 92% of duration)
    // 6. Reveal moment! (at 100%)

    const tTeaser = totalDuration * 0.40;
    const tReaccel = totalDuration * 0.55;
    const tFinalSlow = totalDuration * 0.72;
    const tPause = totalDuration * 0.92;

    // 1 -> 2: Fake slow-down teaser
    const id1 = setTimeout(() => {
      setPhase(CEREMONY_PHASES.TEASING);
      soundEngine.playTeaseBrake();
      if (scrollTickIntervalRef.current) {
        clearInterval(scrollTickIntervalRef.current);
        scrollTickIntervalRef.current = setInterval(() => {
          soundEngine.playScrollTick(0.6);
        }, 220);
      }
    }, tTeaser);
    subTimersRef.current.push(id1);

    // 2 -> 3: Re-accelerate!
    const id2 = setTimeout(() => {
      setPhase(CEREMONY_PHASES.REACCEL);
      if (scrollTickIntervalRef.current) {
        clearInterval(scrollTickIntervalRef.current);
        scrollTickIntervalRef.current = setInterval(() => {
          soundEngine.playScrollTick(1.2);
        }, 45);
      }
    }, tReaccel);
    subTimersRef.current.push(id2);

    // 3 -> 4: Final heavy deceleration
    const id3 = setTimeout(() => {
      setPhase(CEREMONY_PHASES.SLOWING);
      soundEngine.playTensionRiser(2.5);
      if (scrollTickIntervalRef.current) {
        clearInterval(scrollTickIntervalRef.current);
        scrollTickIntervalRef.current = setInterval(() => {
          soundEngine.playScrollTick(0.4);
        }, 320);
      }
    }, tFinalSlow);
    subTimersRef.current.push(id3);

    // 4 -> 5: Dramatic pause cutoff
    const id4 = setTimeout(() => {
      if (scrollTickIntervalRef.current) {
        clearInterval(scrollTickIntervalRef.current);
        scrollTickIntervalRef.current = null;
      }
      setPhase(CEREMONY_PHASES.DRAMATIC_PAUSE);
      soundEngine.playDramaticPause();
    }, tPause);
    subTimersRef.current.push(id4);

    // 5 -> 6: The grand reveal!
    const id5 = setTimeout(() => {
      revealRank(step);
    }, totalDuration);
    subTimersRef.current.push(id5);

  }, [teams, revealedRanks, currentTeam, getDynamicSuspenseDuration, config.autoAdvance]);

  // Reveal the rank with dramatic animations and audio fanfare
  const revealRank = useCallback((step) => {
    clearAllTimers();
    soundEngine.stopTensionDrone();

    // Mark rank as permanently revealed so it won't appear in subsequent scrollers
    setRevealedRanks((prev) => new Set([...prev, step.rank]));

    if (step.type === 'champion' || step.rank === 1) {
      setPhase(CEREMONY_PHASES.CHAMPION_REVEAL);
      soundEngine.playChampionFanfare();
      fireChampionConfetti();
    } else {
      setPhase(CEREMONY_PHASES.REVEAL);
      soundEngine.playRevealImpact(step.rank);
      fireRankBurst(step.rank);
    }

    if (config.autoAdvance) {
      const holdTime = (config.holdDurationSeconds || 5.0) * 1000;
      timerRef.current = setTimeout(() => {
        nextStep();
      }, holdTime);
    } else {
      timerRef.current = setTimeout(() => {
        setPhase(CEREMONY_PHASES.HOLDING);
      }, 1500);
    }
  }, [config.autoAdvance, config.holdDurationSeconds]);

  // Start Ceremony
  const startCeremony = useCallback(() => {
    soundEngine.init();
    soundEngine.playCeremonyStart();
    setPhase(CEREMONY_PHASES.INTRO);
    clearAllTimers();

    timerRef.current = setTimeout(() => {
      startCountdown();
    }, 3200);
  }, [startCountdown]);

  // Pause / Resume
  const togglePause = useCallback(() => {
    if (phase === CEREMONY_PHASES.IDLE) {
      startCeremony();
      return;
    }

    if (isPaused) {
      setIsPaused(false);
      setPhase(prevPhaseBeforePause || CEREMONY_PHASES.HOLDING);
      soundEngine.startTensionDrone(currentStep.rank);
    } else {
      clearAllTimers();
      setPrevPhaseBeforePause(phase);
      setIsPaused(true);
      setPhase(CEREMONY_PHASES.PAUSED);
      soundEngine.stopTensionDrone();
    }
  }, [phase, isPaused, prevPhaseBeforePause, currentStep, startCeremony]);

  // Next Step:
  // When Champion is currently shown, nextStep goes DIRECTLY to final table!
  const nextStep = useCallback(() => {
    clearAllTimers();
    setIsPaused(false);
    const nextIdx = currentStepIndex + 1;
    if (nextIdx < sequenceSteps.current.length) {
      startStep(nextIdx);
    } else {
      setPhase(CEREMONY_PHASES.FINAL_TABLE);
      soundEngine.playLeaderboardEntry();
    }
  }, [currentStepIndex, startStep]);

  // Previous Step
  const prevStep = useCallback(() => {
    clearAllTimers();
    setIsPaused(false);
    const prevIdx = Math.max(0, currentStepIndex - 1);
    startStep(prevIdx);
  }, [currentStepIndex, startStep]);

  // Replay Current Step
  const replayCurrentStep = useCallback(() => {
    clearAllTimers();
    setIsPaused(false);
    startStep(currentStepIndex);
  }, [currentStepIndex, startStep]);

  // Instant Reveal
  const instantReveal = useCallback(() => {
    clearAllTimers();
    setIsPaused(false);
    const step = sequenceSteps.current[currentStepIndex];
    if (step) {
      revealRank(step);
    }
  }, [currentStepIndex, revealRank]);

  // Jump to Final Table
  const jumpToFinalTable = useCallback(() => {
    clearAllTimers();
    setIsPaused(false);
    setCurrentStepIndex(sequenceSteps.current.length - 1);
    setPhase(CEREMONY_PHASES.FINAL_TABLE);
    soundEngine.stopTensionDrone();
    soundEngine.playLeaderboardEntry();
  }, []);

  // Reset to Idle
  const resetCeremony = useCallback(() => {
    clearAllTimers();
    soundEngine.stopTensionDrone();
    setIsPaused(false);
    setPhase(CEREMONY_PHASES.IDLE);
    setCurrentStepIndex(0);
    setRevealedRanks(new Set());
    setCountdownNum(config.countdownSeconds || 5);
  }, [config.countdownSeconds]);

  // Hotkeys
  useEffect(() => {
    const handleKeyDown = (e) => {
      const tag = e.target.tagName.toLowerCase();
      if (tag === 'input' || tag === 'textarea' || tag === 'select') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePause();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        nextStep();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        prevStep();
      } else if (e.key === 'r' || e.key === 'R' || e.key === 'ق') {
        e.preventDefault();
        replayCurrentStep();
      } else if (e.key === 'm' || e.key === 'M' || e.key === 'م') {
        e.preventDefault();
        const newMute = !config.enableSound;
        soundEngine.setMuted(!newMute);
        onConfigChange?.({ ...config, enableSound: newMute });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePause, nextStep, prevStep, replayCurrentStep, config, onConfigChange]);

  useEffect(() => {
    return () => {
      clearAllTimers();
      soundEngine.stopTensionDrone();
    };
  }, []);

  return {
    phase,
    currentStepIndex,
    currentStep,
    currentTeam,
    countdownNum,
    scrollingNames,
    revealedRanks,
    isPaused,
    sequenceSteps: sequenceSteps.current,
    currentStepDuration,
    startCeremony,
    togglePause,
    nextStep,
    prevStep,
    replayCurrentStep,
    instantReveal,
    jumpToFinalTable,
    resetCeremony,
    startCountdown,
  };
}
