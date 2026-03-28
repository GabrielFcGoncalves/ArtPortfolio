'use client';

import React from 'react';
import Image from 'next/image';

export default function Features() {
  return (
    <section className="py-32 max-w-7xl mx-auto px-8">
      <div className="text-center mb-20 space-y-4">
        <h2 className="text-4xl font-headline font-bold tracking-tight text-on-surface">Designed for the Creative Workflow.</h2>
        <p className="text-on-surface-variant max-w-2xl mx-auto text-lg">Stop juggling spreadsheets and DMs. We built the tools so you can focus on the canvas.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Large Feature Card */}
        <div className="md:col-span-2 lg:col-span-2 bg-surface-container-low rounded-[2rem] p-8 md:p-12 flex flex-col justify-between overflow-hidden relative group">
          <div className="relative z-10 max-w-md">
            <span className="text-primary font-bold tracking-widest uppercase text-xs">Management</span>
            <h3 className="text-3xl font-headline font-bold mt-4 mb-6">Master Your Commissions</h3>
            <p className="text-on-surface-variant leading-relaxed">Automated invoicing, milestone tracking, and a dedicated client portal that makes you look as professional as your art.</p>
            <button className="mt-8 flex items-center gap-2 text-primary font-bold group-hover:gap-4 transition-all">
              Learn more <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="absolute right-0 bottom-0 w-1/2 translate-x-10 translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-500 hidden sm:block">
            <div className="relative aspect-square w-full">
              <Image fill className="rounded-tl-3xl shadow-2xl object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhHOCzOURBbZhXaN6SKfKmMQcNhJlSCl1gygTdTRHsdAuTumQVh10qKUlkUFhvH9uyHQ993n4mqT4POyluGT93mYGPGdYM9QsgV2iI8q6WK9SvWqthljg2rey3eROqtn0h0TWjtaMRXd2HFmiTRq013jdh4QJ3olo8jSmkw1Y_K6e9szk1QvASxxUJnLYRhCG-a0Wkt48QoirgknjAT06nQic7jBMR-FFPcnkwGov0klXBScjSpoOBeh6dM0W35dw_WEkDQCLM3GM" alt="Digital Organization" />
            </div>
          </div>
        </div>
        
        {/* Small Feature Card - Inventory */}
        <div className="bg-primary text-on-primary rounded-[2rem] p-8 md:p-12 flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-4xl">inventory_2</span>
          </div>
          <h3 className="text-2xl font-headline font-bold mb-4">Inventory Engine</h3>
          <p className="opacity-80 text-sm leading-relaxed">Track every original piece from sketch to sale. Never lose a physical canvas again.</p>
        </div>

        {/* Small Feature Card - Digital Atelier */}
        <div className="bg-tertiary-container text-on-tertiary-container rounded-[2rem] p-8 md:p-12 flex flex-col justify-center text-center">
          <div className="w-16 h-16 bg-on-tertiary-container/10 rounded-2xl flex items-center justify-center mx-auto mb-8">
            <span className="material-symbols-outlined text-4xl">brush</span>
          </div>
          <h3 className="text-2xl font-headline font-bold mb-4">Digital Atelier</h3>
          <p className="opacity-80 text-sm leading-relaxed">A stunning, zero-code portfolio that works as hard as you do. Mobile-optimized by default.</p>
        </div>

        {/* Mid-size Feature Card - Asset Delivery */}
        <div className="md:col-span-2 bg-surface-container-low rounded-[2rem] p-8 md:p-12 flex flex-col sm:flex-row items-center gap-8 md:gap-12 overflow-hidden group">
          <div className="w-full sm:w-1/3 shrink-0">
            <div className="aspect-square bg-surface-container-lowest rounded-2xl border border-outline-variant/20 flex items-center justify-center relative shadow-inner">
              <span className="material-symbols-outlined text-primary text-6xl" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_done</span>
            </div>
          </div>
          <div>
            <span className="text-secondary font-bold tracking-widest uppercase text-xs">Security</span>
            <h3 className="text-3xl font-headline font-bold mt-4 mb-4">Vaulted Asset Delivery</h3>
            <p className="text-on-surface-variant">Securely deliver high-resolution files only after final payment is confirmed. No more watermark stress.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
