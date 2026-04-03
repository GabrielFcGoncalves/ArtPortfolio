import React from 'react';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';

interface BasicInfoProps {
  errors: { title?: string; story?: string };
}

export function BasicInfo({ errors }: BasicInfoProps) {
  const { formData, updateField } = useArtpieceForm();

  return (
    <>
      {/* Field: Title */}
      <div className="space-y-2">
        <label className="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="piece-title">Title of the Piece</label>
        <input 
          id="piece-title"
          type="text"
          value={formData.metadata.title}
          onChange={(e) => updateField('metadata.title', e.target.value)}
          placeholder="e.g., Whispers of the High Desert"
          className={`w-full bg-surface-container-low border-0 border-b-2 ${errors.title ? 'border-error' : 'border-transparent focus:border-primary'} focus:ring-0 px-4 py-3 text-on-surface font-body transition-all placeholder:text-outline-variant`}
        />
        {errors.title && <p className="text-error text-[11px] font-bold mt-1">{errors.title}</p>}
      </div>

      {/* Field: The Story */}
      <div className="space-y-2">
        <label className="block text-xs font-label font-bold text-on-surface-variant uppercase tracking-wider" htmlFor="piece-story">The Story</label>
        <p className="text-[11px] text-outline mb-2">Narrate the inspiration, process, or the soul behind this creation.</p>
        <textarea 
          id="piece-story"
          rows={5}
          value={formData.metadata.description}
          onChange={(e) => updateField('metadata.description', e.target.value)}
          placeholder="It began with the way the morning light hit the terracotta tiles..."
          className={`w-full bg-surface-container-low border-0 border-b-2 ${errors.story ? 'border-error' : 'border-transparent focus:border-primary'} focus:ring-0 px-4 py-3 text-on-surface font-body transition-all placeholder:text-outline-variant resize-none`}
        />
        {errors.story && <p className="text-error text-[11px] font-bold mt-1">{errors.story}</p>}
      </div>
    </>
  );
}
