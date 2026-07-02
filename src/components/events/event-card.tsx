import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';
import type { Database } from '@/types/database.types';

type EventRow = Database['public']['Tables']['events']['Row'];

const CATEGORY_LABEL: Record<string, string> = {
  konsert: 'Konsert',
  gaming: 'Gaming',
  workshop: 'Workshop',
  community: 'Community',
  metal: 'Metal',
  club: 'Club',
  ovrigt: 'Övrigt',
};

export function EventCard({ event, goingCount }: { event: EventRow; goingCount?: number }) {
  const full = event.max_capacity != null && (goingCount ?? 0) >= event.max_capacity;

  return (
    <Link href={`/event/${event.slug}`} className="group">
      <Card className="overflow-hidden transition-all group-hover:border-signal-500/50 group-hover:shadow-[0_0_30px_rgba(139,92,246,0.15)]">
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-steel">
          {event.cover_image_url ? (
            <Image
              src={event.cover_image_url}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-display text-4xl text-white/10">VU</div>
          )}
          <div className="absolute left-3 top-3 flex gap-2">
            <Badge>{CATEGORY_LABEL[event.category]}</Badge>
            {full && <Badge variant="destructive">Fullbokat — väntelista</Badge>}
          </div>
        </div>
        <div className="p-5">
          <p className="font-mono text-xs uppercase tracking-widest text-volt">{formatDateTime(event.starts_at)}</p>
          <h3 className="mt-2 line-clamp-2 font-display text-xl font-semibold">{event.title}</h3>
          <div className="mt-3 flex items-center gap-4 text-xs text-mist">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" /> {event.location_name}
            </span>
            {event.max_capacity && (
              <span className="flex items-center gap-1">
                <Users className="h-3.5 w-3.5" /> {goingCount ?? 0}/{event.max_capacity}
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
