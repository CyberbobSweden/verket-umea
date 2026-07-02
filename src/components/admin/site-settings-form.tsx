'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface Props {
  contactEmail: string;
  adminBootstrapEmail: string;
  openingHours: Record<string, string>;
}

const DAYS: { key: string; label: string }[] = [
  { key: 'mon', label: 'Måndag' },
  { key: 'tue', label: 'Tisdag' },
  { key: 'wed', label: 'Onsdag' },
  { key: 'thu', label: 'Torsdag' },
  { key: 'fri', label: 'Fredag' },
  { key: 'sat', label: 'Lördag' },
  { key: 'sun', label: 'Söndag' },
];

export function SiteSettingsForm({ contactEmail, adminBootstrapEmail, openingHours }: Props) {
  const [email, setEmail] = useState(contactEmail);
  const [bootstrapEmail, setBootstrapEmail] = useState(adminBootstrapEmail);
  const [hours, setHours] = useState(openingHours);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function save() {
    setLoading(true);
    const { error } = await supabase.from('site_settings').upsert([
      { key: 'contact_email', value: email },
      { key: 'opening_hours', value: hours },
      { key: 'admin_bootstrap_email', value: { email: bootstrapEmail } },
    ]);
    setLoading(false);
    if (error) {
      toast.error('Kunde inte spara inställningarna.');
      return;
    }
    toast.success('Inställningar sparade.');
  }

  return (
    <div className="max-w-xl space-y-8">
      <div className="space-y-1.5">
        <Label htmlFor="contact-email">Kontakt-e-post</Label>
        <Input id="contact-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="bootstrap-email">Admin-bootstrap-e-post</Label>
        <Input id="bootstrap-email" type="email" value={bootstrapEmail} onChange={(e) => setBootstrapEmail(e.target.value)} />
        <p className="text-xs text-mist">
          Kontot med den här e-postadressen blir automatiskt admin första gången det loggar in.
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-medium">Öppettider</p>
        <div className="space-y-2">
          {DAYS.map((d) => (
            <div key={d.key} className="flex items-center gap-3">
              <span className="w-24 text-sm text-mist">{d.label}</span>
              <Input
                value={hours[d.key] ?? ''}
                onChange={(e) => setHours((h) => ({ ...h, [d.key]: e.target.value }))}
                placeholder="Stängt"
              />
            </div>
          ))}
        </div>
      </div>

      <Button onClick={save} disabled={loading}>
        {loading ? 'Sparar...' : 'Spara inställningar'}
      </Button>
    </div>
  );
}
