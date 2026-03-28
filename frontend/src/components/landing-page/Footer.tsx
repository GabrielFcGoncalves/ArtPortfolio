import React from 'react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-stone-50 dark:bg-zinc-900 w-full py-16 px-8 border-t border-stone-100 dark:border-stone-800 mt-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto w-full items-center">
        <div>
          <span className="font-manrope font-bold text-stone-800 dark:text-stone-100 text-lg">The Curated Atelier</span>
          <p className="text-stone-600 dark:text-stone-400 font-inter text-xs tracking-wide mt-4 max-w-xs leading-relaxed">
            Empowering the next generation of creative professionals with tools built for excellence and quiet sophistication.
          </p>
          <p className="text-stone-600 dark:text-stone-400 font-inter text-xs tracking-wide mt-8">
            © 2026 The Curated Atelier. All rights reserved.
          </p>
        </div>
        <div className="flex flex-wrap md:justify-end gap-x-12 gap-y-6">
          <Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-inter text-xs tracking-wide transition-colors" href="#">Privacy Policy</Link>
          <Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-inter text-xs tracking-wide transition-colors" href="#">Terms of Service</Link>
          <Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-inter text-xs tracking-wide transition-colors" href="#">Contact Us</Link>
          <Link className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 font-inter text-xs tracking-wide transition-colors" href="#">Artist Guidelines</Link>
        </div>
      </div>
    </footer>
  );
}
