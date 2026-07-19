'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PurchaseSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!sessionId) {
      router.push('/explore');
    }
  }, [sessionId, router]);

  if (!mounted || !sessionId) return null;

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-surface-container-lowest p-8 rounded-2xl shadow-lg border border-outline-variant/20 text-center space-y-6">
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
          <span className="material-symbols-outlined text-4xl text-primary">check_circle</span>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-headline font-bold text-on-surface">Purchase Successful!</h1>
          <p className="text-on-surface-variant">
            Thank you for your purchase. The artist has been notified and will prepare your artwork for shipping.
          </p>
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <Link 
            href="/explore"
            className="w-full py-3 bg-primary text-on-primary rounded-xl font-bold tracking-tight hover:opacity-90 transition-opacity"
          >
            Continue Exploring
          </Link>
          <Link 
            href="/me"
            className="w-full py-3 bg-surface-container text-on-surface border border-outline-variant/20 rounded-xl font-bold tracking-tight hover:bg-surface-container-high transition-colors"
          >
            View My Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
