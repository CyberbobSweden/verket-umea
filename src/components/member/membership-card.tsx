'use client';

import { QrCode } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const STATUS_LABEL: Record<string, string> = {
  none: 'Inget medlemskap',
  pending: 'Väntar på godkännande',
  active: 'Aktivt medlemskap',
  expired: 'Utgånget',
  cancelled: 'Avslutat',
};

export function MembershipCard({ profile }: { profile: Profile }) {
  return (
    <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-graphite via-steel to-graphite p-6 shadow-[0_0_50px_rgba(139,92,246,0.15)]">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-signal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-volt/10 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="font-display text-lg font-bold tracking-widest text-gradient">VERKET UMEÅ</p>
          <p className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-mist">Medlemskort</p>
        </div>
        <QrCode className="h-14 w-14 text-white/80" aria-label="QR-kod för incheckning (fas 2)" />
      </div>

      <div className="relative mt-10">
        <p className="font-display text-2xl font-semibold">{profile.display_name}</p>
        <p className="mt-1 font-mono text-sm text-volt">{profile.membership_number ?? '—'}</p>
      </div>

      <div className="relative mt-8 flex items-end justify-between text-xs">
        <div>
          <p className="text-mist">Status</p>
          <p className="font-medium">{STATUS_LABEL[profile.membership_status]}</p>
        </div>
        {profile.membership_expires_at && (
          <div className="text-right">
            <p className="text-mist">Giltigt t.o.m.</p>
            <p className="font-medium">{formatDate(profile.membership_expires_at)}</p>
          </div>
        )}
      </div>
    </div>
  );
}
