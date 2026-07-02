'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { suggestionSchema } from '@/lib/validations';
import { toast } from 'sonner';

export function SuggestionForm({ isAuthenticated }: { isAuthenticated: boolean }) {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  if (!isAuthenticated) {
    return (
      <p className="text-sm text-mist">
        <a href="/logga-in?next=/community/forslag" className="text-signal-400 hover:underline">
          Logga in
        </a>{' '}
        för att lämna ett förslag.
      </p>
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = suggestionSchema.safeParse({ title, body });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? 'Kontrollera fälten.');
      return;
    }
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error } = await supabase.from('suggestions').insert({ ...parsed.data, author_id: user!.id });
    setLoading(false);
    if (error) {
      toast.error('Kunde inte skicka förslaget.');
      return;
    }
    toast.success('Tack för ditt förslag!');
    setTitle('');
    setBody('');
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mb-10 space-y-3 rounded-lg border border-white/10 p-5">
      <Input placeholder="Kort titel" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <Textarea placeholder="Beskriv ditt förslag..." value={body} onChange={(e) => setBody(e.target.value)} required />
      <Button type="submit" size="sm" disabled={loading}>
        {loading ? 'Skickar...' : 'Skicka förslag'}
      </Button>
    </form>
  );
}
