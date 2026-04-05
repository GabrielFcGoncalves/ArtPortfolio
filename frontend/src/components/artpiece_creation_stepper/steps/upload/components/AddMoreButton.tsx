import React from 'react';

interface AddMoreButtonProps {
  onAdd: () => void;
  fullWidth?: boolean;
}

export function AddMoreButton({ onAdd, fullWidth }: Readonly<AddMoreButtonProps>) {
  return (
    <button 
      onClick={(e) => { e.stopPropagation(); onAdd(); }}
      type="button"
      className={`bg-surface-container-low/50 border-2 border-dashed border-primary/30 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-primary hover:bg-primary/5 transition-all duration-300 group/add min-h-[140px] ${
        fullWidth ? 'col-span-2' : 'col-span-1'
      }`}
    >
      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover/add:scale-110 transition-transform">
        <span className="material-symbols-outlined text-primary">add</span>
      </div>
      <div className="text-center text-primary">
        <p className="text-sm font-bold tracking-wide">Add More</p>
        <p className="text-[10px] uppercase font-medium tracking-widest opacity-70">Drop assets</p>
      </div>
    </button>
  );
}
