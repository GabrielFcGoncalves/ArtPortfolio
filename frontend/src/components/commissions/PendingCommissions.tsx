'use client';

import React from 'react';
import CommissionCard from './CommissionCard';
import type { CommissionSummary } from '@/types';

interface PendingCommissionsProps {
  commissions: CommissionSummary[];
  loading: boolean;
  onSelectCommission: (id: string) => void;
}

export default function PendingCommissions({
  commissions,
  loading,
  onSelectCommission
}: Readonly<PendingCommissionsProps>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-outline">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-20 h-20 mx-auto bg-surface-container-low rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-outline">inbox</span>
        </div>
        <h3 className="text-lg font-headline font-extrabold text-on-surface">No Pending Requests</h3>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
          When users submit commission requests, they will appear here for your review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-on-surface-variant">
          <span className="font-bold text-primary">{commissions.length}</span> pending {commissions.length === 1 ? 'request' : 'requests'}
        </p>
      </div>
      <div className="grid gap-4">
        {commissions.map(commission => (
          <CommissionCard
            key={commission.id}
            commission={commission}
            role="artist"
            onSelect={onSelectCommission}
          />
        ))}
      </div>
    </div>
  );
}
