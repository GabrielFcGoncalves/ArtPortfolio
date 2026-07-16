'use client';

import React, { useEffect, useState, useRef } from 'react';
import { portfolioService } from '@/services/api_client';
import ArtworkCard from './ArtworkCard';

export default function ArtworkGrid() {
  const [artworks, setArtworks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchArtworks = async (pageNum: number) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      const res = await portfolioService.getAllArtworks(pageNum, 15);
      
      if (pageNum === 1) {
        setArtworks(res.data);
      } else {
        setArtworks(prev => [...prev, ...res.data]);
      }

      setHasMore(pageNum < res.pages);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch artworks:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchArtworks(1);
  }, []);

  useEffect(() => {
    if (!hasMore || loading || loadingMore) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchArtworks(page + 1);
        }
      },
      { threshold: 0.5 }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [hasMore, page, loading, loadingMore]);

  return (
    <section className="px-8 py-10 bg-white">
      {loading && artworks.length === 0 ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-20 space-y-2">
          <p className="text-sm font-bold text-on-surface">No artworks published on the platform yet.</p>
          <p className="text-xs text-outline">Be the first to share your work by clicking the &quot;Create&quot; button above!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-12">
            {artworks.map((artwork) => (
              <ArtworkCard 
                key={artwork.id} 
                id={artwork.id}
                title={artwork.title}
                username={artwork.username || "Anonymous Artist"}
                coverImage={artwork.cover_image}
              />
            ))}
          </div>

          {hasMore && (
            <div ref={loaderRef} className="mt-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
              <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/40">Curating more works</p>
            </div>
          )}
        </>
      )}
    </section>
  );
}
