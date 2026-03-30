'use client';

import React, { useState } from 'react';
import Stepper, { Step } from '@/components/ui/Stepper';
import UploadStep from './steps/upload/UploadStep';
import MetadataStep from './steps/metadata/MetadataStep';
import ProtectionStep from './steps/protection/ProtectionStep';
import PublishStep from './steps/publish/PublishStep';

export interface ArtpieceFormState {
  file: File | null;
  title: string;
  story: string;
  categories: string[];
  disableRightClick: boolean;
  noAI: boolean;
  applyWatermark: boolean;
  watermarkStyle: 'center' | 'tiled';
  watermarkOpacity: number;
  visibility: 'public' | 'private';
  saleStatus: 'showcase' | 'fixed' | 'commissions';
  price: string;
  nsfw: boolean;
}

export interface ArtpieceFormErrors {
  file?: string;
  title?: string;
  story?: string;
  categories?: string;
  price?: string;
}

interface ArtpieceCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtpieceCreationModal({ isOpen, onClose }: ArtpieceCreationModalProps) {
  const [formData, setFormData] = useState<ArtpieceFormState>({
    file: null,
    title: '',
    story: '',
    categories: ['Fine Art', 'Abstract'], // Default populated based on mock
    disableRightClick: true,
    noAI: true,
    applyWatermark: true,
    watermarkStyle: 'center',
    watermarkOpacity: 25,
    visibility: 'public',
    saleStatus: 'fixed',
    price: '1250.00',
    nsfw: false,
  });

  const [errors, setErrors] = useState<ArtpieceFormErrors>({});

  if (!isOpen) return null;

  const handleUpdateField = <K extends keyof ArtpieceFormState>(
    field: K,
    value: ArtpieceFormState[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for field on change
    if (errors[field as keyof ArtpieceFormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateStep = async (step: number) => {
    const newErrors: ArtpieceFormErrors = {};
    let isValid = true;

    if (step === 1) {
      if (!formData.file) {
        // In a real app we'd block this, but since we don't handle real file uploads yet we'll pass.
        // Uncomment to enable actual validation:
        // newErrors.file = 'Please upload an art piece.';
        // isValid = false;
      }
    } else if (step === 2) {
      if (!formData.title.trim()) {
        newErrors.title = 'Title of the piece is required.';
        isValid = false;
      }
      if (!formData.story.trim()) {
        newErrors.story = 'Please provide a story for the piece.';
        isValid = false;
      }
    } else if (step === 3) {
      // Protection step has defaults and toggles, usually valid
    } else if (step === 4) {
      if (formData.saleStatus === 'fixed' && !formData.price.trim()) {
        newErrors.price = 'Price is required for fixed sale status.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePublish = async () => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Publishing art piece:', formData);
    return true;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 md:p-8">
      {/* Modal Container */}
      <div className="bg-surface w-full max-w-6xl max-h-[921px] overflow-hidden rounded-xl shadow-[0_20px_80px_rgba(0,0,0,0.15)] flex flex-col h-full">
        <Stepper
          initialStep={1}
          title="Add New Art Piece"
          subtitle="Digital Atelier Asset Management"
          onClose={onClose}
          validateStep={validateStep}
          onBeforeComplete={handlePublish}
          onFinalStepCompleted={onClose}
        >
          <Step>
            <UploadStep
              formData={formData}
              errors={errors}
              onUpdate={handleUpdateField}
            />
          </Step>
          <Step>
            <MetadataStep
              formData={formData}
              errors={errors}
              onUpdate={handleUpdateField}
            />
          </Step>
          <Step>
            <ProtectionStep
              formData={formData}
              errors={errors}
              onUpdate={handleUpdateField}
            />
          </Step>
          <Step>
            <PublishStep
              formData={formData}
              errors={errors}
              onUpdate={handleUpdateField}
            />
          </Step>
        </Stepper>
      </div>
    </div>
  );
}
