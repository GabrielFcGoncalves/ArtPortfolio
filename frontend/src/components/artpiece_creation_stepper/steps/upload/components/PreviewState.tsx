import React from 'react';

interface PreviewStateProps {
  url: string;
  name: string;
  onRemove: (e: React.MouseEvent) => void;
}

export function PreviewState({ url, name, onRemove }: PreviewStateProps) {
  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="relative w-full max-w-sm aspect-square mb-6 rounded-lg overflow-hidden shadow-xl group/preview border border-outline-variant/20">
        <img src={url} alt="Preview" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/preview:opacity-100 transition-opacity flex items-center justify-center">
          <button 
            onClick={onRemove}
            className="bg-error text-on-error px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <span className="material-symbols-outlined text-sm">delete</span>
            Remove & Replace
          </button>
        </div>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-headline font-bold text-on-surface">Artwork Secured</h3>
        <p className="text-on-surface-variant text-sm mt-1">{name}</p>
      </div>
    </div>
  );
}
