'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKeycloak } from '@react-keycloak/web';
import { AUTH_NAV_LINKS } from './nav-links';
import { useModals } from '@/providers/ModalProvider';

export default function Navbar() {
  const { keycloak } = useKeycloak();
  const { openArtpieceModal } = useModals();
  const pathname = usePathname();

  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <header className="fixed top-0 w-full z-50 px-5 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)]">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-full mx-auto">
        {/* Brand Logo */}
        <Link href="/" className="text-xl font-bold text-stone-800 italic tracking-tight font-headline">
          The Curated Atelier
        </Link>

        {/* Dynamic Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {AUTH_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.label}
                href={link.href}
                className={`
                  tracking-tight text-sm font-medium transition-all duration-200 font-headline
                  ${isActive 
                    ? 'text-stone-900 border-b-2 border-stone-800 pb-1' 
                    : 'text-stone-500 hover:text-stone-800'
                  }
                `}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Trailing Actions */}
        <div className="flex items-center space-x-6">
          <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full ring-1 ring-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
            <input className="bg-transparent border-none focus:ring-0 text-sm placeholder-on-surface-variant/60 w-48 ml-2 outline-none font-body" placeholder="Search curated works..." type="text"/>
          </div>
          <div className="flex items-center space-x-4">
            <span className="material-symbols-outlined text-stone-700 cursor-pointer hover:opacity-80 transition-all">notifications</span>
            <span className="material-symbols-outlined text-stone-700 cursor-pointer hover:opacity-80 transition-all">shopping_bag</span>
            <button onClick={handleLogout} className="material-symbols-outlined text-stone-700 cursor-pointer hover:text-red-500 transition-all">logout</button>
            <button 
              onClick={openArtpieceModal}
              className="hidden sm:block bg-tertiary-container text-on-tertiary-container px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-95 duration-150 font-body"
            >
              Create
            </button>
            <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/10 relative">
              <Link href="/me" className="hidden sm:block bg-tertiary-container text-on-tertiary-container px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition-all active:scale-95 duration-150 font-body">
              <Image 
                fill
                className="object-cover"
                alt="User Profile" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuANn3gCFPiNIRFQGA0_X35G__b7wORvD1Zf7GkMaN-ARFi8IaDnmNLV3UhKimNuZ1XmtWHBG9-QX05libfHUeRQHA2l_xQudRjQ-ObTWs848pZ7lQmokOXcyBG1ZOaDgLN3LNzO1jHJUNi5osiMr3H80CZx3nIJgfZUP8SFl_pKnDkN7xZm51pCa_gWluztpWD6m2S0DTeESC619qyxwi2hfE7TgixI4uCs0zn2vUjM1AKcQizEwWuiMwEDF8OVln3vFvh6IhJ6ZHA" 
                sizes="32px"
              />
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
