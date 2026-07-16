'use client';

import {useState}from 'react';

interface ArtworkCarouselProps {
  assets?: Array<{ id: string; downloadUrl?: string; blobUrl?: string; sequenceOrder: number }>;
  title?: string;
}

export default function ArtworkCarousel({ assets = [], title = "Artwork" }: Readonly<ArtworkCarouselProps>) {
  const [activeIndex, setActiveIndex] = useState(0);

  const images = assets.map(a => a.downloadUrl || a.blobUrl || "");

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="mb-20">
      <div className="relative group max-h-[70vh] aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant/10 flex items-center justify-center">
        {images.length > 0 && (
          <img
            className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]" 
            src={images[activeIndex]} 
            alt={`${title} - View ${activeIndex + 1}`} 
          />
        )}
        
        {images.length > 1 && (
          <>
            <button 
              onClick={handlePrev}
              className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40"
            >
              <span className="material-symbols-outlined">arrow_back_ios</span>
            </button>
            <button 
              onClick={handleNext}
              className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40 leading-none"
            >
              <span className="material-symbols-outlined">arrow_forward_ios</span>
            </button>
          </>
        )}
        <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-widest uppercase">
          Full Screen View
        </div>
      </div>
      
      {/* Thumbnail Strip */}
      {images.length > 1 && (
        <div className="mt-8 flex justify-center gap-4">
          {images.map((src, i) => (
            <button 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className={`w-20 h-20 rounded-lg overflow-hidden transition-all relative ${i === activeIndex ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-outline-variant/40'}`}
            >
              <img 
                className={`object-cover transition-opacity ${i === activeIndex ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
                src={src} 
                alt={`Thumbnail ${i + 1}`} 
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
