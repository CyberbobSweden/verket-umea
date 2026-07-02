import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDateTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Adminpanel' };

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ count: memberCount }, { count: eventCount }, { count: newsCount }, { count: pendingContact }, { data: recentAudit }] =
    await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true }).gte('starts_at', new Date().toISOString()),
      supabase.from('news_posts').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('handled', false),
      supabase.from('audit_log').select('*, profiles(display_name)').order('created_at', { ascending: false }).limit(8),
    ]);

  const stats = [
    { label: 'Medlemmar', value: memberCount ?? 0 },
    { label: 'Kommande event', value: eventCount ?? 0 },
    { label: 'Publicerade nyheter', value: newsCount ?? 0 },
    { label: 'Obehandlade meddelanden', value: pendingContact ?? 0 },
  ];

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Översikt</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-6">
              <p className="font-display text-3xl font-bold text-gradient">{s.value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-mist">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Senaste aktivitet</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            {recentAudit?.map((a) => (
              <li key={a.id} className="flex justify-between border-b border-white/5 pb-2 last:border-0">
                <span>
                  <span className="text-mist">{a.profiles?.display_name ?? 'System'}</span> — {a.action}
                </span>
                <span className="text-mist">{formatDateTime(a.created_at)}</span>
              </li>
            ))}
            {(!recentAudit || recentAudit.length === 0) && <p className="text-mist">Ingen aktivitet loggad ännu.</p>}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
