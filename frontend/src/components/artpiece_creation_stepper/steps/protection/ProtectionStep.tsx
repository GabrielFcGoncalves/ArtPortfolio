import React from 'react';
import { ArtpieceFormState, ArtpieceFormErrors } from '../../ArtpieceCreationModal';
import { SecurityToggles } from './SecurityToggles';
import { WatermarkControls } from './WatermarkControls';
import { WatermarkPreview } from './WatermarkPreview';

interface Props {
  formData: ArtpieceFormState;
  errors: ArtpieceFormErrors;
  onUpdate: <K extends keyof ArtpieceFormState>(field: K, value: ArtpieceFormState[K]) => void;
}

export default function ProtectionStep({ formData, onUpdate }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 p-6">
      <div className="md:col-span-7 space-y-10">
        <SecurityToggles 
          disableRightClick={formData.disableRightClick} 
          noAI={formData.noAI} 
          onUpdate={onUpdate as any} 
        />
        
        <WatermarkControls 
          applyWatermark={formData.applyWatermark} 
          watermarkStyle={formData.watermarkStyle} 
          watermarkOpacity={formData.watermarkOpacity} 
          onUpdate={onUpdate as any} 
        />
      </div>

      <div className="md:col-span-12 lg:col-span-5 relative">
        <WatermarkPreview 
          applyWatermark={formData.applyWatermark} 
          watermarkStyle={formData.watermarkStyle} 
          watermarkOpacity={formData.watermarkOpacity} 
        />
      </div>
    </div>
  );
}
