'use client';

import React from 'react';
import Link from 'next/link';

export default function DashboardFooter() {
  return (
    <footer className="px-8 md:px-12 py-16 flex flex-col md:flex-row justify-between items-center border-t border-outline-variant/10 gap-12 bg-white/50 backdrop-blur-sm">
      <div className="flex flex-col items-center md:items-start">
        <span className="text-xl font-headline font-bold text-primary tracking-tighter italic">The Atelier</span>
        <p className="text-on-surface-variant/60 font-label text-[10px] uppercase tracking-[0.2em] mt-3">© 2026 The Atelier Studio — Artist OS</p>
      </div>
      <div className="flex flex-wrap justify-center gap-x-12 gap-y-6">
        <Link className="text-on-surface-variant/80 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-[0.3em] font-extrabold" href="#">Privacy</Link>
        <Link className="text-on-surface-variant/80 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-[0.3em] font-extrabold" href="#">Terms</Link>
        <Link className="text-on-surface-variant/80 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-[0.3em] font-extrabold" href="#">Archive</Link>
        <Link className="text-on-surface-variant/80 hover:text-primary transition-colors font-label text-[10px] uppercase tracking-[0.3em] font-extrabold shadow-sm bg-primary/5 px-4 py-1 rounded-full" href="#">Identity</Link>
      </div>
    </footer>
  );
}
