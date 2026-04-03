import React from 'react';
import { useArtpieceForm } from '@/lib/context/ArtpieceContext';

interface SaleStatusSettingsProps {
  errors: { price?: string };
}

export function SaleStatusSettings({ errors }: SaleStatusSettingsProps) {
  const { formData, updateField } = useArtpieceForm();
  const { saleStatus, price } = formData.publish;

  return (
    <section className="space-y-4">
      <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Sale Status</h3>
      <div className="space-y-3">
        {/* Option: Showcase */}
        <div onClick={() => updateField('publish.saleStatus', 'showcase')} className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors ${saleStatus === 'showcase' ? 'bg-surface-container-high' : 'bg-surface-container-low hover:bg-surface-container-high'}`}>
          <input type="radio" name="sale_status" checked={saleStatus === 'showcase'} readOnly className="w-4 h-4 text-primary" />
          <label className="ml-4 flex-1 cursor-pointer">
            <span className="block font-bold text-on-surface">Showcase Only</span>
            <span className="block text-xs text-on-surface-variant">Display without purchase options. Useful for archival work.</span>
          </label>
        </div>

        {/* Option: Fixed Price */}
        <div onClick={() => updateField('publish.saleStatus', 'fixed')} className={`p-4 rounded-xl cursor-pointer transition-all border ${saleStatus === 'fixed' ? 'bg-surface-container-lowest border-primary shadow-sm' : 'bg-surface-container-low border-transparent hover:bg-surface-container-high'}`}>
          <div className="flex items-start mb-4">
            <input type="radio" name="sale_status" checked={saleStatus === 'fixed'} readOnly className="mt-1 w-4 h-4 text-primary" />
            <label className="ml-4 flex-1 cursor-pointer">
              <span className="block font-bold text-on-surface">Fixed Price</span>
              <span className="block text-xs text-on-surface-variant">Set a specific value for instant acquisition.</span>
            </label>
          </div>
          {saleStatus === 'fixed' && (
            <div className={`ml-8 flex items-center bg-surface-container-low rounded-lg px-4 py-2 border ${errors.price ? 'border-error' : 'border-transparent'}`}>
              <span className="text-primary font-bold mr-2 font-headline">$</span>
              <input 
                type="number" 
                value={price} 
                onChange={(e) => updateField('publish.price', e.target.value)} 
                placeholder="0.00" 
                className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-headline font-bold text-lg p-0" 
              />
              <span className="text-xs font-bold text-outline-variant ml-2 uppercase">USD</span>
            </div>
          )}
          {saleStatus === 'fixed' && errors.price && <p className="ml-8 mt-2 text-error text-[11px] font-bold">{errors.price}</p>}
        </div>

        {/* Option: Commissions */}
        <div onClick={() => updateField('publish.saleStatus', 'commissions')} className={`flex items-center p-4 rounded-xl cursor-pointer transition-colors ${saleStatus === 'commissions' ? 'bg-surface-container-high' : 'bg-surface-container-low hover:bg-surface-container-high'}`}>
          <input type="radio" name="sale_status" checked={saleStatus === 'commissions'} readOnly className="w-4 h-4 text-primary" />
          <label className="ml-4 flex-1 cursor-pointer">
            <span className="block font-bold text-on-surface">Open for Commissions</span>
            <span className="block text-xs text-on-surface-variant">Invite collectors to discuss custom variations.</span>
          </label>
        </div>
      </div>
    </section>
  );
}
