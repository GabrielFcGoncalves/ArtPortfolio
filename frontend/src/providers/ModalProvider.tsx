'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface CommissionModalState {
  artistId: string;
  artistUsername: string;
}

interface ModalContextType {
  isArtpieceModalOpen: boolean;
  openArtpieceModal: () => void;
  closeArtpieceModal: () => void;

  isCommissionModalOpen: boolean;
  commissionTarget: CommissionModalState | null;
  openCommissionModal: (artistId: string, artistUsername: string) => void;
  closeCommissionModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isArtpieceModalOpen, setIsArtpieceModalOpen] = useState(false);
  const [isCommissionModalOpen, setIsCommissionModalOpen] = useState(false);
  const [commissionTarget, setCommissionTarget] = useState<CommissionModalState | null>(null);

  const openArtpieceModal = () => setIsArtpieceModalOpen(true);
  const closeArtpieceModal = () => setIsArtpieceModalOpen(false);

  const openCommissionModal = useCallback((artistId: string, artistUsername: string) => {
    setCommissionTarget({ artistId, artistUsername });
    setIsCommissionModalOpen(true);
  }, []);

  const closeCommissionModal = useCallback(() => {
    setIsCommissionModalOpen(false);
    setCommissionTarget(null);
  }, []);

  return (
    <ModalContext.Provider value={{
      isArtpieceModalOpen, openArtpieceModal, closeArtpieceModal,
      isCommissionModalOpen, commissionTarget, openCommissionModal, closeCommissionModal
    }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModals() {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useModals must be used within a ModalProvider');
  }
  return context;
}
