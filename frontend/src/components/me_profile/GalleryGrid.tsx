import React from 'react';
import ArtPieceCard, { ArtPiece } from './ArtPieceCard';

interface GalleryGridProps {
  loading: boolean;
  pieces: ArtPiece[];
}

const GalleryGrid: React.FC<Readonly<GalleryGridProps>> = ({ loading, pieces }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-square rounded-2xl bg-surface-container-high mb-4 shadow-sm" />
            <div className="h-4 bg-surface-container-high rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface-container-high rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (pieces.length === 0) {
    return (
      <div className="text-center py-24 bg-surface-container-lowest rounded-[2rem] border-2 border-dashed border-outline-variant/15 flex flex-col items-center justify-center">
        <span className="material-symbols-outlined text-7xl text-outline-variant/40 mb-4 animate-bounce-subtle">palette</span>
        <h3 className="text-2xl font-headline font-bold text-on-surface italic">Your studio awaits its first masterpiece</h3>
        <p className="text-on-surface-variant/50 max-w-sm mx-auto mt-2">The archives are currently empty. Use the control above to begin your journey.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {pieces.map((piece) => (
        <ArtPieceCard key={piece.id} piece={piece} />
      ))}
    </div>
  );
};

export default GalleryGrid;
