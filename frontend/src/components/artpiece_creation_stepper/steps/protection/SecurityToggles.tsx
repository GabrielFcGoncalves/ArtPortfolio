import React from 'react';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';

export function SecurityToggles() {
  const { formData, updateField } = useArtpieceForm();

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>security</span>
        <h3 className="font-headline font-bold text-lg text-on-surface">Security &amp; Privacy</h3>
      </div>
      <div className="space-y-6">
        
        {/* Toggle: Disable Right-Click */}
        <div className="flex items-center justify-between p-4 bg-surface-container-low transition-colors hover:bg-surface-container-high group rounded-lg">
          <div className="flex flex-col">
            <span className="font-semibold text-on-surface">Disable Right-Click</span>
            <span className="text-xs text-on-surface-variant">Prevents visitors from saving images via context menu</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={formData.protection.disableRightClick}
              onChange={(e) => updateField('protection.disableRightClick', e.target.checked)}
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>

        {/* Toggle: NoAI Protections */}
        <div className="flex items-center justify-between p-4 bg-surface-container-low transition-colors hover:bg-surface-container-high rounded-lg">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-on-surface">NoAI Protections</span>
              <span className="px-2 py-0.5 bg-secondary-fixed text-[10px] font-bold text-on-secondary-fixed rounded-full uppercase tracking-tighter">Recommended</span>
            </div>
            <span className="text-xs text-on-surface-variant">Adds metadata and CSS headers to block AI scrapers</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={formData.protection.noAI}
              onChange={(e) => updateField('protection.noAI', e.target.checked)}
            />
            <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
          </label>
        </div>
      </div>
    </section>
  );
}
