'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function ResetPasswordForm() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error('Lösenordet måste vara minst 8 tecken.');
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error('Kunde inte uppdatera lösenordet. Länken kan ha gått ut.');
      return;
    }
    toast.success('Lösenordet är uppdaterat!');
    router.push('/logga-in');
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-3xl font-bold">Nytt lösenord</h1>
      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="password">Nytt lösenord</Label>
          <Input id="password" type="password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Sparar...' : 'Spara nytt lösenord'}
        </Button>
      </form>
    </div>
  );
}
