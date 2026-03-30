import React from 'react';

export default function ArtistNotes() {
  return (
    <section className="mt-24 pt-24 border-t border-outline-variant/10">
      <h2 className="text-3xl font-bold font-headline text-primary mb-12">Artist&apos;s Studio Notes</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <p className="text-xl font-light text-on-surface-variant leading-relaxed italic">
            &quot;The texture in the upper quadrant was achieved by mixing marble dust with cold wax and pigment. I wanted to create a surface that felt as though it had been weathered by centuries of wind, reflecting the &apos;nomad&apos; theme—something that has traveled far but remains structurally sound.&quot;
          </p>
        </div>
        
        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-extrabold uppercase tracking-widest text-outline mb-4">Technical Info</h4>
            <ul className="text-sm space-y-3 text-on-surface">
              <li className="flex justify-between items-center border-b border-outline-variant/5 pb-2">
                <span>Frame</span> 
                <span className="text-outline">Unframed (Gallery Wrapped)</span>
              </li>
              <li className="flex justify-between items-center border-b border-outline-variant/5 pb-2">
                <span>Varnish</span> 
                <span className="text-outline">Satin UV Protection</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Weight</span> 
                <span className="text-outline">12.5 lbs / 5.7 kg</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
