'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { newsPostSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';
import type { Database } from '@/types/database.types';

type NewsRow = Database['public']['Tables']['news_posts']['Row'];

export function NewsForm({ post }: { post?: NewsRow }) {
  const [title, setTitle] = useState(post?.title ?? '');
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? '');
  const [content, setContent] = useState(post?.content ?? '');
  const [tags, setTags] = useState(post?.tags.join(', ') ?? '');
  const [pinned, setPinned] = useState(post?.pinned ?? false);
  const [status, setStatus] = useState<'draft' | 'published'>(post?.status === 'published' ? 'published' : 'draft');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function save(nextStatus: 'draft' | 'published') {
    const parsed = newsPostSchema.safeParse({
      title,
      excerpt: excerpt || undefined,
      content,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      pinned,
      status: nextStatus,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? 'Kontrollera fälten.');
      return;
    }
    setLoading(true);

    const payload = {
      ...parsed.data,
      slug: post?.slug ?? slugify(title),
      published_at: nextStatus === 'published' ? new Date().toISOString() : null,
    };

    const { error } = post
      ? await supabase.from('news_posts').update(payload).eq('id', post.id)
      : await supabase.from('news_posts').insert(payload);

    setLoading(false);
    if (error) {
      toast.error('Kunde inte spara artikeln.');
      return;
    }
    toast.success(nextStatus === 'published' ? 'Publicerad!' : 'Utkast sparat.');
    router.push('/admin/nyheter');
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Titel</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="excerpt">Ingress</Label>
        <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} maxLength={300} rows={2} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="content">Innehåll</Label>
        <Textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={14} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="tags">Taggar (kommaseparerade)</Label>
        <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={pinned} onChange={(e) => setPinned(e.target.checked)} className="accent-signal-500" />
        Fäst överst på nyhetssidan
      </label>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={() => save('draft')} disabled={loading}>
          Spara utkast
        </Button>
        <Button onClick={() => save('published')} disabled={loading}>
          Publicera
        </Button>
      </div>
    </div>
  );
}
