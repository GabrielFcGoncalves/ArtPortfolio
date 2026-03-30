'use client';

import React, { useState } from 'react';
import Navbar from '@/components/navbar/Navbar';
import DashboardHero from '@/components/dashboard/DashboardHero';
import FeaturedPieceWithComment from '@/components/dashboard/FeaturedPieceWithComment';
import ArtworkPriceCard from '@/components/dashboard/ArtworkPriceCard';
import NewsBlock from '@/components/dashboard/NewsBlock';
import StoryCard from '@/components/dashboard/StoryCard';
import CollectionCard from '@/components/dashboard/CollectionCard';
import MinimalCard from '@/components/dashboard/MinimalCard';
import NoticeCard from '@/components/dashboard/NoticeCard';
import DashboardFooter from '@/components/dashboard/DashboardFooter';
import { useModals } from '@/providers/ModalProvider';


/**
 * DashboardPage component for 'The Atelier' (Artist OS).
 * Orchestrates a dense, high-fidelity grid of studio insights and curated works.
 */
export default function DashboardPage() {
  const { openArtpieceModal } = useModals();

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen font-body overflow-x-hidden">
      {/* Platform Navigation */}
      <Navbar />

      <main className="pt-20 min-h-screen max-w-[1920px] mx-auto">
        {/* Cinematic Presentation */}
        <DashboardHero />
        
        {/* Dynamic Studio Grid */}
        <section className="px-8 md:px-12 pb-32 pt-16">
          <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-outline-variant/10 pb-12">
            <div className="max-w-xl">
              <h2 className="text-5xl font-headline font-extrabold text-on-surface tracking-tighter leading-tight">Curated Studio Glimpse</h2>
              <p className="text-on-surface-variant/80 mt-6 font-body text-base leading-relaxed">An organic selection of recent works currently residing in the studio archives. Each piece is hand-curated and authenticated by the atelier.</p>
            </div>
            <div className="flex gap-4 self-center md:self-end">
              <button 
                onClick={openArtpieceModal}
                className="flex items-center gap-3 px-8 py-3.5 bg-primary text-on-primary rounded-full hover:opacity-90 transition-all hover:scale-105 active:scale-95 group font-bold text-sm tracking-tight shadow-md"
              >
                Add New Piece
                <span className="material-symbols-outlined text-xl group-hover:scale-110 transition-transform text-white">add</span>
              </button>
              <button className="flex items-center gap-3 px-8 py-3.5 border border-outline-variant/30 rounded-full hover:bg-surface-container-low transition-all hover:scale-105 active:scale-95 group font-bold text-sm tracking-tight text-on-surface">
                Filter Archives
                <span className="material-symbols-outlined text-xl group-hover:rotate-180 transition-transform">tune</span>
              </button>
            </div>
          </header>

          {/* 12-Column Responsive Grid */}
          <div className="grid grid-cols-12 gap-8 lg:gap-12">
            
            {/* ROW 1: Hero Featured Piece + Comment */}
            <FeaturedPieceWithComment 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuAIoNUroDT4U7LmXv14GX34vwdrb9QmAXdM2wGZdvBHEEYQzsMZFcHxGmQAPTtWkvb1OG_simGBd8AarE5k7Yxii2KGvXuLOjwB1f5FQqzLO13ahdq3NIusyen_sLhWzlTyUrVzbbCZ4rN23fiqF7x7Hkc4dVZdVU0koX7kpQGwcL--DY13VGpf3IAKlZRagr0oae0IK8UheZfIRVOOJwsMsmP0CJkfO6nNQbnvYiYKPAREV5qWL3bN1cPSTl6jlwKcTIzzW8JoTBQ"
              title="Structure No. 04"
              year="2024"
              comment="The way the light anchors itself to the textures is nothing short of spiritual."
              author="Julian Thorne"
              authorRole="Collector"
              imageWidthClass="md:w-[62%]"
              commentWidthClass="md:w-[38%]"
            />

            {/* ROW 1: Small Priced Piece */}
            <ArtworkPriceCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBP92DW2f1zmSICW_h4zcqTywDlbtI9TU-tepQLoqyYvaSmHMI-zVdNnulv4x17wxyEvEqpc6l5rcebONqahQmPlpF5qnqe-MwW26Aws_jLV7neaIzOCvYczK-U2yKq7kzXqEbRX8YhklrbWMYk88-0p6xav1wrH2hdPIaVRK5MghsZphp97Rn0v1JxmTVN-j4UtROgDtDN5rItNFEpwyDLMQt2zB76jRW366ogWkKNg2gThrxrg5i2Q0EMNKRORiHrPBtC8lWyyko"
              title="Vase and Echo"
              edition="Edition 1 of 5"
              price="$1,200"
              id="vase-and-echo"
            />

            {/* ROW 1: Editorial Update */}
            <NewsBlock 
              title="Latest News"
              text="The upcoming 'Clay & Canvas' series is now entering final curation. Members get early access next week."
              linkText="Read Update"
              href="#"
            />

            {/* ROW 2: Featured Interview Story */}
            <StoryCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuCMbOKS8iDDlDJW56keyAVb8HQlesQf-SSpm5Hf9rDekWDRC6WMJp0MLo388R7VxDL2jeL6hNjv751CRRXDfWau180aOCarfv78llgRP0byDbEkBSFYuCldqjT48hoh9K0AoY_lvXqUHQfBAHvUkL2BLBg9N7OJ_xawhLmAuiJtGp1o7VvqYzVSyVSOgi5jVAuTr9Hckv1hf7WnNimQXTFe_OeaJYX2OpJbHeOkXwrLsrpq1gxuhhyExQykhdjgi4SREak8ME-9qs4"
              category="Featured Story"
              title="Landscape of Memory"
              description="Exploring the tactile nature of recall through grounding earth tones and deep pigments in the latest series."
              linkText="Read Interview"
            />

            {/* ROW 2: Trending Collection Spotlight */}
            <CollectionCard 
              image="https://lh3.googleusercontent.com/aida-public/AB6AXuBIt8BG_9CVC0u7Dczngov6pnZdO5RzyXSBwXjPRL_nIPD78wYc7QiXvRAmXNinl6QGlmD-K_CjZYVrsHxL8QTJFaw4-7n-AX3cq6S9iOIIY3XVOAgtp0AeJlxaPIQP9cbdXea3EfyHVb-WB9AUDCQbkmoBHh1mVerKb6D-4m4ZoGGfkqJ5CKEsFuTAqmmE90FVKkOWMz5b6Qoa-3jmCywTMB5mi6v_O9tInXZK_AhvJ2yaomP4lBwSARB-p4GBRezJPQyFW4AtcjM"
              tag="Top Pick"
              title="Metropolitan Series"
              count="4 Artworks Available"
            />

            {/* ROW 3: Dense Content Strip */}
            <div className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-8">
              <MinimalCard 
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuAMf2J5LP2FJjy0UXj_Z4gpKWcvBdR0sgtXfTIlUOij51WXPnsvs9P1AFqrjqgqIkre9T0opwPrcv_Ip95yY6jPHTAGGYxa9ByH8Cor2zEh5tcQKi9wH2M5ubf7CTPD0F2bz-B-FUNm3UrxvQNWh2N_v5HOp-NzYzs0Ky5ElN03mGfvPvmQ03p_k9AKYnHst5V07VXrVWwsn6SSJHf54MTOrnsKXLcewBDGBxNFXqoCHHlpX_5fYRqVvBy4vyZm9D2rqZTiIpmC0Qw"
                title="The Morning Bloom"
                subtitle="Study in Sage"
              />
              <MinimalCard 
                image="https://lh3.googleusercontent.com/aida-public/AB6AXuBh2IQo9xSGWPReIQUcUvHWw5NiKy1Wz2l1hBphbjj8lNo3icq5tXUox7HuwJ5We0mDQzLiqAoryUBb_xvKRqQ6RHcW0RCa-5DUfpmUIBaMbDJWmRX4TdyyTR5DnCeGXdisf4yjwC_v-jo-zDTWf-m0zi-Wp51dX9UE1J1SZjvWBRdpI5eMNVzjAX9svbnRAZndyD3XcPRpOtewjjQDRsefdVc8OGuCJ2EImVaeq_Q0fM2lAA0TU7-ZECy9v5WbazDLgPlQ18uR5r4"
                title="The Tools We Carry"
                subtitle="Studio Series"
              />
              <NoticeCard 
                title="Visit the Studio"
                description="Open for private viewings and deep-dives into the creative process every Thursday and Saturday. Sessions include a guided curation tour."
                buttonText="Book Private Session"
              />
            </div>

          </div>
        </section>
      </main>

      {/* Boutique Footer */}
      <DashboardFooter />

    </div>
  );
}
