import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Sparkles, Shuffle, ChevronLeft, ChevronRight } from 'lucide-react';

const reasons = [
  "The way your smile immediately brightens up even my darkest, most tiring days.",
  "How genuine, pure, and kind your heart is towards everyone around you.",
  "Your adorable laughter that brings instant peace to my soul.",
  "The way you make the simplest moments feel like unforgettable adventures.",
  "How beautiful you look, naturally and effortlessly, every single day.",
  "Your patience, understanding, and how safe I feel talking to you about anything.",
  "The sparkle in your eyes whenever you are excited about something you love.",
  "How you believe in me even during the moments when I doubt myself.",
  "The gentle warmth and happiness you bring into my life just by being you.",
  "Your cute expressions and playful teasing that always make me smile.",
  "How thoughtful you are, remembering the smallest details that matter.",
  "Because having you as my girlfriend feels like Allah's greatest blessing to me.",
  "The way my heart still races whenever I see your picture or hear your voice.",
  "Your strength, elegance, and the graceful woman you are blossoming into.",
  "How you are not just my love, but my best friend and my favorite human.",
  "Because forever with you still doesn't feel like enough time.",
];

export default function LoveJar() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playPaperSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {}
  };

  const pickRandomReason = () => {
    playPaperSound();
    setIsShuffling(true);
    let nextIdx = Math.floor(Math.random() * reasons.length);
    if (nextIdx === currentIndex) {
      nextIdx = (nextIdx + 1) % reasons.length;
    }
    setTimeout(() => {
      setCurrentIndex(nextIdx);
      setIsOpen(true);
      setIsShuffling(false);
    }, 250);
  };

  const nextReason = () => {
    playPaperSound();
    setCurrentIndex((prev) => (prev + 1) % reasons.length);
    setIsOpen(true);
  };

  const prevReason = () => {
    playPaperSound();
    setCurrentIndex((prev) => (prev - 1 + reasons.length) % reasons.length);
    setIsOpen(true);
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      <Card className="glass-panel p-6 sm:p-10 text-center rounded-3xl relative overflow-hidden shadow-2xl border-rose-200/70 dark:border-rose-900/40">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100 dark:bg-pink-900/40 text-rose-600 dark:text-rose-300 font-semibold text-xs tracking-wide uppercase mb-3">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          Muntsha&apos;s Love Jar
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold font-handwriting text-foreground mb-2">
          Little Jar of Infinite Love 💌
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          Every folded paper star in this jar holds a special reason why you hold the most precious place in my heart.
        </p>

        {/* Jar Illustration */}
        <div className="relative flex flex-col items-center justify-center my-4 select-none">
          <div
            onClick={pickRandomReason}
            className={`w-36 h-48 sm:w-44 sm:h-56 rounded-b-[40px] rounded-t-[20px] bg-gradient-to-b from-white/40 via-pink-100/30 to-rose-200/40 dark:from-zinc-800/40 dark:via-pink-950/30 dark:to-rose-900/40 border-4 border-pink-300/80 dark:border-pink-600/50 shadow-2xl relative flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-105 ${
              isShuffling ? 'animate-bounce' : 'animate-gentleFloat'
            }`}
            title="Click the jar to draw a love note!"
          >
            {/* Jar Lid */}
            <div className="absolute -top-3 w-28 sm:w-32 h-5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-md shadow-md border border-amber-700/50 flex items-center justify-center">
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-950">Ribbon</span>
            </div>
            {/* Ribbon Tie */}
            <div className="absolute top-2 w-32 sm:w-36 h-1.5 bg-rose-500 rounded-full shadow" />
            <div className="absolute top-3 text-rose-500 text-lg">🎀</div>

            {/* Glowing Stars Inside Jar */}
            <div className="flex flex-wrap items-center justify-center gap-2 p-4 text-2xl">
              <span className="animate-pulse animation-delay-200">⭐</span>
              <span className="animate-pulse animation-delay-500">💖</span>
              <span className="animate-pulse animation-delay-300">🌟</span>
              <span className="animate-pulse animation-delay-700">✨</span>
              <span className="animate-pulse animation-delay-400">💕</span>
              <span className="animate-pulse animation-delay-600">💫</span>
            </div>

            {/* Label on Jar */}
            <div className="absolute bottom-4 px-3 py-1 bg-white/90 dark:bg-zinc-800/90 rounded-md border border-pink-200 shadow-sm">
              <span className="font-handwriting text-xs font-bold text-rose-600 dark:text-rose-300">
                100% Ali &hearts; Muntsha
              </span>
            </div>
          </div>
        </div>

        {/* Display Note Card */}
        {isOpen ? (
          <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50 dark:from-zinc-900 dark:to-pink-950/40 border border-pink-300 shadow-md animate-slideUp relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-rose-500 text-white text-xs font-fun rounded-full shadow">
              Reason #{currentIndex + 1} of {reasons.length}
            </div>

            <p className="font-handwriting text-2xl sm:text-3xl text-rose-800 dark:text-rose-200 font-bold leading-relaxed pt-2">
              &ldquo;{reasons[currentIndex]}&rdquo;
            </p>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-pink-200 dark:border-pink-800/60">
              <Button
                variant="ghost"
                size="sm"
                onClick={prevReason}
                className="text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous
              </Button>

              <Button
                onClick={pickRandomReason}
                className="bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-90 rounded-full px-5 py-2 font-fun text-sm shadow-md"
              >
                <Shuffle className="w-3.5 h-3.5 mr-2" />
                Draw Another 🌟
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={nextReason}
                className="text-muted-foreground hover:text-foreground"
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <Button
              onClick={pickRandomReason}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-lg px-6 py-2.5 rounded-full font-fun text-base"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Tap to Open a Note ✨
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
