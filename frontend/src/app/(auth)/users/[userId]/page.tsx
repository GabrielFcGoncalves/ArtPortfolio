'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useKeycloak } from '@react-keycloak/web';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import { useModals } from '@/providers/ModalProvider';
import { userService } from '@/services/api_client';
import usePublicPortfolio from '@/hooks/usePublicPortfolio';
import Image from 'next/image';
import GalleryGrid from '@/components/me_profile/GalleryGrid';
import type { PublicProfile } from '@/services/api_client/user.service';
import apiClient from '@/services/api_client/apiClient';

export default function UserProfilePage() {
  const { userId } = useParams();
  const { keycloak, initialized } = useKeycloak();
  const { openCommissionModal } = useModals();
  const { pieces, loading: portfolioLoading } = usePublicPortfolio(userId as string);

  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  useEffect(() => {
    if (userId) {
      setProfileLoading(true);
      userService.getPublicProfile(userId as string)
        .then(data => {
          setProfile(data);
          setProfileLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch user profile:", err);
          setProfileLoading(false);
        });

      if (initialized && keycloak?.authenticated) {
        apiClient.get(`/users/${userId}/is-following`)
          .then(({ data }) => setIsFollowing(!!data))
          .catch(err => console.error("Failed to check follow status:", err));
      }
    }
  }, [userId, initialized, keycloak?.authenticated]);

  const handleFollowToggle = async () => {
    if (!initialized || !keycloak?.authenticated) {
      alert("Please log in to follow artists.");
      return;
    }

    setFollowLoading(true);
    try {
      if (isFollowing) {
        await apiClient.delete(`/users/${userId}/follow`);
        setIsFollowing(false);
        if (profile) {
          setProfile({ ...profile, followerCount: Math.max(0, profile.followerCount - 1) });
        }
      } else {
        await apiClient.post(`/users/${userId}/follow`);
        setIsFollowing(true);
        if (profile) {
          setProfile({ ...profile, followerCount: profile.followerCount + 1 });
        }
      }
    } catch (err) {
      console.error("Failed to toggle follow:", err);
    } finally {
      setFollowLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="bg-surface text-on-surface-variant min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-semibold tracking-wider uppercase text-outline">Loading Profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center font-body">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-headline font-extrabold text-on-surface">Artist profile not found</h1>
          <p className="text-on-surface-variant/70">The user you are looking for does not exist or has a private profile.</p>
        </div>
      </div>
    );
  }

  const currentUsername = keycloak?.tokenParsed?.preferred_username || keycloak?.idTokenParsed?.preferred_username;
  const isSelf = !!(currentUsername && profile && currentUsername === profile.username);
  const showCommissionButton = !isSelf && (profile.role?.toUpperCase() === 'ARTIST' || profile.role?.toUpperCase() === 'USER');

  const mockAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuANn3gCFPiNIRFQGA0_X35G__b7wORvD1Zf7GkMaN-ARFi8IaDnmNLV3UhKimNuZ1XmtWHBG9-QX05libfHUeRQHA2l_xQudRjQ-ObTWs848pZ7lQmokOXcyBG1ZOaDgLN3LNzO1jHJUNi5osiMr3H80CZx3nIJgfZUP8SFl_pKnDkN7xZm51pCa_gWluztpWD6m2S0DTeESC619qyxwi2hfE7TgixI4uCs0zn2vUjM1AKcQizEwWuiMwEDF8OVln3vFvh6IhJ6ZHA";

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen font-body">
      <main className="pt-24 pb-32 max-w-7xl mx-auto px-8">
        
        {/* Profile Header */}
        <section className="bg-surface-container-low rounded-[2.5rem] p-8 md:p-16 border border-outline-variant/10 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
            {/* Avatar */}
            <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-white shadow-2xl relative border border-primary/10">
              <Image 
                fill
                className="object-cover"
                alt={profile.username}
                src={profile.avatarUrl || mockAvatar}
                sizes="(max-width: 768px) 128px, 192px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              {profile.isVerified && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-4 inline-block">
                  Verified Atelier Member
                </span>
              )}
              <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-2">
                <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface italic">
                  {profile.username}
                </h1>
                {showCommissionButton && (
                  <button 
                    type="button" 
                    onClick={() => openCommissionModal(profile.id, profile.username)}
                    className="bg-tertiary text-on-tertiary px-6 py-2.5 rounded-full font-bold text-xs shadow-md hover:opacity-90 active:scale-95 transition-all self-center shrink-0"
                  >
                    Request Commission
                  </button>
                )}
              </div>
              <p className="text-on-surface-variant/70 text-lg mb-6 max-w-xl">
                {profile.bio || "No bio provided yet."}
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4">
                {!isSelf && (
                  <button 
                    type="button" 
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`px-8 py-3 rounded-full font-bold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50 ${
                      isFollowing 
                        ? 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high' 
                        : 'bg-primary text-on-primary hover:opacity-90'
                    }`}
                  >
                    {isFollowing ? 'Unfollow' : 'Follow Artist'}
                  </button>
                )}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/5 text-center shadow-sm">
                <p className="text-2xl font-headline font-black text-primary">{pieces.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Pieces</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/5 text-center shadow-sm">
                <p className="text-2xl font-headline font-black text-primary">{profile.followerCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Followers</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="mt-20">
          <div className="flex items-center justify-between mb-8 border-b border-outline-variant/10 pb-4">
            <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">Public Gallery</h2>
            <span className="text-xs text-on-surface-variant font-medium">{pieces.length} published pieces</span>
          </div>
          <GalleryGrid loading={portfolioLoading} pieces={pieces} />
        </section>
      </main>

      <DashboardFooter />
    </div>
  );
}
