import React from 'react';
import { BasicInfo } from './BasicInfo';
import { CategoryInput } from './CategoryInput';
import { SpecificationsInput } from './SpecificationsInput';
import { CurationTip } from './CurationTip';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';

interface Props {
  errors: any;
}

export default function MetadataStep({ errors }: Props) {
  const { formData, updateField } = useArtpieceForm();

  const handleAddCategory = (category: string) => {
    if (!formData.metadata.tags.includes(category)) {
      updateField('metadata.tags', [...formData.metadata.tags, category]);
    }
  };

  const handleRemoveCategory = (category: string) => {
    updateField('metadata.tags', formData.metadata.tags.filter(c => c !== category));
  };

  return (
    <div className="space-y-8 p-6">
      <BasicInfo 
        errors={errors} 
      />

      <CategoryInput 
        categories={formData.metadata.tags} 
        onAdd={handleAddCategory} 
        onRemove={handleRemoveCategory} 
      />

      <SpecificationsInput />

      <CurationTip />
    </div>
  );
}
