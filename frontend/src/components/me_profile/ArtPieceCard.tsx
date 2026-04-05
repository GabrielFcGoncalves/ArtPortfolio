import React from 'react';
import Image from 'next/image';

export interface ArtPiece {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  assetCount: number;
  createdAt: string;
  isPublished: boolean;
}

interface ArtPieceCardProps {
  piece: ArtPiece;
}

const ArtPieceCard: React.FC<Readonly<ArtPieceCardProps>> = ({ piece }) => {
  const coverImageContent = piece.coverImage ? (
    <Image 
      fill
      className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.2] group-hover:grayscale-0"
      src={piece.coverImage}
      alt={piece.title}
      sizes="(max-width: 768px) 100vw, 33vw"
    />
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-primary/5">
      <span className="material-symbols-outlined text-primary/20 text-6xl">image</span>
    </div>
  );

  return (
    <div className="group cursor-pointer">
      <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-high relative mb-4 border border-outline-variant/10 shadow-sm">
        {coverImageContent}
        {!piece.isPublished && (
          <div className="absolute top-4 right-4 bg-orange-500/90 text-white text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded-md backdrop-blur-sm z-10">
            Draft
          </div>
        )}
      </div>
      <h4 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">{piece.title}</h4>
      <p className="text-[10px] text-outline font-bold uppercase tracking-widest mt-1">
        {new Date(piece.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
      </p>
    </div>
  );
};

export default ArtPieceCard;
