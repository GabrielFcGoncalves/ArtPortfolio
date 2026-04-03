import React from 'react';

interface UploadingStateProps {
  name: string;
  size: string;
  progress: number;
}

export function UploadingState({ name, size, progress }: UploadingStateProps) {
  return (
    <div className="w-full max-w-md bg-surface-container-lowest rounded-lg p-6 shadow-sm border border-outline-variant/10">
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>brush</span>
          <span className="text-xs font-bold text-on-surface truncate max-w-[200px]">{name}</span>
        </div>
        <span className="text-xs font-bold text-primary">{progress}%</span>
      </div>
      <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary transition-all duration-300" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-[10px] text-on-surface-variant font-medium">
          {progress < 100 ? 'Analyzing color profiles...' : 'Processing complete'}
        </span>
        <span className="text-[10px] text-on-surface-variant font-medium">{size}</span>
      </div>
    </div>
  );
}
