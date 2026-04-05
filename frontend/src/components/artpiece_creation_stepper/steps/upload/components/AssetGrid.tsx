import React, { useState } from 'react';
import { ArtpieceAsset } from '@/lib/context/ArtpieceContext';
import { FeaturedAsset } from './FeaturedAsset';
import { SmallAsset } from './SmallAsset';
import { AddMoreButton } from './AddMoreButton';
import { ImagePreviewModal } from './ImagePreviewModal';

interface AssetGridProps {
  assets: ArtpieceAsset[];
  onRemove: (id: string) => void;
  onAddMore: () => void;
  onMove: (from: number, to: number) => void;
}

export function AssetGrid({ assets, onRemove, onAddMore, onMove }: Readonly<AssetGridProps>) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const [previewAsset, setPreviewAsset] = useState<ArtpieceAsset | null>(null);

  const mainAsset = assets[0];
  const sideAssets = assets.slice(1);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (index: number) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      onMove(draggedIndex, index);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[400px] w-full">
        {/* Featured Thumbnail */}
        <FeaturedAsset 
          asset={mainAsset}
          onRemove={onRemove}
          onPreview={() => setPreviewAsset(mainAsset)}
          onDragStart={(e) => handleDragStart(e, 0)}
          onDragOver={(e) => handleDragOver(e, 0)}
          onDrop={() => handleDrop(0)}
          onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
          isDragging={draggedIndex === 0}
          isOver={dragOverIndex === 0}
        />

        {/* Supporting Assets */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4 auto-rows-min">
          {sideAssets.map((asset, i) => {
            const actualIndex = i + 1;
            return (
              <SmallAsset 
                key={asset.id}
                asset={asset}
                onRemove={onRemove}
                onPreview={() => setPreviewAsset(asset)}
                onDragStart={(e) => handleDragStart(e, actualIndex)}
                onDragOver={(e) => handleDragOver(e, actualIndex)}
                onDrop={() => handleDrop(actualIndex)}
                onDragEnd={() => { setDraggedIndex(null); setDragOverIndex(null); }}
                isDragging={draggedIndex === actualIndex}
                isOver={dragOverIndex === actualIndex}
              />
            );
          })}

          <AddMoreButton 
            onAdd={onAddMore} 
            fullWidth={sideAssets.length % 2 === 0}
          />
        </div>
      </div>

      {previewAsset && (
        <ImagePreviewModal 
          asset={previewAsset} 
          onClose={() => setPreviewAsset(null)} 
        />
      )}
    </>
  );
}
