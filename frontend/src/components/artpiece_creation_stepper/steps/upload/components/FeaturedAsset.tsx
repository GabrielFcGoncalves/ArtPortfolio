import React from 'react';
import { ArtpieceAsset } from '@/lib/context/ArtpieceContext';

interface FeaturedAssetProps {
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

export function FeaturedAsset({
  asset,
  onRemove,
  onPreview,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  isDragging,
  isOver
}: Readonly<FeaturedAssetProps>) {
  return (
    <div 
      className={`md:col-span-2 relative group/card h-full ${isDragging ? 'opacity-40 scale-95' : 'opacity-100'}`}
    >
      <button 
        type="button"
        draggable
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        onClick={onPreview}
        className={`bg-surface-container-lowest p-4 rounded-xl border-2 shadow-sm flex flex-col gap-3 transition-all duration-300 text-left w-full h-full block cursor-pointer ${
          isOver ? 'border-primary border-dashed scale-[1.02] bg-primary/5' : 'border-outline-variant/10 hover:border-primary/50'
        }`}
      >
        <div className="flex-1 rounded-lg overflow-hidden bg-surface-container-low pointer-events-none relative aspect-[16/10] w-full">
          <img 
            alt={asset.file.name} 
            className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-700" 
            src={asset.previewUrl} 
          />
          <div className="absolute top-4 left-4 bg-primary text-on-primary px-3 py-1.5 rounded-lg shadow-lg flex items-center gap-2 z-10">
            <span className="material-symbols-outlined text-sm font-bold">star</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest">Primary Thumbnail</span>
          </div>
        </div>
        <div className="flex justify-between items-center px-1 pointer-events-none w-full">
          <div>
            <p className="text-xs font-bold text-on-surface truncate max-w-[200px]">{asset.file.name}</p>
            <p className="text-[10px] text-on-surface-variant font-medium">
              {(asset.file.size / (1024 * 1024)).toFixed(1)} MB
            </p>
          </div>
          <span className="material-symbols-outlined text-green-600 font-bold">check_circle</span>
        </div>
      </button>

      {/* Remove Button - Fixed for accessibility */}
      <button 
        type="button"
        onClick={(e) => { e.stopPropagation(); onRemove(asset.id); }}
        className="absolute -top-3 -right-3 bg-error text-on-error rounded-full p-1.5 shadow-lg opacity-0 group-hover/card:opacity-100 transition-opacity z-20"
        aria-label={`Remove ${asset.file.name}`}
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
}
