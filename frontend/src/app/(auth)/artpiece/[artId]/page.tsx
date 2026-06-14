'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import ArtworkCarousel from '@/components/artpiece/ArtworkCarousel';
import ArtworkDetails from '@/components/artpiece/ArtworkDetails';
import ActionCard from '@/components/artpiece/ActionCard';
import ArtistNotes from '@/components/artpiece/ArtistNotes';
import CollectorCommunity from '@/components/artpiece/CollectorCommunity';
import ArtPieceFooter from '@/components/artpiece/ArtPieceFooter';

/**
 * ArtPiecePage component.
 * Displays a detailed view of a specific artwork/collectible.
 */
export default function ArtPiecePage() {
  const { artId } = useParams();

  // In a real app, you would fetch artwork data based on artId.
  // For now, we are using the mocked 'The Ethereal Nomad' data.

  return (
    <div className="bg-surface text-on-surface-variant min-h-screen selection:bg-primary-container selection:text-on-primary-container">
      <main className="pt-24 pb-32 max-w-screen-xl mx-auto px-6">
        {/* Visual Presentation */}
        <ArtworkCarousel />

        {/* Content & Action Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Main Context */}
          <ArtworkDetails />

          {/* Commerce & Interaction */}
          <ActionCard />
        </div>

        {/* Insights & Context */}
        <ArtistNotes />

        {/* Community & Feedback */}
        <CollectorCommunity />
      </main>

      {/* Boutique Footer */}
      <ArtPieceFooter />
    </div>
  );
}
