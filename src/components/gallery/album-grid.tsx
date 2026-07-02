'use client';

import { useState } from 'react';
import Image from 'next/image';
import { PlayCircle } from 'lucide-react';
import { Lightbox } from '@/components/gallery/lightbox';

interface MediaItem {
  id: string;
  storage_path: string;
  thumbnail_path: string | null;
  media_type: 'image' | 'video';
  caption: string | null;
}

export function AlbumGrid({ media }: { media: MediaItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {media.map((m, i) => (
          <button
            key={m.id}
            onClick={() => setActiveIndex(i)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-steel focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-volt"
          >
            <Image
              src={m.thumbnail_path ?? m.storage_path}
              alt={m.caption ?? ''}
              fill
              loading="lazy"
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {m.media_type === 'video' && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <PlayCircle className="h-8 w-8 text-white" />
              </div>
            )}
          </button>
        ))}
      </div>
      <Lightbox items={media} index={activeIndex} onClose={() => setActiveIndex(null)} onNavigate={setActiveIndex} />
    </>
  );
}
