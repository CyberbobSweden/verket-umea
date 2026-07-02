import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { buildIcs } from '@/lib/ical';

export async function GET(_req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: event, error } = await supabase.from('events').select('*').eq('id', params.id).single();

  if (error || !event || !event.is_published) {
    return NextResponse.json({ error: 'Eventet hittades inte' }, { status: 404 });
  }

  const ics = buildIcs([event]);

  return new NextResponse(ics, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="${event.slug}.ics"`,
    },
  });
}
