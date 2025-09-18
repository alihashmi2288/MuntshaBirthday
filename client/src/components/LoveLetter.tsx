import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import FloatingElement from './FloatingElement';
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
    const hearts = ['💖', '💕', '💗', '💓', '💝', '🌹', '✨', '💐'];
    
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
    }, 1500);

    return () => {
      clearInterval(interval);
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      timeoutsRef.current.clear();
    };
  }, []);

  useEffect(() => {
    // Auto-advance through paragraphs
    if (currentParagraph < letterContent.length - 1) {
      const timer = setTimeout(() => {
        setCurrentParagraph(prev => prev + 1);
      }, 800 + currentParagraph * 200); // Faster text appearance
      
      return () => clearTimeout(timer);
    }
  }, [currentParagraph, letterContent.length]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-primary/10 to-accent/30 relative overflow-hidden">
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-50">
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

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <FloatingElement className="absolute top-20 left-10 text-4xl text-accent/30">
          🌹
        </FloatingElement>
        <FloatingElement className="absolute top-32 right-16 text-3xl text-primary/40" animationDelay={1}>
          💐
        </FloatingElement>
        <FloatingElement className="absolute bottom-20 left-20 text-5xl text-accent/20" animationDelay={2}>
          💖
        </FloatingElement>
        <FloatingElement className="absolute bottom-32 right-20 text-4xl text-primary/30" animationDelay={0.5}>
          ✨
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-20">
        <Card className="max-w-2xl w-full backdrop-blur-xl bg-card/95 border-2 border-accent/30 shadow-2xl rounded-3xl overflow-hidden">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-6 text-center border-b border-accent/20">
            <div className="mb-4 animate-float">
              <img 
                src={muntshaPic} 
                alt="Muntsha" 
                className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover mx-auto shadow-xl border-4 border-accent/50 animate-pulse"
                data-testid="img-letter-muntsha"
              />
            </div>
            
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent mb-2 animate-pulse"
                style={{ fontFamily: "'Dancing Script', cursive" }}
                data-testid="text-letter-title">
              💖 For My Beloved Muntsha 💖
            </h1>
            
            <div className="flex justify-center gap-2 mt-4">
              <Heart className="w-5 h-5 text-accent animate-pulse" />
              <Sparkles className="w-5 h-5 text-primary animate-pulse animation-delay-500" />
              <Heart className="w-5 h-5 text-accent animate-pulse animation-delay-1000" />
            </div>
          </div>

          {/* Letter Content */}
          <div className="p-6 md:p-8 max-h-96 overflow-y-auto">
            <div className="space-y-6 text-muted-foreground leading-relaxed"
                 style={{ fontFamily: "'Dancing Script', cursive", fontSize: '1.1rem' }}>
              {letterContent.map((paragraph, index) => (
                <div
                  key={index}
                  className={`transition-all duration-1000 ${
                    index <= currentParagraph 
                      ? 'opacity-100 translate-y-0' 
                      : 'opacity-0 translate-y-4'
                  } ${index === 0 ? 'font-semibold text-lg' : ''} ${
                    index === letterContent.length - 1 ? 'text-right font-semibold mt-8' : ''
                  }`}
                  data-testid={`paragraph-${index}`}
                >
                  {index === letterContent.length - 1 ? (
                    <div className="whitespace-pre-line text-accent font-bold">
                      {paragraph}
                    </div>
                  ) : (
                    paragraph
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 border-t border-accent/20">
            <div className="flex justify-between items-center">
              <Link href="/">
                <Button variant="outline" className="hover-elevate" data-testid="button-back-letter">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back Home
                </Button>
              </Link>
              
              <Button 
                onClick={() => setCurrentParagraph(0)}
                className="bg-gradient-to-r from-accent to-primary hover-elevate shadow-lg"
                data-testid="button-read-again"
              >
                <Heart className="w-4 h-4 mr-2" />
                Read Again
              </Button>
            </div>
            
            <div className="text-center mt-4">
              <p className="text-xs text-muted-foreground italic">
                "Love is not just looking at each other, it's looking in the same direction together" 💕
              </p>
            </div>
          </div>
        </Card>
      </div>

      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) rotate(0deg); opacity: 0; }
          10% { opacity: 0.4; }
          90% { opacity: 0.4; }
          100% { transform: translateY(-100px) rotate(360deg); opacity: 0; }
        }
        
        .animation-delay-500 { animation-delay: 0.5s; }
        .animation-delay-1000 { animation-delay: 1s; }
      `}</style>
    </div>
  );
}