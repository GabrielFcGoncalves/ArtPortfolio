import React from 'react';
import Image from 'next/image';

export default function ArtworkDetails() {
  return (
    <div className="lg:col-span-7 space-y-10">
      <header>
        <div className="flex items-center gap-2 mb-4">
          <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-container text-[10px] font-bold tracking-widest uppercase">Original Work</span>
          <span className="text-outline text-xs">• Listed 2 days ago</span>
        </div>
        <h1 className="text-5xl font-extrabold font-headline text-primary tracking-tight mb-4">The Ethereal Nomad</h1>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden relative border border-outline-variant/10">
            <Image 
              fill
              className="object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPROyKG2yAazCjc_e_m-nUYNfE8wNJ8ngXhDvB3kYSGG6TQTALbbun5fmequ1zAyWkqCMWdpnTLeUf73eEnqmc0oxeAPg9Bp1wuHcwwKhYs1dwP0kZ9z_VSPCccFIsNSx9kRolMj5eTE58_XYYfBJ5uSVdvUIkXWrpuEaL--OqV1v9cZGwqg8ZDDg8QquiuYo5aBpG3pGVRmsTCkYPMt5aHLYC-cTvydyTliN0i6M9y-Q-QRID0UZ4BV9Y2Bk0JNt3enh2b58OR1I" 
              alt="Artist Elena K. Volkov" 
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-on-surface">Elena K. Volkov</p>
            <p className="text-xs text-outline">Contemporary Abstract Artist</p>
          </div>
        </div>
      </header>

      <div className="prose prose-stone leading-relaxed">
        <p className="text-lg text-on-surface-variant font-light leading-relaxed">
          "The Ethereal Nomad" explores the intersection of transient human presence and the immutable groundedness of the earth. Through layered glazes of raw sienna and sage, the piece invites the viewer into a silent dialogue with the unknown horizons of our internal landscape.
        </p>
      </div>

      {/* Provenance & Technical Specs (Bento Style) */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Medium</p>
          <p className="text-on-surface font-medium">Oil and Mixed Media on Linen</p>
        </div>
        <div className="p-6 bg-surface-container-low rounded-xl border border-outline-variant/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline mb-2">Dimensions</p>
          <p className="text-on-surface font-medium">48 x 60 inches (122 x 152 cm)</p>
        </div>
        <div className="p-6 bg-surface-container-low rounded-xl col-span-2 border border-outline-variant/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Provenance</p>
          </div>
          <p className="text-sm text-on-surface-variant leading-snug">
            Acquired directly from the artist&apos;s studio. Includes a signed Certificate of Authenticity and complete exhibition history (Berlin, 2023).
          </p>
        </div>
      </div>
    </div>
  );
}
