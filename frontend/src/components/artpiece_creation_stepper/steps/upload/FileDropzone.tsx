import React, { useRef, useState } from 'react';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';
import { IdleState } from './components/IdleState';
import { UploadingState } from './components/UploadingState';
import { PreviewState } from './components/PreviewState';

export function FileDropzone() {
  const { formData, updateField } = useArtpieceForm();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setIsUploading(true);
      setProgress(0);
      const url = URL.createObjectURL(file);
      updateField('previewUrl', url);

      // Simulate upload progress
      let p = 0;
      const interval = setInterval(() => {
        p += Math.floor(Math.random() * 15) + 5;
        if (p >= 100) {
          p = 100;
          clearInterval(interval);
          setIsUploading(false);
          updateField('file', file);
        }
        setProgress(p);
      }, 200);
    } else {
      alert('Please upload an image file');
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
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
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    updateField('file', null);
    updateField('previewUrl', null);
    setIsUploading(false);
    setProgress(0);
  };

  return (
    <div 
      className={`relative group transition-all duration-300 ${isDragging ? 'scale-[1.02]' : ''}`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onClick={triggerFileInput}
    >
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={onFileChange} 
        className="hidden" 
        accept="image/*"
      />
      
      <div className={`border-2 rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-300 hover:bg-surface-container-low cursor-pointer min-h-[300px] ${
        isDragging ? 'border-primary bg-primary/5' : 'border-dashed border-outline-variant hover:border-primary'
      }`}>
        
        {isUploading ? (
          <UploadingState 
            name={formData.previewUrl ? 'Preparing Masterpiece...' : 'Processing...'} 
            size={fileInputRef.current?.files?.[0] ? `${(fileInputRef.current.files[0].size / (1024 * 1024)).toFixed(1)}MB` : "Calculating..."} 
            progress={progress}
          />
        ) : formData.file && formData.previewUrl ? (
          <PreviewState 
            url={formData.previewUrl}
            name={formData.file.name}
            onRemove={handleRemove}
          />
        ) : (
          <IdleState />
        )}
      </div>
    </div>
  );
}
