'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';
import { toast } from 'sonner';

interface CommentItem {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  profiles?: { display_name: string; avatar_url: string | null } | null;
}

export function Comments({
  parentType,
  parentId,
  initialComments,
  isAuthenticated,
}: {
  parentType: 'news' | 'gallery_album' | 'board_thread';
  parentId: string;
  initialComments: CommentItem[];
  isAuthenticated: boolean;
}) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parent_type: parentType, parent_id: parentId, body }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setComments((c) => [...c, json.comment]);
      setBody('');
      router.refresh();
    } catch {
      toast.error('Kunde inte posta kommentaren.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl font-semibold">Kommentarer ({comments.length})</h2>

      {isAuthenticated ? (
        <form onSubmit={submit} className="mb-8 space-y-3">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Vad tycker du?"
            maxLength={2000}
            required
          />
          <Button type="submit" disabled={loading} size="sm">
            {loading ? 'Postar...' : 'Kommentera'}
          </Button>
        </form>
      ) : (
        <p className="mb-8 text-sm text-mist">
          <a href="/logga-in" className="text-signal-400 hover:underline">
            Logga in
          </a>{' '}
          för att kommentera.
        </p>
      )}

      <ul className="space-y-5">
        {comments.map((c) => (
          <li key={c.id} className="border-l-2 border-white/10 pl-4">
            <p className="text-sm font-medium">{c.profiles?.display_name ?? 'Medlem'}</p>
            <p className="text-xs text-mist">{formatDateTime(c.created_at)}</p>
            <p className="mt-1 text-sm text-foreground/90">{c.body}</p>
          </li>
        ))}
        {comments.length === 0 && <p className="text-sm text-mist">Bli den första att kommentera.</p>}
      </ul>
    </div>
  );
}
