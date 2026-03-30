import React from 'react';
import { ArtpieceFormState, ArtpieceFormErrors } from '../../ArtpieceCreationModal';
import { FileDropzone } from './FileDropzone';

interface Props {
  formData: ArtpieceFormState;
  errors: ArtpieceFormErrors;
  onUpdate: <K extends keyof ArtpieceFormState>(field: K, value: ArtpieceFormState[K]) => void;
}

export default function UploadStep({ formData, errors, onUpdate }: Props) {
  const handleSimulatedUpload = () => {
    const mockFile = new File([''], 'The Struggle.png', { type: 'image/png' });
    onUpdate('file', mockFile);
  };

  return (
    <div className="space-y-10 p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Upload Your Art</h2>
        <p className="text-on-surface-variant text-sm">Select the high-resolution file for this piece.</p>
      </div>

      <FileDropzone 
        file={formData.file} 
        error={errors.file} 
        onUpload={handleSimulatedUpload} 
      />
    </div>
  );
}
