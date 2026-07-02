'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { contactSchema } from '@/lib/validations';
import { toast } from 'sonner';

export function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', body: '', company: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.errors[0]?.message ?? 'Kontrollera formuläret.');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!res.ok) throw new Error();
      setSent(true);
    } catch {
      toast.error('Kunde inte skicka meddelandet. Försök igen om en stund.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="rounded-lg border border-signal-500/30 bg-signal-500/5 p-6 text-center">
        <p className="font-display text-xl font-semibold">Tack för ditt meddelande!</p>
        <p className="mt-2 text-mist">Vi återkommer så snart vi kan.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot — hidden from real users, bots tend to fill every field */}
      <input
        type="text"
        name="company"
        value={form.company}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
        className="hidden"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Namn</Label>
          <Input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-post</Label>
          <Input id="email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subject">Ämne</Label>
        <Input id="subject" required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="body">Meddelande</Label>
        <Textarea id="body" required rows={6} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Skickar...' : 'Skicka meddelande'}
      </Button>
    </form>
  );
}
