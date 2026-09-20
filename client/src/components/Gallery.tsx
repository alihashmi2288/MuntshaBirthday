import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowLeft, X, Play, Lock, Heart, ChevronLeft, ChevronRight, Sparkles, KeyRound } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ThemeToggle from './ThemeToggle';
import FloatingMusicPlayer from './FloatingMusicPlayer';
import SparkleTrail from './SparkleTrail';
import shinChanImg from '@assets/generated_images/Shin_Chan_character_image_5f6a317d.png';
import whatsappImg1 from '@assets/WhatsApp Image 2025-09-13 at 15.21.36_5518dbbf_1757966541328.jpg';
import whatsappImg2 from '@assets/WhatsApp Image 2025-09-18 at 13.30.06_0442815b.jpg';
import whatsappImg3 from '@assets/WhatsApp Image 2025-09-18 at 13.30.07_55787989.jpg';
import whatsappImg4 from '@assets/WhatsApp Image 2025-09-18 at 13.30.07_80dc95af.jpg';
import whatsappImg5 from '@assets/WhatsApp Image 2025-09-18 at 13.30.07_df74f5c1.jpg';
import whatsappImg6 from '@assets/WhatsApp Image 2025-09-18 at 14.46.19_405a7eb2.jpg';
import whatsappImg7 from '@assets/WhatsApp Image 2025-09-18 at 14.46.19_46e8f2fd.jpg';
import whatsappImg8 from '@assets/WhatsApp Image 2025-09-18 at 14.46.19_d07fd2c7.jpg';
import whatsappImg9 from '@assets/WhatsApp Image 2025-09-18 at 14.46.20_1f2e4ce2.jpg';
import kissVideo from '@assets/WhatsApp Video 2025-09-18 at 14.54.23_d8830ac0.mp4';

interface GalleryItem {
  id: number;
  src: string;
  alt: string;
  caption: string;
  rotation: string;
}

const galleryImages: GalleryItem[] = [
  { id: 2, src: shinChanImg, alt: 'Shin Chan & Muntsha', caption: 'Shin Chan cheering for Muntsha! 🎈', rotation: '-rotate-2' },
  { id: 3, src: whatsappImg1, alt: 'Cherished Moment', caption: 'Your radiant smile lighting up my life ✨', rotation: 'rotate-1' },
  { id: 4, src: whatsappImg2, alt: 'Sweet Memory', caption: 'Unforgettable moments with you 💖', rotation: '-rotate-1' },
  { id: 5, src: whatsappImg3, alt: 'Pure Joy', caption: 'Every second with you is a blessing 🌸', rotation: 'rotate-2' },
  { id: 6, src: whatsappImg4, alt: 'Cutest Expression', caption: 'The prettiest girl in the whole world 👑', rotation: '-rotate-2' },
  { id: 7, src: whatsappImg5, alt: 'Special Day', caption: 'Holding your love close to my heart 🌹', rotation: 'rotate-1' },
  { id: 8, src: whatsappImg6, alt: 'Happy Smiles', caption: 'Laughter that heals everything 💕', rotation: '-rotate-1' },
  { id: 9, src: whatsappImg7, alt: 'Lovely Muntsha', caption: 'My favorite person in the universe 💫', rotation: 'rotate-2' },
  { id: 10, src: whatsappImg8, alt: 'Warm Memories', caption: 'You make every ordinary day magical 🍰', rotation: '-rotate-2' },
  { id: 11, src: whatsappImg9, alt: 'Forever With You', caption: 'Today, tomorrow, and forever together 💍', rotation: 'rotate-1' },
];

