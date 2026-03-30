'use client';

import React from 'react';
import Image from 'next/image';

interface CollectionCardProps {
  image: string;
  tag: string;
  title: string;
  count: string;
}

export default function CollectionCard({ image, tag, title, count }: CollectionCardProps) {
  return (
    <div className="col-span-12 md:col-span-4 lg:col-span-4 relative h-[360px] md:h-full rounded-[2rem] overflow-hidden group border border-outline-variant/10 shadow-lg cursor-pointer">
      <Image 
        fill
        className="object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" 
        src={image} 
        alt={title} 
        sizes="(max-width: 1024px) 100vw, 33vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/80 via-transparent to-transparent flex flex-col justify-end p-8">
        <span className="text-white/70 text-[10px] font-bold uppercase tracking-[0.2em] mb-2">{tag}</span>
        <h4 className="text-white font-headline font-bold text-2xl tracking-tight transition-all duration-300 group-hover:translate-x-2">{title}</h4>
        <p className="text-white/60 text-xs mt-2 uppercase tracking-widest">{count}</p>
      </div>
    </div>
  );
}
