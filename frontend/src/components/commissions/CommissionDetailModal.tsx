'use client';

import React, { useEffect, useState } from 'react';
import { commissionService } from '@/services/api_client';
import type { Commission } from '@/types';

interface CommissionDetailModalProps {
  isOpen: boolean;
  commissionId: string | null;
  onClose: () => void;
  isArtistView: boolean;
  onActionComplete?: () => void;
}

export default function CommissionDetailModal({
  isOpen,
  commissionId,
  onClose,
  isArtistView,
  onActionComplete
}: Readonly<CommissionDetailModalProps>) {
  const [commission, setCommission] = useState<Commission | null>(null);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (isOpen && commissionId) {
      setLoading(true);
      setShowRejectForm(false);
      setRejectReason('');
      commissionService.getCommissionDetail(commissionId)
        .then(data => {
          setCommission(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch commission detail:', err);
          setLoading(false);
        });
    }
  }, [isOpen, commissionId]);

  if (!isOpen || !commissionId) return null;

  const handleAccept = async () => {
    setActionLoading('accept');
    try {
      await commissionService.acceptCommission(commissionId);
      onActionComplete?.();
      onClose();
    } catch (err) {
      console.error('Failed to accept commission:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async () => {
    setActionLoading('reject');
    try {
      await commissionService.rejectCommission(commissionId, rejectReason || undefined);
      onActionComplete?.();
      onClose();
    } catch (err) {
      console.error('Failed to reject commission:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const isPending = commission?.status === 'REQUESTED';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-surface w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/15 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-1">Commission Details</span>
            <h2 className="text-xl font-headline font-extrabold text-on-surface tracking-tight">
              {loading ? 'Loading...' : commission?.title || 'Commission'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : commission ? (
            <div className="space-y-8">
              {/* Status & Meta */}
              <div className="flex flex-wrap gap-3">
                <StatusBadge status={commission.status} />
                <span className="px-3 py-1 bg-surface-container-low text-on-surface-variant text-[10px] font-bold uppercase tracking-widest rounded-full">
                  {formatDate(commission.created_at)}
                </span>
              </div>

              {/* Parties */}
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-2">Client</span>
                  <p className="text-sm font-bold text-on-surface font-headline">{commission.client_username}</p>
                </div>
                <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-2">Artist</span>
                  <p className="text-sm font-bold text-on-surface font-headline">{commission.artist_username}</p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-outline">Description</h3>
                <div className="p-5 bg-surface-container-low rounded-xl border border-outline-variant/10">
                  <p className="text-sm text-on-surface leading-relaxed whitespace-pre-wrap">{commission.description || 'No description provided.'}</p>
                </div>
              </div>

              {/* Reference Images */}
              {commission.reference_image_urls && commission.reference_image_urls.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-outline">Reference Images</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {commission.reference_image_urls.map((url, index) => (
                      <div key={url} className="aspect-square rounded-xl overflow-hidden border border-outline-variant/15 shadow-sm">
                        <img src={url} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reject Reason Form */}
              {showRejectForm && (
                <div className="space-y-3 p-5 bg-error-container/10 border border-error/15 rounded-xl">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-error">Reason for Declining</h3>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Optionally explain why you are declining this request..."
                    rows={3}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant/20 rounded-lg text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-error/30 resize-none font-body"
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={handleReject}
                      disabled={actionLoading === 'reject'}
                      className="px-6 py-2.5 bg-error text-white rounded-full font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {actionLoading === 'reject' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="material-symbols-outlined text-sm">close</span>
                      )}
                      Confirm Decline
                    </button>
                    <button
                      onClick={() => setShowRejectForm(false)}
                      className="px-6 py-2.5 bg-surface-container-high text-on-surface rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-on-surface-variant py-16">Commission not found.</p>
          )}
        </div>

        {/* Footer Actions (only for artist on pending commissions) */}
        {isArtistView && isPending && !showRejectForm && commission && (
          <div className="px-8 py-5 border-t border-outline-variant/15 flex items-center justify-end gap-4 shrink-0 bg-surface-container-lowest">
            <button
              onClick={() => setShowRejectForm(true)}
              disabled={!!actionLoading}
              className="px-8 py-3 bg-surface-container-high text-on-surface rounded-full font-bold text-sm hover:bg-error/10 hover:text-error transition-all disabled:opacity-50 flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-lg">close</span>
              Decline
            </button>
            <button
              onClick={handleAccept}
              disabled={!!actionLoading}
              className="px-8 py-3 bg-tertiary text-on-tertiary rounded-full font-bold text-sm shadow-lg shadow-tertiary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              {actionLoading === 'accept' ? (
                <div className="w-4 h-4 border-2 border-on-tertiary border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-lg">check_circle</span>
              )}
              Accept Commission
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, { bg: string; text: string; label: string }> = {
    REQUESTED: { bg: 'bg-secondary-fixed/40', text: 'text-secondary', label: 'Pending Review' },
    IN_PROGRESS: { bg: 'bg-primary-container/40', text: 'text-primary', label: 'In Progress' },
    REVIEW: { bg: 'bg-tertiary-container/40', text: 'text-tertiary', label: 'Under Review' },
    COMPLETED: { bg: 'bg-tertiary-container', text: 'text-on-tertiary-container', label: 'Completed' },
    CANCELLED: { bg: 'bg-surface-container-high', text: 'text-outline', label: 'Cancelled' },
    PAID: { bg: 'bg-primary-container', text: 'text-primary', label: 'Paid' },
    REFUNDED: { bg: 'bg-surface-container-high', text: 'text-outline', label: 'Refunded' },
  };
  const style = styles[status] || styles.REQUESTED;
  return (
    <span className={`px-3 py-1 ${style.bg} ${style.text} text-[10px] font-bold uppercase tracking-widest rounded-full`}>
      {style.label}
    </span>
  );
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return dateStr;
  }
}
