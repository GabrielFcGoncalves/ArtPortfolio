import React from 'react';
import { ArtpieceFormState, ArtpieceFormErrors } from '../../ArtpieceCreationModal';
import { VisibilitySettings } from './VisibilitySettings';
import { SaleStatusSettings } from './SaleStatusSettings';

interface Props {
  formData: ArtpieceFormState;
  errors: ArtpieceFormErrors;
  onUpdate: <K extends keyof ArtpieceFormState>(field: K, value: ArtpieceFormState[K]) => void;
}

export default function PublishStep({ formData, errors, onUpdate }: Props) {
  return (
    <div className="space-y-10 p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-extrabold tracking-tight text-on-surface">Commercial Details</h2>
        <p className="text-on-surface-variant text-sm">Define how your artwork will be discovered and acquired.</p>
      </div>

      <VisibilitySettings 
        visibility={formData.visibility} 
        onUpdate={(val) => onUpdate('visibility', val)} 
      />

      <SaleStatusSettings 
        saleStatus={formData.saleStatus} 
        price={formData.price} 
        errors={errors} 
        onUpdate={onUpdate as any} 
      />

      <section className="pt-2">
        <label className="flex items-center p-5 bg-tertiary-container/10 border border-tertiary/20 rounded-xl cursor-pointer hover:bg-tertiary-container/20 transition-colors">
          <input 
            type="checkbox" 
            checked={formData.nsfw}
            onChange={(e) => onUpdate('nsfw', e.target.checked)}
            className="w-5 h-5 rounded border-tertiary text-tertiary focus:ring-tertiary" 
          />
          <div className="ml-4">
            <span className="block font-bold text-on-tertiary-container text-sm">Sensitive Content / NSFW</span>
            <span className="block text-xs text-on-tertiary-container/70">Flag this artwork for platform safety. Content may be blurred for some users.</span>
          </div>
        </label>
      </section>
    </div>
  );
}
