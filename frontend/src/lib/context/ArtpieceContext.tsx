import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { portfolioService } from '@/services/api_client';

// Define the interface for Artpiece Form Data
export interface ArtpieceAsset {
  id: string;
  file: File;
  previewUrl: string;
  isUploading?: boolean;
  progress?: number;
}

export interface ArtpieceFormData {
  assets: ArtpieceAsset[];
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
  addAsset: (asset: ArtpieceAsset) => void;
  moveAsset: (fromIndex: number, toIndex: number) => void;
  removeAsset: (id: string) => void;
  submit: () => Promise<any>;
}

const ArtpieceContext = createContext<ArtpieceContextType | null>(null);

export function ArtpieceProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [formData, setFormData] = useState<ArtpieceFormData>({
    assets: [],
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

  const updateField = useCallback((path: string, value: any) => {
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
      const lastKey = keys.at(-1);
      if (lastKey) {
        current[lastKey] = value;
      }
      return newData;
    });
  }, []);

  const addAsset = useCallback((asset: ArtpieceAsset) => {
    setFormData(prev => ({
      ...prev,
      assets: [...prev.assets, asset]
    }));
  }, []);

  const moveAsset = useCallback((fromIndex: number, toIndex: number) => {
    setFormData(prev => {
      const newAssets = [...prev.assets];
      const [moved] = newAssets.splice(fromIndex, 1);
      newAssets.splice(toIndex, 0, moved);
      return { ...prev, assets: newAssets };
    });
  }, []);

  const removeAsset = useCallback((id: string) => {
    setFormData(prev => ({
      ...prev,
      assets: prev.assets.filter(a => a.id !== id)
    }));
  }, []);

  const submit = useCallback(async () => {
    // 1. Validation
    if (formData.assets.length === 0) throw new Error('At least one file required');
    if (!formData.metadata.title) throw new Error('Title required');
    
    // 2. Simulated Storage Upload
    // Since real Azure Blob storage is not configured yet, 
    // we simulate generating the blobPaths after the upload.
    const blobPaths = formData.assets.map(asset => {
      const sanitizedName = asset.file.name.replaceAll(/\s+/g, '_').toLowerCase();
      const uniqueId = Math.random().toString(36).substring(2, 8);
      return `portfolio/pieces/${uniqueId}-${sanitizedName}`;
    });

    // 3. Prepare Payload
    const payload = {
      title: formData.metadata.title,
      description: formData.metadata.description,
      tags: formData.metadata.tags.join(','),
      blobPaths: blobPaths,
      isPublished: formData.publish.isPublished
    };

    try {
      const result = await portfolioService.createPiece(payload);
      return result;
    } catch (error) {
      console.error('Atelier Sync Failed:', error);
      throw new Error('Failed to save your art piece. Please try again.');
    }
  }, [formData]);

  const value = useMemo(() => ({
    formData,
    updateField,
    addAsset,
    moveAsset,
    removeAsset,
    submit
  }), [formData, updateField, addAsset, moveAsset, removeAsset, submit]);

  return (
    <ArtpieceContext.Provider value={value}>
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
