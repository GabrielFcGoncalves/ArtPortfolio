'use client';

import React, { useState, useRef } from 'react';
import { commissionService } from '@/services/api_client';

interface CommissionRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  artistId: string;
  artistUsername: string;
}

export default function CommissionRequestModal({
  isOpen,
  onClose,
  artistId,
  artistUsername
}: Readonly<CommissionRequestModalProps>) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxFiles = 5;
    const totalFiles = attachedFiles.length + files.length;
    if (totalFiles > maxFiles) {
      setError(`Maximum ${maxFiles} reference images allowed.`);
      return;
    }

    const validFiles = files.filter(f => f.type.startsWith('image/'));
    if (validFiles.length !== files.length) {
      setError('Only image files are allowed as references.');
      return;
    }

    setError(null);
    setAttachedFiles(prev => [...prev, ...validFiles]);

    validFiles.forEach(file => {
      const url = URL.createObjectURL(file);
      setPreviewUrls(prev => [...prev, url]);
    });
  };

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);
    setAttachedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!title.trim()) {
      setError('Please enter a title for your commission request.');
      return;
    }
    if (!description.trim()) {
      setError('Please describe what you would like commissioned.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // For now, reference images are passed as data URLs.
      // In production, these would be uploaded to storage first.
      const referenceImageUrls: string[] = [];
      for (const file of attachedFiles) {
        const dataUrl = await fileToDataUrl(file);
        referenceImageUrls.push(dataUrl);
      }

      await commissionService.createCommission({
        artist_id: artistId,
        title: title.trim(),
        description: description.trim(),
        reference_image_urls: referenceImageUrls.length > 0 ? referenceImageUrls : undefined,
      });

      setSubmitted(true);
    } catch (err: any) {
      console.error('Failed to submit commission:', err);
      setError(err?.response?.data?.message || 'Failed to submit commission. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setTitle('');
    setDescription('');
    setAttachedFiles([]);
    setPreviewUrls([]);
    setError(null);
    setSubmitted(false);
    onClose();
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4">
        <div className="bg-surface w-full max-w-lg rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.15)] overflow-hidden">
          <div className="p-12 text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-tertiary-container rounded-full flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-on-tertiary-container">check_circle</span>
            </div>
            <h2 className="text-2xl font-headline font-extrabold text-on-surface">Commission Submitted</h2>
            <p className="text-on-surface-variant leading-relaxed">
              Your commission request has been sent to <span className="font-semibold text-primary">{artistUsername}</span>.
              You will be notified once they respond.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 px-10 py-3 bg-primary text-on-primary rounded-full font-bold text-sm hover:opacity-90 transition-all active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-on-surface/40 backdrop-blur-sm p-4 md:p-8">
      <div className="bg-surface w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-[0_20px_80px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-8 py-6 border-b border-outline-variant/15 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-outline block mb-1">New Commission</span>
            <h2 className="text-xl font-headline font-extrabold text-on-surface tracking-tight">
              Request from <span className="text-primary">{artistUsername}</span>
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center hover:bg-surface-container-highest transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-on-surface-variant">close</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Title Field */}
          <div className="space-y-2">
            <label htmlFor="commission-title" className="text-xs font-bold uppercase tracking-widest text-outline">
              Commission Title
            </label>
            <input
              id="commission-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Portrait of my pet, Fantasy landscape..."
              className="w-full px-5 py-3.5 bg-surface-container-low border border-outline-variant/20 rounded-xl text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all font-body"
              maxLength={120}
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="commission-description" className="text-xs font-bold uppercase tracking-widest text-outline">
              Description
            </label>
            <textarea
              id="commission-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what you would like the artist to create. Include details about style, colors, composition, dimensions, and any specific requirements..."
              rows={5}
              className="w-full px-5 py-3.5 bg-surface-container-low border border-outline-variant/20 rounded-xl text-on-surface text-sm placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all resize-none font-body leading-relaxed"
              maxLength={2000}
            />
            <p className="text-[10px] text-outline text-right">{description.length}/2000</p>
          </div>

          {/* Reference Images */}
          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-outline">
              Reference Images <span className="text-on-surface-variant/50 font-normal normal-case">(optional, max 5)</span>
            </label>

            {/* Preview Grid */}
            {previewUrls.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {previewUrls.map((url, index) => (
                  <div key={url} className="relative group aspect-square rounded-xl overflow-hidden border border-outline-variant/15 shadow-sm">
                    <img src={url} alt={`Reference ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeFile(index)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-on-surface/70 text-surface rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-on-surface/90"
                      aria-label="Remove image"
                    >
                      <span className="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Button */}
            {attachedFiles.length < 5 && (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-4 border-2 border-dashed border-outline-variant/30 rounded-xl text-on-surface-variant hover:border-primary/40 hover:bg-primary/5 transition-all flex items-center justify-center gap-2 group"
              >
                <span className="material-symbols-outlined text-xl group-hover:text-primary transition-colors">add_photo_alternate</span>
                <span className="text-sm font-medium group-hover:text-primary transition-colors">Add Reference Images</span>
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-error-container/30 border border-error/20 rounded-xl">
              <p className="text-sm text-error font-medium">{error}</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 border-t border-outline-variant/15 flex items-center justify-end gap-4 shrink-0 bg-surface-container-lowest">
          <button
            onClick={handleClose}
            disabled={isSubmitting}
            className="px-8 py-3 bg-surface-container-high text-on-surface rounded-full font-bold text-sm hover:bg-surface-container-highest transition-all disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting || !title.trim() || !description.trim()}
            className="px-8 py-3 bg-primary text-on-primary rounded-full font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-lg">send</span>
                Submit Request
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
