import React from 'react';
import Image from 'next/image';

interface ProfileHeaderProps {
  name: string;
  email: string;
  pieceCount: number;
}

const ProfileHeader: React.FC<Readonly<ProfileHeaderProps>> = ({ name, email, pieceCount }) => {
  const mockAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuANn3gCFPiNIRFQGA0_X35G__b7wORvD1Zf7GkMaN-ARFi8IaDnmNLV3UhKimNuZ1XmtWHBG9-QX05libfHUeRQHA2l_xQudRjQ-ObTWs848pZ7lQmokOXcyBG1ZOaDgLN3LNzO1jHJUNi5osiMr3H80CZx3nIJgfZUP8SFl_pKnDkN7xZm51pCa_gWluztpWD6m2S0DTeESC619qyxwi2hfE7TgixI4uCs0zn2vUjM1AKcQizEwWuiMwEDF8OVln3vFvh6IhJ6ZHA";

  return (
    <section className="bg-surface-container-low rounded-[2.5rem] p-8 md:p-16 border border-outline-variant/10 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
        {/* Avatar */}
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden ring-4 ring-white shadow-2xl relative border border-primary/10">
          <Image 
            fill
            className="object-cover"
            alt={name}
            src={mockAvatar}
            sizes="(max-width: 768px) 128px, 192px"
          />
        </div>

        {/* User Info */}
        <div className="flex-1 text-center md:text-left">
          <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full mb-4 inline-block">
            Verified Atelier Member
          </span>
          <h1 className="text-4xl md:text-6xl font-headline font-extrabold tracking-tighter text-on-surface mb-2 italic">
            {name}
          </h1>
          <p className="text-on-surface-variant/70 text-lg mb-6">{email}</p>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <button type="button" className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
              Edit Profile
            </button>
            <button type="button" className="bg-surface-container-highest px-8 py-3 rounded-full font-bold text-sm hover:bg-surface-container-high transition-colors">
              Studio Settings
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/5 text-center shadow-sm">
            <p className="text-2xl font-headline font-black text-primary">{pieceCount}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Pieces</p>
          </div>
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/5 text-center shadow-sm">
            <p className="text-2xl font-headline font-black text-primary">0</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Likes</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
