'use client';

import React from 'react';
import Image from 'next/image';

export default function ArtworkCarousel() {
  const thumbnails = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAHC8_QyVCuendN8WB07--Km9gdnwdNzlt5fZbJaX1QW60w-xWtCNXz8EEd6qT4zM_C44fO8WTJuGHrKS640CdsIrwQsLEFE8nY3mqX2KzKcWmZaGdJJI06uu9wCy5zA5CNkHZSElKvtUt95r-iJEgtb4EI9jAaDnWv3z3A0wIXiaQP3dno34sZCIoOCjmuARPYsdWidH6LeX7ZqwxeHkvToX_E-NdBvvK2bsC9Y5RoMIQrdlRKwIy2j8eowmGbsuQtgVIkv0a9v24",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBFOFuWZ1MWgP753tisCRIb7AQoZkDALxczqUqbBiErbQo2nFd8OqiUsqQcTK-lXUTVy4QoerFJpLXoXbFwrG73x-wJmn_NZISgwHwT8izyz-JbQHd2DhenOkTddQEPOJK5jCBe0OxcgrKc4xZteKMhEZdzcJfRI28lwUIKSEKHEVdSBVS6EjaMOYn1luNgykH9-phmKPsr5uOJGKT2vzcH6162SkMbRBtVgGluR-LJ4V9VNAOCsB2tuVCjaEXAFTI8vwU0TcnwXXg",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBBWguHfYC8AAJ9MQLmk8r2BuIj4Tg46WPtyb3Kz1-fKVUyXI9NGGrExsasFPRJgXkCNkqgsl5b78HPt1t5Py9fodELvzepiSWbrHMvmeeOfoKqkgGvVqI6JHvDnZXnFIDGO8HCcS8qb99eiZz-kgwK_BeKD6fOJcUC4-movuEacSMXmrcRlxsYh63MJiKiDjQcxCiJoS1NgAqlhsaaYK5FcUrkRvgzJGqC4vKt96kDSf7vgcib2-MBF8rQndQIJu9GbirF9wP9RoI"
  ];

  return (
    <section className="mb-20">
      <div className="relative group aspect-[16/9] w-full overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant/10">
        <Image 
          fill
          priority
          className="object-cover transition-transform duration-700 group-hover:scale-105" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2sSDR8qZ2lXuQbtuN4uHvbvtG6288J5EdA9HuU97iLdIAUYMVRJvmczq_DMzo9SOfatyBuxX6gWtt3okLF4WwbLrW89oQ7DmhKB9-Vn6DvZ2qEOpBanouop0u-7jCZW2ZLUVDM3tJSImpRd8ccRW3l8W4zqOQoGoFX6BPxX1IO-khtzn4sn1brXtDgYPOTCDRyOU1_5zNPpWe6fgck5N9__ycps1LT8_fns30gAM1q4wbu_4rZvhzE4P578iEIkDpX4MUddtozIY" 
          alt="The Ethereal Nomad" 
          sizes="100vw"
        />
        {/* Carousel Controls */}
        <button className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40">
          <span className="material-symbols-outlined">arrow_back_ios</span>
        </button>
        <button className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/40 leading-none">
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
        <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/30 backdrop-blur-md rounded-full text-white text-[10px] font-bold tracking-widest uppercase">
          Full Screen View
        </div>
      </div>
      
      {/* Thumbnail Strip */}
      <div className="mt-8 flex justify-center gap-4">
        {thumbnails.map((src, i) => (
          <button key={i} className={`w-20 h-20 rounded-lg overflow-hidden transition-all relative ${i === 0 ? 'ring-2 ring-primary' : 'hover:ring-2 hover:ring-outline-variant/40'}`}>
            <Image 
              fill
              className={`object-cover transition-opacity ${i === 0 ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
              src={src} 
              alt={`Thumbnail ${i + 1}`} 
              sizes="80px"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
