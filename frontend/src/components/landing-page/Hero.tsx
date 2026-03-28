'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-surface py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-12 xl:col-span-5 space-y-8">
          <div className="inline-flex items-center gap-2 bg-secondary-fixed text-on-secondary-container px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase">
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
            Now in Early Access
          </div>
          <h1 className="text-5xl lg:text-7xl font-headline font-extrabold text-on-background tracking-tight leading-[1.1]">
            Your Craft, <br/><span className="text-primary">Professionally Organized.</span>
          </h1>
          <p className="text-xl text-on-surface-variant font-light leading-relaxed max-w-xl">
            The all-in-one workstation for digital and traditional artists to manage portfolios, sell originals, and handle high-value commissions with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href="/dashboard" className="bg-primary text-on-primary px-8 py-4 rounded-xl font-headline font-bold text-lg shadow-xl shadow-primary/10 hover:opacity-95 transition-all active:scale-95 text-center">
              Start Your Atelier
            </Link>
            <Link href="/dashboard" className="bg-surface-container-lowest border border-outline-variant/30 text-primary px-8 py-4 rounded-xl font-headline font-bold text-lg hover:bg-surface-container-low transition-all text-center">
              Explore the Showcase
            </Link>
          </div>
          <div className="flex items-center gap-4 pt-6 text-on-surface-variant/60">
            <div className="flex -space-x-3">
              {[
                "https://lh3.googleusercontent.com/aida-public/AB6AXuDXwjc5eXHM4zUKKN1_aAdYRX_ivmCbER_svon0KYz8CZ2iadtBjKnk7lh1N8yrB7hTphe9CWJYw4Y4D3ET1VYKUeGZKado3w3dKlMIaDUz5oCnV8iGALVnjsnWTFFEd5V41u-CvAQxUHOeJcPuDuvNV9BWMLMtbj5G5WjpKDkNmhOvWOP3yj4nT-f6KpxFsyV6sUMEm4vzXDErO6b24KlXIlryFmBz7Pv40Uw0JvAwsaEjNrtuYXHFli03-XsCW0DqrkOSuYSIGLY",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCn6-q6pqNhYynqBYCWxyx__zSjMvOy49-uIA4WJRuN97g_r6XDAaJA3q0fJCmvYArsBDc4TI9XUM2PvP6ghabmV6kerg4BvfceOEDhtxPRxjtb8Z8FB3FJb78FGqt7fcBXzQo9gpnGbkJLLj_mm5OjNJZLct3Hh7e8vcXozheaEEhnEFcTP0-LZfLEAQH0o45E6TnRw1AmzJJDwIpmMo5ifJPqsZsexGmEPkrCuHOVKc9kkGTNEeoSQTKxSKyom2gIWezZ9s0GRis",
                "https://lh3.googleusercontent.com/aida-public/AB6AXuCkPqGGuZoFZ_C4hhGROfeZpw2yf_uPmbTrmaHpejRfvcCQSgywmHgqklaoMuY6SoI1fy1qhSE_2PcIcR7ZLc0zkG3_bVfp226NGLlQrH_OfsOQYAEsQAXjx8UhoD2rg3nKvWGg2pIxzpM5DlHF1BDd4aPBxeZ-pChGJO9asy82nViaSKX2MItL1vNyKAIXq7cWPvVr6wNB1mkbzKuY2xC89JhG_T44LAK1qjkb-VK_eA1XAZpYIVxGGbl-5OP5H_pDihvKmwGM_30"
              ].map((src, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-surface bg-stone-200 overflow-hidden relative">
                  <Image fill className="object-cover" src={src} alt="Artist portrait" />
                </div>
              ))}
            </div>
            <span className="text-sm font-medium italic">Join 2,400+ artists refining their workflow.</span>
          </div>
        </div>
        <div className="lg:col-span-12 xl:col-span-7 relative">
          {/* Browser Mockup */}
          <div className="bg-surface-container-lowest rounded-2xl shadow-2xl shadow-primary/5 border border-outline-variant/20 overflow-hidden transform lg:rotate-1 lg:hover:rotate-0 transition-transform duration-700 ease-out">
            <div className="bg-surface-container-low px-4 py-3 flex items-center gap-2 border-b border-outline-variant/10">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-stone-300"></div>
              </div>
              <div className="mx-auto bg-surface-container-lowest px-8 py-1 rounded-md text-[10px] text-stone-400 font-mono tracking-widest uppercase truncate max-w-[200px]">artist-os.atelier/dashboard</div>
            </div>
            <div className="aspect-[4/3] relative bg-white">
              <Image fill className="object-cover opacity-90" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGyW0ODYTlhbjsdFgcLtMLasBGKBaQ_ochmPfzdkqmp_zDnrHtK1F6w2Odhj9SyTFeX4xuUuJq81_wOiYWApfqg-4tj6wTqbYh7aH4x9qsoAG3ad6dVNW2DP-WR_TX7gzcbtbaqB3621qZdYEkkmnSD_MKEbCDSRv8IpG8qa5p918EPRpOUwfjjQZe7RHbChwcQSIlpNSK2IC4UzSPkglocvthJ5AFUcaVJoo5eAsoW0AOiyzX9KGlLLTPgRCkNwxH3CUvdwGMUDs" alt="Dashboard UI" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent pointer-events-none"></div>
            </div>
          </div>
          {/* Floating Accent Card */}
          <div className="absolute -bottom-8 -left-8 bg-surface-bright p-6 rounded-2xl shadow-xl border border-outline-variant/20 max-w-[240px] hidden md:block">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">New Commission</p>
                <p className="text-sm font-headline font-bold text-on-surface">$2,450.00 USD</p>
              </div>
            </div>
            <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden">
              <div className="bg-tertiary h-full w-3/4"></div>
            </div>
            <p className="text-[10px] text-on-surface-variant mt-2 font-medium">Concept Art - Phase 1 Complete</p>
          </div>
        </div>
      </div>
    </section>
  );
}
