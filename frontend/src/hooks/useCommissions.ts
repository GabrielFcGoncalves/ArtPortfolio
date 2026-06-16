'use client';

import { useState, useEffect, useCallback } from 'react';
import { commissionService } from '@/services/api_client';
import type { CommissionSummary } from '@/types';

interface UseCommissionsResult {
  pending: CommissionSummary[];
  active: CommissionSummary[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

/**
 * Hook to fetch and separate commissions into pending and active lists.
 * Fetches all commissions for the current user in the ARTIST role.
 */
export default function useCommissions(initialized: boolean, authenticated: boolean): UseCommissionsResult {
  const [pending, setPending] = useState<CommissionSummary[]>([]);
  const [active, setActive] = useState<CommissionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const refresh = useCallback(() => {
    setRefreshCounter(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!initialized || !authenticated) {
      setLoading(false);
      return;
    }

    const fetchCommissions = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch pending commissions (REQUESTED status)
        const pendingResponse = await commissionService.getCommissions('ARTIST', 'REQUESTED', 1, 50);
        const pendingData: CommissionSummary[] = pendingResponse.data || [];

        // Fetch active commissions (non-REQUESTED, non-CANCELLED)
        const allResponse = await commissionService.getCommissions('ARTIST', undefined, 1, 50);
        const allData: CommissionSummary[] = allResponse.data || [];

        const activeStatuses = ['IN_PROGRESS', 'REVIEW', 'PAID', 'COMPLETED'];
        const activeData = allData.filter(c => activeStatuses.includes(c.status));

        setPending(pendingData);
        setActive(activeData);
      } catch (err: any) {
        console.error('Failed to fetch commissions:', err);
        setError(err?.message || 'Failed to load commissions');
      } finally {
        setLoading(false);
      }
    };

    fetchCommissions();
  }, [initialized, authenticated, refreshCounter]);

  return { pending, active, loading, error, refresh };
}
