import type { Metadata } from 'next';
import { EventForm } from '@/components/admin/event-form';

export const metadata: Metadata = { title: 'Nytt event · Admin' };

export default function NewEventPage() {
  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Nytt event</h1>
      <EventForm />
    </div>
  );
}
