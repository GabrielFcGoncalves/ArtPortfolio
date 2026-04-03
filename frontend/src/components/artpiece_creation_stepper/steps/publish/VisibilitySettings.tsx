import React from 'react';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';

export function VisibilitySettings() {
  const { formData, updateField } = useArtpieceForm();
  const visibility = formData.publish.visibility;

  return (
    <section className="space-y-4">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Visibility Settings</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label 
          onClick={() => updateField('publish.visibility', 'PUBLIC')}
          className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${visibility === 'PUBLIC' ? 'bg-surface-container-low border-primary' : 'bg-surface-container-lowest border-transparent hover:border-outline-variant'}`}
        >
          <input type="radio" name="visibility" className="hidden" checked={visibility === 'PUBLIC'} readOnly />
          <div className="flex items-center justify-between mb-2">
            <span className={`material-symbols-outlined ${visibility === 'PUBLIC' ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
            <div className={`w-4 h-4 rounded-full border-2 ${visibility === 'PUBLIC' ? 'border-primary bg-primary' : 'border border-outline bg-white'}`}></div>
          </div>
          <span className="font-bold text-on-surface">Public Portfolio</span>
          <span className="text-xs text-on-surface-variant mt-1">Visible to all visitors and searchable in common areas.</span>
        </label>
        
        <label 
          onClick={() => updateField('publish.visibility', 'PRIVATE')}
          className={`relative flex flex-col p-4 rounded-xl border-2 cursor-pointer transition-all ${visibility === 'PRIVATE' ? 'bg-surface-container-low border-primary' : 'bg-surface-container-lowest border-transparent hover:border-outline-variant'}`}
        >
          <input type="radio" name="visibility" className="hidden" checked={visibility === 'PRIVATE'} readOnly />
          <div className="flex items-center justify-between mb-2">
            <span className={`material-symbols-outlined ${visibility === 'PRIVATE' ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: "'FILL' 1" }}>link</span>
            <div className={`w-4 h-4 rounded-full border-2 ${visibility === 'PRIVATE' ? 'border-primary bg-primary' : 'border border-outline bg-white'}`}></div>
          </div>
          <span className="font-bold text-on-surface">Private Link</span>
          <span className="text-xs text-on-surface-variant mt-1">Only accessible via direct URL. Hidden from public exploration.</span>
        </label>
      </div>
    </section>
  );
}
