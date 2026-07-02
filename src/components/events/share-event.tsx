'use client';

import { Share2, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function ShareEvent({ title, url }: { title: string; url: string }) {
  async function share() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled — no-op */
      }
      return;
    }
    await navigator.clipboard.writeText(url);
    toast.success('Länk kopierad!');
  }

  return (
    <Button variant="outline" size="sm" onClick={share}>
      {typeof navigator !== 'undefined' && 'share' in navigator ? (
        <Share2 className="h-4 w-4" />
      ) : (
        <LinkIcon className="h-4 w-4" />
      )}
      Dela
    </Button>
  );
}
