'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { RsvpStatus } from '@/types/database.types';

export function RsvpButton({
  eventId,
  isAuthenticated,
  initialStatus,
}: {
  eventId: string;
  isAuthenticated: boolean;
  initialStatus: RsvpStatus | null;
}) {
  const [status, setStatus] = useState<RsvpStatus | null>(initialStatus);
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const supabase = createClient();

  if (!isAuthenticated) {
    return (
      <Button onClick={() => router.push(`/logga-in?next=/event`)}>Logga in för att anmäla dig</Button>
    );
  }

  function rsvp() {
    startTransition(async () => {
      const { data, error } = await supabase.rpc('rsvp_with_capacity', { p_event_id: eventId, p_guests: 0 });
      if (error) {
        toast.error('Kunde inte anmäla dig. Försök igen.');
        return;
      }
      setStatus(data as RsvpStatus);
      toast.success(data === 'going' ? 'Du är anmäld! 🤘' : 'Eventet är fullt — du står på väntelistan.');
      router.refresh();
    });
  }

  function cancel() {
    startTransition(async () => {
      const { error } = await supabase
        .from('event_rsvps')
        .update({ status: 'cancelled' })
        .eq('event_id', eventId);
      if (error) {
        toast.error('Kunde inte avanmäla dig.');
        return;
      }
      setStatus('cancelled');
      toast('Du är avanmäld.');
      router.refresh();
    });
  }

  if (status === 'going') {
    return (
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm text-emerald-400">
          <CheckCircle2 className="h-4 w-4" /> Du är anmäld
        </span>
        <Button variant="outline" size="sm" onClick={cancel} disabled={pending}>
          Avanmäl
        </Button>
      </div>
    );
  }

  if (status === 'waitlisted') {
    return (
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-sm text-amber-400">
          <Clock className="h-4 w-4" /> På väntelista
        </span>
        <Button variant="outline" size="sm" onClick={cancel} disabled={pending}>
          Lämna väntelistan
        </Button>
      </div>
    );
  }

  return (
    <Button onClick={rsvp} disabled={pending}>
      {pending ? 'Anmäler...' : 'Anmäl dig'}
    </Button>
  );
}
