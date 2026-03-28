'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="max-w-7xl mx-auto px-8 mb-32">
      <div className="bg-stone-900 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <Image fill className="object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAWJlzudW6AuIdCCma7lgTX1HSctwOnp4BlDOJGVJyNikZ3fxwyzOVkNi7b0r06LsPRKe8QdJYjtOYrFaMSMOS1gPY44uVzpdGsTEIGIvHzUmpjTtLwZ8CLpEv8APizuBh_IGDNqNizTk9F-GML-hvv3NrQ3CgIy9YuXeKzyH7DtuYMMZwYzmxSBfNgQa2B6Sf-4kRTvU3K9hMRSIYdYIZm4l5UPVokqfCwYAlZCIOAdIADifNQy9S1sNUd5NmTCak90lVnxx-ArZc" alt="Canvas Texture" />
        </div>
        <div className="relative z-10 max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl lg:text-6xl font-headline font-bold text-white tracking-tight">Ready to turn your studio into a professional atelier?</h2>
          <p className="text-stone-400 text-lg">Join the growing community of artists who have reclaimed their time and increased their revenue by 40%.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link href="/dashboard" className="bg-primary-container text-on-primary-fixed px-10 py-5 rounded-xl font-headline font-bold text-lg hover:scale-105 transition-transform text-center shadow-lg shadow-primary-container/20">
              Claim Your Workshop
            </Link>
            <Link href="/dashboard" className="bg-transparent border border-white/20 text-white px-10 py-5 rounded-xl font-headline font-bold text-lg hover:bg-white/5 transition-colors text-center">
              Talk to an Artist
            </Link>
          </div>
          <p className="text-stone-500 text-sm">No credit card required. 14-day free trial.</p>
        </div>
      </div>
    </section>
  );
}
