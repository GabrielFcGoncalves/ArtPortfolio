import React from 'react';
import { FileDropzone } from './FileDropzone';

interface Props {
  errors: any;
}

export default function UploadStep({ errors }: Props) {
  return (
    <div className="space-y-10 p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight">Upload Your Art</h2>
        <p className="text-on-surface-variant text-sm">Select the high-resolution file for this piece.</p>
      </div>

      <FileDropzone />
      {errors.file && <p className="text-error text-xs font-bold mt-2 ml-4">{errors.file}</p>}
    </div>
  );
}
