import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Link } from 'wouter';
import { ArrowLeft, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import shinChanImg from '@assets/generated_images/Shin_Chan_character_image_5f6a317d.png';
import whatsappImg1 from '@assets/WhatsApp Image 2025-09-13 at 15.21.36_5518dbbf_1757966541328.jpg';
import whatsappImg2 from '@assets/WhatsApp Image 2025-09-18 at 13.30.06_0442815b.jpg';
import whatsappImg3 from '@assets/WhatsApp Image 2025-09-18 at 13.30.07_55787989.jpg';
import whatsappImg4 from '@assets/WhatsApp Image 2025-09-18 at 13.30.07_80dc95af.jpg';
import whatsappImg5 from '@assets/WhatsApp Image 2025-09-18 at 13.30.07_df74f5c1.jpg';

const galleryImages = [
  { id: 2, src: shinChanImg, alt: 'Shin Chan' },
  { id: 3, src: whatsappImg1, alt: 'Memory 1' },
  { id: 4, src: whatsappImg2, alt: 'Memory 2' },
  { id: 5, src: whatsappImg3, alt: 'Memory 3' },
  { id: 6, src: whatsappImg4, alt: 'Memory 4' },
  { id: 7, src: whatsappImg5, alt: 'Memory 5' },
];

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent/20 via-primary/10 to-accent/30 relative overflow-hidden">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      <div className="flex items-center justify-center min-h-screen p-4 relative z-20">
        <Card className="max-w-4xl w-full backdrop-blur-xl bg-card/95 border-2 border-accent/30 shadow-2xl rounded-3xl overflow-hidden">
          
          <div className="bg-gradient-to-r from-accent/20 to-primary/20 p-6 text-center border-b border-accent/20">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent"
                style={{ fontFamily: "'Dancing Script', cursive" }}>
              📸 Gallery 📸
            </h1>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {galleryImages.map((image) => (
                <div
                  key={image.id}
                  className="cursor-pointer transition-all duration-300 hover:scale-105"
                  onClick={() => setSelectedImage(image)}
                >
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-48 object-cover rounded-lg shadow-lg border-2 border-accent/30"
                  />

                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <Link href="/">
                <Button variant="outline" className="hover-elevate">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back Home
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-4 h-4" />
            </Button>
            <img
              src={selectedImage.src}
              alt={selectedImage.alt}
              className="max-w-full max-h-full object-contain rounded-lg"
            />

          </div>
        </div>
      )}
    </div>
  );
}