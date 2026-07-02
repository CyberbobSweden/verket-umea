'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function RegisterForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const supabase = createClient();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Lösenordet måste vara minst 8 tecken.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message === 'User already registered' ? 'Ett konto med den e-posten finns redan.' : 'Något gick fel.');
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <h1 className="text-2xl font-bold">Kolla din inkorg</h1>
        <p className="mt-3 text-mist">
          Vi har skickat ett bekräftelsemejl till <strong>{email}</strong>. Klicka på länken för att aktivera ditt konto.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-3xl font-bold">Skapa konto</h1>
      <p className="mt-2 text-sm text-mist">Lösenord lagras säkert hashade — vi ser det aldrig i klartext.</p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name">Namn</Label>
          <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">E-post</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="password">Lösenord</Label>
          <Input
            id="password"
            type="password"
            minLength={8}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="text-xs text-mist">Minst 8 tecken.</p>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Skapar konto...' : 'Skapa konto'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        Har du redan ett konto?{' '}
        <Link href="/logga-in" className="text-signal-400 hover:underline">
          Logga in
        </Link>
      </p>
    </div>
  );
}
