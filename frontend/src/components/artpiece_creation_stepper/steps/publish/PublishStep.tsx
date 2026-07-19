import React from 'react';
import { VisibilitySettings } from './VisibilitySettings';
import { SaleStatusSettings } from './SaleStatusSettings';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';

interface Props {
  errors: any;
}

export default function PublishStep({ errors }: Props) {
  const { formData, updateField } = useArtpieceForm();
  const { nsfw } = formData.publish;

  return (
    <div className="space-y-10 p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Commercial Details</h2>
        <p className="text-on-surface-variant text-sm">Define how your artwork will be discovered and acquired.</p>
      </div>

      <VisibilitySettings />

      <SaleStatusSettings errors={errors} />

      <section className="pt-2">
        <label className="flex items-center p-5 bg-tertiary-container/10 border border-tertiary/20 rounded-xl cursor-pointer hover:bg-tertiary-container/20 transition-colors">
          <input 
            type="checkbox" 
            checked={nsfw}
            onChange={(e) => updateField('publish.nsfw', e.target.checked)}
            className="w-5 h-5 rounded border-tertiary text-tertiary focus:ring-tertiary" 
          />
          <div className="ml-4">
            <span className="block font-bold text-on-tertiary-container text-sm">Sensitive Content / NSFW</span>
            <span className="block text-xs text-on-tertiary-container/70">Flag this artwork for platform safety. Content may be blurred for some users.</span>
          </div>
        </label>
        <label className="flex items-center p-5 bg-tertiary-container/10 border border-tertiary/20 rounded-xl cursor-pointer hover:bg-tertiary-container/20 transition-colors mt-4">
          <input 
            type="checkbox" 
            checked={formData.publish.isFramed}
            onChange={(e) => updateField('publish.isFramed', e.target.checked)}
            className="w-5 h-5 rounded border-tertiary text-tertiary focus:ring-tertiary" 
          />
          <div className="ml-4">
            <span className="block font-bold text-on-tertiary-container text-sm">Artwork is Framed</span>
            <span className="block text-xs text-on-tertiary-container/70">Indicate whether this artwork comes with a frame included in the price.</span>
          </div>
        </label>
      </section>
    </div>
  );
}
