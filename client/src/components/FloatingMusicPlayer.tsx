import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Music, Heart } from 'lucide-react';

export default function FloatingMusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);
  const currentNoteIndex = useRef(0);

  // Sweet kalimba / music box frequencies for Happy Birthday & Romantic melody
  // Notes: C4=261.6, D4=293.7, E4=329.6, F4=349.2, G4=392.0, A4=440.0, B4=493.9, C5=523.3
  const melody = [
    { freq: 261.6, dur: 0.35 }, { freq: 261.6, dur: 0.35 }, { freq: 293.7, dur: 0.7 }, { freq: 261.6, dur: 0.7 },
    { freq: 349.2, dur: 0.7 }, { freq: 329.6, dur: 1.2 },
    { freq: 261.6, dur: 0.35 }, { freq: 261.6, dur: 0.35 }, { freq: 293.7, dur: 0.7 }, { freq: 261.6, dur: 0.7 },
    { freq: 392.0, dur: 0.7 }, { freq: 349.2, dur: 1.2 },
    { freq: 261.6, dur: 0.35 }, { freq: 261.6, dur: 0.35 }, { freq: 523.3, dur: 0.7 }, { freq: 440.0, dur: 0.7 },
    { freq: 349.2, dur: 0.7 }, { freq: 329.6, dur: 0.7 }, { freq: 293.7, dur: 1.0 },
    { freq: 466.2, dur: 0.35 }, { freq: 466.2, dur: 0.35 }, { freq: 440.0, dur: 0.7 }, { freq: 349.2, dur: 0.7 },
    { freq: 392.0, dur: 0.7 }, { freq: 349.2, dur: 1.4 },
    // Soft romantic bridge
    { freq: 329.6, dur: 0.6 }, { freq: 392.0, dur: 0.6 }, { freq: 440.0, dur: 0.8 }, { freq: 523.3, dur: 1.2 },
  ];

  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playChimeNote = (freq: number, duration: number) => {
    if (isMuted) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      // Soft triangle tone like a music box
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Add harmonic shimmer
      const overtone = ctx.createOscillator();
      const overtoneGain = ctx.createGain();
      overtone.type = 'triangle';
      overtone.frequency.setValueAtTime(freq * 2, ctx.currentTime);

      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      overtoneGain.gain.setValueAtTime(0, ctx.currentTime);
      overtoneGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.03);
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration * 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);

      overtone.connect(overtoneGain);
      overtoneGain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      overtone.start(ctx.currentTime);

      osc.stop(ctx.currentTime + duration);
      overtone.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio playback handling
    }
  };

  const scheduleNextNote = () => {
    if (!isPlaying) return;
    const note = melody[currentNoteIndex.current];
    playChimeNote(note.freq, note.dur);

    currentNoteIndex.current = (currentNoteIndex.current + 1) % melody.length;
    timerRef.current = window.setTimeout(scheduleNextNote, note.dur * 1000 + 120);
  };

  useEffect(() => {
    if (isPlaying) {
      scheduleNextNote();
    } else {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isPlaying, isMuted]);

  const togglePlay = () => {
    getAudioContext();
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <aside aria-label="Music Player Controls" className="fixed bottom-5 left-5 z-40">
      <div className="glass-panel p-2.5 rounded-full shadow-xl flex items-center gap-2 border border-pink-300/50 bg-white/85 dark:bg-zinc-900/85 transition-all duration-300 hover:scale-105">
        <Button
          size="icon"
          variant="ghost"
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 text-white hover:from-rose-500 hover:to-pink-600 shadow-md"
          title={isPlaying ? 'Pause music' : 'Play romantic birthday music'}
        >
          {isPlaying ? (
            <span className="relative flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-200 opacity-60"></span>
              <Heart className="w-5 h-5 fill-white animate-pulse" />
            </span>
          ) : (
            <Music className="w-5 h-5" />
          )}
        </Button>

        {!minimized && (
          <div className="px-2 pr-1 flex items-center gap-2">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 font-fun">
                {isPlaying ? '♪ Playing for Muntsha' : 'Tap for Music 🎵'}
              </span>
              <span className="text-[10px] text-muted-foreground">Sweet Kalimba Melodies</span>
            </div>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="w-7 h-7 rounded-full text-muted-foreground hover:text-foreground"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </Button>
          </div>
        )}
      </div>
    </aside>
  );
}
