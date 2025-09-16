import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { Play, Sparkles, Heart } from 'lucide-react';
import FloatingElement from './FloatingElement';
import ThemeToggle from './ThemeToggle';
import shinChanImg from '@assets/generated_images/Shin_Chan_character_image_5f6a317d.png';
import muntshaPic from '@assets/muntsha-photo.jpg';

interface FloatingHeart {
  id: number;
  left: number;
  emoji: string;
  duration: number;
  fontSize: number;
}

export default function LandingPage() {
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const timeoutsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    const hearts = ['💖', '💕', '💗', '💓', '💝', '🎈', '🎂', '🎉'];
    
    const interval = setInterval(() => {
      const newHeart: FloatingHeart = {
        id: Date.now() + Math.random(),
        left: Math.random() * 100,
        emoji: hearts[Math.floor(Math.random() * hearts.length)],
        duration: Math.random() * 3 + 5,
        fontSize: Math.random() * 10 + 15,
      };
      
      setFloatingHearts(prev => [...prev, newHeart]);
      
      const heartTimeout = setTimeout(() => {
        setFloatingHearts(prev => prev.filter(heart => heart.id !== newHeart.id));
        timeoutsRef.current.delete(heartTimeout);
      }, 8000);
      timeoutsRef.current.add(heartTimeout);
    }, 2000);

    return () => {
      clearInterval(interval);
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-primary/20 via-accent/10 to-primary/30 animate-pulse">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 bg-[length:400%_400%] animate-[gradientShift_15s_ease_infinite]" />
      
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Floating Hearts */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {floatingHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute opacity-30 animate-[floatUp_8s_linear_infinite]"
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

      {/* Main Container */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-20">
        <Card className="max-w-4xl w-full p-8 md:p-16 backdrop-blur-2xl bg-card/95 border-2 border-primary/20 shadow-2xl animate-slideUp">
          
          {/* Title Section */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-pulse mb-6 drop-shadow-lg"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                data-testid="text-main-title">
              🎉 Muntsha Birthday Adventure 🎉
            </h1>

            {/* Profile Images Section */}
            <div className="flex justify-center items-center gap-8 mb-8">
              {/* Muntsha's Photo */}
              <FloatingElement className="relative">
                <img 
                  src={muntshaPic} 
                  alt="Muntsha" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-primary/50 shadow-xl hover-elevate transition-all duration-300 hover:scale-110 hover:rotate-3"
                  data-testid="img-muntsha"
                />
                {/* Sparkles around Muntsha's image */}
                <div className="absolute -top-2 -left-2 text-2xl animate-sparkle">✨</div>
                <div className="absolute -top-2 -right-2 text-xl animate-sparkle animation-delay-500">⭐</div>
                <div className="absolute -bottom-2 -left-2 text-xl animate-sparkle animation-delay-1000">💖</div>
                <div className="absolute -bottom-2 -right-2 text-2xl animate-sparkle animation-delay-1500">🌟</div>
              </FloatingElement>

              {/* Heart in the middle */}
              <FloatingElement animationDelay={1} className="text-4xl text-accent animate-pulse">
                💕
              </FloatingElement>

              {/* Shin Chan */}
              <FloatingElement className="relative" animationDelay={0.5}>
                <img 
                  src={shinChanImg} 
                  alt="Shin Chan" 
                  className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-accent/50 shadow-xl hover-elevate transition-all duration-300 hover:scale-110 hover:-rotate-3"
                  data-testid="img-shinchan-landing"
                />
                <div className="absolute -top-2 -left-2 text-2xl animate-bounce">🎮</div>
                <div className="absolute -top-2 -right-2 text-xl animate-bounce animation-delay-300">🎂</div>
                <div className="absolute -bottom-2 -left-2 text-xl animate-bounce animation-delay-600">🎈</div>
                <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce animation-delay-900">🎉</div>
              </FloatingElement>
            </div>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-4 font-semibold animate-slideUp animation-delay-500">
              Choose your birthday adventure with Shin Chan!
            </p>
            <p className="text-accent italic font-bold text-lg animate-slideUp animation-delay-700" data-testid="text-love-message">
              Made with love for the most amazing person 💖
            </p>
          </div>

          {/* Option Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Play Game Option */}
            <Link href="/game">
              <Card className="p-6 text-center cursor-pointer transition-all duration-500 hover-elevate hover:scale-105 hover:-translate-y-2 backdrop-blur-lg bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-slideUp animation-delay-200"
                    data-testid="card-play-game">
                <div className="text-5xl mb-4 animate-bounce" data-testid="icon-play">
                  🎮
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Play Game</h3>
                <p className="text-muted-foreground text-sm">A memory game with Shin Chan for you to complete!</p>
                <div className="mt-4">
                  <Button variant="outline" className="hover-elevate">
                    <Play className="w-4 h-4 mr-2" />
                    Start Game
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Fireworks Option */}
            <Link href="/fireworks">
              <Card className="p-6 text-center cursor-pointer transition-all duration-500 hover-elevate hover:scale-105 hover:-translate-y-2 backdrop-blur-lg bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20 animate-slideUp animation-delay-400"
                    data-testid="card-fireworks">
                <div className="text-5xl mb-4 animate-bounce animation-delay-500" data-testid="icon-fireworks">
                  🎆
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Fireworks</h3>
                <p className="text-muted-foreground text-sm">Celebrate with spectacular fireworks show!</p>
                <div className="mt-4">
                  <Button variant="outline" className="hover-elevate">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Launch Show
                  </Button>
                </div>
              </Card>
            </Link>

            {/* Letter Option */}
            <Link href="/letter">
              <Card className="p-6 text-center cursor-pointer transition-all duration-500 hover-elevate hover:scale-105 hover:-translate-y-2 backdrop-blur-lg bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 animate-slideUp animation-delay-600"
                    data-testid="card-letter">
                <div className="text-5xl mb-4 animate-bounce animation-delay-1000" data-testid="icon-letter">
                  💌
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">Love Letter</h3>
                <p className="text-muted-foreground text-sm">A heartfelt letter for my beloved Muntsha!</p>
                <div className="mt-4">
                  <Button variant="outline" className="hover-elevate">
                    <Heart className="w-4 h-4 mr-2" />
                    Read Letter
                  </Button>
                </div>
              </Card>
            </Link>
          </div>
        </Card>
      </div>

    </div>
  );
}