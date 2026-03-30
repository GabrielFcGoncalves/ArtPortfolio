import React from 'react';
import Link from 'next/link';

export default function ArtPieceFooter() {
  return (
    <footer className="bg-surface-container-low py-16 px-8 border-t border-outline-variant/10">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-xl font-bold tracking-tighter text-[#7a5642] font-headline">Artist OS</div>
        <div className="flex gap-12 text-[10px] font-extrabold uppercase tracking-[0.2em] text-outline">
          <Link className="hover:text-primary transition-colors" href="#">Privacy</Link>
          <Link className="hover:text-primary transition-colors" href="#">Terms of Sale</Link>
          <Link className="hover:text-primary transition-colors" href="#">Shipping Policy</Link>
          <Link className="hover:text-primary transition-colors" href="#">Contact</Link>
        </div>
        <p className="text-[10px] text-outline/60 font-medium tracking-widest uppercase">© 2026 Artist OS. All rights reserved.</p>
      </div>
    </footer>
  );
}
