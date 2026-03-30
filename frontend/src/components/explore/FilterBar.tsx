import React from 'react';

export default function FilterBar() {
  return (
    <section className="sticky top-[72px] z-40 bg-surface/90 backdrop-blur-md border-b border-outline-variant/10 px-8 py-3">
      <div className="max-w-full mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button className="px-4 py-1.5 rounded-full bg-primary text-on-primary text-xs font-semibold tracking-wide shadow-lg shadow-primary/20">All Categories</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-medium hover:bg-surface-container-high transition-colors border border-outline-variant/10">Digital</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-medium hover:bg-surface-container-high transition-colors border border-outline-variant/10">Physical</button>
          <div className="h-4 w-[1px] bg-outline-variant/30 mx-2"></div>
          <button className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-medium hover:bg-surface-container-high transition-colors border border-outline-variant/10">Latest</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-medium hover:bg-surface-container-high transition-colors border border-outline-variant/10">Popular</button>
          <button className="px-4 py-1.5 rounded-full bg-surface-container-lowest text-on-surface-variant text-xs font-medium hover:bg-surface-container-high transition-colors border border-outline-variant/10">Artists</button>
        </div>
        <div className="flex items-center text-on-surface-variant text-xs font-medium cursor-pointer hover:text-primary transition-colors group">
          <span className="material-symbols-outlined text-sm mr-1 group-hover:scale-110 transition-transform">tune</span>
          Advanced Filters
        </div>
      </div>
    </section>
  );
}
