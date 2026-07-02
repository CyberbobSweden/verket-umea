'use client';
import { Toaster as Sonner } from 'sonner';

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: 'bg-graphite border border-white/10 text-foreground font-body',
          title: 'font-medium',
          description: 'text-mist',
        },
      }}
    />
  );
}
