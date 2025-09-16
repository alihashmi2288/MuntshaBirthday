import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Cake, Gift } from 'lucide-react';
import TypewriterText from './TypewriterText';
import FloatingElement from './FloatingElement';
import shinChanImg from '@assets/generated_images/Shin_Chan_character_image_5f6a317d.png';
import cakeImg from '@assets/generated_images/Birthday_cake_cartoon_image_15303aff.png';
import balloonsImg from '@assets/generated_images/Cartoon_balloon_bouquet_ed95afde.png';

interface BirthdayCardProps {
  onCelebrate?: () => void;
}

export default function BirthdayCard({ onCelebrate }: BirthdayCardProps) {
  const handleCelebrate = () => {
    console.log('Celebrate button clicked!');
    if (onCelebrate) onCelebrate();
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-card to-accent/20 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0">
        {/* Balloons */}
        <FloatingElement className="absolute top-10 left-10">
          <img src={balloonsImg} alt="Balloons" className="w-24 h-24 object-contain" />
        </FloatingElement>
        
        <FloatingElement className="absolute top-20 right-16" animationDelay={1}>
          <img src={balloonsImg} alt="Balloons" className="w-20 h-20 object-contain" />
        </FloatingElement>

        {/* Hearts */}
        <FloatingElement className="absolute top-1/4 left-1/4" animationDelay={2}>
          <Heart className="w-8 h-8 text-accent animate-pulse" />
        </FloatingElement>
        
        <FloatingElement className="absolute top-1/3 right-1/4" animationDelay={0.5}>
          <Heart className="w-6 h-6 text-primary animate-pulse" />
        </FloatingElement>
        
        <FloatingElement className="absolute bottom-1/4 left-1/3" animationDelay={1.5}>
          <Heart className="w-10 h-10 text-accent/70 animate-pulse" />
        </FloatingElement>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-8">
        <Card className="max-w-4xl w-full p-8 md:p-16 text-center space-y-8 border-2 shadow-xl">
          {/* Shin Chan Character */}
          <div className="flex justify-center">
            <FloatingElement className="animate-bounce-gentle">
              <img 
                src={shinChanImg} 
                alt="Shin Chan" 
                className="w-48 h-48 md:w-64 md:h-64 object-contain hover-elevate rounded-full transition-transform hover:scale-105"
                data-testid="img-shinchan"
              />
            </FloatingElement>
          </div>

          {/* Birthday Message */}
          <div className="space-y-4">
            <TypewriterText 
              text="🎉 Happy Birthday, My Love! 🎉"
              className="text-3xl md:text-5xl font-bold text-primary"
              speed={100}
              delay={500}
            />
            
            <TypewriterText 
              text="Hope your special day is filled with Shin Chan's mischief and lots of joy!"
              className="text-lg md:text-xl text-foreground/80"
              speed={60}
              delay={4000}
            />
          </div>

          {/* Birthday Cake */}
          <FloatingElement className="flex justify-center" animationDelay={1}>
            <img 
              src={cakeImg} 
              alt="Birthday Cake" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain hover-elevate transition-transform hover:scale-110"
              data-testid="img-cake"
            />
          </FloatingElement>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="text-lg px-8 py-3 hover-elevate shadow-lg"
              onClick={handleCelebrate}
              data-testid="button-celebrate"
            >
              <Cake className="w-6 h-6 mr-2" />
              Let's Celebrate!
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="text-lg px-8 py-3 hover-elevate shadow-lg"
              onClick={() => console.log('Send love clicked!')}
              data-testid="button-send-love"
            >
              <Heart className="w-6 h-6 mr-2" />
              Send Love
            </Button>
          </div>

          {/* Additional Message */}
          <div className="pt-4">
            <TypewriterText 
              text="You bring as much happiness to my life as Shin Chan brings laughter to everyone! 💕"
              className="text-base md:text-lg text-muted-foreground italic"
              speed={50}
              delay={7000}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}