import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { PollCard } from '@/components/community/poll-card';

export const metadata: Metadata = { title: 'Omröstningar' };

export default async function PollsPage() {
  const supabase = await createClient();
  const { data: polls } = await supabase.from('polls').select('*').order('created_at', { ascending: false });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pollsWithVotes = await Promise.all(
    (polls ?? []).map(async (p) => {
      const { data: votes } = await supabase.from('poll_votes').select('option_id, user_id').eq('poll_id', p.id);
      const resultsByOption = (votes ?? []).reduce<Record<string, number>>((acc, v) => {
        acc[v.option_id] = (acc[v.option_id] ?? 0) + 1;
        return acc;
      }, {});
      const myVote = user ? votes?.find((v) => v.user_id === user.id)?.option_id ?? null : null;
      return {
        id: p.id,
        question: p.question,
        options: p.options as { id: string; label: string }[],
        status: p.status,
        myVote,
        isAuthenticated: !!user,
        resultsByOption,
        totalVotes: votes?.length ?? 0,
      };
    })
  );

  return (
    <div className="container max-w-2xl py-12">
      <p className="eyebrow mb-2">Community</p>
      <h1 className="mb-8 text-4xl font-bold">Omröstningar</h1>
      <div className="space-y-6">
        {pollsWithVotes.map((poll) => (
          <PollCard key={poll.id} poll={poll} />
        ))}
        {pollsWithVotes.length === 0 && <p className="text-mist">Inga omröstningar just nu.</p>}
      </div>
    </div>
  );
}
