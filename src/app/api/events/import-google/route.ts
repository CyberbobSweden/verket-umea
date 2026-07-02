import { NextResponse } from 'next/server';
import type * as IcalTypes from 'node-ical';
import { requireRole } from '@/lib/authorize';
import { createAdminClient } from '@/lib/supabase/admin';
import { slugify } from '@/lib/utils';
import { z } from 'zod';

const bodySchema = z.object({
  icalUrl: z.string().url(),
  category: z.enum(['konsert', 'gaming', 'workshop', 'community', 'metal', 'club', 'ovrigt']).default('ovrigt'),
});

/**
 * Imports events from a public Google Calendar "Secret address in iCal
 * format" URL. Staff-only: this creates draft (unpublished) events that
 * an editor must review and publish, so a bad feed can't spam the site.
 */
export async function POST(req: Request) {
  try {
    await requireRole('editor');
  } catch {
    return NextResponse.json({ error: 'Endast redaktionen kan importera event.' }, { status: 403 });
  }

  const json = await req.json();
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { icalUrl, category } = parsed.data;

  // Only allow fetching from Google's calendar export domain to prevent SSRF.
  const host = new URL(icalUrl).hostname;
  if (!host.endsWith('calendar.google.com')) {
    return NextResponse.json({ error: 'Endast Google Calendar-länkar stöds.' }, { status: 400 });
  }

  const events = await (await import('node-ical')).default.async.fromURL(icalUrl);
  const admin = createAdminClient();

  // node-ical's ParameterValue fields (summary/description/location) can be
  // either a plain string or `{ val, params }` when the source .ics uses
  // ICS parameters like LANGUAGE — unwrap to a plain string either way.
  const textOf = (v: IcalTypes.ParameterValue | undefined): string | undefined =>
    v == null ? undefined : typeof v === 'string' ? v : v.val;

  const rows = Object.values(events)
    .filter((e): e is IcalTypes.VEvent => e != null && e.type === 'VEVENT')
    .filter((e) => e.end != null)
    .map((e) => ({
      slug: `${slugify(textOf(e.summary) ?? 'event')}-${e.uid?.slice(0, 6) ?? Math.random().toString(36).slice(2, 8)}`,
      title: textOf(e.summary) ?? 'Importerat event',
      description: textOf(e.description) ?? '',
      category,
      starts_at: new Date(e.start).toISOString(),
      ends_at: new Date(e.end as Date).toISOString(),
      location_name: textOf(e.location) ?? 'Verket Umeå',
      google_calendar_id: e.uid ?? null,
      is_published: false,
    }));

  if (rows.length === 0) {
    return NextResponse.json({ imported: 0 });
  }

  const { error } = await admin.from('events').upsert(rows, { onConflict: 'google_calendar_id', ignoreDuplicates: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ imported: rows.length });
}