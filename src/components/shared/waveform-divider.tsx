'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';

/**
 * The site's signature element: an animated audio-waveform divider used
 * between sections. It stands in for the "torn gig-poster edge" you'd
 * find at a real venue — but built from real bars, referencing the
 * live-sound identity of Verket rather than decorating with a stock
 * SVG blob. `active` pulses the bars (used near hero/live content);
 * static contexts get a calm, non-animated version.
 */
export function WaveformDivider({
  className,
  bars = 64,
  active = false,
}: {
  className?: string;
  bars?: number;
  active?: boolean;
}) {
  const heights = useMemo(
    () => Array.from({ length: bars }, (_, i) => 20 + Math.abs(Math.sin(i * 0.7) * 60) + Math.random() * 20),
    [bars]
  );

  return (
    <div
      aria-hidden="true"
      className={cn('flex h-8 w-full items-end justify-between gap-[2px] overflow-hidden opacity-70', className)}
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn(
            'w-full min-w-[1px] origin-bottom rounded-t-sm bg-gradient-to-t from-signal-500 to-volt',
            active && 'animate-wave'
          )}
          style={{
            height: `${h}%`,
            animationDelay: `${(i % 12) * 90}ms`,
          }}
        />
      ))}
    </div>
  );
}
