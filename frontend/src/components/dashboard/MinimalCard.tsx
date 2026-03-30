'use client';

import React from 'react';
import Image from 'next/image';

interface MinimalCardProps {
  image: string;
  title: string;
  subtitle: string;
}

export default function MinimalCard({ image, title, subtitle }: MinimalCardProps) {
  return (
    <div className="bg-surface-container-lowest p-5 rounded-2xl border border-outline-variant/10 hover:shadow-2xl transition-all duration-500 group relative">
      <div className="aspect-video overflow-hidden rounded-xl mb-6 bg-surface-container-low border border-outline-variant/10 relative">
        <Image 
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700" 
          src={image} 
          alt={title} 
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <h4 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-[0.2em] mt-2 italic">{subtitle}</p>
    </div>
  );
}
