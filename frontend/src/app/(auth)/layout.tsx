import React from 'react';
import { AppProvider } from '@/providers/AppProvider';
import Navbar from '@/components/navbar/Navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <div className="flex h-screen bg-surface text-on-surface font-body">
        <Navbar />
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
