import ical from 'ical-generator';
import type { Database } from '@/types/database.types';

type EventRow = Database['public']['Tables']['events']['Row'];

/** Builds a downloadable .ics file for a single event or a full list. */
export function buildIcs(events: EventRow[], calendarName = 'Verket Umeå') {
  const cal = ical({ name: calendarName, timezone: 'Europe/Stockholm' });
  for (const e of events) {
    cal.createEvent({
      id: e.id,
      start: new Date(e.starts_at),
      end: new Date(e.ends_at),
      summary: e.title,
      description: e.description,
      location: e.location_address ?? e.location_name,
      url: `https://verketumea.se/event/${e.slug}`,
    });
  }
  return cal.toString();
}
