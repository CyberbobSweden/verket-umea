'use client';

import { useEffect, useState } from 'react';
import { getCountdownParts } from '@/lib/utils';

export function Countdown({ target }: { target: string }) {
  const [parts, setParts] = useState(() => getCountdownParts(target));

  useEffect(() => {
    const id = setInterval(() => setParts(getCountdownParts(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (parts.done) {
    return <p className="font-mono text-sm text-volt">Pågår nu / avslutat</p>;
  }

  const units = [
    { label: 'Dagar', value: parts.days },
    { label: 'Timmar', value: parts.hours },
    { label: 'Min', value: parts.minutes },
    { label: 'Sek', value: parts.seconds },
  ];

  return (
    <div className="flex gap-3" role="timer" aria-live="off">
      {units.map((u) => (
        <div key={u.label} className="flex flex-col items-center rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 min-w-[64px]">
          <span className="font-mono text-2xl font-bold tabular-nums text-white">{String(u.value).padStart(2, '0')}</span>
          <span className="text-[10px] uppercase tracking-widest text-mist">{u.label}</span>
        </div>
      ))}
    </div>
  );
}
