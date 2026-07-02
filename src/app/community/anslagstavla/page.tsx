import type { Metadata } from 'next';
import Link from 'next/link';
import { MessageSquare, Pin, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Anslagstavla', description: 'Diskussionsforum för Verket Umeås community.' };
export const revalidate = 30;

export default async function BoardPage() {
  const supabase = await createClient();
  const { data: threads } = await supabase
    .from('board_threads')
    .select('*, board_categories(name, slug), profiles(display_name)')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="eyebrow mb-2">Community</p>
          <h1 className="text-4xl font-bold">Anslagstavlan</h1>
        </div>
        {user ? (
          <Button asChild>
            <Link href="/community/anslagstavla?nytt=1">Nytt inlägg</Link>
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link href="/logga-in?next=/community/anslagstavla">Logga in för att posta</Link>
          </Button>
        )}
      </div>

      <ul className="divide-y divide-white/10 rounded-lg border border-white/10">
        {threads?.map((t) => (
          <li key={t.id}>
            <Link href={`/community/anslagstavla/${t.id}`} className="flex items-center justify-between gap-4 p-4 hover:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                {t.is_pinned && <Pin className="h-4 w-4 text-volt" />}
                {t.is_locked && <Lock className="h-4 w-4 text-mist" />}
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-mist">
                    av {t.profiles?.display_name ?? 'Medlem'} {t.board_categories && <>· {t.board_categories.name}</>}
                  </p>
                </div>
              </div>
              <MessageSquare className="h-4 w-4 text-mist" />
            </Link>
          </li>
        ))}
      </ul>
      {(!threads || threads.length === 0) && <p className="mt-6 text-mist">Inga trådar ännu — bli den första att posta.</p>}
    </div>
  );
}
