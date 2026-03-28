'use client';

import React from 'react';
import Navbar from './Navbar';
import Hero from './Hero';
import LogoStrip from './LogoStrip';
import Features from './Features';
import CTA from './CTA';
import Footer from './Footer';

/**
 * LandingPage component for 'The Curated Atelier' (Artist OS).
 * This component orchestrates the modular sections of the landing page.
 */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface font-body overflow-x-hidden selection:bg-primary-container selection:text-on-primary-container">
      {/* Navigation */}
      <Navbar />

      <main>
        {/* Welcome & Value Prop */}
        <Hero />
        
        {/* Trust Signals */}
        <LogoStrip />

        {/* Product Depth */}
        <Features />

        {/* Conversion / Final Call */}
        <CTA />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
