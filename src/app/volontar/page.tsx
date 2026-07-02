import type { Metadata } from 'next';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = { title: 'Volontär', description: 'Engagera dig som volontär på Verket Umeå — bar, ljud, dörr, marknadsföring och mer.' };

const ROLES = [
  { title: 'Bar & servering', body: 'Håll koll på baren under club nights och konserter.' },
  { title: 'Ljud & scen', body: 'Rigga, mixa och supporta band och DJs på scenen.' },
  { title: 'Dörr & vakt', body: 'Ta emot besökare, koll på biljetter och trygg stämning.' },
  { title: 'Gaming-ansvarig', body: 'Håll koll på LAN-hallen, turneringar och utrustning.' },
  { title: 'Marknadsföring', body: 'Sociala medier, affischer och content för event.' },
  { title: 'Städ & underhåll', body: 'Håll huset i skick mellan events.' },
];

export default function VolunteerPage() {
  return (
    <div className="container py-16">
      <p className="eyebrow mb-2">Volontär</p>
      <h1 className="max-w-2xl text-4xl font-bold sm:text-5xl">Verket drivs av folk som ställer upp</h1>
      <p className="mt-6 max-w-2xl text-lg text-mist">
        Som volontär samlar du poäng för varje pass du kör — poängen syns i din profil och ger tillgång till exklusiva
        volontärevent.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {ROLES.map((r) => (
          <div key={r.title} className="rounded-lg border border-white/10 bg-white/[0.02] p-6">
            <h2 className="font-display text-lg font-semibold text-signal-400">{r.title}</h2>
            <p className="mt-2 text-sm text-mist">{r.body}</p>
          </div>
        ))}
      </div>

      <Button size="lg" className="mt-10" asChild>
        <a href="/medlem/profil">Anmäl intresse via din profil</a>
      </Button>
    </div>
  );
}
