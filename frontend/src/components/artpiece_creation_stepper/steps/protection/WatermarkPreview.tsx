import { useArtpieceForm } from '@/lib/context/ArtpieceContext';

interface WatermarkPreviewProps {
  applyWatermark: boolean;
  watermarkStyle: 'center' | 'tiled';
  watermarkOpacity: number;
}

export function WatermarkPreview({ applyWatermark, watermarkStyle, watermarkOpacity }: WatermarkPreviewProps) {
  const { formData } = useArtpieceForm();
  
  return (
    <div className="sticky top-0 space-y-4 pt-1">
      <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Live Preview</span>
      
      <div className="aspect-[4/5] relative bg-surface-container-low overflow-hidden shadow-inner group rounded-xl">
        <img 
          className="w-full h-full object-cover" 
          src={formData.previewUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuAO_y2hP15r63myE2RgbU90-8YOuPwbFTZmROoy73mxLgGUDlZ_fpKx6RJrKJWVKzu4xqk8dZ3r2ZVyf0U5cLeeIVz8alWmHztU_F6h8tgt2vwR2iIDjG9v2X2bQfg4XvRrUec7_QA4B9tdFDSEXYt3dTbcxh2Sg7cZLyTDYYcaBxV5_2JTuW5bCAVLAaExNguI3ZT3hvzlD5Kjpd3BXRy3lyjy5oVr6rH1phaCp6ALjMK4dSZkidWj7ydEXVmptgAuEaBhoLQAw6c"} 
          alt="Art preview" 
        />
        
        {applyWatermark && (
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
            style={{ opacity: watermarkOpacity / 100 }}
          >
            {watermarkStyle === 'center' ? (
              <div className="flex flex-col items-center text-white text-center drop-shadow-md">
                <span className="material-symbols-outlined text-6xl" style={{ fontVariationSettings: "'FILL' 0" }}>brush</span>
                <span className="font-headline font-bold text-lg tracking-tighter uppercase mt-2">The Atelier</span>
              </div>
            ) : (
              <div className="w-full h-full flex flex-wrap content-start items-center justify-center p-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <span key={i} className="font-headline font-bold text-white text-xs uppercase tracking-widest opacity-30 m-4 -rotate-12 select-none">
                    Protected by The Atelier
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
        
        <div className="absolute top-4 right-4 px-2 py-1 bg-black/40 backdrop-blur-md text-[8px] font-bold text-white uppercase tracking-[0.2em] rounded">
          Protected by The Curated Atelier
        </div>
      </div>
      
      <p className="text-[11px] leading-relaxed text-on-surface-variant italic">
        * This preview demonstrates how the watermark will appear on high-resolution displays based on your settings.
      </p>
    </div>
  );
}
