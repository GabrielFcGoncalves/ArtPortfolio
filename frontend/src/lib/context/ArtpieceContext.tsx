import React, { createContext, useContext, useState } from 'react';

// Define the interface for Artpiece Form Data
export interface ArtpieceFormData {
  file: File | null;
  previewUrl: string | null;
  metadata: {
    title: string;
    description: string;
    tags: string[];
  };
  protection: {
    disableRightClick: boolean;
    noAI: boolean;
    applyWatermark: boolean;
    watermarkStyle: 'center' | 'tiled';
    watermarkOpacity: number;
  };
  publish: {
    visibility: 'PUBLIC' | 'PRIVATE' | 'FOLLOWERS';
    saleStatus: 'showcase' | 'fixed' | 'commissions';
    price: string;
    isPublished: boolean;
    nsfw: boolean;
  };
}

// Define the shape of the Context
interface ArtpieceContextType {
  formData: ArtpieceFormData;
  updateField: (path: string, value: any) => void;
  submit: () => Promise<any>;
}

const ArtpieceContext = createContext<ArtpieceContextType | null>(null);

export function ArtpieceProvider({ children }: { children: React.ReactNode }) {
  const [formData, setFormData] = useState<ArtpieceFormData>({
    file: null,
    previewUrl: null,
    metadata: { title: '', description: '', tags: [] },
    protection: {
      disableRightClick: true,
      noAI: true,
      applyWatermark: true,
      watermarkStyle: 'center',
      watermarkOpacity: 25,
    },
    publish: {
      visibility: 'PUBLIC',
      saleStatus: 'fixed',
      price: '0.00',
      isPublished: true,
      nsfw: false,
    }
  });

  const updateField = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split('.');
      const newData = { ...prev };
      let current: any = newData;
      
      // Navigate to nested field and create copies
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      // Update value
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const submit = async () => {
    // Validate all steps
    if (!formData.file) throw new Error('File required');
    if (!formData.metadata.title) throw new Error('Title required');
    
    // Upload logic will go here
    console.log('Submitting artpiece:', formData);
    
    /* 
    // Example flow (Requires backend API integration)
    const sasResponse = await api.getSasToken(formData.file.name);
    await uploadToAzure(sasResponse.sas_url, formData.file);
    
    const response = await api.createArtpiece({
      blob_path: sasResponse.blob_path,
      title: formData.metadata.title,
      description: formData.metadata.description,
      tags: formData.metadata.tags,
      visibility: formData.protection.visibility,
      is_published: formData.publish.isPublished
    });
    return response;
    */

    return { success: true };
  };

  return (
    <ArtpieceContext.Provider value={{ formData, updateField, submit }}>
      {children}
    </ArtpieceContext.Provider>
  );
}

// Custom hook to use context
export function useArtpieceForm() {
  const context = useContext(ArtpieceContext);
  if (!context) {
    throw new Error('useArtpieceForm must be used within ArtpieceProvider');
  }
  return context;
}
