import React from 'react';

export default function ActionCard() {
  return (
    <aside className="lg:col-span-5 sticky top-24">
      <div className="p-10 bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(122,86,66,0.06)] border border-outline-variant/10 space-y-8">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-medium text-outline">Listing Price</span>
          <span className="text-4xl font-extrabold font-headline text-primary">$2,400</span>
        </div>
        
        <div className="space-y-4">
          <button className="w-full py-4 bg-tertiary text-on-tertiary rounded-lg font-bold tracking-tight hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">shopping_cart</span>
            Buy Now
          </button>
          <button className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold tracking-tight hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">mail</span>
            Inquire via Message
          </button>
        </div>

        <div className="pt-6 border-t border-outline-variant/20 space-y-4">
          <div className="flex items-center gap-3 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <span>Secure Worldwide Shipping</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">security</span>
            <span>Transaction Protection & Insurance</span>
          </div>
        </div>

        <div className="p-4 bg-secondary-fixed/30 rounded-lg">
          <p className="text-xs font-semibold text-secondary leading-tight line-clamp-2">
            Interest in this piece is high. 3 other collectors have inquired in the last 24 hours.
          </p>
        </div>
      </div>
    </aside>
  );
}
