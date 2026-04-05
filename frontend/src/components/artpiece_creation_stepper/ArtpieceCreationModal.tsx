'use client';

import React, { useState } from 'react';
import Stepper, { Step } from '@/components/ui/Stepper';
import UploadStep from './steps/upload/UploadStep';
import MetadataStep from './steps/metadata/MetadataStep';
import ProtectionStep from './steps/protection/ProtectionStep';
import PublishStep from './steps/publish/PublishStep';

import { ArtpieceProvider, useArtpieceForm } from '@/lib/context/ArtpieceContext';

interface ArtpieceCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArtpieceCreationModal(props: ArtpieceCreationModalProps) {
  if (!props.isOpen) return null;

  return (
    <ArtpieceProvider>
      <ArtpieceCreationModalContent {...props} />
    </ArtpieceProvider>
  );
}

function ArtpieceCreationModalContent({ onClose }: ArtpieceCreationModalProps) {
  const { formData, submit } = useArtpieceForm();
  const [errors, setErrors] = useState<any>({});

  const validateStep = async (step: number) => {
    const newErrors: any = {};
    let isValid = true;

    if (step === 1) {
      if (formData.assets.length === 0) {
        newErrors.file = 'Please upload at least one art piece.';
        isValid = false;
      }
    } else if (step === 2) {
      if (!formData.metadata.title.trim()) {
        newErrors.title = 'Title of the piece is required.';
        isValid = false;
      }
    } else if (step === 4) {
      if (formData.publish.saleStatus === 'fixed' && !formData.publish.price.trim()) {
        newErrors.price = 'Price is required for fixed sale status.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handlePublish = async () => {
    try {
      await submit();
      return true;
    } catch (err: any) {
      setErrors({ global: err.message });
      return false;
    }
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
            <UploadStep errors={errors} />
          </Step>
          <Step>
            <MetadataStep errors={errors} />
          </Step>
          <Step>
            <ProtectionStep errors={errors} />
          </Step>
          <Step>
            <PublishStep errors={errors} />
          </Step>
        </Stepper>
        {errors.global && (
          <div className="bg-error/10 p-4 text-error text-center font-bold">
            {errors.global}
          </div>
        )}
      </div>
    </div>
  );
}
