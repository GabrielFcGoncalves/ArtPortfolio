import React from 'react';

interface FileDropzoneProps {
  file: File | null;
  error?: string;
  onUpload: () => void;
}

export function FileDropzone({ file, error, onUpload }: FileDropzoneProps) {
  return (
    <div className="relative group" onClick={onUpload}>
      <div className={`border-2 ${error ? 'border-error' : 'border-dashed border-outline-variant hover:border-primary'} rounded-xl p-12 flex flex-col items-center justify-center transition-all duration-300 hover:bg-surface-container-low cursor-pointer min-h-[300px]`}>
        
        <div className="mb-8 w-24 h-24 bg-primary-container/30 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
          <span className="material-symbols-outlined text-4xl text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>upload_file</span>
        </div>
        
        <h3 className="text-2xl font-headline font-bold text-on-surface mb-2">Drag &amp; Drop Your Masterpiece</h3>
        <p className="text-on-surface-variant mb-12 text-center max-w-md">The Curated Atelier handles the digital preservation of your work with professional grade color profiles.</p>
        
        {file ? (
          <UploadStatus name={file.name} size="11.2MB" />
        ) : (
          <div className="mt-4 text-center">
            <p className="text-xs font-bold text-primary mb-1">High-res PNG/JPG preferred. Max 100MB.</p>
            <p className="text-[10px] text-outline uppercase tracking-wider">Raw formats supported via Atelier+ subscription</p>
          </div>
        )}
      </div>
      {error && <p className="text-error text-xs font-bold mt-2 ml-4">{error}</p>}
    </div>
  );
}

function UploadStatus({ name, size }: { name: string; size: string }) {
  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>brush</span>
          <span className="text-xs font-bold text-on-surface">{name}</span>
        </div>
        <span className="text-xs font-bold text-primary">100%</span>
      </div>
      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div className="h-full bg-primary transition-all duration-700 w-full" style={{ width: '100%' }}></div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[10px] text-on-surface-variant font-medium">Processing complete</span>
        <span className="text-[10px] text-on-surface-variant font-medium">{size} / {size}</span>
      </div>
    </div>
  );
}
