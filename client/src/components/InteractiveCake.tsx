import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Heart, RotateCcw, Flame } from 'lucide-react';
import ConfettiAnimation from './ConfettiAnimation';

interface Candle {
  id: number;
  lit: boolean;
  smoking: boolean;
}

export default function InteractiveCake() {
  const [candles, setCandles] = useState<Candle[]>([
    { id: 1, lit: true, smoking: false },
    { id: 2, lit: true, smoking: false },
    { id: 3, lit: true, smoking: false },
    { id: 4, lit: true, smoking: false },
    { id: 5, lit: true, smoking: false },
  ]);
  const [isCakeCut, setIsCakeCut] = useState(false);
  const [wishRevealed, setWishRevealed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const playBlowSound = () => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      // Soft gentle air puff sound
      const bufferSize = ctx.sampleRate * 0.3;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.08));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
    } catch (e) {}
  };

  const playChimeFanfare = () => {
    try {
      const ctx = getAudioContext();
      if (ctx.state === 'suspended') ctx.resume();

      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.1 + 0.8);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.8);
      });
    } catch (e) {}
  };

  const blowCandle = (id: number) => {
    playBlowSound();
    setCandles((prev) => {
      const updated = prev.map((c) =>
        c.id === id ? { ...c, lit: false, smoking: true } : c
      );
      // Remove smoke effect after 1.5s
      setTimeout(() => {
        setCandles((curr) =>
          curr.map((c) => (c.id === id ? { ...c, smoking: false } : c))
        );
      }, 1500);

      const allBlown = updated.every((c) => !c.lit);
      if (allBlown) {
        setTimeout(() => {
          setShowCelebration(true);
          setWishRevealed(true);
          playChimeFanfare();
        }, 500);
      }
      return updated;
    });
  };

  const blowAllCandles = () => {
    playBlowSound();
    setCandles((prev) =>
      prev.map((c) => ({ ...c, lit: false, smoking: true }))
    );
    setTimeout(() => {
      setCandles((curr) => curr.map((c) => ({ ...c, smoking: false })));
      setShowCelebration(true);
      setWishRevealed(true);
      playChimeFanfare();
    }, 600);
  };

  const relightCandles = () => {
    setCandles([
      { id: 1, lit: true, smoking: false },
      { id: 2, lit: true, smoking: false },
      { id: 3, lit: true, smoking: false },
      { id: 4, lit: true, smoking: false },
      { id: 5, lit: true, smoking: false },
    ]);
    setIsCakeCut(false);
    setWishRevealed(false);
    setShowCelebration(false);
  };

  const allBlown = candles.every((c) => !c.lit);

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      {showCelebration && <ConfettiAnimation />}

      <Card className="glass-panel p-6 sm:p-10 text-center rounded-3xl relative overflow-hidden shadow-2xl border-pink-200/60 dark:border-pink-900/40">
        {/* Glow ambient background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-rose-400/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 font-semibold text-xs tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            Interactive Cake Ceremony
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold font-handwriting text-foreground mb-2">
            Make a Wish & Blow the Candles!
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mb-6">
            Tap each candle flame or click &quot;Blow All&quot; to make your secret birthday wish come true.
          </p>

          {/* Interactive Cake Illustration */}
          <div className="relative flex flex-col items-center justify-center my-6 select-none">
            {/* Candles Row */}
            <div className="flex justify-center items-end gap-6 sm:gap-8 mb-[-6px] z-20">
              {candles.map((candle) => (
                <div
                  key={candle.id}
                  onClick={() => candle.lit && blowCandle(candle.id)}
                  className={`flex flex-col items-center cursor-pointer transition-transform duration-200 hover:scale-110 ${
                    candle.lit ? 'hover:-translate-y-1' : ''
                  }`}
                  title={candle.lit ? 'Tap to blow out flame' : 'Candle blown'}
                >
                  {/* Flame or Smoke */}
                  <div className="h-9 flex items-center justify-center relative">
                    {candle.lit && (
                      <div className="animate-candle">
                        <div className="w-4 h-7 bg-gradient-to-t from-amber-500 via-yellow-300 to-rose-400 rounded-full shadow-[0_0_12px_rgba(255,183,3,0.9)] transform -translate-y-1" />
                        <div className="w-1.5 h-3 bg-white/90 rounded-full absolute bottom-1 left-1/2 -translate-x-1/2 blur-[0.5px]" />
                      </div>
                    )}
                    {candle.smoking && (
                      <div className="animate-smoke text-xs text-zinc-400 font-mono select-none">
                        💨
                      </div>
                    )}
                    {!candle.lit && !candle.smoking && (
                      <div className="w-1 h-2 bg-zinc-700/80 rounded-t" />
                    )}
                  </div>

                  {/* Candle Wick & Body */}
                  <div className="w-0.5 h-1.5 bg-zinc-800" />
                  <div className="w-3 sm:w-3.5 h-10 sm:h-12 bg-gradient-to-b from-pink-300 via-rose-300 to-pink-400 rounded-t-sm shadow-sm border-x border-pink-400/40 relative overflow-hidden">
                    {/* Candle stripes */}
                    <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_4px,rgba(255,255,255,0.6)_4px,rgba(255,255,255,0.6)_8px)]" />
                  </div>
                </div>
              ))}
            </div>

            {/* Cake Structure */}
            <div className="flex flex-col items-center w-full max-w-xs sm:max-w-sm">
              {/* Top Layer */}
              <div className="w-44 sm:w-52 h-16 bg-gradient-to-r from-pink-200 via-rose-100 to-pink-200 dark:from-pink-900/60 dark:via-rose-800/50 dark:to-pink-900/60 rounded-t-2xl relative shadow-md border border-pink-300/60 flex items-center justify-around px-4">
                {/* Strawberries on top */}
                <span className="text-xl transform -translate-y-6">🍓</span>
                <span className="text-xl transform -translate-y-6">🍒</span>
                <span className="text-xl transform -translate-y-6">🍓</span>
                {/* Frosting drips */}
                <div className="absolute bottom-0 inset-x-0 h-3 bg-white/70 dark:bg-white/15 rounded-b-md flex justify-around">
                  <div className="w-4 h-4 bg-white/70 dark:bg-white/15 rounded-full -mb-1" />
                  <div className="w-4 h-5 bg-white/70 dark:bg-white/15 rounded-full -mb-2" />
                  <div className="w-4 h-4 bg-white/70 dark:bg-white/15 rounded-full -mb-1" />
                </div>
              </div>

              {/* Bottom Layer */}
              <div className="w-64 sm:w-72 h-20 bg-gradient-to-r from-amber-100 via-rose-100 to-amber-100 dark:from-amber-950/70 dark:via-rose-950/50 dark:to-amber-950/70 rounded-2xl relative shadow-lg border border-pink-300/60 flex items-center justify-center overflow-hidden">
                <span className="font-handwriting text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-300 tracking-wider">
                  Muntsha
                </span>
                {/* Chocolate and cream decorative piping */}
                <div className="absolute bottom-0 inset-x-0 h-4 bg-gradient-to-r from-amber-400/30 via-pink-400/30 to-amber-400/30" />
              </div>

              {/* Cake Stand Plate */}
              <div className="w-72 sm:w-80 h-3 bg-gradient-to-r from-zinc-200 via-white to-zinc-200 dark:from-zinc-700 dark:via-zinc-500 dark:to-zinc-700 rounded-full shadow-xl border border-zinc-300 mt-1" />
            </div>

            {/* Cut Cake Animation View */}
            {isCakeCut && (
              <div className="mt-4 p-3 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800 animate-slideUp flex items-center gap-3">
                <span className="text-3xl">🍰</span>
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300 text-left">
                  Here is the sweetest slice for the sweetest girl! Always stay smiling, Muntsha!
                </p>
              </div>
            )}
          </div>

          {/* Controls & Wish Message */}
          <div className="space-y-4">
            {!allBlown ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <Button
                  onClick={blowAllCandles}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg px-6 py-2.5 rounded-full font-fun text-base"
                >
                  <Flame className="w-4 h-4 mr-2" />
                  Blow All Candles ✨
                </Button>
              </div>
            ) : (
              <div className="space-y-3 animate-slideUp">
                <div className="p-4 bg-gradient-to-br from-pink-50 to-rose-100 dark:from-rose-950/60 dark:to-pink-900/40 rounded-2xl border border-pink-300/80 shadow-inner">
                  <div className="text-3xl mb-1">🎉✨💖</div>
                  <h3 className="text-xl font-bold font-handwriting text-rose-600 dark:text-rose-300 mb-1">
                    Your Wish is Locked in My Heart!
                  </h3>
                  <p className="text-sm text-zinc-700 dark:text-zinc-300 max-w-md mx-auto">
                    May Allah bless this year of your life with boundless peace, health, laughter, and every dream you cherish. You deserve the entire galaxy!
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  {!isCakeCut && (
                    <Button
                      onClick={() => setIsCakeCut(true)}
                      className="bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-90 shadow-md rounded-full px-5 py-2 font-fun"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Cut the Cake 🍰
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={relightCandles}
                    className="rounded-full border-pink-300 hover:bg-pink-50 dark:hover:bg-zinc-800"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Relight Candles
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
