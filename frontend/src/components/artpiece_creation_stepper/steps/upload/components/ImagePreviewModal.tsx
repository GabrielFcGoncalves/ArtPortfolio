import React from 'react';
import { ArtpieceAsset } from '@/lib/context/ArtpieceContext';

interface ImagePreviewModalProps {
  asset: ArtpieceAsset;
  onClose: () => void;
}

export function ImagePreviewModal({ asset, onClose }: Readonly<ImagePreviewModalProps>) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if the click originated on the backdrop itself, not its children
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[200]">
      {/* Backdrop Backdrop Container */}
      <button 
        type="button" // Always specify type for buttons
        className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300 w-full h-full cursor-pointer flex items-center justify-center p-4 focus:outline-none border-none"
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        aria-label="Close preview"
      >
        {/* Modal Content */}
        <div className="max-w-7xl max-h-[90vh] w-full flex items-center justify-center relative cursor-default">
          <img 
            src={asset.previewUrl} 
            alt={`Full size preview of ${asset.file.name}`} 
            className="max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-300" 
          />
          <div className="absolute -bottom-16 left-0 right-0 text-center pointer-events-none">
            <h3 className="text-white text-xl font-headline font-bold">{asset.file.name}</h3>
            <p className="text-white/60 text-sm mt-1">{(asset.file.size / (1024 * 1024)).toFixed(2)} MB</p>
          </div>
        </div>
      </button>
    </div>
  );
}
