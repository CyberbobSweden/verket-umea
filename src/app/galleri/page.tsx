import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Galleri', description: 'Bilder och videos från konserter, gamingkvällar och club nights på Verket Umeå.' };
export const revalidate = 120;

export default async function GalleryPage() {
  const supabase = await createClient();
  const { data: albums } = await supabase
    .from('gallery_albums')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Ögonblick</p>
      <h1 className="mb-8 text-4xl font-bold sm:text-5xl">Galleri</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {albums?.map((album) => (
          <Link
            key={album.id}
            href={`/galleri/${album.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-white/10 bg-steel"
          >
            {album.cover_image_url && (
              <Image
                src={album.cover_image_url}
                alt=""
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            )}
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-black/10 to-transparent p-5">
              <div>
                <p className="font-display text-xl font-semibold">{album.title}</p>
                {album.description && <p className="mt-1 line-clamp-1 text-sm text-mist">{album.description}</p>}
              </div>
            </div>
          </Link>
        ))}
      </div>
      {(!albums || albums.length === 0) && <p className="text-mist">Inga album publicerade ännu.</p>}
    </div>
  );
}
