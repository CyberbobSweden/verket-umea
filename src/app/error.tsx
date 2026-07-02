'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorBoundary({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-mono text-sm uppercase tracking-widest text-destructive">Något gick fel</p>
      <h1 className="mt-4 font-display text-4xl font-bold">Ett oväntat fel inträffade</h1>
      <p className="mt-4 max-w-md text-mist">Vårt team har informerats. Försök igen om en stund.</p>
      <Button onClick={reset} className="mt-8">
        Försök igen
      </Button>
    </div>
  );
}
