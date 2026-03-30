import React from 'react';

interface WatermarkControlsProps {
  applyWatermark: boolean;
  watermarkStyle: 'center' | 'tiled';
  watermarkOpacity: number;
  onUpdate: <K extends 'applyWatermark' | 'watermarkStyle' | 'watermarkOpacity'>(field: K, value: any) => void;
}

export function WatermarkControls({ applyWatermark, watermarkStyle, watermarkOpacity, onUpdate }: WatermarkControlsProps) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>brand_awareness</span>
        <h3 className="font-headline font-bold text-lg text-on-surface">Watermark Styling</h3>
      </div>
      <div className="bg-surface-container-low p-6 space-y-6 rounded-xl">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-on-surface text-sm">Apply Watermark</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={applyWatermark}
              onChange={(e) => onUpdate('applyWatermark', e.target.checked)}
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {applyWatermark && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onUpdate('watermarkStyle', 'center')}
                className={`flex flex-col items-center gap-3 p-4 border rounded-xl transition-all ${watermarkStyle === 'center' ? 'border-primary bg-surface-container-lowest shadow-sm' : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-lowest'}`}
              >
                <span className={`material-symbols-outlined scale-125 ${watermarkStyle === 'center' ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: "'FILL' 0" }}>center_focus_weak</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${watermarkStyle === 'center' ? 'text-primary' : 'text-on-surface-variant'}`}>Center Logo</span>
              </button>
              <button 
                onClick={() => onUpdate('watermarkStyle', 'tiled')}
                className={`flex flex-col items-center gap-3 p-4 border rounded-xl transition-all ${watermarkStyle === 'tiled' ? 'border-primary bg-surface-container-lowest shadow-sm' : 'border-outline-variant/30 bg-surface-container-low hover:bg-surface-container-lowest'}`}
              >
                <span className={`material-symbols-outlined scale-125 ${watermarkStyle === 'tiled' ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: "'FILL' 0" }}>grid_view</span>
                <span className={`text-xs font-bold uppercase tracking-widest ${watermarkStyle === 'tiled' ? 'text-primary' : 'text-on-surface-variant'}`}>Tiled Text</span>
              </button>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Watermark Opacity</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={watermarkOpacity}
                onChange={(e) => onUpdate('watermarkOpacity', parseInt(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest accent-primary appearance-none cursor-pointer rounded-full" 
              />
              <div className="flex justify-between text-[10px] font-medium text-on-surface-variant">
                <span>Subtle (0%)</span>
                <span>Heavy (100%)</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
