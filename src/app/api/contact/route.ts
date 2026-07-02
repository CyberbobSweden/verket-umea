import { NextResponse } from 'next/server';
import { contactSchema } from '@/lib/validations';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = contactSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }
  // Honeypot: bots fill every field, humans never see this one.
  if (parsed.data.company) {
    return NextResponse.json({ ok: true }); // pretend success, drop silently
  }

  const admin = createAdminClient();
  const { error } = await admin.from('contact_messages').insert({
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject,
    body: parsed.data.body,
  });

  if (error) {
    return NextResponse.json({ error: 'Kunde inte skicka meddelandet just nu.' }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
