'use client';

import React from 'react';

interface NewsBlockProps {
  title: string;
  text: string;
  linkText: string;
  href: string;
}

export default function NewsBlock({ title, text, linkText, href }: NewsBlockProps) {
  return (
    <div className="col-span-12 md:col-span-6 lg:col-span-2">
      <div className="h-full flex flex-col justify-center p-8 bg-primary-fixed-dim/10 rounded-2xl border border-primary-fixed-dim/20 shadow-sm">
        <h4 className="font-headline font-extrabold text-[10px] uppercase tracking-[0.2em] text-primary mb-4">{title}</h4>
        <p className="text-on-surface-variant font-body text-sm leading-relaxed mb-6 italic">
          &quot;{text}&quot;
        </p>
        <a 
          href={href} 
          className="mt-auto text-xs font-bold text-primary flex items-center gap-2 hover:translate-x-1 transition-transform"
        >
          {linkText} 
          <span className="material-symbols-outlined text-[14px]">north_east</span>
        </a>
      </div>
    </div>
  );
}
