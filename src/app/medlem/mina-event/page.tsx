import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EventCard } from '@/components/events/event-card';

export const metadata: Metadata = { title: 'Mina event' };

export default async function MyEventsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/logga-in?next=/medlem/mina-event');

  const { data: rsvps } = await supabase
    .from('event_rsvps')
    .select('status, events(*)')
    .eq('user_id', user.id)
    .neq('status', 'cancelled');

  const upcoming = rsvps?.filter((r) => r.events && new Date(r.events.starts_at) >= new Date()) ?? [];
  const past = rsvps?.filter((r) => r.events && new Date(r.events.starts_at) < new Date()) ?? [];

  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Mitt konto</p>
      <h1 className="mb-8 text-4xl font-bold">Mina event</h1>

      <h2 className="mb-4 font-display text-2xl font-semibold">Kommande</h2>
      <div className="mb-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((r) => r.events && <EventCard key={r.events.id} event={r.events} />)}
        {upcoming.length === 0 && <p className="text-mist">Inga kommande anmälningar.</p>}
      </div>

      <h2 className="mb-4 font-display text-2xl font-semibold">Historik</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 opacity-70">
        {past.map((r) => r.events && <EventCard key={r.events.id} event={r.events} />)}
        {past.length === 0 && <p className="text-mist">Ingen historik ännu.</p>}
      </div>
    </div>
  );
}
