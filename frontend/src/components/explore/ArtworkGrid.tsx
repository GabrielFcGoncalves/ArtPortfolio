'use client';

import React from 'react';
import ArtworkCard from './ArtworkCard';

const ARTWORKS = [
  { 
    title: "Ethereal Equilibrium", 
    artist: "Elena Vance", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAsjMbA2kwmhHJ8OeEosiRV34rTLES65RK4CYISTEUX5057sYS_dKe7cqauIZsIVv6FdTYyM416BULEHnAYRrVUIfL09SW2dN4h-sKjayyjyis45eqsm7oy79IMe1G7gVo7eD9ggp-e0E6VvFmW1Tdhjdsr29n5ajRSJtidRchNCKyM8Xe-Jw-KN5OOjFR0ntm2UPd5caYjLjQdQVLogXKYMtiaUQ_9EWktdcGTPjQx2VLrXEyxf5GUcLqf3KePxp990j5GMrx_jYo", 
    views: "1.2k", 
    likes: "458" 
  },
  { 
    title: "Obsidian Monolith", 
    artist: "Marcus Thorne", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjWEvuDw857Y5IBCw2u2YdtPYb1_DIya3vrTwtOL9177eZ4Bi14E9XcQJOwLcYFJkJci4yeCTdfWOcI1OnsQbeA-9h1i27CSm3lbr-ck3LSBt_OKt5cORxWBCmedz_p0roQLDGUVNU7bCGx23erWRLM9l3zOdricCmvO1q-Z3w50jCMhRzVsf0A4pUbXIjqIoTTSVwGZnq_udO_koqp0AdZkLX2IBVMtHszsR0__pBLG2KFmpuqBkyPG_tRBaoXecPPsCUKpIfF_g", 
    views: "892", 
    likes: "124" 
  },
  { 
    title: "Textural Whispers", 
    artist: "Sarah Jenkins", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRK70hTHIZwSDFRD0yiHUfUHtgINqj17Cnh9_PbqU12HORVOjsW4YZpMEQU3eoX5rfStk44oMfS4UChN--6N0LZADdx_zueuupvQQ1iWI-LSbDO-fyVOI7wVS-P9qOtsircO1mB2vEyWjJ-BSddfAjO2CH_Dmd43S54u_k5_Oz5N4VQyXfddZ2-6S8MUryReVkcedffLOg2q9bVpmyy3Xc4cYGTHKqveWHENE3KkIkdT4EbW7cFsYCRWpTW3wazqvFwp8AfRU8b-8", 
    views: "2.4k", 
    likes: "1.1k",
    isLiked: true
  },
  { 
    title: "Curvilinear Form No. 4", 
    artist: "Arlo Studio", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAdKUfVlxig8p6kyTduQOmf5i10VuSFiFwaFfiLCpGj-AjpfcEo8EQlnZ5HnrT7O2QBbtu5Z2hjffmqfE5gm41cTLfoGP47TIxJcr9mFQCqogCWZVAfS7Dj3b1t2y2mJ5QV4I41fhvbc4FpRaOwHmgnNlEDfiY0KcfUmzV_gMMtpfRGakPWgdvAJVm9tOe9Ee94awMOtrpK4PH3yODFZiqb8Xqy-tKTT4My4gX05bMAmf5zwA9tPvyW0ThyVK0oZ5GuqX11i8pF78", 
    views: "543", 
    likes: "89" 
  },
  { 
    title: "Neon Meridian", 
    artist: "Kaelen Voss", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB5aBZo74auc5Erk2ytfOcyBrEyBDH8q0zAIbr5kv7PGahdLPtrKJfYFbD4BNuW7SgBxh0WT5CAME8t5K3C2Nx3SVM1tAp3NMmRI0KkwGFS2D_b34O48WTgVxVNrYDC2bRn2Mup0JC1_-eYX18mtRcscXjh4HdbcWBTtU_ruW4L8Sj9uvrj-ADdJyHMi9VcqvHDmDhDyVLR8fdtSRE4D_HA-vJ9nq8Jo8Pw45eKR3OQJo1N0vGrz5EEc3hjl-eZZjt6icFt5F-IfUY", 
    views: "3.1k", 
    likes: "962" 
  },
  { 
    title: "Shadow Play", 
    artist: "Hiroshi T.", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIpVsWHvvBl3_b-KeLaMQnopS01HU-BrWP-Asv5VToid44Cy8afLvsOzubPHRxgFgNodNfr9yFDRy-ZcaxRSltN1DUHLsMvuZWd2UgPeWpAf-xe9288JkRrOCgSgcdJ0F-wGZt1JZFCuG2jxVlySn0dI6hqhdHz_E-14CVHKwgAG2gx5gLoyOv_vNHp_Y2cEMe35PhcMvqQvNmFVdKEchXN0HXbZWzauN7cjfS9io3zwQrKeukcQpdPAQcRt2C-OrCFlm-PHoT0Ac", 
    views: "1.5k", 
    likes: "312" 
  },
  { 
    title: "Midnight Aurora", 
    artist: "Sophia Chen", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCr4gij0AqAr8IUuow7ydyOmoCM7MqSiHimCCLX3vILE0Ig-pvPbVoOVPL_ENaSQ5IAvkzM4xQ-eVNQknktE5YvXzTuXXgiS8wL-QZ79jA8xTUUJNawTg-G4wBainCjBS8N9IeKLRgCj05BpFaky7mYJvZnPCzpOXE2aHNoqbDBBfAVkmDUIPx6J1p_sfvT4UJISREUqpt74AUwkKELWoulxXeHacLtcRVEGCaHmMR7tQqv8vWdBJ1W1DMeJXM6smitZDpXBBcDDDQ", 
    views: "9.2k", 
    likes: "4.5k" 
  },
  { 
    title: "Atelier No. 12", 
    artist: "J. Sterling", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAosJpgDvJotOHX8K3xq1vPajb10stOveSjpBFbmt1BmXTCa3vi2QIrSluWMeEGD2G8lEHTsVCTtaE_tS9EXMRlqGjcPT7sUfp2NyD7WglEEdCmDRElGY4cT0vEB7DN8v4RLDMqO5__1JdJDji7m_7cvCZwimq37FvygThBg57yIweD0_D_1QB9ulW5Hu70mEEgR9g55YeuvR_gAWEHRnbnTbJs5WUt8r1haM0zDdZdPwCTmWtjTG8IcmI4fTX0lCTERGL5EjkQpN8", 
    views: "1.1k", 
    likes: "233" 
  },
  { 
    title: "Fractal Sunset", 
    artist: "Digital Nomad", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDqy1FzjgxwuH3ASpe-2yAXB51xbTlB11JY9doFY59Swc6pbLAHet5qfiCG2wMxVxZsGgN1QqwoYkgKLq3MoKNaBWtUCJZxdh7ntRytjZB5V8MZlA1hjyW_nbZaR0ihiB88aXMRqhSw7HWYGwMqboEHhTPOkJUYD2XPnpf9F6F4Y08aakUz8tLl3m3QseBxcwALjTzqbCgJqf7LY2PR0rklAvWLBGFkdu1_IdUZQ6Tsm5pwe4JHQIfT0NKCeQk__EqmD5OAG6TagKU", 
    views: "4.3k", 
    likes: "821" 
  },
  { 
    title: "Botanical Etching", 
    artist: "Vera Bloom", 
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAtoGmV-haG7MlLPJpQf-QeukndLQVGdHiwBpi-8Rp4JN1UhfsEFENGSq1IQOrgEVvdhIVqcpcKK0XVeq81jT75PuJB9Y7xFc18JObuBUKDUmDChgc2GFtZtm0kHwFixC_eNlus26V69Ec4s9kdmBwpC6cUTW3S5qKfztP6T7BcWL6fnCqNe_OPMJewwCA8Rq8eOPAZqtuaBe-6ufbO-5e1xRdm-Lw0RxB11ISKjqyNQpWk2ml0bYKa_-L6FaQM3jCTkOYM4UD2VIs", 
    views: "622", 
    likes: "154" 
  }
];

export default function ArtworkGrid() {
  return (
    <section className="px-8 py-10 bg-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-12">
        {ARTWORKS.map((artwork, idx) => (
          <ArtworkCard key={idx} {...artwork} />
        ))}
      </div>
      {/* Continuous Scroll Indicator */}
      <div className="mt-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
        <p className="text-[10px] font-bold tracking-widest uppercase text-on-surface-variant/40">Curating more works</p>
      </div>
    </section>
  );
}
