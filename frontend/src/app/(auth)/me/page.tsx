'use client';

import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import { useModals } from '@/providers/ModalProvider';
import { portfolioService } from '@/services/api_client';

// Shared Profile Components
import ProfileHeader from '@/components/me_profile/ProfileHeader';
import GalleryToolbar from '@/components/me_profile/GalleryToolbar';
import GalleryGrid from '@/components/me_profile/GalleryGrid';
import { ArtPiece } from '@/components/me_profile/ArtPieceCard';

/**
 * ProfilePage (The Studio)
 * The main desktop as an Artist where they manage their published work and drafts.
 */
export default function ProfilePage() {
  const { keycloak, initialized } = useKeycloak();
  const { openArtpieceModal } = useModals();
  const [pieces, setPieces] = useState<ArtPiece[]>([]);
  const [loading, setLoading] = useState(true);
  
  const userToken = keycloak.idTokenParsed;

  // Derive identity with sensible placeholders
  const name = userToken?.name || userToken?.preferred_username || "Artist Guest";
  const email = userToken?.email || "No email provided";

  /**
   * Sync gallery with backend on mount or identity refresh.
   */
  useEffect(() => {
    async function syncGallery() {
      // Only proceed if authenticated and Keycloak is ready
      if (!initialized || !keycloak.authenticated) return;
      
      try {
        setLoading(true);
        const result = await portfolioService.getMyPortfolio(1, 50);
        setPieces(result.data || []);
      } catch (error) {
        console.error('Atelier Sync Error:', error);
      } finally {
        setLoading(false);
      }
    }

    syncGallery();
  }, [initialized, keycloak.authenticated, keycloak.token]);

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen font-body">
      <main className="pt-24 pb-32 max-w-7xl mx-auto px-8">
        {/* Visual Identity Section */}
        <ProfileHeader 
          name={name} 
          email={email} 
          pieceCount={pieces.length} 
        />

        {/* Gallery Management Section */}
        <section className="mt-20">
          <GalleryToolbar onAddNewPiece={openArtpieceModal} />
          <GalleryGrid loading={loading} pieces={pieces} />
        </section>
      </main>

      <DashboardFooter />
    </div>
  );
}
