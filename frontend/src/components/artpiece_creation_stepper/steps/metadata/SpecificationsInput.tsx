import React from 'react';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';

const CATEGORIES = [
  'Painting', 'Drawing', 'Sculpture', 'Digital Art', 
  'Photography', 'Mixed Media', 'Printmaking', 'Textile', 'Ceramics', 'Other'
];

export function SpecificationsInput() {
  const { formData, updateField } = useArtpieceForm();

  return (
    <div className="space-y-6">
      <h4 className="text-sm font-bold text-on-surface uppercase tracking-wider">Artwork Specifications</h4>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant ml-2">Category</label>
          <select
            value={formData.metadata.category || ''}
            onChange={(e) => updateField('metadata.category', e.target.value)}
            className="w-full px-5 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant ml-2">Medium / Materials</label>
          <input
            type="text"
            value={formData.metadata.medium || ''}
            onChange={(e) => updateField('metadata.medium', e.target.value)}
            placeholder="e.g. Oil on Canvas, Bronze..."
            className="w-full px-5 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface placeholder:text-outline-variant focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-on-surface-variant ml-2">Dimensions</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={formData.metadata.width || ''}
              onChange={(e) => updateField('metadata.width', parseFloat(e.target.value))}
              placeholder="W"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-outline-variant">×</span>
            <input
              type="number"
              value={formData.metadata.height || ''}
              onChange={(e) => updateField('metadata.height', parseFloat(e.target.value))}
              placeholder="H"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <span className="text-outline-variant">×</span>
            <input
              type="number"
              value={formData.metadata.depth || ''}
              onChange={(e) => updateField('metadata.depth', parseFloat(e.target.value))}
              placeholder="D"
              className="w-full px-4 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <select
              value={formData.metadata.dimensionUnit || 'cm'}
              onChange={(e) => updateField('metadata.dimensionUnit', e.target.value)}
              className="px-2 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="cm">cm</option>
              <option value="in">in</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5 flex gap-4">
          <div className="w-1/2 space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant ml-2">Weight (kg)</label>
            <input
              type="number"
              value={formData.metadata.weight || ''}
              onChange={(e) => updateField('metadata.weight', parseFloat(e.target.value))}
              placeholder="Weight"
              className="w-full px-5 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          <div className="w-1/2 space-y-1.5">
            <label className="text-xs font-semibold text-on-surface-variant ml-2">Creation Year</label>
            <input
              type="number"
              value={formData.metadata.year || ''}
              onChange={(e) => updateField('metadata.year', parseInt(e.target.value))}
              placeholder="YYYY"
              className="w-full px-5 py-3 rounded-xl bg-surface-container-low border border-outline-variant/30 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
