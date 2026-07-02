import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/shared/section-heading';

export async function GalleryPreview() {
  const supabase = await createClient();
  const { data: media } = await supabase
    .from('gallery_media')
    .select('id, storage_path, thumbnail_path, caption, media_type, album_id, gallery_albums!inner(is_published)')
    .eq('gallery_albums.is_published', true)
    .order('created_at', { ascending: false })
    .limit(8);

  if (!media || media.length === 0) return null;

  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Ögonblick" title="Från senaste kvällarna" href="/galleri" />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {media.map((m) => (
          <Link
            key={m.id}
            href="/galleri"
            className="group relative aspect-square overflow-hidden rounded-lg border border-white/10 bg-steel"
          >
            <Image
              src={m.thumbnail_path ?? m.storage_path}
              alt={m.caption ?? ''}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </section>
  );
}
