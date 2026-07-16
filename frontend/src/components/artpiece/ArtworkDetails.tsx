import React from 'react';

interface ArtworkDetailsProps {
  description?: string;
  isEditing?: boolean;
  editDescription?: string;
  onChangeDescription?: (val: string) => void;
}

interface ArtworkHeaderProps {
  title?: string;
  createdAt?: string;
  isEditing?: boolean;
  editTitle?: string;
  onChangeTitle?: (val: string) => void;
  username?: string;
  artistAvatarUrl?: string;
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

export function ArtworkHeader({
  title,
  createdAt,
  isEditing,
  editTitle,
  onChangeTitle,
  username,
  artistAvatarUrl
}: Readonly<ArtworkHeaderProps>) {
  const displayTitle = title || "The Ethereal Nomad";
  const timeText = createdAt 
    ? `• Listed on ${new Date(createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}`
    : '• Listed 2 days ago';

  return (
    <header className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-container text-[10px] font-bold tracking-widest uppercase">Original Work</span>
        <span className="text-outline text-xs">{timeText}</span>
      </div>
      
      {isEditing ? (
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-2">Artwork Title</label>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => onChangeTitle?.(e.target.value)}
            className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-lg font-headline text-2xl font-bold focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="Artwork Title"
          />
        </div>
      ) : (
        <h1 className="text-4xl md:text-5xl font-extrabold font-headline text-primary tracking-tight leading-tight">{displayTitle}</h1>
      )}

      <div className="flex items-center gap-4 pt-2">
        <RenderAvatar username={username || 'Artist'} avatarUrl={artistAvatarUrl} />
        <div>
          <p className="text-sm font-semibold text-on-surface">{username || 'Artist'}</p>
          <p className="text-xs text-outline font-light">Contemporary Abstract Artist</p>
        </div>
      </div>
    </header>
  );
}

export default function ArtworkDetails({
  description,
  isEditing,
  editDescription,
  onChangeDescription
}: Readonly<ArtworkDetailsProps>) {
  const displayDescription = description || `"The Ethereal Nomad" explores the intersection of transient human presence and the immutable groundedness of the earth. Through layered glazes of raw sienna and sage, the piece invites the viewer into a silent dialogue with the unknown horizons of our internal landscape.`;

  return (
    <div className="w-full space-y-10">
      <div className="prose prose-stone leading-relaxed border-t border-outline-variant/10 pt-8">
        {isEditing ? (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-outline mb-2">Artwork Description</label>
            <textarea
              value={editDescription}
              onChange={(e) => onChangeDescription?.(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-lg text-base font-light focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed resize-y"
              placeholder="Artwork Description"
            />
          </div>
        ) : (
          <p className="text-lg text-on-surface-variant font-light leading-relaxed">
            {displayDescription}
          </p>
        )}
      </div>
    </div>
  );
}
