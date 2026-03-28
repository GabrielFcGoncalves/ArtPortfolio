import React from 'react';

export default function SupportPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white mb-2">Support & Help Center</h1>
        <p className="text-neutral-400">Need help managing your commissions or account? We've got you covered.</p>
      </header>
      
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-emerald-400">Contact Us</h2>
        <p className="text-neutral-300 text-sm">
          For urgent inquiries regarding a commission or an active tournament bracket, 
          please email <strong>support@artistos.com</strong>.
        </p>
      </div>
    </div>
  );
}
