import React from 'react';

export function CurationTip() {
  return (
    <div className="mt-8 p-6 bg-tertiary-container/10 rounded-xl border border-tertiary-container/20 flex items-start gap-4">
      <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 0" }}>auto_awesome</span>
      <div>
        <h4 className="text-sm font-headline font-bold text-on-tertiary-container mb-1">Curation Tip</h4>
        <p className="text-xs text-on-tertiary-container/80 leading-relaxed">Pieces with stories longer than 200 words tend to receive 40% more engagement from collectors in the gallery.</p>
      </div>
    </div>
  );
}
