'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface PollOption {
  id: string;
  label: string;
}

interface PollProps {
  id: string;
  question: string;
  options: PollOption[];
  status: 'open' | 'closed';
  myVote: string | null;
  isAuthenticated: boolean;
  resultsByOption: Record<string, number>;
  totalVotes: number;
}

export function PollCard({ poll }: { poll: PollProps }) {
  const [myVote, setMyVote] = useState(poll.myVote);
  const [results, setResults] = useState(poll.resultsByOption);
  const [total, setTotal] = useState(poll.totalVotes);
  const router = useRouter();
  const supabase = createClient();

  async function vote(optionId: string) {
    if (!poll.isAuthenticated) {
      router.push('/logga-in?next=/community/omrostningar');
      return;
    }
    if (myVote || poll.status === 'closed') return;

    const { error } = await supabase.from('poll_votes').insert({ poll_id: poll.id, option_id: optionId });
    if (error) {
      toast.error('Kunde inte rösta.');
      return;
    }
    setMyVote(optionId);
    setResults((r) => ({ ...r, [optionId]: (r[optionId] ?? 0) + 1 }));
    setTotal((t) => t + 1);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{poll.question}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {poll.options.map((opt) => {
          const votes = results[opt.id] ?? 0;
          const pct = total > 0 ? Math.round((votes / total) * 100) : 0;
          const showResults = !!myVote || poll.status === 'closed';

          return (
            <button
              key={opt.id}
              onClick={() => vote(opt.id)}
              disabled={showResults}
              className="relative w-full overflow-hidden rounded-md border border-white/10 p-3 text-left text-sm hover:border-signal-500/50 disabled:cursor-default"
            >
              {showResults && (
                <div
                  className="absolute inset-y-0 left-0 bg-signal-500/15"
                  style={{ width: `${pct}%` }}
                  aria-hidden="true"
                />
              )}
              <div className="relative flex justify-between">
                <span>{opt.label}</span>
                {showResults && <span className="text-mist">{pct}%</span>}
              </div>
            </button>
          );
        })}
        <p className="pt-2 text-xs text-mist">{total} röster</p>
      </CardContent>
    </Card>
  );
}
