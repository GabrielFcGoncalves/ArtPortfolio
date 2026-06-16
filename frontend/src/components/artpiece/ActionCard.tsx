import React from 'react';

interface ActionCardProps {
  isOwner?: boolean;
  isEditing?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
  isSaving?: boolean;
  onRequestCommission?: () => void;
}

export default function ActionCard({
  isOwner,
  isEditing,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  isSaving,
  onRequestCommission
}: Readonly<ActionCardProps>) {
  if (isOwner) {
    return (
      <aside className="lg:col-span-5 sticky top-24">
        <div className="p-10 bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(122,86,66,0.06)] border border-outline-variant/10 space-y-8">
          <div className="space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-outline">Creator Control Panel</span>
            <h3 className="text-xl font-extrabold font-headline text-primary">Studio Actions</h3>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              As the owner of this artwork, you can manage its metadata details or delete it permanently from the portfolio stack.
            </p>
          </div>

          <div className="space-y-4 pt-4 border-t border-outline-variant/20">
            {isEditing ? (
              <>
                <button
                  onClick={onSave}
                  disabled={isSaving}
                  className="w-full py-4 bg-tertiary text-on-tertiary rounded-lg font-bold tracking-tight hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <div className="w-5 h-5 border-2 border-on-tertiary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">save</span>
                      Save Changes
                    </>
                  )}
                </button>
                <button
                  onClick={onCancel}
                  disabled={isSaving}
                  className="w-full py-4 bg-surface-container-low text-on-surface border border-outline-variant/30 rounded-lg font-bold tracking-tight hover:bg-surface-container-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <span className="material-symbols-outlined">cancel</span>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={onEdit}
                  className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold tracking-tight hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">edit</span>
                  Edit Details
                </button>
                <button
                  onClick={onDelete}
                  className="w-full py-4 bg-error-container text-on-error-container hover:bg-error/20 border border-error/30 rounded-lg font-bold tracking-tight transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-error">delete</span>
                  Delete Artwork
                </button>
              </>
            )}
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="lg:col-span-5 sticky top-24">
      <div className="p-10 bg-surface-container-lowest rounded-2xl shadow-[0_10px_40px_rgba(122,86,66,0.06)] border border-outline-variant/10 space-y-8">
        <div className="flex justify-between items-baseline">
          <span className="text-sm font-medium text-outline">Listing Price</span>
          <span className="text-4xl font-extrabold font-headline text-primary">$2,400</span>
        </div>
        
        <div className="space-y-4">
          <button className="w-full py-4 bg-tertiary text-on-tertiary rounded-lg font-bold tracking-tight hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">shopping_cart</span>
            Buy Now
          </button>
          <button className="w-full py-4 bg-primary text-on-primary rounded-lg font-bold tracking-tight hover:opacity-95 transition-all shadow-sm flex items-center justify-center gap-2">
            <span className="material-symbols-outlined">mail</span>
            Inquire via Message
          </button>
          {onRequestCommission && (
            <button
              onClick={onRequestCommission}
              className="w-full py-4 bg-secondary text-on-secondary rounded-lg font-bold tracking-tight hover:opacity-90 transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined">palette</span>
              Request Commission
            </button>
          )}
        </div>

        <div className="pt-6 border-t border-outline-variant/20 space-y-4">
          <div className="flex items-center gap-3 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">local_shipping</span>
            <span>Secure Worldwide Shipping</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">security</span>
            <span>Transaction Protection & Insurance</span>
          </div>
        </div>

        <div className="p-4 bg-secondary-fixed/30 rounded-lg">
          <p className="text-xs font-semibold text-secondary leading-tight line-clamp-2">
            Interest in this piece is high. 3 other collectors have inquired in the last 24 hours.
          </p>
        </div>
      </div>
    </aside>
  );
}
