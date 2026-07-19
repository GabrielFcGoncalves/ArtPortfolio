'use client';

import React, { useState } from 'react';
import FilterBar from '@/components/explore/FilterBar';
import ArtworkGrid from '@/components/explore/ArtworkGrid';
import ExploreFooter from '@/components/explore/ExploreFooter';

export default function ExplorePage() {
  const [category, setCategory] = useState<string>('');
  const [sort, setSort] = useState<string>('latest');
  const [search, setSearch] = useState<string>('');
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      
      <main className="pt-24 min-h-screen">
        <FilterBar 
          category={category} 
          setCategory={setCategory} 
          sort={sort} 
          setSort={setSort} 
          search={search} 
          setSearch={setSearch} 
        />
        <ArtworkGrid category={category} sort={sort} search={search} />
      </main>

      <ExploreFooter />

      {/* Floating Action Button (Only on Mobile) */}
      <div className="md:hidden fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center active:scale-95 transition-transform">
          <span className="material-symbols-outlined">add</span>
        </button>
      </div>
    </div>
  );
}
