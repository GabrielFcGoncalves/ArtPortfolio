'use client';

import React from 'react';
import type { CommissionSummary } from '@/types';

interface CommissionCardProps {
  commission: CommissionSummary;
  role: 'artist' | 'client';
  onSelect: (id: string) => void;
}

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  REQUESTED: { bg: 'bg-secondary-fixed/40', text: 'text-secondary', label: 'Pending Review' },
  IN_PROGRESS: { bg: 'bg-primary-container/40', text: 'text-primary', label: 'In Progress' },
  REVIEW: { bg: 'bg-tertiary-container/40', text: 'text-tertiary', label: 'Under Review' },
  COMPLETED: { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', label: 'Completed' },
  CANCELLED: { bg: 'bg-surface-container-high', text: 'text-outline', label: 'Cancelled' },
  PAID: { bg: 'bg-primary-container', text: 'text-primary', label: 'Paid' },
  REFUNDED: { bg: 'bg-surface-container-high', text: 'text-outline', label: 'Refunded' },
};

export default function CommissionCard({ commission, role, onSelect }: Readonly<CommissionCardProps>) {
  const statusStyle = STATUS_STYLES[commission.status] || STATUS_STYLES.REQUESTED;
  const counterpartyLabel = role === 'artist' ? 'Client' : 'Artist';
  const counterpartyName = role === 'artist' ? commission.client_username : commission.artist_username;

  const formattedDate = (() => {
    try {
      return new Date(commission.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return commission.created_at;
    }
  })();

  return (
    <button
      onClick={() => onSelect(commission.id)}
      className="w-full text-left p-6 bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm hover:shadow-md hover:border-primary/20 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-headline font-extrabold text-on-surface tracking-tight truncate group-hover:text-primary transition-colors">
            {commission.title}
          </h3>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="text-xs text-on-surface-variant/70">{counterpartyLabel}:</span>
            <span className="text-xs font-semibold text-on-surface-variant">{counterpartyName}</span>
          </div>
        </div>

        <span className={`shrink-0 px-3 py-1 ${statusStyle.bg} ${statusStyle.text} text-[10px] font-bold uppercase tracking-widest rounded-full`}>
          {statusStyle.label}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-outline-variant/10">
        <span className="text-[10px] font-medium text-outline uppercase tracking-widest">{formattedDate}</span>
        <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">chevron_right</span>
      </div>
    </button>
  );
}
