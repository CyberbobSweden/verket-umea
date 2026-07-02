'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

interface CommentRow {
  id: string;
  body: string;
  is_hidden: boolean;
  created_at: string;
  profiles?: { display_name: string } | null;
}

export function ModerationList({ comments }: { comments: CommentRow[] }) {
  const [items, setItems] = useState(comments);
  const router = useRouter();
  const supabase = createClient();

  async function toggleHidden(id: string, hidden: boolean) {
    const { error } = await supabase.from('comments').update({ is_hidden: hidden }).eq('id', id);
    if (error) {
      toast.error('Kunde inte uppdatera kommentaren.');
      return;
    }
    setItems((prev) => prev.map((c) => (c.id === id ? { ...c, is_hidden: hidden } : c)));
    router.refresh();
  }

  async function remove(id: string) {
    const { error } = await supabase.from('comments').delete().eq('id', id);
    if (error) {
      toast.error('Kunde inte radera kommentaren.');
      return;
    }
    setItems((prev) => prev.filter((c) => c.id !== id));
    router.refresh();
  }

  return (
    <ul className="space-y-3">
      {items.map((c) => (
        <li key={c.id} className="flex items-start justify-between gap-4 rounded-lg border border-white/10 p-4">
          <div>
            <p className="text-xs text-mist">
              {c.profiles?.display_name ?? 'Medlem'} · {formatDateTime(c.created_at)} {c.is_hidden && '· Dold'}
            </p>
            <p className="mt-1 text-sm">{c.body}</p>
          </div>
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={() => toggleHidden(c.id, !c.is_hidden)}>
              {c.is_hidden ? 'Visa' : 'Dölj'}
            </Button>
            <Button variant="destructive" size="sm" onClick={() => remove(c.id)}>
              Radera
            </Button>
          </div>
        </li>
      ))}
      {items.length === 0 && <p className="text-mist">Inga kommentarer att granska.</p>}
    </ul>
  );
}
