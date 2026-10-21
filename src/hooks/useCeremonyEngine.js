import { useState, useEffect, useRef, useCallback } from 'react';
import { soundEngine } from '../services/soundEngine';
import { fireChampionConfetti, fireRunnerUpConfetti, fireRankBurst } from '../utils/confetti';
import { syncService } from '../services/syncService';
import { storageService } from '../services/storageService';

export const CEREMONY_PHASES = {
  IDLE: 'IDLE',
  INTRO: 'INTRO',
  COUNTDOWN: 'COUNTDOWN',
  SCROLLING: 'SCROLLING',
  SLOWING: 'SLOWING',
  DRAMATIC_PAUSE: 'DRAMATIC_PAUSE',
  REVEAL: 'REVEAL',
  HOLDING: 'HOLDING',
  FINALE_PREP: 'FINALE_PREP',
  CHAMPION_REVEAL: 'CHAMPION_REVEAL',
  RUNNER_UP_REVEAL: 'RUNNER_UP_REVEAL',
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

  const timerRef = useRef(null);
  const scrollTickIntervalRef = useRef(null);

  // Define ceremony sequence based on config (Champion first or Runner-up first)
  const sequenceSteps = useRef([]);

  const buildSequence = useCallback(() => {
    const steps = [];
    // Ranks 10 down to 3
    for (let r = 10; r >= 3; r--) {
      steps.push({ type: 'rank', rank: r });
    }
    // Finale Prep
    steps.push({ type: 'finale_prep' });

    if (config.championFirst !== false) {
      // DEFAULT: Champion (Rank 1) first, then Runner-Up (Rank 2)
      steps.push({ type: 'champion', rank: 1 });
      steps.push({ type: 'runner_up', rank: 2 });
    } else {
      steps.push({ type: 'runner_up', rank: 2 });
      steps.push({ type: 'champion', rank: 1 });
    }

    // Final Table
    steps.push({ type: 'final_table' });
    return steps;
  }, [config.championFirst]);

  useEffect(() => {
    sequenceSteps.current = buildSequence();
  }, [buildSequence]);

  const clearAllTimers = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (scrollTickIntervalRef.current) {
      clearInterval(scrollTickIntervalRef.current);
      scrollTickIntervalRef.current = null;
    }
  };

  const currentStep = sequenceSteps.current[currentStepIndex] || { type: 'rank', rank: 10 };
  const currentTeam = teams.find((t) => t.rank === currentStep.rank) || teams[0];

  // Broadcast current state to synced audience stage windows
  const broadcastCurrentState = useCallback((customState = {}) => {
    syncService.broadcast('STATE_UPDATE', {
      phase: customState.phase || phase,
      currentStepIndex: customState.currentStepIndex ?? currentStepIndex,
      currentStep: customState.currentStep || currentStep,
      countdownNum: customState.countdownNum ?? countdownNum,
      isPaused: customState.isPaused ?? isPaused,
      config,
    });
  }, [phase, currentStepIndex, currentStep, countdownNum, isPaused, config]);

  // Sync state broadcast on major changes
  useEffect(() => {
    broadcastCurrentState();
  }, [phase, currentStepIndex, isPaused, countdownNum, broadcastCurrentState]);

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
          // Proceed to first reveal step (Rank 10)
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
      soundEngine.startTensionDrone();
      if (config.autoAdvance) {
        timerRef.current = setTimeout(() => {
          startStep(stepIdx + 1);
        }, 4000);
      }
      return;
    }

    if (step.type === 'final_table') {
      setPhase(CEREMONY_PHASES.FINAL_TABLE);
      soundEngine.playLeaderboardEntry();
      return;
    }

    // Step is rank reveal (rank 10..3, or rank 1 champion, or rank 2 runner-up)
    setPhase(CEREMONY_PHASES.SCROLLING);
    soundEngine.startTensionDrone();

    // Prepare rolling pool of candidate team names (only from valid pool)
    const pool = teams.map((t) => t.name);
    setScrollingNames(pool);

    // Dynamic mechanical sound ticks
    let tickSpeed = 70;
    scrollTickIntervalRef.current = setInterval(() => {
      soundEngine.playScrollTick(1.0);
    }, tickSpeed);

    // Duration of full scroll
    const scrollDuration = (config.scrollDurationSeconds || 3.5) * 1000;
    const slowStart = scrollDuration * 0.65;

    // Deceleration phase
    timerRef.current = setTimeout(() => {
      setPhase(CEREMONY_PHASES.SLOWING);
      soundEngine.playTensionRiser(1.4);
      if (scrollTickIntervalRef.current) {
        clearInterval(scrollTickIntervalRef.current);
        scrollTickIntervalRef.current = setInterval(() => {
          soundEngine.playScrollTick(0.5);
        }, 180);
      }

      // Dramatic pause cutoff
      timerRef.current = setTimeout(() => {
        if (scrollTickIntervalRef.current) {
          clearInterval(scrollTickIntervalRef.current);
          scrollTickIntervalRef.current = null;
        }
        setPhase(CEREMONY_PHASES.DRAMATIC_PAUSE);
        soundEngine.playDramaticPause();

        // Reveal Moment!
        timerRef.current = setTimeout(() => {
          revealRank(step);
        }, 600);
      }, scrollDuration - slowStart);
    }, slowStart);
  }, [config.scrollDurationSeconds, config.autoAdvance, teams]);

  // Reveal the rank with dramatic animations and audio fanfare
  const revealRank = useCallback((step) => {
    clearAllTimers();
    soundEngine.stopTensionDrone();

    setRevealedRanks((prev) => new Set([...prev, step.rank]));

    if (step.type === 'champion' || step.rank === 1) {
      setPhase(CEREMONY_PHASES.CHAMPION_REVEAL);
      soundEngine.playChampionFanfare();
      fireChampionConfetti();
    } else if (step.type === 'runner_up' || step.rank === 2) {
      setPhase(CEREMONY_PHASES.RUNNER_UP_REVEAL);
      soundEngine.playRunnerUpFanfare();
      fireRunnerUpConfetti();
    } else {
      setPhase(CEREMONY_PHASES.REVEAL);
      soundEngine.playRevealImpact(step.rank);
      fireRankBurst(step.rank);
    }

    // Auto advance if configured
    if (config.autoAdvance) {
      const holdTime = (config.holdDurationSeconds || 4.5) * 1000;
      timerRef.current = setTimeout(() => {
        nextStep();
      }, holdTime);
    } else {
      // In manual mode, we transition to HOLDING after impact
      timerRef.current = setTimeout(() => {
        setPhase(CEREMONY_PHASES.HOLDING);
      }, 1200);
    }
  }, [config.autoAdvance, config.holdDurationSeconds]);

  // Operator Action: Start Ceremony
  const startCeremony = useCallback(() => {
    soundEngine.init();
    soundEngine.playCeremonyStart();
    setPhase(CEREMONY_PHASES.INTRO);
    clearAllTimers();

    timerRef.current = setTimeout(() => {
      startCountdown();
    }, 2800);
  }, [startCountdown]);

  // Operator Action: Pause / Resume
  const togglePause = useCallback(() => {
    if (phase === CEREMONY_PHASES.IDLE) {
      startCeremony();
      return;
    }

    if (isPaused) {
      // Resume
      setIsPaused(false);
      setPhase(prevPhaseBeforePause || CEREMONY_PHASES.HOLDING);
      soundEngine.startTensionDrone();
    } else {
      // Pause
      clearAllTimers();
      setPrevPhaseBeforePause(phase);
      setIsPaused(true);
      setPhase(CEREMONY_PHASES.PAUSED);
      soundEngine.stopTensionDrone();
    }
  }, [phase, isPaused, prevPhaseBeforePause, startCeremony]);

  // Operator Action: Next Step
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

  // Operator Action: Previous Step
  const prevStep = useCallback(() => {
    clearAllTimers();
    setIsPaused(false);
    const prevIdx = Math.max(0, currentStepIndex - 1);
    startStep(prevIdx);
  }, [currentStepIndex, startStep]);

  // Operator Action: Replay Current Step
  const replayCurrentStep = useCallback(() => {
    clearAllTimers();
    setIsPaused(false);
    startStep(currentStepIndex);
  }, [currentStepIndex, startStep]);

  // Operator Action: Instant Reveal (Skip scroll directly to reveal)
  const instantReveal = useCallback(() => {
    clearAllTimers();
    setIsPaused(false);
    const step = sequenceSteps.current[currentStepIndex];
    if (step) {
      revealRank(step);
    }
  }, [currentStepIndex, revealRank]);

  // Operator Action: Jump directly to final leaderboard
  const jumpToFinalTable = useCallback(() => {
    clearAllTimers();
    setIsPaused(false);
    setCurrentStepIndex(sequenceSteps.current.length - 1);
    setPhase(CEREMONY_PHASES.FINAL_TABLE);
    soundEngine.stopTensionDrone();
    soundEngine.playLeaderboardEntry();
  }, []);

  // Operator Action: Reset to Idle
  const resetCeremony = useCallback(() => {
    clearAllTimers();
    soundEngine.stopTensionDrone();
    setIsPaused(false);
    setPhase(CEREMONY_PHASES.IDLE);
    setCurrentStepIndex(0);
    setRevealedRanks(new Set());
    setCountdownNum(config.countdownSeconds || 5);
  }, [config.countdownSeconds]);

  // Global hotkeys listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if typing inside an input/textarea
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

  // Clean up timers on unmount
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