export default function Gallery() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showPasswordError, setShowPasswordError] = useState(false);

  const handlePasswordSubmit = () => {
    if (password.toLowerCase().trim() === 'muntshaali') {
      setIsAuthenticated(true);
      setShowPasswordError(false);
    } else {
      setShowPasswordError(true);
      setTimeout(() => setShowPasswordError(false), 3000);
    }
  };

  const nextImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex + 1) % galleryImages.length);
  };

  const prevImage = () => {
    if (selectedIndex === null) return;
    setSelectedIndex((selectedIndex - 1 + galleryImages.length) % galleryImages.length);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-100/70 via-pink-50/50 to-amber-100/60 dark:from-zinc-950 dark:via-purple-950/40 dark:to-zinc-900 relative overflow-hidden flex items-center justify-center p-4">
        <SparkleTrail />
        <FloatingMusicPlayer />

        <div className="fixed top-4 right-4 z-50">
          <ThemeToggle />
        </div>

        <Card className="max-w-md w-full glass-panel p-8 rounded-3xl border-2 border-pink-300/70 shadow-2xl animate-slideUp text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center mx-auto mb-4 shadow-lg animate-pulse">
            <Lock className="w-8 h-8" />
          </div>

          <h1 className="text-3xl font-bold font-handwriting text-rose-600 dark:text-rose-300 mb-2">
            🔒 Muntsha &amp; Ali&apos;s Secret Vault
          </h1>
          <p className="text-muted-foreground text-xs sm:text-sm mb-6">
            Enter our special couple password to unlock our private photo gallery &amp; surprise video!
          </p>

          <div className="space-y-4">
            <div className="relative">
              <Input
                type="password"
                placeholder="Enter password (hint: our names together)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handlePasswordSubmit()}
                className="text-center rounded-full border-pink-300 focus:border-rose-500 py-5 text-sm"
              />
              <KeyRound className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            </div>

            {showPasswordError && (
              <p className="text-rose-600 dark:text-rose-400 text-xs font-semibold animate-pulse">
                Incorrect password, my love! Try &quot;muntshaali&quot; 💕
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Link href="/" className="flex-1">
                <Button variant="outline" className="w-full rounded-full border-rose-300 hover:bg-rose-50">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back Home
                </Button>
              </Link>

              <Button
                onClick={handlePasswordSubmit}
                className="flex-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-lg hover:opacity-90 font-fun"
              >
                Open Vault ✨
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100/70 via-pink-50/50 to-amber-100/60 dark:from-zinc-950 dark:via-purple-950/40 dark:to-zinc-900 relative overflow-x-hidden p-4 sm:p-6 md:p-10 transition-colors duration-500">
      <SparkleTrail />
      <FloatingMusicPlayer />

      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="max-w-6xl mx-auto pt-4 pb-12">
        <Card className="w-full glass-panel p-6 sm:p-10 rounded-3xl border-2 border-pink-300/70 shadow-2xl">
          {/* Header Banner */}
          <div className="text-center mb-8 border-b border-pink-200/60 dark:border-pink-900/40 pb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full bg-pink-100 dark:bg-pink-950/50 text-rose-600 dark:text-rose-300 text-xs font-bold uppercase tracking-wider mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-500" />
              Our Cherished Scrapbook
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold font-handwriting text-rose-600 dark:text-rose-300 mb-2">
              📸 Muntsha &amp; Ali&apos;s Memory Gallery 📸
            </h1>
            <p className="text-sm text-muted-foreground max-w-lg mx-auto">
              Every picture holds a timeless memory of laughter, love, and happiness. Tap any Polaroid to view it closely!
            </p>
          </div>

          {/* Polaroid Photo Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-6 mb-8">
            {galleryImages.map((image, idx) => (
              <div
                key={image.id}
                onClick={() => setSelectedIndex(idx)}
                className={`polaroid-card p-2.5 pb-4 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl relative ${image.rotation}`}
              >
                {/* Washi Tape Accent */}
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 w-12 h-4 bg-amber-200/80 dark:bg-amber-700/60 border border-amber-300/60 rotate-2 shadow-sm rounded-xs z-10" />

                <div className="overflow-hidden rounded-lg aspect-square bg-rose-50 dark:bg-zinc-800 mb-2">
                  <img
                    src={image.src}
                    alt={image.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                  />
                </div>
                <p className="text-center font-handwriting text-xs sm:text-sm font-bold text-zinc-700 dark:text-zinc-200 truncate px-1">
                  {image.caption}
                </p>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 border-t border-pink-200/60 dark:border-pink-900/40">
            <Button
              onClick={() => setShowVideo(true)}
              className="bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full shadow-lg hover:opacity-90 px-6 py-2.5 font-fun text-sm sm:text-base"
            >
              <Play className="w-4 h-4 mr-2" />
              Wanna See Us Kiss Together 💋
            </Button>

            <Link href="/">
              <Button variant="outline" className="rounded-full border-rose-300 hover:bg-rose-50 px-6 py-2.5">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back Home
              </Button>
            </Link>
          </div>
        </Card>
      </div>

      {/* LIGHTBOX FOR POLAROID PHOTOS */}
      {selectedIndex !== null && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade"
          onClick={() => setSelectedIndex(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white dark:bg-zinc-900 p-4 sm:p-6 rounded-3xl shadow-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-3 right-3 rounded-full bg-white/80 dark:bg-zinc-800/80 z-20"
              onClick={() => setSelectedIndex(null)}
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Lightbox Image */}
            <div className="rounded-2xl overflow-hidden max-h-[65vh] flex items-center justify-center bg-black/5 dark:bg-black/40 mb-4">
              <img
                src={galleryImages[selectedIndex].src}
                alt={galleryImages[selectedIndex].alt}
                className="max-h-[62vh] max-w-full object-contain rounded-xl shadow-lg"
              />
            </div>

            {/* Caption */}
            <p className="font-handwriting text-2xl sm:text-3xl text-rose-600 dark:text-rose-300 font-bold mb-3">
              {galleryImages[selectedIndex].caption}
            </p>

            {/* Navigation Arrows */}
            <div className="flex items-center justify-between pt-2 border-t border-pink-100 dark:border-zinc-800">
              <Button
                variant="ghost"
                onClick={prevImage}
                className="rounded-full text-xs text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Previous Memory
              </Button>

              <span className="text-xs text-muted-foreground font-mono">
                {selectedIndex + 1} / {galleryImages.length}
              </span>

              <Button
                variant="ghost"
                onClick={nextImage}
                className="rounded-full text-xs text-muted-foreground hover:text-foreground"
              >
                Next Memory
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* SPECIAL VIDEO MODAL */}
      {showVideo && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade"
          onClick={() => setShowVideo(false)}
        >
          <div
            className="relative max-w-3xl w-full bg-zinc-950 p-3 sm:p-5 rounded-3xl border-2 border-rose-500/50 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-2 pb-3">
              <span className="font-handwriting text-xl font-bold text-rose-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                Our Sweetest Kiss Video 💋
              </span>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-zinc-900 text-white border-zinc-700"
                onClick={() => setShowVideo(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-black flex items-center justify-center max-h-[70vh]">
              <video
                src={kissVideo}
                controls
                autoPlay
                className="max-w-full max-h-[68vh] rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}