import React from 'react';

export function IdleState() {
  return (
    <>
      <div className="mb-8 w-24 h-24 bg-primary-container/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
        <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>
          upload_file
        </span>
      </div>
      
      <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">
        Drag & Drop Your Masterpiece
      </h3>
      <p className="text-on-surface-variant mb-12 text-center max-w-md">
        The Curated Atelier handles the digital preservation of your work with professional grade color profiles.
      </p>
      
      <div className="mt-4 text-center text-on-surface-variant">
        <p className="text-xs font-bold text-primary mb-1">High-res PNG/JPG preferred. Max 100MB.</p>
        <p className="text-[10px] text-outline uppercase tracking-wider">Raw formats supported via Atelier+ subscription</p>
      </div>
    </>
  );
}
