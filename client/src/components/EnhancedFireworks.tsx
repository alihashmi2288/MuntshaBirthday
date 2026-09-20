import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, Play, Pause, RotateCcw, Sparkles, Heart } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FloatingMusicPlayer from './FloatingMusicPlayer';
import SparkleTrail from './SparkleTrail';

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
    '#ff6b8b', '#4ecdc4', '#45b7d1', '#ffd700',
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
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
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
      if (ctx.state === 'suspended') ctx.resume();
      const melody = [
        { freq: 523, duration: 0.3 }, { freq: 659, duration: 0.3 }, { freq: 784, duration: 0.3 },
        { freq: 1047, duration: 0.5 }, { freq: 784, duration: 0.3 }, { freq: 659, duration: 0.3 },
        { freq: 523, duration: 0.5 }, { freq: 659, duration: 0.3 }, { freq: 784, duration: 0.3 },
        { freq: 1047, duration: 0.8 }
      ];

      let currentTime = ctx.currentTime;
      melody.forEach((note) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = note.freq;
        gain.gain.setValueAtTime(0.12, currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(currentTime);
        osc.stop(currentTime + note.duration);
        currentTime += note.duration + 0.05;
      });
    } catch (e) {}
  };

  const playLaunchSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 1.2);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {}
  };

  const playExplosionSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.1));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch (e) {}
  };

  const createFirework = (x: number, y: number, color: string) => {
    playExplosionSound();
    const newExplosion: Explosion = { id: Date.now() + Math.random(), x, y, color };
    setExplosions((prev) => [...prev, newExplosion]);

    const expTimeout = setTimeout(() => {
      setExplosions((prev) => prev.filter((e) => e.id !== newExplosion.id));
      timeoutsRef.current.delete(expTimeout);
    }, 800);
    timeoutsRef.current.add(expTimeout);

    const particleCount = 28;
    const newFireworks: Firework[] = [];
    for (let i = 0; i < particleCount; i++) {
      const angle = (i * 2 * Math.PI) / particleCount;
      const speed = Math.random() * 80 + 40;
      newFireworks.push({
        id: Date.now() + Math.random() + i,
        x,
        y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        color,
        delay: Math.random() * 0.2,
      });
    }

    setFireworks((prev) => [...prev, ...newFireworks]);

    const fireworkTimeout = setTimeout(() => {
      setFireworks((prev) => prev.filter((f) => !newFireworks.some((nf) => nf.id === f.id)));
      timeoutsRef.current.delete(fireworkTimeout);
    }, 2200);
    timeoutsRef.current.add(fireworkTimeout);
  };

  const launchRocket = () => {
    playLaunchSound();
    const x = Math.random() * 80 + 10;
    const targetY = Math.random() * 40 + 20;
    const color = colors[Math.floor(Math.random() * colors.length)];

    const newRocket: Rocket = { id: Date.now() + Math.random(), x, y: 100, targetY, color };
    setRockets((prev) => [...prev, newRocket]);

    const explodeTimeout = setTimeout(() => {
      setRockets((prev) => prev.filter((r) => r.id !== newRocket.id));
      createFirework(x, targetY, color);
      timeoutsRef.current.delete(explodeTimeout);
    }, 1200);
    timeoutsRef.current.add(explodeTimeout);
  };

  const startShow = () => {
    setIsPlaying(true);
    setShowControls(false);
    playFireworksMusic();
    launchRocket();

    intervalRef.current = setInterval(() => {
      launchRocket();
    }, 1500);

    const finaleTimeout = setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        const burstTimeout = setTimeout(() => {
          launchRocket();
          timeoutsRef.current.delete(burstTimeout);
        }, i * 300);
        timeoutsRef.current.add(burstTimeout);
      }
      timeoutsRef.current.delete(finaleTimeout);
    }, 8000);
    timeoutsRef.current.add(finaleTimeout);

    const stopTimeout = setTimeout(() => {
      stopShow();
      timeoutsRef.current.delete(stopTimeout);
    }, 14000);
    timeoutsRef.current.add(stopTimeout);
  };

  const stopShow = () => {
    setIsPlaying(false);
    setShowControls(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
    timeoutsRef.current.clear();
  };

  const resetShow = () => {
    stopShow();
    setRockets([]);
    setFireworks([]);
    setExplosions([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e0720] via-[#1a0c36] to-[#080214] relative overflow-hidden transition-colors duration-500">
      <SparkleTrail />
      <FloatingMusicPlayer />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Twinkling Starfield in background */}
      <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]" />

      {/* Sky Banner during Show */}
      {isPlaying && (
        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 text-center animate-slideUp pointer-events-none">
          <h2 className="text-3xl sm:text-5xl font-bold font-handwriting text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 drop-shadow-[0_0_15px_rgba(255,107,139,0.8)]">
            ✨ Happy Birthday Muntsha! ✨
          </h2>
          <p className="text-xs sm:text-sm text-pink-200/90 font-fun mt-1 flex items-center justify-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 animate-pulse" />
            Lighting the sky for my one and only love
          </p>
        </div>
      )}

      {/* Controls Overlay */}
      {showControls && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-40 w-full max-w-md px-4">
          <div className="text-center glass-panel rounded-3xl p-8 border-2 border-pink-500/30 shadow-2xl backdrop-blur-2xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-spin" />
              Celebration Light Show
            </span>

            <h1
              className="text-4xl sm:text-5xl font-bold font-handwriting text-white mb-3 drop-shadow-md"
              data-testid="text-fireworks-title"
            >
              🎆 Happy Birthday Muntsha! 🎆
            </h1>
            <p className="text-sm sm:text-base text-zinc-300 mb-6 font-medium">
              Watch the night sky burst into sparkling colors and romantic lights just for you!
            </p>

            <div className="flex flex-wrap gap-3 justify-center mb-4">
              <Button
                onClick={startShow}
                size="lg"
                className="bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:opacity-90 shadow-xl text-base px-7 rounded-full font-fun"
                data-testid="button-start-fireworks"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Show ✨
              </Button>

              <Button
                onClick={resetShow}
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 rounded-full px-5 text-sm"
                data-testid="button-reset-fireworks"
              >
                <RotateCcw className="w-4 h-4 mr-1.5" />
                Reset
              </Button>
            </div>

            <Link href="/">
              <Button
                variant="ghost"
                className="text-zinc-400 hover:text-white rounded-full text-xs"
                data-testid="button-back-fireworks"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5" />
                Back Home
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* Navigation Buttons During Show */}
      {isPlaying && (
        <>
          <div className="absolute top-4 left-4 z-40">
            <Link href="/">
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 text-white bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full text-xs"
                data-testid="button-back-during-show"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                Back Home
              </Button>
            </Link>
          </div>

          <div className="absolute bottom-6 right-6 z-40">
            <Button
              onClick={stopShow}
              variant="outline"
              size="sm"
              className="border-white/30 text-white bg-black/40 hover:bg-white/10 backdrop-blur-md rounded-full text-xs"
              data-testid="button-stop-show"
            >
              <Pause className="w-3.5 h-3.5 mr-1.5" />
              Stop Show
            </Button>
          </div>
        </>
      )}

      {/* Rockets */}
      {rockets.map((rocket) => (
        <div
          key={rocket.id}
          className="absolute w-2 h-6 rounded-full animate-[rocketLaunch_1.2s_ease-out_forwards] pointer-events-none"
          style={{
            left: `${rocket.x}%`,
            bottom: '0%',
            background: `linear-gradient(to top, ${rocket.color}, #ffd700, #fff)`,
            '--launch-height': `${-(100 - rocket.targetY)}vh`,
          } as React.CSSProperties}
          data-testid={`rocket-${rocket.id}`}
        >
          <div className="absolute bottom-[-10px] left-1/2 transform -translate-x-1/2 w-2.5 h-5 rounded-full bg-gradient-to-t from-transparent via-amber-400 to-rose-500 animate-[rocketFlame_1.2s_ease-out_forwards]" />
        </div>
      ))}

      {/* Explosions */}
      {explosions.map((explosion) => (
        <div
          key={explosion.id}
          className="absolute w-6 h-6 rounded-full animate-[explode_0.8s_ease-out_forwards] pointer-events-none"
          style={{
            left: `${explosion.x}%`,
            top: `${explosion.y}%`,
            backgroundColor: explosion.color,
            boxShadow: `0 0 35px ${explosion.color}`,
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
            animationDelay: `${firework.delay}s`,
          } as React.CSSProperties}
          data-testid={`firework-${firework.id}`}
        />
      ))}

      <style>{`
        @keyframes rocketLaunch {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(var(--launch-height)) scale(0.8); opacity: 0.8; }
        }
        @keyframes rocketFlame {
          0% { height: 1rem; opacity: 1; }
          100% { height: 1.6rem; opacity: 0.6; }
        }
        @keyframes explode {
          0% { transform: scale(0); opacity: 1; box-shadow: 0 0 0 0 currentColor; }
          50% { transform: scale(2); opacity: 0.9; box-shadow: 0 0 30px 10px currentColor; }
          100% { transform: scale(4); opacity: 0; box-shadow: 0 0 50px 20px transparent; }
        }
        @keyframes fireworkBurst {
          0% { transform: translate(0, 0) scale(0.5); opacity: 1; }
          30% { transform: translate(calc(var(--dx) * 0.4), calc(var(--dy) * 0.4)) scale(1.2); opacity: 1; }
          100% { transform: translate(var(--dx), var(--dy)) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}