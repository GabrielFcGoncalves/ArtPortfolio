'use client';

import React from 'react';
import Image from 'next/image';

interface FeaturedPieceWithCommentProps {
  image: string;
  title: string;
  year: string;
  comment: string;
  author: string;
  authorRole: string;
  imageWidthClass?: string; // e.g., "md:w-3/5"
  commentWidthClass?: string; // e.g., "md:w-2/5"
}

/**
 * Sub-component for the image part
 */
const FeaturedImage = ({ src, title, description, widthClass }: { src: string; title: string; description: string; widthClass: string }) => (
  <div className={`w-full ${widthClass}`}>
    <div className="aspect-[3/4] overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant/10 relative">
      <Image 
        fill
        className="object-cover grayscale hover:grayscale-0 transition-all duration-700" 
        src={src} 
        alt={title} 
        sizes="(max-width: 768px) 100vw, 40vw"
      />
    </div>
    <div className="mt-4">
      <h3 className="font-headline font-bold text-lg text-primary">{title}</h3>
      <p className="text-on-surface-variant font-label text-[10px] uppercase tracking-tighter">{description}</p>
    </div>
  </div>
);

/**
 * Sub-component for the comment part
 */
const FeaturedComment = ({ comment, author, role, widthClass }: { comment: string; author: string; role: string; widthClass: string }) => (
  <div className={`w-full ${widthClass} p-8 border border-outline-variant/10 flex flex-col justify-center bg-surface-container-low/20 rounded-xl self-start mt-4 md:mt-0 shadow-sm`}>
    <span className="material-symbols-outlined text-primary-container text-2xl mb-4" style={{ fontVariationSettings: "'FILL' 1" }}>format_quote</span>
    <p className="text-on-surface-variant font-body italic text-base leading-relaxed mb-6">
      &quot;{comment}&quot;
    </p>
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-secondary-fixed ring-2 ring-primary/5"></div>
      <div>
        <p className="font-headline font-bold text-xs text-on-surface">{author}</p>
        <p className="text-[10px] text-on-surface-variant font-label uppercase tracking-widest">{role}</p>
      </div>
    </div>
  </div>
);

export default function FeaturedPieceWithComment({
  image,
  title,
  year,
  comment,
  author,
  authorRole,
  imageWidthClass = "md:w-3/5",
  commentWidthClass = "md:w-2/5"
}: FeaturedPieceWithCommentProps) {
  return (
    <div className="col-span-12 lg:col-span-7 flex flex-col md:flex-row gap-6">
      <FeaturedImage 
        src={image} 
        title={title} 
        description={`Mixed Media, ${year}`} 
        widthClass={imageWidthClass} 
      />
      <FeaturedComment 
        comment={comment} 
        author={author} 
        role={authorRole} 
        widthClass={commentWidthClass} 
      />
    </div>
  );
}
