import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDateTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Event · Admin' };

export default async function AdminEventsListPage() {
  const supabase = await createClient();
  const { data: events } = await supabase.from('events').select('*').order('starts_at', { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Event</h1>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/event/importera">Importera från Google</Link>
          </Button>
          <Button asChild>
            <Link href="/admin/event/nytt">Nytt event</Link>
          </Button>
        </div>
      </div>

      <ul className="divide-y divide-white/10 rounded-lg border border-white/10">
        {events?.map((e) => (
          <li key={e.id}>
            <Link href={`/admin/event/${e.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-white/[0.02]">
              <div>
                <p className="font-medium">{e.title}</p>
                <p className="text-xs text-mist">{formatDateTime(e.starts_at)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline">{e.category}</Badge>
                <Badge variant={e.is_published ? 'default' : 'outline'}>{e.is_published ? 'Publicerat' : 'Utkast'}</Badge>
              </div>
            </Link>
          </li>
        ))}
        {(!events || events.length === 0) && <p className="p-4 text-mist">Inga event ännu.</p>}
      </ul>
    </div>
  );
}
