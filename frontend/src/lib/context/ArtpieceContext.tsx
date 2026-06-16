import React, { createContext, useContext, useState, useMemo, useCallback, useEffect, useRef } from 'react';
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

  const isSubmittedRef = useRef(false);

  // Load draft from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedDraft = localStorage.getItem('porfordio_artpiece_draft');
      if (savedDraft) {
        try {
          const parsed = JSON.parse(savedDraft);
          setFormData(prev => ({
            ...prev,
            metadata: parsed.metadata || prev.metadata,
            protection: parsed.protection || prev.protection,
            publish: parsed.publish ? { ...parsed.publish, isPublished: true } : prev.publish,
          }));
        } catch (e) {
          console.error('Failed to parse artpiece draft from localStorage', e);
        }
      }
    }
  }, []);

  // Save draft to localStorage on changes, unless submitted
  useEffect(() => {
    if (typeof window !== 'undefined' && !isSubmittedRef.current) {
      const draftData = {
        metadata: formData.metadata,
        protection: formData.protection,
        publish: formData.publish,
      };
      localStorage.setItem('porfordio_artpiece_draft', JSON.stringify(draftData));
    }
  }, [formData.metadata, formData.protection, formData.publish]);

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

    if (formData.assets.length === 0) throw new Error('At least one file required');
    if (!formData.metadata.title) throw new Error('Title required');


    const files = formData.assets.map(asset => ({
      clientFileName: asset.file.name,
      contentType: asset.file.type
    }));

    // 3. Prepare Payload
    const payload = {
      title: formData.metadata.title,
      description: formData.metadata.description,
      tags: formData.metadata.tags.join(','),
      files: files,
      isPublished: true
    };

    try {
      isSubmittedRef.current = true;
      const result = await portfolioService.createPiece(payload);

      if (result && result.assets) {
        await Promise.all(
          formData.assets.map(async (asset, index) => {
            const matchingAsset = result.assets.find((a: any) => a.sequenceOrder === index) || result.assets[index];
            if (!matchingAsset || !matchingAsset.uploadUrl) {
              throw new Error(`No upload URL available for ${asset.file.name}`);
            }

            const uploadResponse = await fetch(matchingAsset.uploadUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': asset.file.type,
              },
              body: asset.file,
            });

            if (!uploadResponse.ok) {
              throw new Error(`Storage upload failed for ${asset.file.name}`);
            }
          })
        );
      }

      // Clear draft on successful completion
      localStorage.removeItem('porfordio_artpiece_draft');

      return result;
    } catch (error: any) {
      isSubmittedRef.current = false;
      console.error('Atelier Sync Failed:', error);
      throw new Error(error.message || 'Failed to save your art piece. Please try again.');
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
