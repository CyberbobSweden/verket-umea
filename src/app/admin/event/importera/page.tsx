'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function ImportGoogleCalendarPage() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/events/import-google', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icalUrl: url }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok) {
      toast.error(typeof json.error === 'string' ? json.error : 'Kunde inte importera kalendern.');
      return;
    }
    toast.success(`${json.imported} event importerade som utkast.`);
    router.push('/admin/event');
  }

  return (
    <div className="max-w-lg">
      <h1 className="mb-4 text-3xl font-bold">Importera från Google Calendar</h1>
      <p className="mb-6 text-sm text-mist">
        Klistra in den publika &quot;hemlig adress i iCal-format&quot;-länken från din Google-kalender. Importerade
        event sparas som utkast så en redaktör kan granska innan publicering.
      </p>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="url">iCal-URL (calendar.google.com)</Label>
          <Input id="url" type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://calendar.google.com/calendar/ical/..." />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Importerar...' : 'Importera'}
        </Button>
      </form>
    </div>
  );
}
