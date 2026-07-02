'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const params = useSearchParams();
  const supabase = createClient();
  const next = params.get('next') ?? '/';

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error('Fel e-post eller lösenord.');
      return;
    }
    router.push(next);
    router.refresh();
  }

  async function oauth(provider: 'google' | 'discord') {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
  }

  return (
    <div className="mx-auto w-full max-w-sm">
      <h1 className="text-3xl font-bold">Logga in</h1>
      <p className="mt-2 text-sm text-mist">Välkommen tillbaka till Verket.</p>

      <div className="mt-6 flex flex-col gap-3">
        <Button variant="outline" onClick={() => oauth('google')}>
          Fortsätt med Google
        </Button>
        <Button variant="outline" onClick={() => oauth('discord')}>
          Fortsätt med Discord
        </Button>
      </div>

      <div className="my-6 flex items-center gap-3 text-xs text-mist">
        <div className="h-px flex-1 bg-white/10" />
        eller med e-post
        <div className="h-px flex-1 bg-white/10" />
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="email">E-post</Label>
          <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Lösenord</Label>
            <Link href="/glomt-losenord" className="text-xs text-signal-400 hover:underline">
              Glömt lösenord?
            </Link>
          </div>
          <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Loggar in...' : 'Logga in'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-mist">
        Inget konto?{' '}
        <Link href="/registrera" className="text-signal-400 hover:underline">
          Skapa ett här
        </Link>
      </p>
    </div>
  );
}
