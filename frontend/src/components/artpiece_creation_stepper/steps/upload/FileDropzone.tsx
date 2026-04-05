import React, { useRef, useState } from 'react';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';
import { IdleState } from './components/IdleState';
import { UploadingState } from './components/UploadingState';
import { AssetGrid } from './components/AssetGrid';

export function FileDropzone() {
  const { formData, addAsset, moveAsset, removeAsset } = useArtpieceForm();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUpload, setCurrentUpload] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        setIsUploading(true);
        setCurrentUpload(file.name);
        setProgress(0);
        const url = URL.createObjectURL(file);

        // Simulate upload progress
        let p = 0;
        const interval = setInterval(() => {
          p += Math.floor(Math.random() * 15) + 5;
          if (p >= 100) {
            p = 100;
            clearInterval(interval);
            setIsUploading(false);
            setCurrentUpload(null);
            
            const newAsset = {
              id: Math.random().toString(36).substring(2, 11),
              file: file,
              previewUrl: url,
            };
            addAsset(newAsset);
          }
          setProgress(p);
        }, 150);
      } else {
        alert('Please upload an image file');
      }
    });
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      handleFiles(e.target.files);
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files?.length) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (formData.assets.length === 0 && !isUploading) {
        triggerFileInput();
      }
    }
  };

  // Extract nested ternary logic
  let content;
  if (isUploading) {
    content = (
      <UploadingState 
        name={currentUpload || 'Processing...'} 
        size="Calculating..." 
        progress={progress}
      />
    );
  } else if (formData.assets.length > 0) {
    content = (
      <AssetGrid 
        assets={formData.assets}
        onRemove={removeAsset}
        onAddMore={triggerFileInput}
        onMove={moveAsset}
      />
    );
  } else {
    content = <IdleState />;
  }

  const isClickable = formData.assets.length === 0 && !isUploading;

  return (
    <section 
      aria-label="Dropzone for art assets"
      className={`relative group transition-all duration-300 w-full outline-none rounded-xl ${isDragging ? 'scale-[1.02]' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <input 
        type="file" 
        multiple
        ref={fileInputRef} 
        onChange={onFileChange} 
        className="hidden" 
        accept="image/*"
      />
      
      {isClickable ? (
        <button
          type="button"
          onClick={triggerFileInput}
          onKeyDown={handleKeyDown}
          className={`w-full border-2 border-dashed border-outline-variant hover:border-primary hover:bg-surface-container-low rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 min-h-[300px] ${
            isDragging ? 'border-primary bg-primary/5' : ''
          } focus-visible:ring-2 focus-visible:ring-primary outline-none`}
          aria-label="Select images to upload"
        >
          {content}
        </button>
      ) : (
        <div className={`border-2 rounded-xl p-8 flex flex-col items-center justify-center transition-all duration-300 border-outline-variant ${
          isDragging ? 'border-primary bg-primary/5' : ''
        }`}>
          {content}
        </div>
      )}
      
      {formData.assets.length > 0 && (
        <div className="mt-8 text-center px-4">
          <p className="text-sm font-bold text-primary mb-1">High-res PNG/JPG preferred. Max 100MB.</p>
          <p className="text-[10px] text-outline uppercase tracking-wider">Raw formats supported via Atelier+ subscription</p>
        </div>
      )}
    </section>
  );
}
