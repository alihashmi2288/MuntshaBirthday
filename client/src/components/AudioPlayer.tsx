import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  onPlay?: () => void;
}

export default function AudioPlayer({ onPlay }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (onPlay) onPlay();
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex items-center gap-2 p-4 bg-card rounded-lg border hover-elevate">
      <Button
        size="icon"
        variant="ghost"
        onClick={togglePlay}
        className="hover-elevate"
        data-testid="button-audio-play"
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </Button>
      
      <div className="flex-1">
        <p className="text-sm font-semibold text-foreground">Happy Birthday Song</p>
        <p className="text-xs text-muted-foreground">Shin Chan Theme</p>
      </div>
      
      <Button
        size="icon"
        variant="ghost"
        onClick={toggleMute}
        className="hover-elevate"
        data-testid="button-audio-mute"
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </Button>
      
      <audio ref={audioRef} loop>
        <source src="happy-birthday-song.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}