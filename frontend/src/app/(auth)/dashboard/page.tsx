'use client';

import React, { useEffect, useState } from 'react';
import { commissionService } from '@/services/commissionService';
import { Commission } from '@/types';

export default function DashboardPage() {
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [queue, setQueue] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [commissionsData, queueData] = await Promise.all([
          commissionService.getCommissions(),
          commissionService.getLiveQueue()
        ]);
        setCommissions(commissionsData);
        setQueue(queueData);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="text-neutral-400">Loading Dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
        <p className="text-neutral-400">Here's what your commission pipeline looks like today.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Active Commissions Widget */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-400">Active Commissions</h2>
          {commissions.length === 0 ? (
            <p className="text-sm text-neutral-500">No active commissions.</p>
          ) : (
            <ul className="space-y-4">
              {commissions.map((c) => (
                <li key={c.id} className="p-4 bg-neutral-950 rounded-lg flex justify-between items-center border border-neutral-800">
                  <div>
                    <h3 className="font-medium text-white">{c.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1">Status: {c.status}</p>
                  </div>
                  <div className="text-emerald-400 font-bold">${c.price}</div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Live Queue Widget */}
        <section className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-emerald-400">Live Queue</h2>
          {queue.length === 0 ? (
            <p className="text-sm text-neutral-500">Queue is empty.</p>
          ) : (
            <ul className="space-y-4">
              {queue.map((c, idx) => (
                <li key={c.id} className="p-4 bg-neutral-950 rounded-lg flex gap-4 items-center border border-neutral-800">
                  <div className="text-2xl font-bold text-neutral-700">#{idx + 1}</div>
                  <div>
                    <h3 className="font-medium text-white">{c.title}</h3>
                    <p className="text-xs text-neutral-500 mt-1">In Progress</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
