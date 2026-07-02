import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { EventCalendar } from '@/components/events/calendar';

export const metadata: Metadata = {
  title: 'Event & kalender',
  description: 'Alla kommande konserter, gamingkvällar, workshops och club nights på Verket Umeå.',
};
export const revalidate = 60;

export default async function EventsPage() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('starts_at', new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString())
    .order('starts_at', { ascending: true });

  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Kalender</p>
      <h1 className="mb-8 text-4xl font-bold sm:text-5xl">Vad händer på Verket</h1>
      <EventCalendar events={events ?? []} />
    </div>
  );
}
