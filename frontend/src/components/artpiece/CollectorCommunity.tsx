'use client';

import React from 'react';
import Image from 'next/image';

const COMMENTS = [
  {
    author: "Julian Thorne",
    role: "Verified Collector",
    time: "4h ago",
    text: "The use of negative space here is breathtaking. It really captures that feeling of solitude without being lonely.",
    likes: 12,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuA3p9Xk49qhRWeCFQaplDv8P_oIxdkd-CuVjZ_EScF3XqPL1hS49rOBFQlaCc9d9vTL2_4xy_3Dch9Ry6Fe5JxzPoQzXIHUX2GYtuxH5uB4hgtjHQt2pbAbjgcvQksOtXqlllRY5f8iGCDVHQDfEcmIHQ5YThG8106sGvJi6_3wdBhtPGk-TC3oIGw_CjXNdBKp_nJV92U-Wr38MFiY3ukVmlx4vOXstNqCQPyzfuHwmwb6O9RwYfS9mBC86gbi28rtUdMGSr0vlHI"
  },
  {
    author: "Sarah Mendez",
    role: "Art Critic",
    time: "1d ago",
    text: "Volkov’s palette has shifted toward more organic tones in this series. A masterful evolution from her 2022 collection.",
    likes: 8,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfvmF3lRixNfayIR37pz8HbrKUNuCbVI_LgKTXVYIMOA_w4YSDn2HecUEt6krtkuKi1B49KzALloaxRA_atMSOX0n4etE1AISWUXhD162WcQgthjFFU3MeLO7aiDE4PlJiU95QCCBwCPxkGj66imBiReolDHcu54nEGzHZEJ1S7jGSWSd8MKlu1Peq-aJMhDV2U97dA702HeWeLn_jDZXbPShWn5E8EgWt6-wDx1Y4MnOfKw_8BNozbh1HMNTh-NcDhoTfs0vk26w"
  }
];

export default function CollectorCommunity() {
  return (
    <section className="mt-24 bg-surface-container-low rounded-[2rem] p-8 md:p-12 border border-outline-variant/10">
      <div className="max-w-3xl mx-auto">
        <h3 className="text-2xl font-bold font-headline text-primary mb-8">Collector Community</h3>
        
        {/* Comment Input */}
        <div className="mb-12">
          <label className="block text-xs font-bold uppercase tracking-widest text-outline mb-3">Join the conversation</label>
          <div className="relative">
            <textarea 
              className="w-full bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-6 text-sm focus:ring-1 focus:ring-primary outline-none transition-all resize-none h-32 placeholder:text-outline/40 shadow-inner" 
              placeholder="Share your thoughts on this work..."
            />
            <button className="absolute bottom-4 right-4 py-2 px-6 bg-primary text-on-primary rounded-lg text-xs font-bold transition-transform active:scale-95 hover:bg-primary/90">
              Post Comment
            </button>
          </div>
        </div>

        {/* Comment List */}
        <div className="space-y-10">
          {COMMENTS.map((comment, i) => (
            <div key={i} className="flex gap-4 group">
              <div className="w-10 h-10 rounded-full overflow-hidden relative border border-outline-variant/10 shrink-0">
                <Image 
                  fill
                  className="object-cover grayscale hover:grayscale-0 transition-grayscale duration-500" 
                  src={comment.avatar} 
                  alt={comment.author} 
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-bold text-on-surface">{comment.author}</span>
                  <span className="text-[10px] text-outline font-semibold uppercase tracking-wider">{comment.role}</span>
                  <span className="text-[10px] text-outline/60 ml-auto">{comment.time}</span>
                </div>
                <p className="text-sm text-on-surface-variant leading-relaxed font-light">{comment.text}</p>
                <div className="mt-3 flex gap-6">
                  <button className="text-[10px] font-bold text-primary flex items-center gap-1.5 hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span> 
                    {comment.likes}
                  </button>
                  <button className="text-[10px] font-bold text-outline hover:text-primary transition-colors">Reply</button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <button className="text-sm font-bold text-primary hover:underline underline-offset-4 transition-all decoration-primary/30">
            Load more comments
          </button>
        </div>
      </div>
    </section>
  );
}
