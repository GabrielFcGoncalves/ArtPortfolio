'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PurchaseCancelPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pieceId = searchParams.get('piece_id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!pieceId) {
      router.push('/explore');
    }
  }, [pieceId, router]);

  if (!mounted || !pieceId) return null;

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl shadow-lg border border-outline-variant/20 text-center space-y-6">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-4xl text-error">cancel</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Purchase Cancelled</h1>
          <p className="text-on-surface-variant">
            Your checkout process was cancelled. No charges were made.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link 
            href={`/artpiece/${pieceId}`}
            className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
          >
            Return to Artwork
          </Link>
          <Link 
            href="/explore"
            className="w-full py-3 bg-surface-container text-on-surface border border-outline-variant/20 rounded-xl font-bold tracking-tight hover:bg-surface-container-high transition-colors"
          >
            Explore More Art
          </Link>
        </div>
      </div>
    </div>
  );
}
