import type { Metadata } from 'next';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Nyheter · Admin' };

const STATUS_VARIANT: Record<string, 'default' | 'outline' | 'volt'> = { published: 'default', draft: 'outline', archived: 'outline' };

export default async function AdminNewsListPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase.from('news_posts').select('*').order('updated_at', { ascending: false });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Nyheter</h1>
        <Button asChild>
          <Link href="/admin/nyheter/nytt">Ny artikel</Link>
        </Button>
      </div>

      <ul className="divide-y divide-white/10 rounded-lg border border-white/10">
        {posts?.map((p) => (
          <li key={p.id}>
            <Link href={`/admin/nyheter/${p.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-white/[0.02]">
              <div>
                <p className="font-medium">{p.title}</p>
                <p className="text-xs text-mist">{formatDate(p.updated_at)} · {p.view_count} visningar</p>
              </div>
              <div className="flex items-center gap-2">
                {p.pinned && <Badge variant="volt">Pinned</Badge>}
                <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>
              </div>
            </Link>
          </li>
        ))}
        {(!posts || posts.length === 0) && <p className="p-4 text-mist">Inga artiklar ännu.</p>}
      </ul>
    </div>
  );
}
