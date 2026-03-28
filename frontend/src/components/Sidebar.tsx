'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useKeycloak } from '@react-keycloak/web';

export default function Sidebar() {
  const pathname = usePathname();
  const { keycloak } = useKeycloak();

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Support', href: '/support' },
  ];

  const handleLogout = () => {
    keycloak.logout();
  };

  return (
    <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col">
      {/* Brand Header */}
      <div className="p-6">
        <h1 className="text-2xl font-bold tracking-tight text-emerald-400">Artist OS</h1>
        <p className="text-sm text-neutral-400 mt-1">Creator Dashboard</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-emerald-300'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Account / Actions Section */}
      <div className="p-4 border-t border-neutral-800 space-y-1">
        <div className="px-4 py-2 mb-2">
            <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Account</p>
            <p className="text-sm text-neutral-300 truncate mt-1">
                {keycloak.tokenParsed?.preferred_username || 'Artist'}
            </p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
