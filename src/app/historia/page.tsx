import type { Metadata } from 'next';
import { WaveformDivider } from '@/components/shared/waveform-divider';

export const metadata: Metadata = { title: 'Historia', description: 'Verket Umeås historia.' };

export default function HistoryPage() {
  return (
    <div className="container max-w-3xl py-16">
      <p className="eyebrow mb-2">Historia</p>
      <h1 className="text-4xl font-bold sm:text-5xl">Verkets historia</h1>
      <WaveformDivider className="my-10 h-8 opacity-40" />
      <p className="text-mist">
        Den här sidan väntar på sitt innehåll. Vi vill gärna berätta Verkets riktiga historia — när
        föreningen grundades, viktiga milstolpar och personerna som byggt den — men har inte fått
        underlag för det ännu.
      </p>
      <p className="mt-4 text-mist">
        Har du varit med och format Verket och vill bidra med minnen, årtal eller bilder? Hör av dig via{' '}
        <a href="/kontakt" className="text-signal-400 hover:underline">
          kontaktsidan
        </a>{' '}
        så bygger vi tidslinjen tillsammans med styrelsen.
      </p>
    </div>
  );
}
