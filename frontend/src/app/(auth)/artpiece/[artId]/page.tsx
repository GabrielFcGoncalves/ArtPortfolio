'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useKeycloak } from '@react-keycloak/web';
import ArtworkCarousel from '@/components/artpiece/ArtworkCarousel';
import ArtworkDetails, { ArtworkHeader } from '@/components/artpiece/ArtworkDetails';
import ActionCard from '@/components/artpiece/ActionCard';
import CommentSection from '@/components/artpiece/commentSection';
import ArtPieceFooter from '@/components/artpiece/ArtPieceFooter';
import { portfolioService, favoriteService, purchaseService } from '@/services/api_client';
import { useModals } from '@/providers/ModalProvider';
import apiClient from '@/services/api_client/apiClient';

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

  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);

  useEffect(() => {
    if (artId) {
      portfolioService.getArtworkById(artId as string, 1200, 900)
        .then(data => {
          setArtPiece(data);
          setEditTitle(data.title || '');
          setEditDescription(data.description || '');
          setFavoriteCount(data.favorite_count || 0);
          setLoading(false);
          
          // Record view (fire and forget)
          portfolioService.recordView(artId as string).catch(err => console.error("Failed to record view:", err));
        })
        .catch(err => {
          console.error("Failed to fetch artwork:", err);
          setLoading(false);
        });

      if (initialized && keycloak?.authenticated) {
        favoriteService.isFavorited(artId as string)
          .then(res => setIsFavorited(res.is_favorited))
          .catch(err => console.error("Failed to fetch favorite status:", err));
      }
    }
  }, [artId, initialized, keycloak?.authenticated]);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    const artistId = artPiece?.user_id || artPiece?.userId;
    if (artistId && initialized && keycloak?.authenticated) {
      apiClient.get(`/users/${artistId}/is-following`)
        .then(({ data }) => setIsFollowing(!!data))
        .catch(err => console.error("Failed to check follow status:", err));
    }
  }, [artPiece, initialized, keycloak?.authenticated]);

  const handleFollowToggle = async () => {
    const artistId = pieceData.user_id || pieceData.userId;
    if (!artistId) return;

    if (!initialized || !keycloak?.authenticated) {
      alert("Please log in to follow artists.");
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await apiClient.delete(`/users/${artistId}/follow`);
        setIsFollowing(false);
      } else {
        await apiClient.post(`/users/${artistId}/follow`);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

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

  const handleToggleFavorite = async () => {
    if (!initialized || !keycloak?.authenticated) {
      alert("Please log in to favorite artworks.");
      return;
    }
    
    // Optimistic UI update
    const newIsFavorited = !isFavorited;
    const newCount = isFavorited ? Math.max(0, favoriteCount - 1) : favoriteCount + 1;
    setIsFavorited(newIsFavorited);
    setFavoriteCount(newCount);

    try {
      const res = await favoriteService.toggleFavorite(artId as string);
      setIsFavorited(res.is_favorited);
      setFavoriteCount(res.favorite_count);
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      // Revert optimistic update
      setIsFavorited(!newIsFavorited);
      setFavoriteCount(isFavorited ? newCount + 1 : Math.max(0, newCount - 1));
    }
  };

  const handleBuyNow = async () => {
    if (!initialized || !keycloak?.authenticated) {
      alert("Please log in to purchase artworks.");
      return;
    }

    try {
      const { checkout_url } = await purchaseService.createCheckout(artId as string);
      if (checkout_url) {
        window.location.href = checkout_url;
      }
    } catch (err: any) {
      console.error("Purchase failed:", err);
      alert(err.response?.data?.message || "Failed to initialize checkout. Please try again.");
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

  const handleBack = () => {
    if (typeof window !== 'undefined' && window.history.length > 2) {
      window.history.back();
    } else {
      router.push('/explore');
    }
  };

  return (
    <div className="bg-surface text-on-surface-variant min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <main className="pt-28 pb-16 max-w-screen-2xl mx-auto px-8 relative">
        <button 
          type="button"
          onClick={handleBack}
          className="fixed top-[110px] left-4 lg:left-8 xl:left-12 flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-low hover:bg-surface-container-medium border border-outline-variant/10 text-outline hover:text-primary transition-all active:scale-95 group cursor-pointer shadow-md z-30"
        >
          <span className="material-symbols-outlined text-lg transition-transform group-hover:-translate-x-0.5">arrow_back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start animate-fade-in">
          {/* Left Column: Details, Actions, and Comments */}
          <div className="lg:col-span-5 space-y-12 min-w-0">
            <ArtworkHeader 
              title={pieceData.title} 
              createdAt={pieceData.created_at} 
              isEditing={isEditing}
              editTitle={editTitle}
              onChangeTitle={setEditTitle}
              username={pieceData.username}
              artistAvatarUrl={pieceData.artist_avatar_url}
              artistId={pieceData.user_id || pieceData.userId}
              isSelf={isOwner}
              isFollowing={isFollowing}
              followLoading={followLoading}
              onFollowToggle={handleFollowToggle}
            />

            <ArtworkDetails 
              description={pieceData.description} 
              isEditing={isEditing}
              editDescription={editDescription}
              onChangeDescription={setEditDescription}
              medium={pieceData.medium}
              category={pieceData.category}
              width={pieceData.width}
              height={pieceData.height}
              depth={pieceData.depth}
              dimensionUnit={pieceData.dimension_unit}
              weight={pieceData.weight}
              year={pieceData.year}
              isFramed={pieceData.is_framed}
            />

            <ActionCard 
              isOwner={isOwner}
              isEditing={isEditing}
              onEdit={() => setIsEditing(true)}
              onDelete={handleDelete}
              onSave={handleSave}
              onCancel={handleCancel}
              isSaving={isSaving}
              onRequestCommission={!isOwner ? handleRequestCommission : undefined}
              isForSale={pieceData.is_for_sale}
              price={pieceData.price}
              currency={pieceData.currency}
              isFavorited={isFavorited}
              favoriteCount={favoriteCount}
              onToggleFavorite={!isOwner ? handleToggleFavorite : undefined}
              onBuyNow={handleBuyNow}
            />
          </div>

          {/* Right Column: Sticky Image Showcase */}
          <div className="lg:col-span-7 lg:sticky lg:top-32 w-full">
            <ArtworkCarousel assets={pieceData.assets} title={pieceData.title} />
          </div>
        </div>

        {/* Community & Feedback */}
        <CommentSection artId={artId as string} />
      </main>

      {/* Boutique Footer */}
      <ArtPieceFooter />
    </div>
  );
}
