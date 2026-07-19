'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKeycloak } from '@react-keycloak/web';
import { AUTH_NAV_LINKS } from './nav-links';
import { useModals } from '@/providers/ModalProvider';
import { userService } from '@/services/api_client';
import type { PublicProfile } from '@/services/api_client/user.service';

export default function Navbar() {
  const { keycloak } = useKeycloak();
  const { openArtpieceModal } = useModals();
  const pathname = usePathname();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<PublicProfile[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const results = await userService.searchUsers(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error("Failed to search users:", err);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogout = () => {
    keycloak.logout();
  };

  const defaultAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuANn3gCFPiNIRFQGA0_X35G__b7wORvD1Zf7GkMaN-ARFi8IaDnmNLV3UhKimNuZ1XmtWHBG9-QX05libfHUeRQHA2l_xQudRjQ-ObTWs848pZ7lQmokOXcyBG1ZOaDgLN3LNzO1jHJUNi5osiMr3H80CZx3nIJgfZUP8SFl_pKnDkN7xZm51pCa_gWluztpWD6m2S0DTeESC619qyxwi2hfE7TgixI4uCs0zn2vUjM1AKcQizEwWuiMwEDF8OVln3vFvh6IhJ6ZHA";

  return (
    <header className="fixed top-0 w-full z-50 px-5 bg-white/80 backdrop-blur-xl shadow-[0_10px_40px_rgba(122,86,66,0.06)]">
      <nav className="flex justify-between items-center w-full px-8 py-4 max-w-full mx-auto">
        <Link href="/explore" className="text-xl font-bold text-stone-800 italic tracking-tight font-headline">
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
          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-surface-container-low px-4 py-2 rounded-full ring-1 ring-outline-variant/20 relative" ref={dropdownRef}>
            <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
            <input 
              className="bg-transparent border-none focus:ring-0 text-sm placeholder-on-surface-variant/60 w-48 ml-2 outline-none font-body" 
              placeholder="Search usernames..." 
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
            />

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-2xl shadow-[0_10px_45px_rgba(0,0,0,0.12)] border border-outline-variant/10 overflow-hidden z-[100] max-h-60 overflow-y-auto w-64">
                <div className="p-2 space-y-1">
                  {searchResults.map((user) => (
                    <Link
                      key={user.id}
                      href={`/users/${user.id}`}
                      onClick={() => {
                        setShowDropdown(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 px-4 py-2.5 hover:bg-surface-container-high rounded-xl transition-all duration-150 group"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden relative border border-outline-variant/15 shrink-0 bg-primary/5">
                        <img 
                          src={user.avatarUrl || defaultAvatar} 
                          alt={user.username} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-on-surface group-hover:text-primary transition-colors truncate">
                          {user.username}
                        </p>
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-outline">
                          {user.role}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
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
            <Link href="/me" className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-primary/10 relative block hover:opacity-90 active:scale-95 transition-all shrink-0">
              <img 
                className="absolute inset-0 w-full h-full object-cover"
                alt="User Profile" 
                src={defaultAvatar} 
              />
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
