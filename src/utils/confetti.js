import confetti from 'canvas-confetti';

/**
 * Trigger celebratory confetti bursts
 */
export function fireChampionConfetti() {
  const duration = 4.5 * 1000;
  const animationEnd = Date.now() + duration;

  // Gold, amber, royal yellow & diamond white colors
  const colors = ['#ffd700', '#f59e0b', '#fbbf24', '#ffffff', '#fef08a'];

  const frame = () => {
    confetti({
      particleCount: 7,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.7 },
      colors: colors,
      zIndex: 9999,
    });
    confetti({
      particleCount: 7,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.7 },
      colors: colors,
      zIndex: 9999,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };

  frame();

  // Cannon burst at middle
  setTimeout(() => {
    confetti({
      particleCount: 120,
      spread: 100,
      origin: { y: 0.55 },
      colors: colors,
      zIndex: 9999,
      scalar: 1.2,
    });
  }, 400);
}

export function fireRunnerUpConfetti() {
  // Silver, icy cyan and platinum
  const colors = ['#e2e8f0', '#94a3b8', '#38bdf8', '#ffffff'];
  confetti({
    particleCount: 80,
    spread: 90,
    origin: { y: 0.6 },
    colors: colors,
    zIndex: 9999,
  });
}

export function fireRankBurst(rank) {
  let colors = ['#06b6d4', '#3b82f6', '#8b5cf6'];
  if (rank === 3) {
    colors = ['#d97706', '#b45309', '#fde68a'];
  }
  confetti({
    particleCount: 45,
    spread: 70,
    origin: { y: 0.65 },
    colors: colors,
    zIndex: 9999,
  });
}
