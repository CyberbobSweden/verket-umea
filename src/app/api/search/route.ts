import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q')?.trim();
  if (!q || q.length < 2) return NextResponse.json({ results: [] });

  const supabase = await createClient();
  const { data, error } = await supabase.rpc('global_search', { q });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ results: data });
}
