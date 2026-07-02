import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export function SectionHeading({
  eyebrow,
  title,
  href,
  hrefLabel,
}: {
  eyebrow: string;
  title: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4">
      <div>
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h2 className="text-3xl font-bold sm:text-4xl">{title}</h2>
      </div>
      {href && (
        <Link href={href} className="hidden shrink-0 items-center gap-1 text-sm font-medium text-signal-400 hover:text-signal-300 sm:flex">
          {hrefLabel ?? 'Visa alla'} <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
