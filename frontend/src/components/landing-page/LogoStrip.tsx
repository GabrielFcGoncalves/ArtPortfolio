import React from 'react';

export default function LogoStrip() {
  const logos = ["PIXAR", "Disney", "RIOTS", "ArtStation", "BUNGIE"];
  
  return (
    <section className="py-12 border-y border-outline-variant/10 bg-white">
      <div className="max-w-7xl mx-auto px-8">
        <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant/40 mb-8">Trusted by Artists at</p>
        <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-40 grayscale">
          {logos.map(logo => (
            <span key={logo} className="font-headline font-extrabold text-2xl tracking-tighter">{logo}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
