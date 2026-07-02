'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      toast.success('Kolla din inkorg för att bekräfta prenumerationen.');
      setEmail('');
    } catch {
      toast.error('Något gick fel. Försök igen om en stund.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2">
      <Input
        type="email"
        required
        placeholder="din@mejl.se"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="E-postadress för nyhetsbrev"
      />
      <Button type="submit" disabled={loading} size="default">
        {loading ? '...' : 'Prenumerera'}
      </Button>
    </form>
  );
}
