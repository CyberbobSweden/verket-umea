import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-volt">Error 404</p>
      <h1 className="mt-4 font-display text-5xl font-bold">Sidan hittades inte</h1>
      <p className="mt-4 max-w-md text-mist">Länken kan vara trasig eller sidan borttagen. Testa att gå tillbaka till startsidan.</p>
      <Button asChild className="mt-8">
        <Link href="/">Till startsidan</Link>
      </Button>
    </div>
  );
}
