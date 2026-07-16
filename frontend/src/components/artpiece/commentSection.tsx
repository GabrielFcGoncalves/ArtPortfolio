'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useKeycloak } from '@react-keycloak/web';
import { commentService, Comment } from '@/services/api_client';

const RenderAvatar = ({ username, avatarUrl }: { username: string; avatarUrl?: string }) => {
  const [imgError, setImgError] = useState(false);

  if (avatarUrl && !imgError) {
    return (
      <div className="w-10 h-10 rounded-full overflow-hidden relative border border-outline-variant/10 shrink-0">
        <Image 
          fill
          className="object-cover grayscale hover:grayscale-0 transition-all duration-500" 
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

export default function CommentSection({ artId }: { artId: string }) {
  const { keycloak, initialized } = useKeycloak();
  const currentUserId = keycloak?.tokenParsed?.sub || keycloak?.idTokenParsed?.sub;
  const isAuthenticated = !!(initialized && keycloak?.authenticated);

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [commentText, setCommentText] = useState('');
  
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  const formatTimeAgo = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      if (seconds < 60) return 'just now';
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      const hours = Math.floor(minutes / 60);
      if (hours < 24) return `${hours}h ago`;
      const days = Math.floor(hours / 24);
      if (days < 7) return `${days}d ago`;
      return date.toLocaleDateString();
    } catch (e) {
      return '';
    }
  };

  const fetchComments = async (pageNum = 1) => {
    try {
      if (pageNum === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const res = await commentService.getComments(artId, pageNum, 10);
      if (pageNum === 1) {
        setComments(res.data);
      } else {
        setComments(prev => [...prev, ...res.data]);
      }
      setHasMore(pageNum < res.pages);
      setPage(pageNum);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (artId) {
      fetchComments(1);
    }
  }, [artId]);

  const handlePostComment = async () => {
    if (!commentText.trim()) return;
    try {
      setSubmitting(true);
      const newComment = await commentService.createComment(artId, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to post comment. Make sure you are logged in.');
    } finally {
      setSubmitting(false);
    }
  };

  const handlePostReply = async (parentId: string, mentionUsername?: string) => {
    if (!replyText.trim()) return;
    try {
      const finalContent = mentionUsername ? `@${mentionUsername} ${replyText}` : replyText;
      const newReply = await commentService.createComment(artId, finalContent, parentId);
      setComments(prev => prev.map(c => {
        if (c.id === parentId) {
          return {
            ...c,
            replies: [...(c.replies || []), newReply]
          };
        }
        return c;
      }));
      setReplyText('');
      setActiveReplyId(null);
    } catch (err) {
      console.error('Failed to post reply:', err);
      alert('Failed to post reply. Make sure you are logged in.');
    }
  };

  const handleDeleteComment = async (commentId: string, parentId?: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      await commentService.deleteComment(commentId);
      if (parentId) {
        setComments(prev => prev.map(c => {
          if (c.id === parentId) {
            return {
              ...c,
              replies: (c.replies || []).filter(r => r.id !== commentId)
            };
          }
          return c;
        }));
      } else {
        setComments(prev => prev.filter(c => c.id !== commentId));
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
      alert('Failed to delete comment.');
    }
  };

  return (
    <section className="mt-24 bg-surface-container-low rounded-[2rem] p-8 md:p-12 border border-outline-variant/10">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold font-headline text-primary mb-8">Collector Community</h3>
        
        {/* Comment Input */}
        <div className="mb-12">
          <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-3">
            {isAuthenticated ? 'Join the conversation' : 'Log in to join the conversation'}
          </label>
          {isAuthenticated ? (
            <div className="relative">
              <textarea 
                className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-6 text-sm focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-32 placeholder:text-outline/40 shadow-inner" 
                placeholder="Share your thoughts on this work..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                disabled={submitting}
              />
              <button 
                onClick={handlePostComment}
                disabled={submitting || !commentText.trim()}
                className="absolute bottom-4 right-4 py-2 px-6 bg-primary text-on-primary rounded-lg text-xs font-bold transition-transform active:scale-95 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
              >
                {submitting ? 'Posting...' : 'Post Comment'}
              </button>
            </div>
          ) : (
            <button 
              onClick={() => keycloak.login()}
              className="py-3 px-6 bg-primary text-on-primary rounded-lg text-xs font-bold hover:bg-primary/90 transition-colors"
            >
              Sign In to Comment
            </button>
          )}
        </div>

        {/* Comment List */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-outline text-center py-8">No comments yet. Be the first to share your thoughts!</p>
        ) : (
          <div className="space-y-10">
            {comments.map((comment) => (
              <div key={comment.id} className="flex flex-col">
                <div className="flex gap-4 group">
                  <RenderAvatar username={comment.username} avatarUrl={comment.user_avatar_url} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-bold text-on-surface">{comment.username}</span>
                      <span className="text-[10px] text-outline/60 ml-auto">{formatTimeAgo(comment.created_at)}</span>
                    </div>
                    <p className="text-sm text-on-surface-variant leading-relaxed font-light">{comment.content}</p>
                    <div className="mt-3 flex gap-6">
                      {isAuthenticated && (
                        <button 
                          onClick={() => {
                            setActiveReplyId(activeReplyId === comment.id ? null : comment.id);
                            setReplyText('');
                          }}
                          className="text-[10px] font-bold text-outline hover:text-primary transition-colors"
                        >
                          Reply
                        </button>
                      )}
                      {isAuthenticated && currentUserId === comment.user_id && (
                        <button 
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors ml-auto"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Reply Input Field under Top Level Comment */}
                {activeReplyId === comment.id && (
                  <div className="mt-4 ml-14 relative">
                    <textarea 
                      className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-4 text-xs focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24 placeholder:text-outline/40 shadow-inner" 
                      placeholder="Write a reply..."
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />
                    <div className="mt-2 flex justify-end gap-2">
                      <button 
                        onClick={() => setActiveReplyId(null)}
                        className="py-1.5 px-4 text-[10px] font-bold text-outline hover:text-on-surface transition-colors"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={() => handlePostReply(comment.id)}
                        disabled={!replyText.trim()}
                        className="py-1.5 px-4 bg-primary text-on-primary rounded-lg text-[10px] font-bold transition-transform active:scale-95 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                      >
                        Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies List */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="mt-6 ml-14 space-y-6 border-l border-outline-variant/20 pl-6">
                    {comment.replies.map((reply) => (
                      <div key={reply.id} className="flex flex-col">
                        <div className="flex gap-4 group">
                          <RenderAvatar username={reply.username} avatarUrl={reply.user_avatar_url} />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-bold text-on-surface">{reply.username}</span>
                              <span className="text-[10px] text-outline/60 ml-auto">{formatTimeAgo(reply.created_at)}</span>
                            </div>
                            <p className="text-sm text-on-surface-variant leading-relaxed font-light">{reply.content}</p>
                            <div className="mt-2 flex gap-4">
                              {isAuthenticated && (
                                <button 
                                  onClick={() => {
                                    setActiveReplyId(activeReplyId === reply.id ? null : reply.id);
                                    setReplyText('');
                                  }}
                                  className="text-[10px] font-bold text-outline hover:text-primary transition-colors"
                                >
                                  Reply
                                </button>
                              )}
                              {isAuthenticated && currentUserId === reply.user_id && (
                                <button 
                                  onClick={() => handleDeleteComment(reply.id, comment.id)}
                                  className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors ml-auto"
                                >
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Reply Input Field under a Reply (Reply-to-Reply) */}
                        {activeReplyId === reply.id && (
                          <div className="mt-4 ml-14 relative">
                            <textarea 
                              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-4 text-xs focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-24 placeholder:text-outline/40 shadow-inner" 
                              placeholder={`Reply to ${reply.username}...`}
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                            />
                            <div className="mt-2 flex justify-end gap-2">
                              <button 
                                onClick={() => setActiveReplyId(null)}
                                className="py-1.5 px-4 text-[10px] font-bold text-outline hover:text-on-surface transition-colors"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => handlePostReply(comment.id, reply.username)}
                                disabled={!replyText.trim()}
                                className="py-1.5 px-4 bg-primary text-on-primary rounded-lg text-[10px] font-bold transition-transform active:scale-95 hover:bg-primary/90 disabled:opacity-50 disabled:pointer-events-none"
                              >
                                Reply
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        
        {hasMore && (
          <div className="mt-12 text-center">
            <button 
              onClick={() => fetchComments(page + 1)}
              disabled={loadingMore}
              className="text-sm font-bold text-primary hover:underline underline-offset-4 transition-all decoration-primary/30 disabled:opacity-50"
            >
              {loadingMore ? 'Loading...' : 'Load more comments'}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
