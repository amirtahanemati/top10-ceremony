import React, { useEffect, useRef } from 'react';

/**
 * High performance Canvas particle background with volumetric lighting & cyber particles
 */
export const ParticleBackground = ({ theme = 'cyber-blue', active = true }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Color palettes based on theme
    let particleColors = ['#00d2ff', '#3b82f6', '#8b5cf6', '#06b6d4'];
    if (theme === 'royal-gold') {
      particleColors = ['#fbbf24', '#f59e0b', '#d97706', '#fef08a'];
    } else if (theme === 'emerald-tech') {
      particleColors = ['#10b981', '#059669', '#34d399', '#6ee7b7'];
    } else if (theme === 'neon-purple') {
      particleColors = ['#a855f7', '#ec4899', '#8b5cf6', '#d946ef'];
    }

    const particleCount = Math.min(85, Math.floor(window.innerWidth / 22));
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.2 + 0.8,
      color: particleColors[Math.floor(Math.random() * particleColors.length)],
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45 - 0.25, // gentle upwards drift
      alpha: Math.random() * 0.6 + 0.2,
      pulseSpeed: Math.random() * 0.02 + 0.01,
    }));

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Radial ambient lighting in center
      const gradient = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        50,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.65
      );

      if (theme === 'royal-gold') {
        gradient.addColorStop(0, 'rgba(245, 158, 11, 0.08)');
        gradient.addColorStop(0.5, 'rgba(180, 83, 9, 0.03)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        gradient.addColorStop(0, 'rgba(14, 165, 233, 0.09)');
        gradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.04)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render & update particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += Math.sin(Date.now() * p.pulseSpeed * 0.05) * 0.008;
        const currentAlpha = Math.max(0.1, Math.min(0.85, p.alpha));

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = currentAlpha;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, active]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full"
    />
  );
};
