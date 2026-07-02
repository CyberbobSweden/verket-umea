import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireRole } from '@/lib/authorize';
import { createAdminClient } from '@/lib/supabase/admin';

const schema = z.object({ role: z.enum(['visitor', 'member', 'volunteer', 'editor', 'admin']) });

/**
 * Only a signed-in admin may change another user's role. RLS on
 * `profiles` would already block a non-admin update, but we also check
 * here so we can return a clean 403 instead of a silent RLS no-op, and
 * so the service-role client (used to bypass RLS write races) can't be
 * reached without this guard.
 */
export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    await requireRole('admin');
  } catch {
    return NextResponse.json({ error: 'Endast administratörer kan ändra roller.' }, { status: 403 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: 'Ogiltig roll.' }, { status: 400 });

  const admin = createAdminClient();
  const { error } = await admin.from('profiles').update({ role: parsed.data.role }).eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
