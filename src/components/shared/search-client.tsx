'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface Result {
  kind: string;
  id: string;
  title: string;
  excerpt: string | null;
  url_path: string;
}

export function SearchClient() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const id = setTimeout(async () => {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      const json = await res.json();
      setResults(json.results ?? []);
      setLoading(false);
    }, 300);
    return () => clearTimeout(id);
  }, [q]);

  return (
    <div>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-mist" />
        <Input
          autoFocus
          placeholder="Sök event, nyheter..."
          className="pl-9"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {loading && <p className="mt-6 text-sm text-mist">Söker...</p>}

      <ul className="mt-6 space-y-3">
        {results.map((r) => (
          <li key={`${r.kind}-${r.id}`}>
            <Link href={r.url_path} className="block rounded-lg border border-white/10 p-4 hover:border-signal-500/50">
              <div className="mb-1 flex items-center gap-2">
                <Badge variant="outline">{r.kind === 'news' ? 'Nyhet' : 'Event'}</Badge>
              </div>
              <p className="font-display font-semibold">{r.title}</p>
              {r.excerpt && <p className="mt-1 line-clamp-2 text-sm text-mist">{r.excerpt}</p>}
            </Link>
          </li>
        ))}
      </ul>

      {!loading && q.trim().length >= 2 && results.length === 0 && (
        <p className="mt-6 text-sm text-mist">Inga träffar för &quot;{q}&quot;.</p>
      )}
    </div>
  );
}
