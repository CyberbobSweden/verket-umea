import type { Metadata } from 'next';
import { FileText } from 'lucide-react';
import { WaveformDivider } from '@/components/shared/waveform-divider';

export const metadata: Metadata = { title: 'Om oss', description: 'Verket är en ideell förening i Umeå.' };

const VALUES = [
  { title: 'Öppet för alla', body: 'Oavsett bakgrund, genre eller erfarenhetsnivå — Verket är till för dig som vill vara med.' },
  { title: 'Medlemsstyrt', body: 'Verket drivs som en ideell förening — beslut går att påverka via medlemskap och årsmöte.' },
  { title: 'Volontärdrivet', body: 'Det som händer på Verket görs till stor del av volontärer som ger sin tid för communityt.' },
];

export default function AboutPage() {
  return (
    <div className="container max-w-4xl py-16">
      <p className="eyebrow mb-2">Om Verket</p>
      <h1 className="text-4xl font-bold sm:text-5xl">Verket är en ideell förening i Umeå</h1>
      <p className="mt-6 max-w-2xl text-lg text-mist">
        Verket är en mötesplats för musik, gaming och alternativ kultur, driven som en ideell förening. Vill
        du läsa hela regelverket för hur föreningen styrs finns stadgarna att ladda ner nedan.
      </p>

      <a
        href="/dokument/stadgar.pdf"
        className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/15 px-4 py-2 text-sm hover:border-signal-500/50 hover:text-signal-400"
      >
        <FileText className="h-4 w-4" /> Ladda ner föreningens stadgar (PDF)
      </a>

      <WaveformDivider className="my-12 h-8 opacity-40" />

      <div className="grid gap-8 sm:grid-cols-3">
        {VALUES.map((v) => (
          <div key={v.title} className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
            <h2 className="font-display text-xl font-semibold text-signal-400">{v.title}</h2>
            <p className="mt-2 text-sm text-mist">{v.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16">
        <h2 className="mb-4 text-2xl font-bold">Styrelsen</h2>
        <p className="text-mist">
          Vill du engagera dig, ställa upp i styrelsen eller bara veta mer om hur föreningen leds?{' '}
          <a href="/kontakt" className="text-signal-400 hover:underline">
            Hör av dig
          </a>
          .
        </p>
      </div>
    </div>
  );
}
