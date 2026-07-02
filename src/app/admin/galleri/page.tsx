import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { GalleryUploadForm } from '@/components/admin/gallery-upload-form';

export const metadata: Metadata = { title: 'Galleri · Admin' };

export default async function AdminGalleryPage() {
  const supabase = await createClient();
  const { data: albums } = await supabase.from('gallery_albums').select('*, gallery_media(count)').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Galleri</h1>
      <GalleryUploadForm />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {albums?.map((a) => (
          <div key={a.id} className="rounded-lg border border-white/10 p-4">
            <p className="font-medium">{a.title}</p>
            <p className="text-xs text-mist">{a.gallery_media?.[0]?.count ?? 0} filer · {a.is_published ? 'Publicerat' : 'Utkast'}</p>
          </div>
        ))}
        {(!albums || albums.length === 0) && <p className="text-mist">Inga album ännu.</p>}
      </div>
    </div>
  );
}
