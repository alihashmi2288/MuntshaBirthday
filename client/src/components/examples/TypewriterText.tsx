import TypewriterText from '../TypewriterText';

export default function TypewriterTextExample() {
  return (
    <div className="p-8">
      <div className="space-y-4">
        <TypewriterText 
          text="Happy Birthday, My Love!" 
          className="text-4xl font-bold text-primary"
          speed={150}
        />
        
        <TypewriterText 
          text="Hope your special day is as amazing as you are!"
          className="text-xl text-foreground"
          delay={3000}
          speed={80}
        />
      </div>
    </div>
  );
}