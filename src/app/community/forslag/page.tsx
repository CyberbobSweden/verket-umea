import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SuggestionForm } from '@/components/community/suggestion-form';
import { Badge } from '@/components/ui/badge';

export const metadata: Metadata = { title: 'Förslagslåda' };

const STATUS_LABEL: Record<string, string> = { open: 'Öppen', planned: 'Planerad', done: 'Genomförd', declined: 'Avböjd' };

export default async function SuggestionsPage() {
  const supabase = await createClient();
  const { data: suggestions } = await supabase
    .from('suggestions')
    .select('*, profiles(display_name)')
    .order('upvotes', { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container max-w-2xl py-12">
      <p className="eyebrow mb-2">Community</p>
      <h1 className="mb-8 text-4xl font-bold">Förslagslåda</h1>

      <SuggestionForm isAuthenticated={!!user} />

      <ul className="space-y-4">
        {suggestions?.map((s) => (
          <li key={s.id} className="rounded-lg border border-white/10 p-5">
            <div className="mb-1 flex items-center justify-between gap-2">
              <p className="font-display font-semibold">{s.title}</p>
              <Badge variant="outline">{STATUS_LABEL[s.status]}</Badge>
            </div>
            <p className="text-sm text-mist">{s.body}</p>
            <p className="mt-2 text-xs text-mist">
              {s.upvotes} röster · av {s.profiles?.display_name ?? 'Medlem'}
            </p>
          </li>
        ))}
        {(!suggestions || suggestions.length === 0) && <p className="text-mist">Inga förslag ännu.</p>}
      </ul>
    </div>
  );
}
