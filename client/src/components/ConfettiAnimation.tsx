import { useEffect, useState } from 'react';

interface Confetti {
  id: number;
  left: number;
  color: string;
  delay: number;
}

export default function ConfettiAnimation() {
  const [confetti, setConfetti] = useState<Confetti[]>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FF69B4', '#00CED1', '#FF4500', '#32CD32', '#9370DB'];
    const confettiPieces: Confetti[] = [];

    for (let i = 0; i < 50; i++) {
      confettiPieces.push({
        id: i,
        left: Math.random() * 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
      });
    }

    setConfetti(confettiPieces);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-2 h-2 rounded-full animate-confetti-fall"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}