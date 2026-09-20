import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  emoji: string;
  opacity: number;
}

export default function SparkleTrail() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const emojis = ['✨', '💖', '⭐', '🌸', '💫', '💕'];
    let lastTime = 0;

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const now = performance.now();
      if (now - lastTime < 45) return; // Throttle to maintain 60fps
      lastTime = now;

      let clientX = 0;
      let clientY = 0;

      if ('touches' in e && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if ('clientX' in e) {
        clientX = e.clientX;
        clientY = e.clientY;
      } else {
        return;
      }

      const newParticle: Particle = {
        id: Math.random() + Date.now(),
        x: clientX + (Math.random() * 16 - 8),
        y: clientY + (Math.random() * 16 - 8),
        size: Math.random() * 12 + 14,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
        opacity: 1,
      };

      setParticles((prev) => [...prev.slice(-18), newParticle]);
    };

    window.addEventListener('mousemove', handlePointerMove, { passive: true });
    window.addEventListener('touchmove', handlePointerMove, { passive: true });

    const cleanupInterval = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({ ...p, opacity: p.opacity - 0.15, y: p.y - 1.5 }))
          .filter((p) => p.opacity > 0)
      );
    }, 60);

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="fixed transform -translate-x-1/2 -translate-y-1/2 select-none transition-transform duration-300"
          style={{
            left: `${p.x}px`,
            top: `${p.y}px`,
            fontSize: `${p.size}px`,
            opacity: p.opacity,
            filter: 'drop-shadow(0 0 6px rgba(255,107,139,0.7))',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
