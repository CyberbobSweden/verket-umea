import { createClient } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/shared/section-heading';
import { EventCard } from '@/components/events/event-card';

export async function UpcomingEvents() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(3);

  if (!events || events.length === 0) return null;

  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Kalender" title="Kommande event" href="/event" />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </section>
  );
}
