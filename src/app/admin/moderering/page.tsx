import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ModerationList } from '@/components/admin/moderation-list';

export const metadata: Metadata = { title: 'Moderering · Admin' };

export default async function ModerationPage() {
  const supabase = await createClient();
  const { data: flaggedComments } = await supabase
    .from('comments')
    .select('*, profiles(display_name)')
    .order('created_at', { ascending: false })
    .limit(50);

  const { data: contactMessages } = await supabase
    .from('contact_messages')
    .select('*')
    .eq('handled', false)
    .order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Moderering</h1>

      <h2 className="mb-4 font-display text-xl font-semibold">Kommentarer</h2>
      <ModerationList comments={flaggedComments ?? []} />

      <h2 className="mb-4 mt-10 font-display text-xl font-semibold">Obehandlade kontaktmeddelanden</h2>
      <ul className="space-y-3">
        {contactMessages?.map((m) => (
          <li key={m.id} className="rounded-lg border border-white/10 p-4">
            <p className="font-medium">{m.subject}</p>
            <p className="text-xs text-mist">{m.name} · {m.email}</p>
            <p className="mt-2 text-sm text-mist">{m.body}</p>
          </li>
        ))}
        {(!contactMessages || contactMessages.length === 0) && <p className="text-mist">Inget obehandlat just nu.</p>}
      </ul>
    </div>
  );
}
