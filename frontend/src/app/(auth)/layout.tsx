import React from 'react';
import Sidebar from '@/components/Sidebar';
import { AppProvider } from '@/providers/AppProvider';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="flex h-screen bg-neutral-900 text-white font-sans">
        {/* Sidebar Navigation */}
        <Sidebar />

        {/* Main Content Area (Outlet) */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-auto p-8">
            {children}
          </div>
        </main>
      </div>
    </AppProvider>
  );
}
