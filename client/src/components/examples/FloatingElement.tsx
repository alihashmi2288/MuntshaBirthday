import FloatingElement from '../FloatingElement';
import { Heart } from 'lucide-react';

export default function FloatingElementExample() {
  return (
    <div className="p-8 flex gap-4">
      <FloatingElement>
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center">
          <Heart className="w-8 h-8 text-primary-foreground" />
        </div>
      </FloatingElement>
      
      <FloatingElement animationDelay={1}>
        <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center">
          ⭐
        </div>
      </FloatingElement>
    </div>
  );
}