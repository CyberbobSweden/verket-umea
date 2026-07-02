import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AlbumGrid } from '@/components/gallery/album-grid';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  const { data: album } = await supabase.from('gallery_albums').select('*').eq('slug', params.slug).single();
  if (!album) return {};
  return { title: album.title, description: album.description ?? undefined };
}

export default async function AlbumPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: album } = await supabase.from('gallery_albums').select('*').eq('slug', params.slug).single();
  if (!album || !album.is_published) notFound();

  const { data: media } = await supabase
    .from('gallery_media')
    .select('*')
    .eq('album_id', album.id)
    .order('sort_order', { ascending: true });

  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Galleri</p>
      <h1 className="mb-2 text-4xl font-bold sm:text-5xl">{album.title}</h1>
      {album.description && <p className="mb-8 max-w-2xl text-mist">{album.description}</p>}
      <AlbumGrid media={media ?? []} />
    </div>
  );
}
