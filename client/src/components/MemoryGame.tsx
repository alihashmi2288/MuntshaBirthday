import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowLeft, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FloatingMusicPlayer from './FloatingMusicPlayer';
import SparkleTrail from './SparkleTrail';
import muntshaPic from '@assets/muntsha-photo.jpg';

interface GameCard {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface ConfettiPiece {
  id: number;
  left: number;
  backgroundColor: string;
  delay: number;
  borderRadius: string;
}

export default function MemoryGame() {
  const [gameCards, setGameCards] = useState<GameCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  const cardEmojis = ['🎂', '🎈', '🎁', '🎉', '💖', '🍰'];

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

  const playFlipSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const playMatchSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.frequency.value = 1200;
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.18, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.35);
    } catch (e) {}
  };

  const playVictoryMusic = () => {
    const ctx = initAudio();
    if (!ctx) return;
    try {
      if (ctx.state === 'suspended') ctx.resume();
      const melody = [
        { freq: 261.63, duration: 0.4 },
        { freq: 261.63, duration: 0.3 },
        { freq: 293.66, duration: 0.6 },
        { freq: 261.63, duration: 0.6 },
        { freq: 349.23, duration: 0.6 },
        { freq: 329.63, duration: 1.0 },
      ];
      let currentTime = ctx.currentTime;
      melody.forEach((note) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.2, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);
        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);
        currentTime += note.duration + 0.08;
      });
    } catch (e) {}
  };

  const createConfetti = () => {
    const colors = ['#ff6b8b', '#ffd166', '#06d6a0', '#118ab2', '#ff9f1c', '#e76f51'];
    const newConfetti: ConfettiPiece[] = [];
    for (let i = 0; i < 60; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      });
    }
    setConfetti(newConfetti);
    const confettiTimeout = setTimeout(() => {
      setConfetti([]);
      timeoutsRef.current.delete(confettiTimeout);
    }, 3500);
    timeoutsRef.current.add(confettiTimeout);
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const initializeGame = () => {
    const cards: GameCard[] = [];
    cardEmojis.forEach((emoji, index) => {
      cards.push(
        { id: index * 2, emoji, isFlipped: false, isMatched: false },
        { id: index * 2 + 1, emoji, isFlipped: false, isMatched: false }
      );
    });

    setGameCards(shuffleArray(cards));
    setSelectedCards([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsProcessing(false);
    setShowModal(false);
  };

  useEffect(() => {
    initializeGame();
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      timeoutsRef.current.forEach((timeout) => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  const handleCardClick = (cardId: number) => {
    if (isProcessing || selectedCards.length >= 2) return;

    const card = gameCards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || selectedCards.includes(cardId)) return;

    playFlipSound();

    setGameCards((prevCards) =>
      prevCards.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c))
    );

    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      setIsProcessing(true);
      setMoves((prev) => prev + 1);

      const matchTimeout = setTimeout(() => {
        checkForMatch(newSelectedCards);
        timeoutsRef.current.delete(matchTimeout);
      }, 900);
      timeoutsRef.current.add(matchTimeout);
    }
  };

  const checkForMatch = (selectedIds: number[]) => {
    const [firstId, secondId] = selectedIds;
    const currentCards = gameCards;
    const firstCard = currentCards.find((c) => c.id === firstId);
    const secondCard = currentCards.find((c) => c.id === secondId);

    if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
      playMatchSound();

      setGameCards((prevCards) =>
        prevCards.map((c) =>
          c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
        )
      );

      const newMatchedPairs = matchedPairs + 1;
      setMatchedPairs(newMatchedPairs);

      if (newMatchedPairs === cardEmojis.length) {
        const victoryTimeout = setTimeout(() => {
          createConfetti();
          playVictoryMusic();
          setShowModal(true);
          timeoutsRef.current.delete(victoryTimeout);
        }, 600);
        timeoutsRef.current.add(victoryTimeout);
      }
    } else {
      const flipBackTimeout = setTimeout(() => {
        setGameCards((prevCards) =>
          prevCards.map((c) =>
            c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
          )
        );
        timeoutsRef.current.delete(flipBackTimeout);
      }, 800);
      timeoutsRef.current.add(flipBackTimeout);
    }

    setSelectedCards([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100/70 via-pink-50/50 to-amber-100/60 dark:from-zinc-950 dark:via-purple-950/40 dark:to-zinc-900 p-4 relative overflow-x-hidden flex items-center justify-center transition-colors duration-500">
      <SparkleTrail />
      <FloatingMusicPlayer />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Confetti Animation */}
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2.5 h-2.5 animate-confetti-fall"
              style={{
                left: `${piece.left}%`,
                backgroundColor: piece.backgroundColor,
                animationDelay: `${piece.delay}s`,
                borderRadius: piece.borderRadius,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Game Container */}
      <div className="w-full max-w-md my-8">
        <Card className="glass-panel border-2 border-pink-300/70 shadow-2xl p-6 sm:p-8 rounded-3xl animate-slideUp">
          
          {/* Header */}
          <div className="text-center mb-6">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Muntsha Turns 19 &bull; 2026 Match Challenge
            </span>
            <h1
              className="text-3xl sm:text-4xl font-bold font-handwriting text-rose-600 dark:text-rose-300 mb-1"
              data-testid="text-game-title"
            >
              🎉 Happy 19th Birthday, Muntsha! 🎉
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Celebrating 19 beautiful years! Match all pairs for a special victory message!
            </p>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-4 gap-2.5 sm:gap-3 mb-6 justify-items-center">
            {gameCards.map((card, index) => (
              <div
                key={card.id}
                className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-2xl cursor-pointer shadow-md transition-all duration-300 hover:scale-105 select-none ${
                  card.isFlipped || card.isMatched ? 'rotate-y-0' : ''
                }`}
                onClick={() => handleCardClick(card.id)}
                style={{ animationDelay: `${index * 0.05}s` }}
                data-testid={`card-${card.id}`}
              >
                {/* Card Back */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-400 via-pink-500 to-amber-400 border-2 border-white/60 dark:border-zinc-700 flex items-center justify-center text-xl text-white shadow-inner transition-all duration-300 ${
                    card.isFlipped || card.isMatched ? 'opacity-0 scale-95 pointer-events-none' : 'opacity-100 scale-100'
                  }`}
                >
                  🎀
                </div>

                {/* Card Front */}
                <div
                  className={`absolute inset-0 rounded-2xl ${
                    card.isMatched
                      ? 'bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-400/40'
                      : 'bg-gradient-to-br from-rose-100 to-pink-200 dark:from-zinc-800 dark:to-pink-950'
                  } border-2 border-pink-300 dark:border-pink-800 flex items-center justify-center text-3xl shadow-md transition-all duration-300 ${
                    card.isFlipped || card.isMatched ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}
                >
                  {card.emoji}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="bg-rose-50/70 dark:bg-zinc-900/60 rounded-2xl p-3.5 mb-6 border border-pink-200/60 dark:border-pink-900/40">
            <div className="flex justify-around items-center text-sm font-bold font-fun">
              <div>
                <span className="text-muted-foreground mr-1.5">Moves:</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold" data-testid="text-moves">
                  {moves}
                </span>
              </div>
              <div className="h-4 w-px bg-pink-300/60" />
              <div>
                <span className="text-muted-foreground mr-1.5">Pairs:</span>
                <span className="text-rose-600 dark:text-rose-400 font-bold" data-testid="text-pairs">
                  {matchedPairs} / {cardEmojis.length}
                </span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="rounded-full border-rose-300 hover:bg-rose-50 px-5" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>

            <Button
              onClick={initializeGame}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-md hover:opacity-90 px-5"
              size="sm"
              data-testid="button-restart"
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Restart
            </Button>
          </div>
        </Card>
      </div>

      {/* Victory Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade">
          <Card className="max-w-sm w-full p-6 text-center glass-panel border-2 border-rose-400 shadow-2xl rounded-3xl animate-modalAppear bg-[#fffdfa] dark:bg-zinc-900">
            <div className="mb-4 animate-gentleFloat">
              <img
                src={muntshaPic}
                alt="Muntsha"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover mx-auto shadow-xl border-4 border-rose-400"
                data-testid="img-victory-muntsha"
              />
            </div>

            <h2 className="text-3xl font-bold font-handwriting text-rose-600 dark:text-rose-300 mb-3">
              🎉 Happy 19th Birthday, Muntsha! 🎉
            </h2>

            <div className="bg-rose-50/80 dark:bg-zinc-800/80 p-4 mb-5 rounded-2xl border border-pink-200 dark:border-pink-900 text-xs sm:text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">
              <p className="mb-2">
                <strong className="text-rose-600 dark:text-rose-400">Level 19 Unlocked with {moves} moves! 🌸</strong>
              </p>
              <p className="mb-2">
                Muntsha, congratulations on turning 19! May 2026 be your happiest, brightest, and most successful year yet. You are the greatest gift in my life!
              </p>
              <p className="font-bold text-rose-600 dark:text-rose-400 font-handwriting text-lg">
                ✨ Forever with you in 2026 &amp; always &bull; Ali ✨
              </p>
            </div>

            <Button
              onClick={() => {
                setShowModal(false);
                initializeGame();
              }}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-lg hover:opacity-90 w-full py-2.5 font-fun"
              data-testid="button-play-again"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}