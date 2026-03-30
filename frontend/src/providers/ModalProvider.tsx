'use client';

import React, { createContext, useContext, useState } from 'react';

interface ModalContextType {
  isArtpieceModalOpen: boolean;
  openArtpieceModal: () => void;
  closeArtpieceModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [isArtpieceModalOpen, setIsArtpieceModalOpen] = useState(false);

  const openArtpieceModal = () => setIsArtpieceModalOpen(true);
  const closeArtpieceModal = () => setIsArtpieceModalOpen(false);

  return (
    <ModalContext.Provider value={{ isArtpieceModalOpen, openArtpieceModal, closeArtpieceModal }}>
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
