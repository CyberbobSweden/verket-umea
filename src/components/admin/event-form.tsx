'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createClient } from '@/lib/supabase/client';
import { eventSchema } from '@/lib/validations';
import { slugify } from '@/lib/utils';
import { toast } from 'sonner';
import type { Database, EventCategory } from '@/types/database.types';

type EventRow = Database['public']['Tables']['events']['Row'];

const CATEGORIES: EventCategory[] = ['konsert', 'metal', 'gaming', 'workshop', 'club', 'community', 'ovrigt'];

export function EventForm({ event }: { event?: EventRow }) {
  const [title, setTitle] = useState(event?.title ?? '');
  const [description, setDescription] = useState(event?.description ?? '');
  const [category, setCategory] = useState<EventCategory>(event?.category ?? 'konsert');
  const [startsAt, setStartsAt] = useState(event?.starts_at?.slice(0, 16) ?? '');
  const [endsAt, setEndsAt] = useState(event?.ends_at?.slice(0, 16) ?? '');
  const [locationName, setLocationName] = useState(event?.location_name ?? 'Verket Umeå');
  const [locationAddress, setLocationAddress] = useState(event?.location_address ?? '');
  const [maxCapacity, setMaxCapacity] = useState(event?.max_capacity?.toString() ?? '');
  const [priceSek, setPriceSek] = useState(event?.price_sek?.toString() ?? '0');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function save(publish: boolean) {
    const parsed = eventSchema.safeParse({
      title,
      description,
      category,
      starts_at: new Date(startsAt).toISOString(),
      ends_at: new Date(endsAt).toISOString(),
      location_name: locationName,
      location_address: locationAddress || null,
      max_capacity: maxCapacity ? Number(maxCapacity) : null,
      price_sek: Number(priceSek),
      is_published: publish,
    });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? 'Kontrollera fälten.');
      return;
    }
    setLoading(true);
    const payload = { ...parsed.data, slug: event?.slug ?? slugify(title) };

    const { error } = event
      ? await supabase.from('events').update(payload).eq('id', event.id)
      : await supabase.from('events').insert(payload);

    setLoading(false);
    if (error) {
      toast.error('Kunde inte spara eventet.');
      return;
    }
    toast.success(publish ? 'Event publicerat!' : 'Utkast sparat.');
    router.push('/admin/event');
    router.refresh();
  }

  return (
    <div className="max-w-2xl space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="title">Titel</Label>
        <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="description">Beskrivning</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={8} required />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="starts">Startar</Label>
          <Input id="starts" type="datetime-local" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ends">Slutar</Label>
          <Input id="ends" type="datetime-local" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} required />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="category">Kategori</Label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value as EventCategory)}
          className="flex h-10 w-full rounded-md border border-white/15 bg-white/[0.03] px-3 text-sm"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c} className="bg-graphite">
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="location">Plats</Label>
          <Input id="location" value={locationName} onChange={(e) => setLocationName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">Adress</Label>
          <Input id="address" value={locationAddress} onChange={(e) => setLocationAddress(e.target.value)} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="capacity">Max antal besökare</Label>
          <Input id="capacity" type="number" min={1} value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} placeholder="obegränsat" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="price">Pris (kr)</Label>
          <Input id="price" type="number" min={0} value={priceSek} onChange={(e) => setPriceSek(e.target.value)} />
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button variant="outline" onClick={() => save(false)} disabled={loading}>
          Spara utkast
        </Button>
        <Button onClick={() => save(true)} disabled={loading}>
          Publicera
        </Button>
      </div>
    </div>
  );
}
