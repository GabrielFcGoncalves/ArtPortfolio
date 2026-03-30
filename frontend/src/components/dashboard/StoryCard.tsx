'use client';

import React from 'react';
import Image from 'next/image';

interface StoryCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  linkText: string;
}

export default function StoryCard({ image, category, title, description, linkText }: StoryCardProps) {
  return (
    <div className="col-span-12 lg:col-span-8 flex flex-col md:flex-row gap-8 bg-surface-container-low/30 rounded-3xl p-6 md:p-8 border border-outline-variant/10 shadow-[0_10px_40px_rgba(122,86,66,0.03)] hover:shadow-[0_10px_40px_rgba(122,86,66,0.06)] transition-all duration-500">
      <div className="w-full md:w-2/3">
        <div className="aspect-[16/7] overflow-hidden rounded-2xl relative border border-outline-variant/10">
          <Image 
            fill
            className="object-cover hover:scale-105 transition-transform duration-1000" 
            src={image} 
            alt={title} 
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </div>
      <div className="w-full md:w-1/3 flex flex-col justify-center py-4">
        <span className="inline-block w-fit px-3 py-1 bg-secondary-fixed text-on-secondary-container rounded-full text-[9px] font-bold uppercase tracking-[0.2em] mb-4">
          {category}
        </span>
        <h3 className="text-2xl font-headline font-bold text-on-surface tracking-tighter mb-4 transition-colors">
          {title}
        </h3>
        <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-8 flex-1">
          {description}
        </p>
        <div className="flex items-center gap-2 text-primary font-headline font-bold text-xs cursor-pointer group hover:gap-4 transition-all">
          {linkText}
          <span className="material-symbols-outlined text-base transition-transform group-hover:translate-x-1">arrow_right_alt</span>
        </div>
      </div>
    </div>
  );
}
