import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { Play, Sparkles, Heart, Camera, Cake, Gift, MessageCircleHeart } from 'lucide-react';
import FloatingElement from './FloatingElement';
import ThemeToggle from './ThemeToggle';
import InteractiveCake from './InteractiveCake';
import LoveJar from './LoveJar';
import GiftBox from './GiftBox';
import FloatingMusicPlayer from './FloatingMusicPlayer';
import SparkleTrail from './SparkleTrail';
import shinChanImg from '@assets/generated_images/Shin_Chan_character_image_5f6a317d.png';
import muntshaPic from '@assets/muntsha-photo.jpg';

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<'adventures' | 'cake' | 'lovejar' | 'gift'>('adventures');

  // Static CSS floating hearts rendered once — 0 CPU cost, 0 React re-renders
  const staticHearts = useMemo(() => [
    { id: 1, left: 8, emoji: '💖', duration: 9, delay: 0, size: 20 },
    { id: 2, left: 22, emoji: '🌸', duration: 11, delay: 2, size: 16 },
    { id: 3, left: 35, emoji: '💕', duration: 8, delay: 4, size: 22 },
    { id: 4, left: 50, emoji: '✨', duration: 12, delay: 1, size: 18 },
    { id: 5, left: 65, emoji: '🎂', duration: 10, delay: 3, size: 24 },
    { id: 6, left: 78, emoji: '💝', duration: 9, delay: 5, size: 20 },
    { id: 7, left: 90, emoji: '🎉', duration: 11, delay: 2.5, size: 22 },
  ], []);

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-gradient-to-br from-rose-100/60 via-pink-50/40 to-amber-100/50 dark:from-zinc-950 dark:via-purple-950/30 dark:to-zinc-900 transition-colors duration-300">
      {/* 60fps Canvas Sparkle Trail */}
      <SparkleTrail />

      {/* Floating BGM Player */}
      <FloatingMusicPlayer />

      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
        <ThemeToggle />
      </div>

      {/* Lightweight GPU-friendly ambient background glows without heavy blur-3xl */}
      <div
        className="fixed -top-20 -left-20 w-80 h-80 pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 182, 193, 0.25) 0%, transparent 70%)',
        }}
      />
      <div
        className="fixed -bottom-20 -right-20 w-80 h-80 pointer-events-none rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(255, 214, 102, 0.22) 0%, transparent 70%)',
        }}
      />

      {/* Pure CSS Floating Celebratory Hearts (Zero React re-render overhead) */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {staticHearts.map((heart) => (
          <div
            key={heart.id}
            className="absolute opacity-35 animate-[floatUp_8s_linear_infinite]"
            style={{
              left: `${heart.left}%`,
              fontSize: `${heart.size}px`,
              animationDuration: `${heart.duration}s`,
              animationDelay: `${heart.delay}s`,
            }}
          >
            {heart.emoji}
          </div>
        ))}
      </div>

      {/* Main Page Container */}
      <main className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 md:p-10 relative z-20 max-w-5xl mx-auto py-12">
        
        {/* Hero Card */}
        <Card className="w-full p-6 sm:p-10 md:p-12 glass-panel rounded-3xl border-2 border-pink-300/60 dark:border-pink-900/40 shadow-xl animate-slideUp relative overflow-hidden">
          
          {/* Top celebratory ribbon */}
          <div className="flex justify-center mb-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-500/15 via-pink-500/15 to-amber-500/15 border border-pink-300/50 text-rose-600 dark:text-rose-300 text-xs sm:text-sm font-semibold tracking-wide">
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              Celebrating Muntsha&apos;s Special Day &bull; With All My Love
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
            </span>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl sm:text-6xl md:text-7xl font-bold font-handwriting bg-gradient-to-r from-rose-600 via-pink-500 to-amber-500 bg-clip-text text-transparent mb-4 drop-shadow-sm"
              data-testid="text-main-title"
            >
              🎉 Happy Birthday, My Love! 🎉
            </h1>

            {/* Profile Avatars Section */}
            <div className="flex justify-center items-center gap-4 sm:gap-8 my-6">
              {/* Muntsha's Photo */}
              <FloatingElement className="relative group">
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full blur-xs opacity-70 group-hover:opacity-100 transition duration-300" />
                  <img
                    src={muntshaPic}
                    alt="Muntsha"
                    loading="eager"
                    decoding="async"
                    className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl transition-transform duration-300 group-hover:scale-105"
                    data-testid="img-muntsha"
                  />
                </div>
                <div className="absolute -top-2 -left-2 text-2xl animate-sparkle">✨</div>
                <div className="absolute -top-2 -right-2 text-xl animate-sparkle animation-delay-500">⭐</div>
                <div className="absolute -bottom-2 -left-2 text-xl animate-sparkle animation-delay-1000">💖</div>
                <div className="absolute -bottom-2 -right-2 text-2xl animate-sparkle animation-delay-1500">👑</div>
              </FloatingElement>

              {/* Beating Love Heart */}
              <div className="flex flex-col items-center justify-center">
                <FloatingElement animationDelay={1} className="text-4xl sm:text-5xl text-rose-500 animate-pulse">
                  💕
                </FloatingElement>
                <span className="text-[10px] sm:text-xs font-handwriting font-bold text-rose-500 mt-1">
                  Together Forever
                </span>
              </div>

              {/* Shin Chan */}
              <FloatingElement className="relative group" animationDelay={0.5}>
                <div className="relative">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-rose-400 rounded-full blur-xs opacity-70 group-hover:opacity-100 transition duration-300" />
                  <img
                    src={shinChanImg}
                    alt="Shin Chan"
                    loading="eager"
                    decoding="async"
                    className="relative w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-full object-cover border-4 border-white dark:border-zinc-800 shadow-xl transition-transform duration-300 group-hover:scale-105"
                    data-testid="img-shinchan-landing"
                  />
                </div>
                <div className="absolute -top-2 -left-2 text-2xl animate-bounce">🎮</div>
                <div className="absolute -top-2 -right-2 text-xl animate-bounce animation-delay-300">🎂</div>
                <div className="absolute -bottom-2 -left-2 text-xl animate-bounce animation-delay-600">🎈</div>
                <div className="absolute -bottom-2 -right-2 text-2xl animate-bounce animation-delay-900">🎉</div>
              </FloatingElement>
            </div>

            <p className="text-base sm:text-lg text-foreground/80 font-medium max-w-xl mx-auto mb-2">
              Welcome to your magical birthday world! Shin Chan and I have prepared special adventures, romantic secrets, and surprises just for you!
            </p>
            <p
              className="text-rose-600 dark:text-rose-400 font-handwriting font-bold text-2xl sm:text-3xl"
              data-testid="text-love-message"
            >
              Created with infinite love by Syed Ali Hashmi 💖
            </p>
          </div>

          {/* Interactive Feature Navigation Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8 bg-rose-50/70 dark:bg-zinc-900/60 p-1.5 rounded-2xl border border-pink-200/60 max-w-xl mx-auto">
            <button
              onClick={() => setActiveTab('adventures')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'adventures'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Adventures
            </button>
            <button
              onClick={() => setActiveTab('cake')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'cake'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Cake className="w-3.5 h-3.5" />
              Blow Candles 🎂
            </button>
            <button
              onClick={() => setActiveTab('lovejar')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'lovejar'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <MessageCircleHeart className="w-3.5 h-3.5" />
              Love Jar 💌
            </button>
            <button
              onClick={() => setActiveTab('gift')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'gift'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Gift className="w-3.5 h-3.5" />
              Mystery Gift 🎁
            </button>
          </div>

          {/* TAB 1: ADVENTURES GRID */}
          {activeTab === 'adventures' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {/* Play Game Option */}
              <Link href="/game" className="h-full">
                <Card
                  className="h-full p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1.5 glass-panel border-pink-200 hover:border-rose-400 shadow-md rounded-2xl flex flex-col justify-between"
                  data-testid="card-play-game"
                >
                  <div>
                    <div className="text-5xl mb-3 animate-bounce" data-testid="icon-play">
                      🎮
                    </div>
                    <h3 className="text-xl font-bold font-fun text-foreground mb-1">Play Game</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Fun Shin Chan memory card match game to test your skills!
                    </p>
                  </div>
                  <div className="mt-4 pt-2">
                    <Button variant="outline" className="w-full rounded-full border-rose-300 hover:bg-rose-50 dark:hover:bg-zinc-800">
                      <Play className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                      Start Game
                    </Button>
                  </div>
                </Card>
              </Link>

              {/* Fireworks Option */}
              <Link href="/fireworks" className="h-full">
                <Card
                  className="h-full p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1.5 glass-panel border-amber-200 hover:border-amber-400 shadow-md rounded-2xl flex flex-col justify-between"
                  data-testid="card-fireworks"
                >
                  <div>
                    <div className="text-5xl mb-3 animate-bounce animation-delay-300" data-testid="icon-fireworks">
                      🎆
                    </div>
                    <h3 className="text-xl font-bold font-fun text-foreground mb-1">Fireworks</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Spectacular night sky light show dedicated to Muntsha!
                    </p>
                  </div>
                  <div className="mt-4 pt-2">
                    <Button variant="outline" className="w-full rounded-full border-amber-300 hover:bg-amber-50 dark:hover:bg-zinc-800">
                      <Sparkles className="w-3.5 h-3.5 mr-1.5 text-amber-500" />
                      Launch Show
                    </Button>
                  </div>
                </Card>
              </Link>

              {/* Letter Option */}
              <Link href="/letter" className="h-full">
                <Card
                  className="h-full p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1.5 glass-panel border-rose-200 hover:border-rose-400 shadow-md rounded-2xl flex flex-col justify-between"
                  data-testid="card-letter"
                >
                  <div>
                    <div className="text-5xl mb-3 animate-bounce animation-delay-600" data-testid="icon-letter">
                      💌
                    </div>
                    <h3 className="text-xl font-bold font-fun text-foreground mb-1">Love Letter</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      A deeply heartfelt, emotional letter written from Ali&apos;s heart.
                    </p>
                  </div>
                  <div className="mt-4 pt-2">
                    <Button variant="outline" className="w-full rounded-full border-rose-300 hover:bg-rose-50 dark:hover:bg-zinc-800">
                      <Heart className="w-3.5 h-3.5 mr-1.5 text-rose-500" />
                      Read Letter
                    </Button>
                  </div>
                </Card>
              </Link>

              {/* Gallery Option */}
              <Link href="/gallery" className="h-full">
                <Card
                  className="h-full p-6 text-center cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-1.5 glass-panel border-purple-200 hover:border-purple-400 shadow-md rounded-2xl flex flex-col justify-between"
                  data-testid="card-gallery"
                >
                  <div>
                    <div className="text-5xl mb-3 animate-bounce animation-delay-900" data-testid="icon-gallery">
                      📸
                    </div>
                    <h3 className="text-xl font-bold font-fun text-foreground mb-1">Secret Gallery</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm">
                      Our private memories, Polaroid photos &amp; special kiss video!
                    </p>
                  </div>
                  <div className="mt-4 pt-2">
                    <Button variant="outline" className="w-full rounded-full border-purple-300 hover:bg-purple-50 dark:hover:bg-zinc-800">
                      <Camera className="w-3.5 h-3.5 mr-1.5 text-purple-500" />
                      View Memories
                    </Button>
                  </div>
                </Card>
              </Link>
            </div>
          )}

          {/* TAB 2: INTERACTIVE CAKE */}
          {activeTab === 'cake' && <InteractiveCake />}

          {/* TAB 3: LOVE JAR */}
          {activeTab === 'lovejar' && <LoveJar />}

          {/* TAB 4: MYSTERY GIFT */}
          {activeTab === 'gift' && <GiftBox />}

        </Card>

        {/* Romantic Bottom Footer Note */}
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            Always and forever your number one fan &bull; Syed Ali Hashmi 💕
          </p>
        </footer>
      </main>
    </div>
  );
}