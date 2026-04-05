import React from 'react';

interface GalleryToolbarProps {
  onAddNewPiece: () => void;
}

const GalleryToolbar: React.FC<Readonly<GalleryToolbarProps>> = ({ onAddNewPiece }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-outline-variant/10 pb-8 gap-6">
      <div>
        <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tighter italic">Your Studio Archives</h2>
        <p className="text-on-surface-variant/60 text-sm mt-2">Curated works previously shared with the community.</p>
      </div>
      <button 
        type="button"
        className="flex items-center gap-2 bg-tertiary-container text-on-tertiary-container px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md"
        onClick={onAddNewPiece}
      >
        <span className="material-symbols-outlined text-lg">add_circle</span> Add New Piece
      </button>
    </div>
  );
};

export default GalleryToolbar;
