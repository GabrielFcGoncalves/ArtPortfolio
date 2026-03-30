import React from 'react';
import Link from 'next/link';

export default function ExploreFooter() {
  return (
    <footer className="bg-surface-container-low px-8 py-16 border-t border-outline-variant/10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start">
        <div className="mb-10 md:mb-0">
          <h2 className="text-xl font-bold italic text-on-surface mb-4 tracking-tight font-headline">The Curated Atelier</h2>
          <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
            A digital gallery dedicated to the quiet sophistication of modern artistry. Discover, collect, and connect with the world's most intentional creators.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-8">
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface/50 mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="#">About the Atelier</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Artist Residency</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Curation Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface/50 mb-4">Support</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="#">Help Center</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Trust & Safety</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface/50 mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-on-surface-variant">
              <li><Link className="hover:text-primary transition-colors" href="#">Privacy Policy</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Terms of Service</Link></li>
              <li><Link className="hover:text-primary transition-colors" href="#">Licensing</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-outline-variant/10 flex flex-col sm:flex-row justify-between items-center text-[10px] font-medium text-on-surface-variant/60 uppercase tracking-widest">
        <p>© 2026 The Curated Atelier. All Rights Reserved.</p>
        <div className="flex space-x-6 mt-4 sm:mt-0">
          <a className="hover:text-primary transition-colors" href="#">Instagram</a>
          <a className="hover:text-primary transition-colors" href="#">Twitter</a>
          <a className="hover:text-primary transition-colors" href="#">Pinterest</a>
        </div>
      </div>
    </footer>
  );
}
