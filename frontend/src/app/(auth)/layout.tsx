"use client";

import React from 'react';
import { AppProvider } from '@/providers/AppProvider';
import Navbar from '@/components/navbar/Navbar';
import { ModalProvider, useModals } from '@/providers/ModalProvider';
import ArtpieceCreationModal from '@/components/artpiece_creation_stepper/ArtpieceCreationModal';

function GlobalModals() {
  const { isArtpieceModalOpen, closeArtpieceModal } = useModals();
  return (
    <ArtpieceCreationModal 
      isOpen={isArtpieceModalOpen} 
      onClose={closeArtpieceModal} 
    />
  );
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppProvider>
      <ModalProvider>
        <div className="flex h-screen bg-surface text-on-surface font-body">
          <Navbar />
          {/* Main Content Area (Outlet) */}
          <main className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 overflow-auto p-8 pt-20">
              {children}
            </div>
          </main>
        </div>
        <GlobalModals />
      </ModalProvider>
    </AppProvider>
  );
}
