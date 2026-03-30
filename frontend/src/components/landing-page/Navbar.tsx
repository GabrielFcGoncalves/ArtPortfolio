'use client';
import Link from 'next/link';
import { LANDING_NAV_LINKS } from '../navbar/nav-links';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)]">
      <div className="flex justify-between items-center max-w-7xl mx-auto px-8 py-4 w-full">
        <div className="flex items-center gap-12">
          <span className="text-xl font-bold tracking-tighter text-stone-800 font-headline">The Curated Atelier</span>
          <div className="hidden md:flex gap-8">
            {LANDING_NAV_LINKS.map(link => (
              <Link 
                key={link.label}
                href={link.href}
                className={`
                  tracking-tight text-sm font-medium transition-all duration-200 font-manrope px-0
                  ${link.isMain 
                    ? 'text-stone-900 border-b-2 border-stone-800 pb-1 font-semibold' 
                    : 'text-stone-500 hover:text-stone-800'
                  }
                `}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden lg:block text-stone-700 hover:opacity-80 transition-opacity duration-300 font-manrope tracking-tight text-sm font-medium">Watch Demo</button>
          <Link href="/dashboard" className="bg-primary text-on-primary px-5 py-2.5 rounded-lg font-manrope tracking-tight text-sm font-semibold hover:opacity-90 active:scale-95 duration-200 ease-in-out">
            Start Your Atelier
          </Link>
        </div>
      </div>
    </nav>
  );
}
