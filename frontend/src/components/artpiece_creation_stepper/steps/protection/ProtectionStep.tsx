import React from 'react';
import { SecurityToggles } from './SecurityToggles';
import { WatermarkControls } from './WatermarkControls';
import { WatermarkPreview } from './WatermarkPreview';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';

interface Props {
  errors: any;
}

export default function ProtectionStep({ errors }: Props) {
  const { formData } = useArtpieceForm();
  const { applyWatermark, watermarkStyle, watermarkOpacity } = formData.protection;

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-12 p-6">
      <div className="md:col-span-7 space-y-10">
        <SecurityToggles />
        
        <WatermarkControls />
      </div>

      <div className="md:col-span-12 lg:col-span-5 relative">
        <WatermarkPreview 
          applyWatermark={applyWatermark} 
          watermarkStyle={watermarkStyle} 
          watermarkOpacity={watermarkOpacity} 
        />
      </div>
    </div>
  );
}
