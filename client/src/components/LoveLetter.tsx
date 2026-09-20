import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowLeft, Heart, Sparkles, MailOpen, Mail } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FloatingElement from './FloatingElement';
import FloatingMusicPlayer from './FloatingMusicPlayer';
import SparkleTrail from './SparkleTrail';
import muntshaPic from '@assets/muntsha-photo.jpg';

interface FloatingHeart {
  id: number;
  left: number;
  emoji: string;
  duration: number;
  fontSize: number;
}

export default function LoveLetter() {
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const letterContent = [
    "My Dearest Muntsha,",

    "Happy Birthday, my love! 🎉 Today marks another year of your beautiful existence, and I couldn't be more grateful to celebrate this special day with you.",

    "You are the best thing that has ever happened to me. Every day with you feels like a blessing, and I find myself falling in love with you more and more with each passing moment.",

    "Your smile lights up my world, your laughter is my favorite melody, and your love gives me strength. Sometimes I wish I could open my heart so you could see how deeply and completely I feel for you.",

    "I'm truly the luckiest person to have you in my life. You bring joy, warmth, and meaning to everything around you, and I'm honored to be part of your journey.",

    "May Allah always bless you with happiness, health, and endless joy. May all your dreams come true, and may this new year of your life be filled with beautiful moments, wonderful surprises, and all the love your heart can hold.",

    "You mean everything to me, Muntsha. Today and always, I celebrate you! 🎂✨",

    "With all my love,\nYour devoted admirer 💕\nSyed Ali Hashmi"
  ];

  useEffect(() => {
    const hearts = ['💖', '💕', '💗', '💓', '💝', '🌹', '✨', '💐', '🌸'];

    const interval = setInterval(() => {
      const newHeart: FloatingHeart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 96 + 2,
        emoji: hearts[Math.floor(Math.random() * hearts.length)],
        duration: Math.random() * 3 + 5,
        fontSize: Math.random() * 10 + 15,
      };

      setFloatingHearts((prev) => [...prev.slice(-15), newHeart]);

      const heartTimeout = setTimeout(() => {
        setFloatingHearts((prev) => prev.filter((heart) => heart.id !== newHeart.id));
        timeoutsRef.current.delete(heartTimeout);
      }, 8000);
      timeoutsRef.current.add(heartTimeout);
    }, 1500);

    return () => {
      clearInterval(interval);
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    if (!isEnvelopeOpen) return;
    if (currentParagraph < letterContent.length - 1) {
      const timer = setTimeout(() => {
        setCurrentParagraph((prev) => prev + 1);
      }, 900);
      return () => clearTimeout(timer);
    }
  }, [currentParagraph, isEnvelopeOpen, letterContent.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100/70 via-pink-50/50 to-amber-100/60 dark:from-zinc-950 dark:via-purple-950/40 dark:to-zinc-900 relative overflow-hidden flex flex-col justify-center items-center p-4 sm:p-6 transition-colors duration-500">
      <SparkleTrail />
      <FloatingMusicPlayer />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Floating Hearts */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute opacity-40 animate-[floatUp_8s_linear_infinite]"
            style={{
              left: `${heart.left}%`,
              fontSize: `${heart.fontSize}px`,
              animationDuration: `${heart.duration}s`,
            }}
          >
            {heart.emoji}
          </div>
        ))}
      </div>

      {/* Decorative Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement className="absolute top-20 left-10 text-4xl text-rose-400/40">🌹</FloatingElement>
        <FloatingElement className="absolute top-32 right-16 text-3xl text-amber-400/40" animationDelay={1}>💐</FloatingElement>
        <FloatingElement className="absolute bottom-20 left-20 text-5xl text-pink-400/30" animationDelay={2}>💖</FloatingElement>
        <FloatingElement className="absolute bottom-32 right-20 text-4xl text-amber-400/30" animationDelay={0.5}>✨</FloatingElement>
      </div>

      {/* ENVELOPE COVER (Before Opening) */}
      {!isEnvelopeOpen ? (
        <div className="relative z-20 max-w-md w-full animate-slideUp text-center">
          <Card className="glass-panel p-8 rounded-3xl border-2 border-pink-300/80 shadow-2xl flex flex-col items-center">
            {/* Wax Seal Stamp */}
            <div
              onClick={() => setIsEnvelopeOpen(true)}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-red-600 via-rose-600 to-red-800 shadow-[0_0_25px_rgba(225,29,72,0.6)] border-4 border-amber-300/80 flex items-center justify-center cursor-pointer transition-all duration-300 hover:scale-110 mb-6 group select-none animate-pulseGlow"
              title="Click wax seal to break & open letter"
            >
              <Heart className="w-10 h-10 text-white fill-white group-hover:scale-110 transition-transform" />
            </div>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <Mail className="w-3.5 h-3.5" />
              Special Delivery for Muntsha
            </span>

            <h1
              className="text-3xl sm:text-4xl font-bold font-handwriting text-rose-600 dark:text-rose-300 mb-2"
              data-testid="text-letter-title"
            >
              A Heartfelt Letter
            </h1>
            <p className="text-sm text-muted-foreground mb-6">
              Written with sincere love and prayers on your special birthday.
            </p>

            <Button
              onClick={() => setIsEnvelopeOpen(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:opacity-90 shadow-lg px-8 py-3 rounded-full font-fun text-base"
            >
              <MailOpen className="w-4 h-4 mr-2" />
              Break Wax Seal &amp; Open Letter 💌
            </Button>

            <div className="mt-6">
              <Link href="/">
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                  Back Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      ) : (
        /* OPENED LETTER CONTENT */
        <div className="flex items-center justify-center min-h-screen p-4 relative z-20 w-full max-w-2xl py-12">
          <Card className="w-full glass-panel border-2 border-pink-300/70 shadow-2xl rounded-3xl overflow-hidden animate-slideUp bg-[#fffdfa]/95 dark:bg-[#1a1028]/95">
            {/* Header with Muntsha's Portrait */}
            <div className="bg-gradient-to-r from-rose-500/15 via-pink-500/10 to-amber-500/15 p-6 text-center border-b border-pink-200/50 dark:border-pink-900/40">
              <div className="mb-3 animate-gentleFloat">
                <img
                  src={muntshaPic}
                  alt="Muntsha"
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto shadow-xl border-4 border-rose-300/80"
                  data-testid="img-letter-muntsha"
                />
              </div>

              <h1
                className="text-3xl sm:text-4xl font-bold font-handwriting text-rose-600 dark:text-rose-300 mb-1"
                data-testid="text-letter-title"
              >
                💖 For My Beloved Muntsha 💖
              </h1>

              <div className="flex justify-center gap-2 mt-2">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse" />
                <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500 animate-pulse animation-delay-500" />
              </div>
            </div>

            {/* Letter Parchment Scroll Content */}
            <div className="p-6 sm:p-8 max-h-[55vh] overflow-y-auto space-y-6">
              <div className="font-handwriting text-xl sm:text-2xl text-foreground/90 leading-relaxed">
                {letterContent.map((paragraph, index) => (
                  <div
                    key={index}
                    className={`transition-all duration-700 ${
                      index <= currentParagraph
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-4'
                    } ${index === 0 ? 'font-bold text-2xl sm:text-3xl text-rose-600 dark:text-rose-400 mb-4' : 'mb-4'} ${
                      index === letterContent.length - 1 ? 'text-right font-bold text-rose-600 dark:text-rose-300 mt-6 pt-4 border-t border-pink-200/60' : ''
                    }`}
                    data-testid={`paragraph-${index}`}
                  >
                    {index === letterContent.length - 1 ? (
                      <div className="whitespace-pre-line text-rose-600 dark:text-rose-300">
                        {paragraph}
                      </div>
                    ) : (
                      paragraph
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with Controls */}
            <div className="bg-rose-50/60 dark:bg-zinc-900/60 p-4 sm:p-6 border-t border-pink-200/50 dark:border-pink-900/40">
              <div className="flex justify-between items-center gap-2">
                <Link href="/">
                  <Button variant="outline" className="rounded-full border-rose-300 hover:bg-rose-50" data-testid="button-back-letter">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back Home
                  </Button>
                </Link>

                <Button
                  onClick={() => setCurrentParagraph(0)}
                  className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-md hover:opacity-90"
                  data-testid="button-read-again"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  Read Again
                </Button>
              </div>

              <div className="text-center mt-3">
                <p className="text-xs text-muted-foreground italic">
                  &ldquo;Love is not just looking at each other, it&apos;s looking in the same direction together&rdquo; 💕
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}