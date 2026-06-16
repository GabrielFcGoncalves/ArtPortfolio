'use client';

import { useState, useEffect, useCallback } from 'react';
import { artService } from '@/services/api_client';
import { ArtPiece } from '@/components/me_profile/ArtPieceCard';

export default function usePublicPortfolio(userId: string | null) {
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchPortfolio = useCallback(async () => {
    if (!userId) return;

    try {
      setLoading(true);
      setError(null);
      const result = await artService.getPublicPortfolio(userId, 1, 50);
      const rawPieces = result.data || [];

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
      console.error('Failed to fetch public portfolio:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchPortfolio();
  }, [fetchPortfolio]);

  return { pieces, loading, error, refetch: fetchPortfolio };
}
