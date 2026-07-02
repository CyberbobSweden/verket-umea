import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { EventForm } from '@/components/admin/event-form';

export const metadata: Metadata = { title: 'Redigera event · Admin' };

export default async function EditEventPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: event } = await supabase.from('events').select('*').eq('id', params.id).single();
  if (!event) notFound();

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Redigera event</h1>
      <EventForm event={event} />
    </div>
  );
}
