import { useState, useEffect, useCallback } from 'react';
import { portfolioService } from '@/services/api_client';
import { ArtPiece } from '@/components/me_profile/ArtPieceCard';

/**
 * Custom hook to fetch the artist's portfolio, download private S3 assets 
 * using signed URLs, and convert them to local object URLs for rendering.
 */
export default function useMyPortfolio(initialized: boolean, keycloak: any) {
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const syncGallery = useCallback(async () => {
    if (!initialized || !keycloak.authenticated) return;
    
    try {
      setLoading(true);
      setError(null);
      const result = await portfolioService.getMyPortfolio(1, 50);
      const rawPieces = result.data || [];

      // Map raw response properties to camelCase expected by components
      const processedPieces = rawPieces.map((piece: any) => {
        const rawAssets = piece.assets || [];
        const processedAssets = rawAssets.map((asset: any) => ({
          id: asset.id,
          sequenceOrder: asset.sequenceOrder ?? asset.sequence_order ?? 0,
          blobUrl: asset.blobUrl ?? asset.blob_url ?? '',
          downloadUrl: asset.downloadUrl ?? asset.download_url ?? '',
        }));

        return {
          id: piece.id,
          title: piece.title,
          description: piece.description || '',
          coverImage: piece.cover_image ?? piece.coverImage ?? '',
          assetCount: piece.asset_count ?? piece.assetCount ?? rawAssets.length,
          createdAt: piece.created_at ?? piece.createdAt ?? '',
          isPublished: piece.is_published ?? piece.isPublished ?? false,
          assets: processedAssets,
        };
      });

      setPieces(processedPieces);
    } catch (err: any) {
      console.error('Atelier Sync Error:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [initialized, keycloak.authenticated]);

  useEffect(() => {
    syncGallery();
  }, [syncGallery]);

  return { pieces, loading, error, refetch: syncGallery };
}
