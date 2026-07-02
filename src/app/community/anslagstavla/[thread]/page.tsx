import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { Comments } from '@/components/news/comments';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

export default async function ThreadPage(props: { params: Promise<{ thread: string }> }) {
  const params = await props.params;
  const supabase = await createClient();
  const { data: thread } = await supabase
    .from('board_threads')
    .select('*, board_categories(name), profiles(display_name)')
    .eq('id', params.thread)
    .single();

  if (!thread) notFound();

  const { data: comments } = await supabase
    .from('comments')
    .select('id, body, created_at, author_id, profiles(display_name, avatar_url)')
    .eq('parent_type', 'board_thread')
    .eq('parent_id', thread.id)
    .eq('is_hidden', false)
    .order('created_at', { ascending: true });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="container max-w-3xl py-12">
      {thread.board_categories && <Badge className="mb-4">{thread.board_categories.name}</Badge>}
      <h1 className="text-3xl font-bold sm:text-4xl">{thread.title}</h1>
      <p className="mt-2 text-sm text-mist">
        Startad av {thread.profiles?.display_name ?? 'Medlem'} · {formatDateTime(thread.created_at)}
      </p>

      <hr className="my-8 border-white/10" />

      <Comments parentType="board_thread" parentId={thread.id} initialComments={comments ?? []} isAuthenticated={!!user} />
    </div>
  );
}
