'use client';

import React from 'react';

interface NoticeCardProps {
  title: string;
  description: string;
  buttonText: string;
}

export default function NoticeCard({ title, description, buttonText }: NoticeCardProps) {
  return (
    <div className="bg-tertiary-fixed p-10 rounded-[2.5rem] flex flex-col justify-between shadow-lg border border-primary/10">
      <div>
        <h4 className="font-headline font-extrabold text-on-tertiary-container text-2xl tracking-tighter">{title}</h4>
        <p className="text-on-tertiary-container/80 text-sm mt-6 font-body leading-relaxed">{description}</p>
      </div>
      <button className="mt-12 w-fit px-8 py-3 bg-on-tertiary-container text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl">
        {buttonText}
      </button>
    </div>
  );
}
