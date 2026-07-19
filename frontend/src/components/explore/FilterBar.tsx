import React from 'react';

interface FilterBarProps {
  category: string;
  setCategory: (c: string) => void;
  sort: string;
  setSort: (s: string) => void;
  search: string;
  setSearch: (s: string) => void;
}

export default function FilterBar({ category, setCategory, sort, setSort, search, setSearch }: FilterBarProps) {
  const categories = [
    'Painting', 'Drawing', 'Sculpture', 'Digital Art', 
    'Photography', 'Mixed Media', 'Printmaking', 'Textile', 'Ceramics', 'Other'
  ];

  return (
    <section className="sticky top-[72px] z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 px-8 py-3">
      <div className="max-w-full mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Categories (scrollable horizontally) */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
          <button 
            onClick={() => setCategory('')}
            className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${!category ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/10'}`}
          >
            All Categories
          </button>
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => setCategory(cat)}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-colors ${category === cat ? 'bg-primary text-on-primary shadow-lg shadow-primary/20' : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high border border-outline-variant/10'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center space-x-4 w-full md:w-auto justify-between md:justify-end">
          {/* Search Input */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search artworks..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 pr-4 py-1.5 bg-surface-container-lowest border border-outline-variant/20 rounded-full text-xs text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all w-full sm:w-48"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-[16px]">
              search
            </span>
          </div>

          <div className="h-4 w-[1px] bg-outline-variant/30 hidden md:block"></div>

          {/* Sort Buttons */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setSort('latest')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${sort === 'latest' ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'}`}
            >
              Latest
            </button>
            <button 
              onClick={() => setSort('popular')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${sort === 'popular' ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'}`}
            >
              Popular
            </button>
            <button 
              onClick={() => setSort('views')}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${sort === 'views' ? 'text-primary bg-primary/10' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-high'}`}
            >
              Most Viewed
            </button>
          </div>
        </div>

      </div>
    </section>
  );
}
