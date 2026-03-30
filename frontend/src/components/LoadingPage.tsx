import React from 'react';

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-surface text-on-surface z-[9999] font-body">
      {/* Animated Logo/Spinner */}
      <div className="relative w-20 h-20 mb-8">
        {/* Outer Ring */}
        <div className="absolute inset-0 border-4 border-primary/10 rounded-2xl" />
        {/* Spinning Element */}
        <div className="absolute inset-0 border-t-4 border-primary rounded-2xl animate-spin shadow-[0_0_15px_rgba(122,86,66,0.1)]" />
        
        {/* Inner Symbol */}
        <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-primary font-headline italic">A</span>
        </div>
      </div>

      {/* Loading Text */}
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-xl font-bold tracking-tight text-on-surface font-headline italic">
            Atelier is Initializing...
        </h2>
        <div className="flex gap-1.5 mt-2">
          {[0, 1, 2].map((i) => (
            <div 
              key={i} 
              className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-pulse" 
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
    </div>
  );
}
