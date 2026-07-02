'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  startOfWeek,
} from 'date-fns';
import { sv } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn, formatDateTime } from '@/lib/utils';
import type { Database } from '@/types/database.types';

type EventRow = Database['public']['Tables']['events']['Row'];
type ViewMode = 'month' | 'week' | 'agenda';

const CATEGORIES = [
  { value: 'all', label: 'Alla' },
  { value: 'konsert', label: 'Konsert' },
  { value: 'metal', label: 'Metal' },
  { value: 'gaming', label: 'Gaming' },
  { value: 'workshop', label: 'Workshop' },
  { value: 'club', label: 'Club' },
  { value: 'community', label: 'Community' },
] as const;

export function EventCalendar({ events }: { events: EventRow[] }) {
  const [view, setView] = useState<ViewMode>('month');
  const [cursor, setCursor] = useState(new Date());
  const [category, setCategory] = useState<string>('all');

  const filtered = useMemo(
    () => (category === 'all' ? events : events.filter((e) => e.category === category)),
    [events, category]
  );

  const days = useMemo(() => {
    if (view === 'week') {
      return eachDayOfInterval({ start: startOfWeek(cursor, { weekStartsOn: 1 }), end: endOfWeek(cursor, { weekStartsOn: 1 }) });
    }
    return eachDayOfInterval({
      start: startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 }),
      end: endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 }),
    });
  }, [cursor, view]);

  const eventsByDay = (day: Date) => filtered.filter((e) => isSameDay(new Date(e.starts_at), day));

  function step(dir: 1 | -1) {
    setCursor((c) => (view === 'week' ? addWeeks(c, dir) : addMonths(c, dir)));
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => step(-1)} aria-label="Föregående">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <p className="min-w-[160px] text-center font-display text-lg font-semibold capitalize">
            {format(cursor, view === 'week' ? "'v.'w yyyy" : 'MMMM yyyy', { locale: sv })}
          </p>
          <Button variant="outline" size="icon" onClick={() => step(1)} aria-label="Nästa">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-md border border-white/10 p-0.5">
            {(['month', 'week', 'agenda'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  'rounded px-3 py-1.5 text-xs font-medium capitalize',
                  view === v ? 'bg-signal-500 text-white' : 'text-mist hover:text-white'
                )}
              >
                {{ month: 'Månad', week: 'Vecka', agenda: 'Agenda' }[v]}
              </button>
            ))}
          </div>
          <a href="/api/events/ical" className="inline-flex">
            <Button variant="outline" size="sm">
              <Download className="h-3.5 w-3.5" /> Exportera iCal
            </Button>
          </a>
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((c) => (
          <button key={c.value} onClick={() => setCategory(c.value)}>
            <Badge variant={category === c.value ? 'default' : 'outline'}>{c.label}</Badge>
          </button>
        ))}
      </div>

      {view === 'agenda' ? (
        <ul className="space-y-3">
          {filtered
            .sort((a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime())
            .map((e) => (
              <li key={e.id}>
                <Link
                  href={`/event/${e.slug}`}
                  className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.02] p-4 hover:border-signal-500/50"
                >
                  <div>
                    <p className="font-mono text-xs uppercase tracking-widest text-volt">{formatDateTime(e.starts_at)}</p>
                    <p className="mt-1 font-display text-lg font-semibold">{e.title}</p>
                  </div>
                  <Badge>{e.category}</Badge>
                </Link>
              </li>
            ))}
          {filtered.length === 0 && <p className="text-mist">Inga event i denna kategori just nu.</p>}
        </ul>
      ) : (
        <div className="grid grid-cols-7 gap-1.5">
          {['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'].map((d) => (
            <div key={d} className="pb-2 text-center text-xs font-medium uppercase tracking-widest text-mist">
              {d}
            </div>
          ))}
          {days.map((day) => {
            const dayEvents = eventsByDay(day);
            return (
              <div
                key={day.toISOString()}
                className={cn(
                  'min-h-[92px] rounded-md border border-white/10 p-2 text-xs',
                  !isSameMonth(day, cursor) && view === 'month' && 'opacity-30'
                )}
              >
                <p className="mb-1 font-mono text-mist">{format(day, 'd')}</p>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((e) => (
                    <Link
                      key={e.id}
                      href={`/event/${e.slug}`}
                      className="block truncate rounded bg-signal-500/20 px-1.5 py-0.5 text-signal-300 hover:bg-signal-500/30"
                    >
                      {e.title}
                    </Link>
                  ))}
                  {dayEvents.length > 3 && <p className="text-mist">+{dayEvents.length - 3} till</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
