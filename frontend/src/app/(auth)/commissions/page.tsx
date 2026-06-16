'use client';

import React, { useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import useCommissions from '@/hooks/useCommissions';
import PendingCommissions from '@/components/commissions/PendingCommissions';
import ActiveTimeline from '@/components/commissions/ActiveTimeline';
import CommissionDetailModal from '@/components/commissions/CommissionDetailModal';
import DashboardFooter from '@/components/dashboard/DashboardFooter';

type TabKey = 'active' | 'pending';

/**
 * CommissionsPage
 * Artist commission management hub with Active (timeline) and Pending (requests) tabs.
 */
export default function CommissionsPage() {
  const { keycloak, initialized } = useKeycloak();
  const { pending, active, loading, refresh } = useCommissions(initialized, !!keycloak?.authenticated);

  const [activeTab, setActiveTab] = useState<TabKey>('active');
  const [selectedCommissionId, setSelectedCommissionId] = useState<string | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const tabs: { key: TabKey; label: string; count: number; icon: string }[] = [
    { key: 'active', label: 'Active Work', count: active.length, icon: 'timeline' },
    { key: 'pending', label: 'Pending Requests', count: pending.length, icon: 'pending_actions' },
  ];

  const handleSelectCommission = (id: string) => {
    setSelectedCommissionId(id);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedCommissionId(null);
  };

  const handleActionComplete = () => {
    refresh();
  };

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen font-body">
      <main className="pt-24 pb-32 max-w-5xl mx-auto px-8">
        {/* Page Header */}
        <section className="mb-16">
          <div className="flex items-end justify-between gap-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-3">Commission Management</span>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tighter text-on-surface leading-tight">
                Your Commissions
              </h1>
              <p className="text-on-surface-variant/70 mt-3 text-base max-w-lg leading-relaxed">
                Track active work and review incoming commission requests from collectors and enthusiasts.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4">
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm text-center min-w-[100px]">
                <p className="text-2xl font-headline font-black text-primary">{active.length}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-outline mt-1">Active</p>
              </div>
              <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 shadow-sm text-center min-w-[100px]">
                <p className="text-2xl font-headline font-black text-secondary">{pending.length}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest text-outline mt-1">Pending</p>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-10 border-b border-outline-variant/15 pb-0">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center gap-2.5 px-6 py-3.5 text-sm font-bold tracking-tight transition-all duration-200 border-b-2 -mb-[1px]
                ${activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant/60 hover:text-on-surface-variant hover:border-outline-variant/30'
                }
              `}
            >
              <span className="material-symbols-outlined text-lg">{tab.icon}</span>
              {tab.label}
              {tab.count > 0 && (
                <span className={`
                  px-2 py-0.5 text-[10px] font-bold rounded-full
                  ${activeTab === tab.key
                    ? 'bg-primary/10 text-primary'
                    : 'bg-surface-container-high text-outline'
                  }
                `}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/10 shadow-sm p-8">
          {activeTab === 'active' ? (
            <ActiveTimeline
              commissions={active}
              loading={loading}
              onSelectCommission={handleSelectCommission}
            />
          ) : (
            <PendingCommissions
              commissions={pending}
              loading={loading}
              onSelectCommission={handleSelectCommission}
            />
          )}
        </div>
      </main>

      <DashboardFooter />

      {/* Commission Detail Modal */}
      <CommissionDetailModal
        isOpen={isDetailOpen}
        commissionId={selectedCommissionId}
        onClose={handleCloseDetail}
        isArtistView={true}
        onActionComplete={handleActionComplete}
      />
    </div>
  );
}
