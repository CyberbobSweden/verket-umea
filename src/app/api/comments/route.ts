import { NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';
import { commentSchema } from '@/lib/validations';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Logga in för att kommentera.' }, { status: 401 });

  const json = await req.json().catch(() => null);
  const parsed = commentSchema.safeParse(json);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });

  const cleanBody = DOMPurify.sanitize(parsed.data.body, { ALLOWED_TAGS: [] });

  const { data, error } = await supabase
    .from('comments')
    .insert({ ...parsed.data, body: cleanBody, author_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: 'Kunde inte spara kommentaren.' }, { status: 500 });
  return NextResponse.json({ comment: data });
}
