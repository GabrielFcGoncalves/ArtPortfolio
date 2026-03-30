import React from 'react';
import { ArtpieceFormState, ArtpieceFormErrors } from '../../ArtpieceCreationModal';
import { BasicInfo } from './BasicInfo';
import { CategoryInput } from './CategoryInput';
import { CurationTip } from './CurationTip';

interface Props {
  formData: ArtpieceFormState;
  errors: ArtpieceFormErrors;
  onUpdate: <K extends keyof ArtpieceFormState>(field: K, value: ArtpieceFormState[K]) => void;
}

export default function MetadataStep({ formData, errors, onUpdate }: Props) {
  const handleAddCategory = (category: string) => {
    if (!formData.categories.includes(category)) {
      onUpdate('categories', [...formData.categories, category]);
    }
  };

  const handleRemoveCategory = (category: string) => {
    onUpdate('categories', formData.categories.filter(c => c !== category));
  };

  return (
    <div className="space-y-8 p-6">
      <BasicInfo 
        title={formData.title} 
        story={formData.story} 
        errors={errors} 
        onUpdate={onUpdate} 
      />

      <CategoryInput 
        categories={formData.categories} 
        onAdd={handleAddCategory} 
        onRemove={handleRemoveCategory} 
      />

      <CurationTip />
    </div>
  );
}
