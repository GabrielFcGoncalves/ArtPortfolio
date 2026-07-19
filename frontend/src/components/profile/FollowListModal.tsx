import React, { useEffect, useState } from 'react';
import { useKeycloak } from '@react-keycloak/web';
import Link from 'next/link';
import apiClient from '@/services/api_client/apiClient';

interface FollowListModalProps {
  userId: string;
  username: string;
  type: 'followers' | 'following';
  onClose: () => void;
}

interface UserSummary {
  id: string;
  username: string;
  avatarUrl?: string;
  role: string;
  isVerified: boolean;
}

const RenderAvatar = ({ username, avatarUrl }: { username: string; avatarUrl?: string }) => {
  const [imgError, setImgError] = React.useState(false);

  if (avatarUrl && !imgError) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden relative border border-outline-variant/10 shrink-0">
        <img 
          className="absolute inset-0 w-full h-full object-cover" 
          src={avatarUrl} 
          alt={username} 
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  const firstLetter = username ? username.substring(0, 1).toUpperCase() : '?';
  return (
    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm border border-outline-variant/10 shrink-0">
      {firstLetter}
    </div>
  );
};

export default function FollowListModal({ userId, username, type, onClose }: Readonly<FollowListModalProps>) {
  const { keycloak, initialized } = useKeycloak();
  const currentUserId = keycloak?.tokenParsed?.sub || keycloak?.idTokenParsed?.sub;

  const [users, setUsers] = useState<UserSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [myFollowingIds, setMyFollowingIds] = useState<Set<string>>(new Set());
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Fetch target user's follow list (followers or following)
  useEffect(() => {
    let active = true;
    setLoading(true);
    apiClient.get(`/users/${userId}/${type}`, { params: { page, limit: 15 } })
      .then(({ data }) => {
        if (active) {
          if (page === 1) {
            setUsers(data.data || []);
          } else {
            setUsers(prev => [...prev, ...(data.data || [])]);
          }
          setPages(data.pages || 1);
          setTotal(data.total || 0);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(`Failed to fetch ${type}:`, err);
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [userId, type, page]);

  // Fetch logged-in user's following list to track follow statuses
  useEffect(() => {
    if (initialized && keycloak?.authenticated && currentUserId) {
      apiClient.get(`/users/${currentUserId}/following`, { params: { page: 1, limit: 1000 } })
        .then(({ data }) => {
          const ids = new Set<string>((data.data || []).map((u: any) => u.id));
          setMyFollowingIds(ids);
        })
        .catch(err => console.error("Failed to load logged-in user's following list:", err));
    }
  }, [initialized, keycloak?.authenticated, currentUserId]);

  const handleFollowToggle = async (targetUser: UserSummary) => {
    if (!initialized || !keycloak?.authenticated) {
      alert("Please log in to follow users.");
      return;
    }
    setActionLoadingId(targetUser.id);
    const isCurrentlyFollowing = myFollowingIds.has(targetUser.id);

    try {
      if (isCurrentlyFollowing) {
        await apiClient.delete(`/users/${targetUser.id}/follow`);
        setMyFollowingIds(prev => {
          const next = new Set(prev);
          next.delete(targetUser.id);
          return next;
        });
      } else {
        await apiClient.post(`/users/${targetUser.id}/follow`);
        setMyFollowingIds(prev => {
          const next = new Set(prev);
          next.add(targetUser.id);
          return next;
        });
      }
    } catch (err) {
      console.error("Failed to toggle follow status:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const filteredUsers = users.filter(user => 
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-low text-on-surface w-full max-w-md rounded-[2rem] border border-outline-variant/10 shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <h3 className="text-lg font-headline font-bold uppercase tracking-wider text-primary">
            {type === 'followers' ? 'Followers' : 'Following'} ({total})
          </h3>
          <button 
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">close</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-outline-variant/5">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-outline text-lg">search</span>
            <input 
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-surface-container-high text-sm rounded-full border-none focus:outline-none focus:ring-2 focus:ring-primary/50 text-on-surface"
            />
          </div>
        </div>

        {/* User list */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-outline text-sm">
              {loading ? 'Loading users...' : 'No users found.'}
            </div>
          ) : (
            filteredUsers.map(user => {
              const isMe = currentUserId === user.id;
              const isFollowing = myFollowingIds.has(user.id);
              return (
                <div key={user.id} className="flex items-center justify-between gap-4">
                  <Link 
                    href={`/users/${user.id}`} 
                    onClick={onClose}
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity min-w-0"
                  >
                    <RenderAvatar username={user.username} avatarUrl={user.avatarUrl} />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-bold text-on-surface truncate">{user.username}</p>
                        {user.isVerified && (
                          <span className="material-symbols-outlined text-primary text-xs select-none">verified</span>
                        )}
                      </div>
                      <p className="text-[10px] text-outline uppercase tracking-wider font-semibold">{user.role}</p>
                    </div>
                  </Link>

                  {!isMe && (
                    <button
                      type="button"
                      disabled={actionLoadingId === user.id}
                      onClick={() => handleFollowToggle(user)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 disabled:opacity-50 ${
                        isFollowing
                          ? 'bg-surface-container-highest text-on-surface hover:bg-surface-container-high border border-outline-variant/10'
                          : 'bg-primary text-on-primary hover:opacity-90'
                      }`}
                    >
                      {actionLoadingId === user.id ? '...' : (isFollowing ? 'Following' : 'Follow')}
                    </button>
                  )}
                </div>
              );
            })
          )}

          {/* Load More Button */}
          {page < pages && !loading && (
            <button
              type="button"
              onClick={() => setPage(prev => prev + 1)}
              className="w-full py-2 mt-2 text-xs font-bold text-primary hover:underline"
            >
              Load More
            </button>
          )}

          {loading && page > 1 && (
            <div className="text-center py-2 text-xs text-outline">Loading more...</div>
          )}
        </div>
      </div>
    </div>
  );
}
