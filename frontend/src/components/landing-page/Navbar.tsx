'use client';

import React from 'react';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)]">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4 w-full">
        <div className="flex items-center gap-12">
          <span className="text-xl font-bold tracking-tighter text-stone-800 dark:text-stone-100 font-headline">The Curated Atelier</span>
          <div className="hidden md:flex gap-8">
            <Link className="text-stone-900 dark:text-white font-semibold border-b-2 border-stone-800 dark:border-stone-200 pb-1 font-manrope tracking-tight text-sm px-0" href="#">Features</Link>
            <Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors font-manrope tracking-tight text-sm font-medium" href="#">Pricing</Link>
            <Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors font-manrope tracking-tight text-sm font-medium" href="#">Showcase</Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden lg:block text-stone-700 dark:text-stone-200 hover:opacity-80 transition-opacity duration-300 font-manrope tracking-tight text-sm font-medium">Watch Demo</button>
          <Link href="/dashboard" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-manrope tracking-tight text-sm font-semibold hover:opacity-90 active:scale-95 duration-200 ease-in-out">
            Start Your Atelier
          </Link>
        </div>
      </div>
    </nav>
  );
}
