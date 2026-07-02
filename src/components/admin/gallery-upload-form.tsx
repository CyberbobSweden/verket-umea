'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';

export function GalleryUploadForm() {
  const [title, setTitle] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) {
      toast.error('Välj minst en fil.');
      return;
    }
    setLoading(true);

    const slug = `${slugify(title)}-${Date.now().toString(36)}`;
    const { data: album, error: albumError } = await supabase
      .from('gallery_albums')
      .insert({ title, slug, is_published: true })
      .select()
      .single();

    if (albumError || !album) {
      toast.error('Kunde inte skapa albumet.');
      setLoading(false);
      return;
    }

    for (const [i, file] of Array.from(files).entries()) {
      const path = `${album.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('gallery').upload(path, file);
      if (uploadError) continue;
      const { data: publicUrl } = supabase.storage.from('gallery').getPublicUrl(path);
      await supabase.from('gallery_media').insert({
        album_id: album.id,
        media_type: file.type.startsWith('video') ? 'video' : 'image',
        storage_path: publicUrl.publicUrl,
        sort_order: i,
      });
    }

    setLoading(false);
    toast.success('Album uppladdat!');
    setTitle('');
    setFiles(null);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md space-y-4 rounded-lg border border-white/10 p-5">
      <div className="space-y-1.5">
        <Label htmlFor="album-title">Albumtitel</Label>
        <Input id="album-title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="files">Bilder / videos</Label>
        <input
          id="files"
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => setFiles(e.target.files)}
          className="block w-full text-sm text-mist file:mr-3 file:rounded-md file:border-0 file:bg-signal-500 file:px-3 file:py-1.5 file:text-white"
        />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Laddar upp...' : 'Skapa album'}
      </Button>
    </form>
  );
}
