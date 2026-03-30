import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ArtworkCardProps {
  title: string;
  artist: string;
  image: string;
  views: string;
  likes: string;
  isLiked?: boolean;
}

export default function ArtworkCard({ title, artist, image, views, likes, isLiked }: ArtworkCardProps) {
  return (
    <Link href="/artpiece/ethereal-nomad" className="group cursor-pointer block">
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-surface-container-low transition-all duration-500 group-hover:shadow-[0_20px_50px_rgba(122,86,66,0.12)] group-hover:-translate-y-1 relative">
        <Image 
          fill
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
          src={image} 
          alt={title} 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <div className="mt-4 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-bold text-on-surface tracking-tight group-hover:text-primary transition-colors">{title}</h3>
          <p className="text-xs text-on-surface-variant mt-0.5">by {artist}</p>
        </div>
        <div className="flex items-center space-x-3 text-on-surface-variant/60">
          <div className="flex items-center space-x-1">
            <span className="material-symbols-outlined text-sm">visibility</span>
            <span className="text-[10px] font-medium">{views}</span>
          </div>
          <div className="flex items-center space-x-1 group/like">
            <span 
              className={`material-symbols-outlined text-sm group-hover/like:text-primary transition-colors ${isLiked ? 'text-primary' : ''}`}
              style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "" }}
            >
              favorite
            </span>
            <span className="text-[10px] font-medium">{likes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
