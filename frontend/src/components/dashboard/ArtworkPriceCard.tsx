'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface ArtworkPriceCardProps {
  image: string;
  title: string;
  edition: string;
  price: string;
  id: string;
}

export default function ArtworkPriceCard({ image, title, edition, price, id }: ArtworkPriceCardProps) {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-3">
      <Link href={`/artpiece/${id}`} className="bg-surface-container-lowest p-5 rounded-xl border border-outline-variant/10 hover:shadow-xl transition-all duration-500 group block relative">
        <div className="aspect-square overflow-hidden rounded-lg mb-6 bg-surface-container-low relative">
          <Image 
            fill
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            src={image} 
            alt={title} 
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-headline font-bold text-base text-on-surface group-hover:text-primary transition-colors">{title}</h3>
            <p className="text-secondary font-label text-[10px] uppercase font-bold tracking-widest mt-1">{edition}</p>
          </div>
          <span className="text-primary font-headline font-extrabold text-sm">{price}</span>
        </div>
      </Link>
    </div>
  );
}
