'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function DashboardHero() {
  return (
    <section className="px-8 md:px-12 py-10">
      <div className="relative w-full aspect-[21/8] overflow-hidden rounded-2xl bg-surface-container-low group border border-outline-variant/10 shadow-lg">
        <Image 
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuARhPuce_tR_JzpU7mrXigRszZRAWq-KFhXL2wiYg_oJvmPXpZtARH7IwsSeblB_-ewNfGPD7aHGZdKkqxp5Skdgtz7UJA6s6_neTAW5e6pDwzMTALz9VxKpApDFiQ4GaPCTpDpo-y9ot1-c1MZJupUrM-PcNfEHY2Wz--tt1V6e3GzwJkKrZwX35KiL41QW1IFaLTcJ-opZDjLnYSsa_7wQCBL6KV8CglygrJwpu_XO3fNTAQUbTxz9IfJciwbR3cGbD14_bKIt5E" 
          alt="Main Featured Artwork" 
          sizes="100vw"
        />
        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-8 md:p-12">
          <div className="max-w-3xl">
            <span className="text-white/80 font-label text-[10px] font-bold uppercase tracking-[0.2em] mb-3 block">Artpiece of the Month</span>
            <h1 className="text-white text-4xl lg:text-6xl font-headline font-extrabold tracking-tighter mb-4">Whispers of the Earth</h1>
            <p className="text-white/90 font-body text-base lg:text-lg mb-8 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-white/50"></span>
              by Elena Vancura
            </p>
            <Link 
              href="/artpiece/whispers-of-earth"
              className="bg-white text-primary px-8 py-3.5 rounded-lg font-headline font-bold text-sm tracking-tight inline-flex items-center gap-3 transition-all hover:bg-surface hover:shadow-xl active:scale-95"
            >
              View Details
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
