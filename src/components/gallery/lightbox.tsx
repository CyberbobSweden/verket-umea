'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface MediaItem {
  id: string;
  storage_path: string;
  media_type: 'image' | 'video';
  caption: string | null;
}

export function Lightbox({
  items,
  index,
  onClose,
  onNavigate,
}: {
  items: MediaItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (i: number) => void;
}) {
  const goNext = useCallback(() => {
    if (index === null) return;
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (index === null) return;
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (index === null) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [index, onClose, goNext, goPrev]);

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={item.caption ?? 'Bildvisare'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <button
            onClick={onClose}
            aria-label="Stäng"
            className="absolute right-4 top-4 rounded-full border border-white/20 p-2 hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goPrev();
            }}
            aria-label="Föregående"
            className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-2 hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              goNext();
            }}
            aria-label="Nästa"
            className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 p-2 hover:bg-white/10"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="relative max-h-[85vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
            {item.media_type === 'video' ? (
              <video src={item.storage_path} controls autoPlay className="max-h-[85vh] max-w-[90vw] rounded-lg" />
            ) : (
              <div className="relative h-[85vh] w-[90vw]">
                <Image src={item.storage_path} alt={item.caption ?? ''} fill className="object-contain" />
              </div>
            )}
            {item.caption && <p className="mt-2 text-center text-sm text-mist">{item.caption}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
