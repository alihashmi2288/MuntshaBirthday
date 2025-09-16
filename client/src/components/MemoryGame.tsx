import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowLeft, RotateCcw, Heart, Trophy } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
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
  
  useEffect(() => {
    initializeGame();
    return () => {
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

  const playFlipSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 800;
      oscillator.type = 'sine';
      gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  };

  const playMatchSound = () => {
    const ctx = initAudio();
    if (!ctx) return;
    
    try {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.value = 1200;
      oscillator.type = 'triangle';
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);
    } catch (e) {}
  };

  const playVictoryMusic = () => {
    const ctx = initAudio();
    if (!ctx) return;
    
    try {
      // Happy Birthday melody
      const melody = [
        {freq: 261.63, duration: 0.5}, // C4 - Hap-
        {freq: 261.63, duration: 0.3}, // C4 - py
        {freq: 293.66, duration: 0.7}, // D4 - Birth-
        {freq: 261.63, duration: 0.7}, // C4 - day
        {freq: 349.23, duration: 0.7}, // F4 - to
        {freq: 329.63, duration: 1.0}, // E4 - you
      ];
      
      let currentTime = ctx.currentTime;
      
      melody.forEach((note) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.value = note.freq;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, currentTime + note.duration);
        
        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);
        
        currentTime += note.duration + 0.1;
      });
    } catch (e) {}
  };

  const createConfetti = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#ffd700', '#ff69b4', '#98fb98'];
    const newConfetti: ConfettiPiece[] = [];
    
    for (let i = 0; i < 50; i++) {
      newConfetti.push({
        id: i,
        left: Math.random() * 100,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 2,
        borderRadius: Math.random() > 0.5 ? '50%' : '0',
      });
    }
    
    setConfetti(newConfetti);
    
    // Clear confetti after animation
    const confettiTimeout = setTimeout(() => {
      setConfetti([]);
      timeoutsRef.current.delete(confettiTimeout);
    }, 3000);
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

  const handleCardClick = (cardId: number) => {
    if (isProcessing || selectedCards.length >= 2) return;
    
    const card = gameCards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched) return;

    playFlipSound();
    
    const newCards = gameCards.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    );
    setGameCards(newCards);
    
    const newSelectedCards = [...selectedCards, cardId];
    setSelectedCards(newSelectedCards);

    if (newSelectedCards.length === 2) {
      setIsProcessing(true);
      setMoves(prev => prev + 1);
      
      const matchTimeout = setTimeout(() => {
        checkForMatch(newSelectedCards);
        timeoutsRef.current.delete(matchTimeout);
      }, 600);
      timeoutsRef.current.add(matchTimeout);
    }
  };

  const checkForMatch = (selectedIds: number[]) => {
    const [firstId, secondId] = selectedIds;
    const firstCard = gameCards.find(c => c.id === firstId);
    const secondCard = gameCards.find(c => c.id === secondId);

    if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
      // Match found
      playMatchSound();
      
      const newCards = gameCards.map(c => {
        if (c.id === firstId || c.id === secondId) {
          return { ...c, isMatched: true };
        }
        return c;
      });
      
      setGameCards(newCards);
      const newMatchedPairs = matchedPairs + 1;
      setMatchedPairs(newMatchedPairs);
      
      // Check if game is complete
      if (newMatchedPairs === cardEmojis.length) {
        const victoryTimeout = setTimeout(() => {
          createConfetti();
          playVictoryMusic();
          setShowModal(true);
          timeoutsRef.current.delete(victoryTimeout);
        }, 800);
        timeoutsRef.current.add(victoryTimeout);
      }
    } else {
      // No match - flip cards back
      const flipBackTimeout = setTimeout(() => {
        const newCards = gameCards.map(c => {
          if (c.id === firstId || c.id === secondId) {
            return { ...c, isFlipped: false };
          }
          return c;
        });
        setGameCards(newCards);
        timeoutsRef.current.delete(flipBackTimeout);
      }, 400);
      timeoutsRef.current.add(flipBackTimeout);
    }
    
    setSelectedCards([]);
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 p-4 relative">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Confetti Animation */}
      {confetti.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confetti.map((piece) => (
            <div
              key={piece.id}
              className="absolute w-2 h-2 animate-confetti-fall"
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
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md backdrop-blur-xl bg-card/95 border-2 border-primary/20 shadow-2xl p-6">
          
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2"
                data-testid="text-game-title">
              🎉 Happy Birthday, Muntsha! 🎉
            </h1>
            <p className="text-sm text-muted-foreground mb-2">
              A little memory game for you. Find all the matching pairs!
            </p>
            <p className="text-xs text-accent italic font-semibold">
              Fun fact: Muntsha loves purple and surprises! 🎈
            </p>
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-4 gap-3 mb-6 justify-items-center">
            {gameCards.map((card, index) => (
              <div
                key={card.id}
                className={`game-card relative w-14 h-14 md:w-16 md:h-16 rounded-xl cursor-pointer shadow-lg transition-all duration-500 hover-elevate ${
                  card.isFlipped || card.isMatched ? 'flipped' : ''
                } ${card.isMatched ? 'matched' : ''}`}
                onClick={() => handleCardClick(card.id)}
                style={{ animationDelay: `${index * 0.1}s` }}
                data-testid={`card-${card.id}`}
              >
                {/* Card Back */}
                <div className={`absolute inset-0 rounded-xl bg-gradient-to-br from-accent via-primary to-accent flex items-center justify-center text-2xl text-white shadow-inner ${
                  card.isFlipped || card.isMatched ? 'opacity-0 rotate-y-180' : 'opacity-100'
                } transition-all duration-500`}>
                  🎀
                </div>
                
                {/* Card Front */}
                <div className={`absolute inset-0 rounded-xl ${
                  card.isMatched ? 'bg-gradient-to-br from-green-400 to-blue-500 shadow-lg shadow-green-400/50' : 'bg-gradient-to-br from-primary to-accent'
                } flex items-center justify-center text-2xl md:text-3xl text-white shadow-inner ${
                  card.isFlipped || card.isMatched ? 'opacity-100 rotate-y-0' : 'opacity-0 rotate-y-180'
                } transition-all duration-500`}>
                  {card.emoji}
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <Card className="bg-card/80 backdrop-blur-sm p-4 mb-6">
            <div className="flex justify-between items-center text-sm font-bold">
              <div className="text-muted-foreground">
                <span className="text-accent">Moves:</span> 
                <span className="text-primary ml-1 animate-bounce" data-testid="text-moves">{moves}</span>
              </div>
              <div className="text-muted-foreground">
                <span className="text-accent">Pairs:</span> 
                <span className="text-primary ml-1 animate-bounce" data-testid="text-pairs">{matchedPairs}/{cardEmojis.length}</span>
              </div>
            </div>
          </Card>

          {/* Controls */}
          <div className="flex gap-2 justify-center">
            <Link href="/">
              <Button variant="outline" size="sm" className="hover-elevate" data-testid="button-back">
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back
              </Button>
            </Link>
            
            <Button 
              onClick={initializeGame}
              className="bg-gradient-to-r from-primary to-accent hover-elevate shadow-lg"
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
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-sm w-full p-6 text-center bg-gradient-to-br from-card to-accent/10 border-2 border-primary/30 animate-modalAppear">
            <div className="mb-4 animate-float">
              <img 
                src={muntshaPic} 
                alt="Muntsha" 
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover mx-auto mb-4 shadow-xl border-4 border-accent animate-pulse"
                data-testid="img-victory-muntsha"
              />
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4 animate-pulse">
              🎉 🎂 Happy Birthday, Muntsha! 🎂 🎉
            </h2>
            
            <Card className="bg-card/70 backdrop-blur-sm p-4 mb-6 border border-primary/20">
              <p className="text-sm md:text-base leading-relaxed font-medium">
                <span className="text-lg animate-bounce">💖</span> <strong className="text-primary">Happy Birthday, my love!</strong> <span className="text-lg animate-bounce">💖</span><br/><br/>
                
                <span className="text-accent font-bold">Muntsha</span>, you are the <em className="text-primary font-semibold">best thing</em> that has ever happened to me. I love you with all my <strong className="text-destructive">heart and soul</strong>.<br/><br/>
                
                I'm truly the <strong className="text-green-600 font-bold">luckiest person</strong> to have you in my life. May <span className="text-blue-600 font-semibold">Allah</span> always bless you with <em className="text-yellow-600 font-medium">happiness</em>, <em className="text-green-600 font-medium">health</em>, and <em className="text-accent font-medium">endless joy</em>.<br/><br/>
                
                <strong className="text-primary text-lg font-bold">✨ You mean everything to me. ✨</strong>
              </p>
            </Card>
            
            <Button 
              onClick={() => {
                setShowModal(false);
                initializeGame();
              }}
              className="bg-gradient-to-r from-primary to-accent hover-elevate shadow-xl"
              data-testid="button-play-again"
            >
              <Trophy className="w-4 h-4 mr-2" />
              Play Again
            </Button>
          </Card>
        </div>
      )}

      <style jsx>{`
        .game-card {
          perspective: 1000px;
          animation: slideUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes slideUp {
          to { opacity: 1; transform: translateY(0); }
        }
        
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        
        .rotate-y-0 {
          transform: rotateY(0deg);
        }
        
        @keyframes modalAppear {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .animate-modalAppear {
          animation: modalAppear 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}