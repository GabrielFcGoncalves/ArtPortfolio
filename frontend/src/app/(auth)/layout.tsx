import React from 'react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-neutral-900 text-white font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-neutral-950 border-r border-neutral-800 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold tracking-tight text-emerald-400">Artist OS</h1>
          <p className="text-sm text-neutral-400 mt-1">Creator Dashboard</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link 
            href="/dashboard"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-neutral-800 hover:text-emerald-300"
          >
            Dashboard
          </Link>
          <Link 
            href="/support"
            className="block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors hover:bg-neutral-800 hover:text-emerald-300"
          >
            Support
          </Link>
        </nav>
        <div className="p-4 border-t border-neutral-800">
          <button className="w-full text-left px-4 py-2 text-sm text-neutral-400 hover:text-white transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Main Content Area (Outlet) */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
