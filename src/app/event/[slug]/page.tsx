import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { CalendarDays, MapPin, Ticket, Users } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Countdown } from '@/components/events/countdown';
import { RsvpButton } from '@/components/events/rsvp-button';
import { ShareEvent } from '@/components/events/share-event';
import { EventMap } from '@/components/events/event-map';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://verketumea.se';

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const params = await props.params;
  const supabase = await createClient();
  const { data: event } = await supabase.from('events').select('*').eq('slug', params.slug).single();
  if (!event) return {};
  return {
    title: event.title,
    description: event.description.slice(0, 155),
    openGraph: {
      title: event.title,
      description: event.description.slice(0, 155),
      images: event.cover_image_url ? [event.cover_image_url] : undefined,
      type: 'website',
    },
  };
}

export default async function EventDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: event } = await supabase.from('events').select('*').eq('slug', params.slug).single();
  if (!event || !event.is_published) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { count: goingCount } = await supabase
    .from('event_rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event.id)
    .eq('status', 'going');

  let myStatus = null;
  if (user) {
    const { data: mine } = await supabase
      .from('event_rsvps')
      .select('status')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .maybeSingle();
    myStatus = mine?.status ?? null;
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.starts_at,
    endDate: event.ends_at,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    eventStatus: 'https://schema.org/EventScheduled',
    location: {
      '@type': 'Place',
      name: event.location_name,
      address: event.location_address ?? undefined,
    },
    image: event.cover_image_url ? [event.cover_image_url] : undefined,
    description: event.description,
    organizer: { '@type': 'Organization', name: 'Verket Umeå', url: siteUrl },
  };

  return (
    <div className="container max-w-4xl py-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <div className="relative mb-8 aspect-[21/9] w-full overflow-hidden rounded-xl border border-white/10 bg-steel">
        {event.cover_image_url && (
          <Image src={event.cover_image_url} alt="" fill priority className="object-cover" />
        )}
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Badge>{event.category}</Badge>
        <ShareEvent title={event.title} url={`${siteUrl}/event/${event.slug}`} />
      </div>

      <h1 className="text-4xl font-bold sm:text-5xl">{event.title}</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div className="space-y-3 text-sm text-mist">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-signal-400" /> {formatDateTime(event.starts_at)} – {formatDateTime(event.ends_at)}
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-signal-400" /> {event.location_name}
            {event.location_address ? `, ${event.location_address}` : ''}
          </p>
          {event.max_capacity && (
            <p className="flex items-center gap-2">
              <Users className="h-4 w-4 text-signal-400" /> {goingCount ?? 0}/{event.max_capacity} anmälda
            </p>
          )}
          <p className="flex items-center gap-2">
            <Ticket className="h-4 w-4 text-signal-400" /> {event.price_sek > 0 ? `${event.price_sek} kr` : 'Gratis inträde'}
          </p>
        </div>
        <div>
          <p className="eyebrow mb-2">Nedräkning</p>
          <Countdown target={event.starts_at} />
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <RsvpButton eventId={event.id} isAuthenticated={!!user} initialStatus={myStatus} />
        {event.external_ticket_url && (
          <Button variant="volt" asChild>
            <a href={event.external_ticket_url} target="_blank" rel="noopener noreferrer">
              Köp biljett
            </a>
          </Button>
        )}
        <a href={`/api/events/${event.id}/ical`}>
          <Button variant="outline">Lägg i kalender (.ics)</Button>
        </a>
      </div>

      <div className="prose prose-invert mt-10 max-w-none prose-headings:font-display">
        <p className="whitespace-pre-line text-base leading-relaxed text-foreground/90">{event.description}</p>
      </div>

      {event.location_lat && (
        <div className="mt-10">
          <p className="eyebrow mb-3">Hitta hit</p>
          <EventMap lat={event.location_lat} lng={event.location_lng} address={event.location_address} />
        </div>
      )}
    </div>
  );
}
