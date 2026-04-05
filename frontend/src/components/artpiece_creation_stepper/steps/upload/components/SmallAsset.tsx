import React from 'react';
import { ArtpieceAsset } from '@/lib/context/ArtpieceContext';

interface SmallAssetProps {
  asset: ArtpieceAsset;
  onRemove: (id: string) => void;
  onPreview: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  isDragging: boolean;
  isOver: boolean;
}

export function SmallAsset({
  asset,
  onRemove,
  onPreview,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isOver
}: Readonly<SmallAssetProps>) {
  return (
    <div 
      className={`relative group/card h-fit ${isDragging ? 'opacity-40 scale-90' : 'opacity-100'}`}
    >
      <button 
        type="button"
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        onClick={onPreview}
        className={`bg-surface-container-lowest p-3 rounded-xl border-2 shadow-sm flex flex-col gap-2 transition-all duration-300 text-left w-full h-full block cursor-pointer ${
          isOver ? 'border-primary border-dashed bg-primary/5 scale-105 z-10' : 'border-outline-variant/10 hover:border-primary/50'
        }`}
      >
        <div className="aspect-square w-full rounded-lg overflow-hidden bg-surface-container-low pointer-events-none">
          <img 
            alt={asset.file.name} 
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" 
            src={asset.previewUrl} 
          />
        </div>
        <div className="flex justify-between items-center px-1 pointer-events-none w-full">
          <span className="text-[10px] font-bold text-on-surface truncate pr-2">{asset.file.name}</span>
          <span className="material-symbols-outlined text-sm text-green-600 font-bold">check_circle</span>
        </div>
      </button>

      {/* Remove Button - Fixed for accessibility */}
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(asset.id); }}
        className="absolute -top-2 -right-2 bg-error text-on-error rounded-full p-1 shadow-md opacity-0 group-hover/card:opacity-100 transition-opacity z-20"
        aria-label={`Remove ${asset.file.name}`}
      >
        <span className="material-symbols-outlined text-xs">close</span>
      </button>
    </div>
  );
}
