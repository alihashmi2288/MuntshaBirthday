import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  emoji: string;
  opacity: number;
  vx: number;
  vy: number;
}

export default function SparkleTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;
    let particles: Particle[] = [];
    const emojis = ['✨', '💖', '⭐', '🌸', '💕'];
    let lastTime = 0;

    const resize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length > 0) {
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.opacity -= 0.025;
          p.x += p.vx;
          p.y += p.vy;

          if (p.opacity > 0) {
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.opacity);
            ctx.font = `${p.size}px sans-serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.emoji, p.x, p.y);
            ctx.restore();
          }
        }

        particles = particles.filter((p) => p.opacity > 0);
        animId = requestAnimationFrame(render);
      } else {
        animId = null;
      }
    };

    const addParticle = (x: number, y: number) => {
      const now = performance.now();
      if (now - lastTime < 50) return; // Throttle to 20 additions/sec
      lastTime = now;

      particles.push({
        x: x + (Math.random() * 12 - 6),
        y: y + (Math.random() * 12 - 6),
        size: Math.random() * 6 + 14,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        opacity: 0.9,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 1.2 - 0.4,
      });

      if (!animId) {
        animId = requestAnimationFrame(render);
      }
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if ('touches' in e && e.touches.length > 0) {
        addParticle(e.touches[0].clientX, e.touches[0].clientY);
      } else if ('clientX' in e) {
        addParticle(e.clientX, e.clientY);
      }
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      if (animId) cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50 select-none"
    />
  );
}
