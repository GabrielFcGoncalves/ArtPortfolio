'use client';

import React from 'react';
import Image from 'next/image';
import { useKeycloak } from '@react-keycloak/web';
import Navbar from '@/components/navbar/Navbar';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import { useModals } from '@/providers/ModalProvider';

export default function ProfilePage() {
  const { keycloak } = useKeycloak();
  const { openArtpieceModal } = useModals();
  const user = keycloak.idTokenParsed;

  // Use Keycloak info or fallback to defaults
  const name = user?.name || user?.preferred_username || "Artist Guest";
  const email = user?.email || "No email provided";
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  const mockAvatar = "https://lh3.googleusercontent.com/aida-public/AB6AXuANn3gCFPiNIRFQGA0_X35G__b7wORvD1Zf7GkMaN-ARFi8IaDnmNLV3UhKimNuZ1XmtWHBG9-QX05libfHUeRQHA2l_xQudRjQ-ObTWs848pZ7lQmokOXcyBG1ZOaDgLN3LNzO1jHJUNi5osiMr3H80CZx3nIJgfZUP8SFl_pKnDkN7xZm51pCa_gWluztpWD6m2S0DTeESC619qyxwi2hfE7TgixI4uCs0zn2vUjM1AKcQizEwWuiMwEDF8OVln3vFvh6IhJ6ZHA";

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen font-body">
      <Navbar />

      <main className="pt-24 pb-32 max-w-7xl mx-auto px-8">
        {/* Profile Header */}
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
                <button className="bg-primary text-on-primary px-8 py-3 rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Edit Profile
                </button>
                <button className="bg-surface-container-highest px-8 py-3 rounded-full font-bold text-sm hover:bg-surface-container-high transition-colors">
                  Studio Settings
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/5 text-center shadow-sm">
                <p className="text-2xl font-headline font-black text-primary">12</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Pieces</p>
              </div>
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-outline-variant/5 text-center shadow-sm">
                <p className="text-2xl font-headline font-black text-primary">2.4k</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Views</p>
              </div>
            </div>
          </div>
        </section>

        {/* Gallery Preview (Mocked) */}
        <section className="mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-outline-variant/10 pb-8 gap-6">
            <div>
              <h2 className="text-3xl font-headline font-bold text-on-surface tracking-tighter italic">Your Studio Archives</h2>
              <p className="text-on-surface-variant/60 text-sm mt-2">Curated works previously shared with the community.</p>
            </div>
            <button 
              onClick={openArtpieceModal}
              className="flex items-center gap-2 bg-tertiary-container text-on-tertiary-container px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-md"
            >
              <span className="material-symbols-outlined text-lg">add_circle</span>
              Add New Piece
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="group cursor-pointer">
                <div className="aspect-square rounded-2xl overflow-hidden bg-surface-container-high relative mb-4 border border-outline-variant/10">
                  <Image 
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700 grayscale-[0.2] group-hover:grayscale-0"
                    src={`https://lh3.googleusercontent.com/aida-public/AB6AXuAMf2J5LP2FJjy0UXj_Z4gpKWcvBdR0sgtXfTIlUOij51WXPnsvs9P1AFqrjqgqIkre9T0opwPrcv_Ip95yY6jPHTAGGYxa9ByH8Cor2zEh5tcQKi9wH2M5ubf7CTPD0F2bz-B-FUNm3UrxvQNWh2N_v5HOp-NzYzs0Ky5ElN03mGfvPvmQ03p_k9AKYnHst5V07VXrVWwsn6SSJHf54MTOrnsKXLcewBDGBxNFXqoCHHlpX_5fYRqVvBy4vyZm9D2rqZTiIpmC0Qw`}
                    alt={`Studio Piece ${i}`}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h4 className="font-headline font-bold text-lg text-on-surface group-hover:text-primary transition-colors">Archive Sequence {i}</h4>
                <p className="text-[10px] text-outline font-bold uppercase tracking-widest mt-1">Mixed Media, 2024</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <DashboardFooter />
    </div>
  );
}
