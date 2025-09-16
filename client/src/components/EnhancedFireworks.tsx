import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, Play, Pause, RotateCcw } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

interface Rocket {
  id: number;
  x: number;
  y: number;
  targetY: number;
  color: string;
}

interface Firework {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  color: string;
  delay: number;
}

interface Explosion {
  id: number;
  x: number;
  y: number;
  color: string;
}

export default function EnhancedFireworks() {
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [fireworks, setFireworks] = useState<Firework[]>([]);
  const [explosions, setExplosions] = useState<Explosion[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd700', 
    '#ff69b4', '#98fb98', '#ff9f43', '#a55eea', 
    '#ff4757', '#2ed573', '#1e90ff', '#ff6348'
  ];

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  const initAudio = () => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      } catch (e) {
        console.warn('Audio not supported');
      }
    }
    return audioContextRef.current;
  };

  const playFireworksMusic = () => {
    const ctx = initAudio();
    if (!ctx) return;
    
    try {
      const melody = [
        {freq: 523, duration: 0.3}, {freq: 659, duration: 0.3}, {freq: 784, duration: 0.3},
        {freq: 1047, duration: 0.5}, {freq: 784, duration: 0.3}, {freq: 659, duration: 0.3},
        {freq: 523, duration: 0.5}, {freq: 659, duration: 0.3}, {freq: 784, duration: 0.3},
        {freq: 1047, duration: 0.8}
      ];
      
      let currentTime = ctx.currentTime;
      
      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        
        gain.gain.setValueAtTime(0, currentTime);
        gain.gain.linearRampToValueAtTime(0.2, currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(currentTime);
        osc.stop(currentTime + note.duration);
        
        currentTime += note.duration + 0.1;
      });
    } catch (e) {
      console.warn('Audio failed:', e);
    }
  };

  const launchRocket = () => {
    const startX = Math.random() * 80 + 10;
    const targetY = Math.random() * 40 + 20;
    const color = colors[Math.floor(Math.random() * colors.length)];

    const rocket: Rocket = {
      id: Date.now() + Math.random(),
      x: startX,
      y: 100,
      targetY,
      color
    };

    setRockets(prev => [...prev, rocket]);

    // Remove rocket and create explosion after 1.2 seconds
    const timeout = setTimeout(() => {
      setRockets(prev => prev.filter(r => r.id !== rocket.id));
      createExplosion(startX, targetY, color);
      timeoutsRef.current.delete(timeout);
    }, 1200);
    timeoutsRef.current.add(timeout);
  };

  const createExplosion = (x: number, y: number, color: string) => {
    // Create central explosion
    const explosion: Explosion = {
      id: Date.now() + Math.random(),
      x,
      y,
      color
    };

    setExplosions(prev => [...prev, explosion]);

    // Remove explosion after animation
    const explosionTimeout = setTimeout(() => {
      setExplosions(prev => prev.filter(e => e.id !== explosion.id));
      timeoutsRef.current.delete(explosionTimeout);
    }, 800);
    timeoutsRef.current.add(explosionTimeout);

    // Create firework particles
    const particleCounts = [8, 16];
    const distances = [60, 120];

    particleCounts.forEach((count, ring) => {
      for (let j = 0; j < count; j++) {
        const angle = (j * (360 / count)) * Math.PI / 180;
        const distance = distances[ring] + Math.random() * 60;
        
        const firework: Firework = {
          id: Date.now() + Math.random() + j + ring * 100,
          x,
          y,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          color,
          delay: ring * 0.1
        };

        setFireworks(prev => [...prev, firework]);

        // Remove firework after animation
        const fireworkTimeout = setTimeout(() => {
          setFireworks(prev => prev.filter(f => f.id !== firework.id));
          timeoutsRef.current.delete(fireworkTimeout);
        }, 2500 + firework.delay * 1000);
        timeoutsRef.current.add(fireworkTimeout);
      }
    });
  };

  const startShow = () => {
    setIsPlaying(true);
    setShowControls(false);
    playFireworksMusic();

    // Launch rockets continuously
    intervalRef.current = setInterval(() => {
      launchRocket();
    }, 300);

    // Launch finale burst after 8 seconds
    const finaleTimeout = setTimeout(() => {
      for (let i = 0; i < 8; i++) {
        const burstTimeout = setTimeout(() => {
          launchRocket();
          timeoutsRef.current.delete(burstTimeout);
        }, i * 100);
        timeoutsRef.current.add(burstTimeout);
      }
      timeoutsRef.current.delete(finaleTimeout);
    }, 8000);
    timeoutsRef.current.add(finaleTimeout);

    // Auto-stop after 12 seconds
    const stopTimeout = setTimeout(() => {
      stopShow();
      timeoutsRef.current.delete(stopTimeout);
    }, 12000);
    timeoutsRef.current.add(stopTimeout);
  };

  const stopShow = () => {
    setIsPlaying(false);
    setShowControls(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    timeoutsRef.current.clear();
  };

  const resetShow = () => {
    stopShow();
    setRockets([]);
    setFireworks([]);
    setExplosions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Controls */}
      {showControls && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40">
          <div className="text-center backdrop-blur-xl bg-white/10 rounded-3xl p-8 border border-white/20">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 animate-pulse"
                data-testid="text-fireworks-title">
              🎆 Happy Birthday Muntsha! 🎆
            </h1>
            <p className="text-xl text-white/80 mb-8 animate-slideUp animation-delay-500">
              Let's celebrate with a spectacular fireworks show!
            </p>
            
            <div className="flex gap-4 justify-center mb-4">
              <Button 
                onClick={startShow}
                size="lg"
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover-elevate shadow-xl text-lg px-8"
                data-testid="button-start-fireworks"
              >
                <Play className="w-6 h-6 mr-2" />
                Start Show
              </Button>
              
              <Button 
                onClick={resetShow}
                size="lg" 
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 hover-elevate shadow-xl"
                data-testid="button-reset-fireworks"
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                Reset
              </Button>
            </div>
            
            <Link href="/">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 hover-elevate" data-testid="button-back-fireworks">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back Home
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Back button during show */}
      {isPlaying && (
        <div className="absolute top-4 left-4 z-40">
          <Link href="/">
            <Button 
              variant="outline" 
              className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover-elevate"
              data-testid="button-back-during-show"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </Link>
        </div>
      )}

      {/* Stop button during show */}
      {isPlaying && (
        <div className="absolute bottom-4 right-4 z-40">
          <Button 
            onClick={stopShow}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover-elevate"
            data-testid="button-stop-show"
          >
            <Pause className="w-4 h-4 mr-2" />
            Stop Show
          </Button>
        </div>
      )}

      {/* Rockets */}
      {rockets.map((rocket) => (
        <div
          key={rocket.id}
          className="absolute w-1.5 h-5 rounded-full animate-[rocketLaunch_1.2s_ease-out_forwards] pointer-events-none"
          style={{
            left: `${rocket.x}%`,
            bottom: '0%',
            background: `linear-gradient(to top, ${rocket.color}, #ffd700, #fff)`,
            '--launch-height': `${-(100 - rocket.targetY)}vh`
          } as React.CSSProperties}
          data-testid={`rocket-${rocket.id}`}
        >
          <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-2 h-4 rounded-full bg-gradient-radial from-orange-500 via-red-500 to-transparent animate-[rocketFlame_1.2s_ease-out_forwards]" />
        </div>
      ))}

      {/* Explosions */}
      {explosions.map((explosion) => (
        <div
          key={explosion.id}
          className="absolute w-5 h-5 rounded-full animate-[explode_0.8s_ease-out_forwards] pointer-events-none"
          style={{
            left: `${explosion.x}%`,
            top: `${explosion.y}%`,
            backgroundColor: explosion.color,
            boxShadow: `0 0 30px ${explosion.color}`,
          }}
          data-testid={`explosion-${explosion.id}`}
        />
      ))}

      {/* Firework Particles */}
      {fireworks.map((firework) => (
        <div
          key={firework.id}
          className="absolute w-2.5 h-2.5 rounded-full animate-[fireworkBurst_2s_ease-out_forwards] pointer-events-none"
          style={{
            left: `${firework.x}%`,
            top: `${firework.y}%`,
            backgroundColor: firework.color,
            boxShadow: `0 0 15px ${firework.color}`,
            '--dx': `${firework.dx}px`,
            '--dy': `${firework.dy}px`,
            animationDelay: `${firework.delay}s`
          } as React.CSSProperties}
          data-testid={`firework-${firework.id}`}
        />
      ))}

      <style jsx>{`
        @keyframes rocketLaunch {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(var(--launch-height)) scale(0.8); opacity: 0.8; }
        }
        
        @keyframes rocketFlame {
          0% { height: 1rem; opacity: 1; }
          100% { height: 1.5rem; opacity: 0.6; }
        }
        
        @keyframes explode {
          0% { transform: scale(0); opacity: 1; box-shadow: 0 0 0 0 currentColor; }
          50% { transform: scale(2); opacity: 0.8; box-shadow: 0 0 30px 10px currentColor; }
          100% { transform: scale(4); opacity: 0; box-shadow: 0 0 50px 20px transparent; }
        }
        
        @keyframes fireworkBurst {
          0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
          30% { transform: translate(calc(var(--dx) * 0.4), calc(var(--dy) * 0.4)) scale(1.2); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
        
        @keyframes slideUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-slideUp { animation: slideUp 0.8s ease-out forwards; }
        .animation-delay-500 { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}