'use client';

import React from 'react';
import type { CommissionSummary } from '@/types';

interface ActiveTimelineProps {
  commissions: CommissionSummary[];
  loading: boolean;
  onSelectCommission: (id: string) => void;
}

const TIMELINE_STATUS_CONFIG: Record<string, { icon: string; color: string; bgColor: string; ringColor: string }> = {
  IN_PROGRESS: { icon: 'brush', color: 'text-primary', bgColor: 'bg-primary-container', ringColor: 'ring-primary/30' },
  REVIEW: { icon: 'rate_review', color: 'text-tertiary', bgColor: 'bg-tertiary-container', ringColor: 'ring-tertiary/30' },
  COMPLETED: { icon: 'check_circle', color: 'text-on-tertiary-container', bgColor: 'bg-tertiary-container', ringColor: 'ring-tertiary/30' },
  PAID: { icon: 'payments', color: 'text-primary', bgColor: 'bg-primary-container', ringColor: 'ring-primary/30' },
};

export default function ActiveTimeline({
  commissions,
  loading,
  onSelectCommission
}: Readonly<ActiveTimelineProps>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold uppercase tracking-widest text-outline">Loading timeline...</p>
        </div>
      </div>
    );
  }

  if (commissions.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-20 h-20 mx-auto bg-surface-container-low rounded-full flex items-center justify-center">
          <span className="material-symbols-outlined text-4xl text-outline">timeline</span>
        </div>
        <h3 className="text-lg font-headline font-extrabold text-on-surface">No Active Commissions</h3>
        <p className="text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
          Accepted commissions will appear here as a timeline. Accept pending requests to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-8">
        <p className="text-sm text-on-surface-variant">
          <span className="font-bold text-primary">{commissions.length}</span> active {commissions.length === 1 ? 'commission' : 'commissions'}
        </p>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-outline-variant/20"></div>

        <div className="space-y-0">
          {commissions.map((commission, index) => {
            const config = TIMELINE_STATUS_CONFIG[commission.status] || TIMELINE_STATUS_CONFIG.IN_PROGRESS;
            const isLast = index === commissions.length - 1;

            return (
              <button
                key={commission.id}
                onClick={() => onSelectCommission(commission.id)}
                className="w-full text-left relative pl-16 pr-6 py-5 group hover:bg-surface-container-low/50 rounded-xl transition-all duration-200"
              >
                {/* Timeline Node */}
                <div className={`absolute left-3 top-1/2 -translate-y-1/2 w-7 h-7 ${config.bgColor} rounded-full flex items-center justify-center ring-4 ${config.ringColor} ring-offset-2 ring-offset-surface z-10 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined text-sm ${config.color}`}>{config.icon}</span>
                </div>

                {/* Content */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-headline font-extrabold text-on-surface tracking-tight truncate group-hover:text-primary transition-colors">
                      {commission.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-on-surface-variant/60">
                        Client: <span className="font-semibold">{commission.client_username}</span>
                      </span>
                      <span className="text-[10px] text-outline">{formatTimeAgo(commission.created_at)}</span>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-3">
                    <span className={`px-3 py-1 ${config.bgColor} ${config.color} text-[9px] font-bold uppercase tracking-widest rounded-full`}>
                      {commission.status.replace('_', ' ')}
                    </span>
                    <span className="material-symbols-outlined text-sm text-outline group-hover:text-primary transition-colors">arrow_forward</span>
                  </div>
                </div>

                {/* Connector dot for non-last items */}
                {!isLast && (
                  <div className="absolute left-[25px] bottom-0 w-1.5 h-1.5 bg-outline-variant/30 rounded-full"></div>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return dateStr;
  }
}
