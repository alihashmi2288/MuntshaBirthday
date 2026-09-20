import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, Sparkles, Heart, CheckCircle2, RotateCcw } from 'lucide-react';
import ConfettiAnimation from './ConfettiAnimation';

interface Coupon {
  id: number;
  title: string;
  emoji: string;
  desc: string;
  claimed: boolean;
}

export default function GiftBox() {
  const [isOpened, setIsOpened] = useState(false);
  const [isUntying, setIsUntying] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [coupons, setCoupons] = useState<Coupon[]>([
    {
      id: 1,
      title: 'Endless Hugs & Forehead Kisses',
      emoji: '🫂',
      desc: 'Valid anytime, anywhere, for as long as you want. Never expires.',
      claimed: false,
    },
    {
      id: 2,
      title: 'Queen of the Day Pass',
      emoji: '👑',
      desc: 'Ali agrees with everything you say for a whole day with zero arguments!',
      claimed: false,
    },
    {
      id: 3,
      title: 'Midnight Cravings & Favorite Dessert',
      emoji: '🍦',
      desc: 'Ice cream, chocolates, or your favorite treat brought directly to you.',
      claimed: false,
    },
    {
      id: 4,
      title: 'Cozy Late Night Long Talk',
      emoji: '🌙',
      desc: 'Just you and me talking under the stars about our dreams and future.',
      claimed: false,
    },
    {
      id: 5,
      title: 'One Magic Wish of Muntsha’s Choice',
      emoji: '🪄',
      desc: 'Ask Ali for whatever your heart desires, and consider it done!',
      claimed: false,
    },
  ]);
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playPopSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
  };

  const handleOpenBox = () => {
    if (isOpened || isUntying) return;
    setIsUntying(true);
    playPopSound();

    setTimeout(() => {
      setIsUntying(false);
      setIsOpened(true);
      setShowConfetti(true);
    }, 600);
  };

  const claimCoupon = (id: number) => {
    playPopSound();
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, claimed: true } : c))
    );
  };

  const resetBox = () => {
    setIsOpened(false);
    setShowConfetti(false);
    setCoupons((prev) => prev.map((c) => ({ ...c, claimed: false })));
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8">
      {showConfetti && <ConfettiAnimation />}

      <Card className="glass-panel p-6 sm:p-10 text-center rounded-3xl relative overflow-hidden shadow-2xl border-amber-200/70 dark:border-amber-900/40">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-semibold text-xs tracking-wide uppercase mb-3">
          <Gift className="w-3.5 h-3.5 text-amber-600 animate-bounce" />
          Birthday Surprise Unboxing
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold font-handwriting text-foreground mb-2">
          Mystery Gift for Muntsha 🎁
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-6">
          {!isOpened
            ? 'Untie the satin ribbon and pop the lid to reveal your special birthday gift!'
            : 'Your exclusive birthday love coupons! Redeemable whenever you wish!'}
        </p>

        {/* Gift Box Unboxing Visual */}
        {!isOpened ? (
          <div className="flex flex-col items-center justify-center my-6 select-none">
            <div
              onClick={handleOpenBox}
              className={`w-44 h-44 sm:w-52 sm:h-52 cursor-pointer relative transition-transform duration-300 hover:scale-105 ${
                isUntying ? 'animate-bounce' : 'animate-gentleFloat'
              }`}
              title="Click to untie ribbon & unwrap gift!"
            >
              {/* Gift Box Lid */}
              <div
                className={`w-48 sm:w-56 h-12 bg-gradient-to-r from-rose-500 via-pink-400 to-rose-500 rounded-t-xl absolute -top-4 -left-2 sm:-left-2 shadow-lg border border-pink-200 flex items-center justify-center transition-all duration-500 z-20 ${
                  isUntying ? 'transform -translate-y-6 rotate-6 opacity-80' : ''
                }`}
              >
                {/* Ribbon Bow on Lid */}
                <div className="text-3xl sm:text-4xl -mt-6 animate-pulse">🎀</div>
              </div>

              {/* Gift Box Body */}
              <div className="w-full h-full bg-gradient-to-br from-rose-400 via-pink-500 to-rose-600 rounded-b-2xl shadow-2xl relative overflow-hidden border-2 border-pink-300 flex items-center justify-center">
                {/* Vertical Ribbon */}
                <div className="w-8 h-full bg-gradient-to-r from-amber-300 via-amber-200 to-amber-300 shadow-md absolute" />
                {/* Horizontal Ribbon */}
                <div className="h-8 w-full bg-gradient-to-b from-amber-300 via-amber-200 to-amber-300 shadow-md absolute" />

                {/* Sparkling icon in center */}
                <div className="relative z-10 p-3 bg-white/90 dark:bg-zinc-900/90 rounded-full shadow-lg border border-amber-300">
                  <Sparkles className="w-6 h-6 text-amber-500 animate-spin" />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                onClick={handleOpenBox}
                className="bg-gradient-to-r from-amber-500 via-rose-500 to-pink-500 text-white hover:opacity-90 shadow-xl px-7 py-3 rounded-full font-fun text-base animate-pulse"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Tap to Open Mystery Box 🎁
              </Button>
            </div>
          </div>
        ) : (
          /* Revealed Love Coupons */
          <div className="space-y-4 animate-slideUp">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
              {coupons.map((coupon) => (
                <div
                  key={coupon.id}
                  className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                    coupon.claimed
                      ? 'bg-rose-100/60 dark:bg-rose-950/40 border-rose-300/80 opacity-90'
                      : 'bg-white/80 dark:bg-zinc-800/80 border-pink-200 hover:border-rose-400 shadow-md hover:-translate-y-1'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl">{coupon.emoji}</span>
                      <h4 className="font-bold text-sm text-foreground font-fun">
                        {coupon.title}
                      </h4>
                    </div>
                    <p className="text-xs text-muted-foreground">{coupon.desc}</p>
                  </div>

                  <div className="mt-3 flex items-center justify-between pt-2 border-t border-pink-100 dark:border-pink-900/50">
                    <span className="text-[10px] uppercase font-bold text-rose-500 tracking-wider">
                      Love Voucher #{coupon.id}
                    </span>
                    <Button
                      size="sm"
                      variant={coupon.claimed ? 'ghost' : 'outline'}
                      onClick={() => claimCoupon(coupon.id)}
                      disabled={coupon.claimed}
                      className={`text-xs h-7 px-3 rounded-full ${
                        coupon.claimed
                          ? 'text-rose-600 font-bold'
                          : 'border-rose-300 text-rose-600 hover:bg-rose-50'
                      }`}
                    >
                      {coupon.claimed ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Claimed 💖
                        </>
                      ) : (
                        'Redeem Now'
                      )}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-3 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={resetBox}
                className="rounded-full border-pink-300 hover:bg-pink-50 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Wrap Box Again
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
