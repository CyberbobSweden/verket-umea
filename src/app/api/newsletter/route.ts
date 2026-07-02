import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createAdminClient } from '@/lib/supabase/admin';

const schema = z.object({ email: z.string().email() });

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Ogiltig e-post' }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin
    .from('newsletter_subscribers')
    .upsert({ email: parsed.data.email }, { onConflict: 'email', ignoreDuplicates: true });

  if (error) return NextResponse.json({ error: 'Kunde inte prenumerera just nu.' }, { status: 500 });
  // TODO (phase 2): trigger double opt-in confirmation email via Supabase Edge Function.
  return NextResponse.json({ ok: true });
}
