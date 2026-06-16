'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useKeycloak } from '@react-keycloak/web';
import ArtworkCarousel from '@/components/artpiece/ArtworkCarousel';
import ArtworkDetails from '@/components/artpiece/ArtworkDetails';
import ActionCard from '@/components/artpiece/ActionCard';
import ArtistNotes from '@/components/artpiece/ArtistNotes';
import CollectorCommunity from '@/components/artpiece/CollectorCommunity';
import ArtPieceFooter from '@/components/artpiece/ArtPieceFooter';
import { portfolioService } from '@/services/api_client';
import { useModals } from '@/providers/ModalProvider';

/**
 * ArtPiecePage component.
 * Displays a detailed view of a specific artwork/collectible.
 */
export default function ArtPiecePage() {
  const { artId } = useParams();
  const router = useRouter();
  const { keycloak, initialized } = useKeycloak();
  const { openCommissionModal } = useModals();
  
  const [artPiece, setArtPiece] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (artId) {
      portfolioService.getArtworkById(artId as string, 1200, 900)
        .then(data => {
          setArtPiece(data);
          setEditTitle(data.title || '');
          setEditDescription(data.description || '');
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch artwork:", err);
          setLoading(false);
        });
    }
  }, [artId]);

  if (loading) {
    return (
      <div className="bg-surface text-on-surface-variant min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wider uppercase text-outline">Loading Artwork...</p>
        </div>
      </div>
    );
  }

  const pieceData = artPiece || {};
  const currentUserId = keycloak?.tokenParsed?.sub || keycloak?.idTokenParsed?.sub;
  const pieceOwnerId = pieceData.keycloak_id || pieceData.keycloakId;
  const isOwner = !!(initialized && keycloak?.authenticated && currentUserId && pieceOwnerId && currentUserId === pieceOwnerId);

  console.log("Ownership Verification:", {
    initialized,
    authenticated: !!keycloak?.authenticated,
    currentUserId,
    pieceOwnerId,
    isOwner
  });

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to permanently delete this artwork? This action cannot be undone.")) {
      return;
    }
    try {
      await portfolioService.deletePiece(artId as string);
      router.push('/me');
    } catch (err) {
      console.error("Failed to delete artwork:", err);
      alert("Failed to delete artwork. Please try again.");
    }
  };

  const handleSave = async () => {
    if (!editTitle.trim()) {
      alert("Title is required.");
      return;
    }
    setIsSaving(true);
    try {
      await portfolioService.updatePiece(artId as string, {
        title: editTitle,
        description: editDescription
      });
      const updatedData = await portfolioService.getArtworkById(artId as string, 1200, 900);
      setArtPiece(updatedData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update artwork:", err);
      alert("Failed to update artwork. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(pieceData.title || '');
    setEditDescription(pieceData.description || '');
    setIsEditing(false);
  };

  const handleRequestCommission = () => {
    // Use the artwork owner's user_id and username to open the commission modal
    const artistId = pieceData.user_id || pieceData.userId || '';
    const artistUsername = pieceData.username || pieceData.artist_username || 'this artist';
    openCommissionModal(artistId, artistUsername);
  };

  return (
    <div className="bg-surface text-on-surface-variant min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <main className="pt-24 pb-32 max-w-screen-xl mx-auto px-6">
        {/* Visual Presentation */}
        <ArtworkCarousel assets={pieceData.assets} title={pieceData.title} />

        {/* Content & Action Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Main Context */}
          <ArtworkDetails 
            title={pieceData.title} 
            description={pieceData.description} 
            createdAt={pieceData.created_at} 
            isEditing={isEditing}
            editTitle={editTitle}
            editDescription={editDescription}
            onChangeTitle={setEditTitle}
            onChangeDescription={setEditDescription}
          />

          {/* Commerce & Interaction / Owner Actions */}
          <ActionCard 
            isOwner={isOwner}
            isEditing={isEditing}
            onEdit={() => setIsEditing(true)}
            onDelete={handleDelete}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={isSaving}
            onRequestCommission={!isOwner ? handleRequestCommission : undefined}
          />
        </div>

        {/* Insights & Context */}
        <ArtistNotes />

        {/* Community & Feedback */}
        <CollectorCommunity />
      </main>

      {/* Boutique Footer */}
      <ArtPieceFooter />
    </div>
  );
}
