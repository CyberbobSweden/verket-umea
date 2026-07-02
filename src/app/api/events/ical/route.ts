import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildIcs } from '@/lib/ical';

/** Exports the full published events calendar as a single .ics feed. */
export async function GET() {
  const supabase = await createClient();
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('starts_at', { ascending: true });

  const ics = buildIcs(events ?? []);

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="verket-umea-kalender.ics"',
      'Cache-Control': 'public, max-age=1800',
    },
  });
}
