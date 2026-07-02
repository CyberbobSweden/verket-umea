'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/aterstall-losenord`,
    });
    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-sm text-center">
        <h1 className="text-2xl font-bold">Länk skickad</h1>
        <p className="mt-3 text-mist">Om {email} finns hos oss får du en återställningslänk inom kort.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-3xl font-bold">Glömt lösenord</h1>
      <p className="mt-2 text-sm text-mist">Vi skickar en länk för att återställa det.</p>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-post</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Skickar...' : 'Skicka återställningslänk'}
        </Button>
      </form>
    </div>
  );
}
