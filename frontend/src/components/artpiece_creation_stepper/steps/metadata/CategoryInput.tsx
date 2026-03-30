import React from 'react';

interface CategoryInputProps {
  categories: string[];
  onAdd: (category: string) => void;
  onRemove: (category: string) => void;
}

export function CategoryInput({ categories, onAdd, onRemove }: CategoryInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      onAdd(e.currentTarget.value.trim());
      e.currentTarget.value = '';
    }
  };

  return (
    <div className="space-y-2 relative">
      <label className="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider">Categories</label>
      <div className="w-full bg-surface-container-low px-4 py-3 flex flex-wrap gap-2 items-center min-h-[52px]">
        {categories.map((cat) => (
          <span key={cat} className="inline-flex items-center gap-1 bg-secondary-fixed text-on-secondary-container px-3 py-1 rounded-full text-xs font-medium">
            {cat}
            <span 
              className="material-symbols-outlined text-[14px] cursor-pointer hover:text-error transition-colors"
              style={{ fontVariationSettings: "'FILL' 0" }}
              onClick={() => onRemove(cat)}
            >
              close
            </span>
          </span>
        ))}
        <input 
          type="text" 
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-0 focus:ring-0 p-0 text-sm font-body min-w-[120px] outline-none" 
          placeholder="Type and press Enter to add..." 
        />
      </div>
    </div>
  );
}
