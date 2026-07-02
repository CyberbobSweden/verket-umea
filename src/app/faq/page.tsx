import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'FAQ', description: 'Vanliga frågor om Verket Umeå.' };

const FAQ = [
  { q: 'Måste jag vara medlem för att komma på event?', a: 'Nej, de flesta event är öppna för alla. Medlemmar får dock rabatterat inträde och förtur till platser med begränsad kapacitet.' },
  { q: 'Vilken åldersgräns gäller?', a: 'De flesta kvällar har 15-årsgräns. Vissa club nights har 18-årsgräns — det anges alltid på eventsidan.' },
  { q: 'Serverar ni alkohol?', a: 'Nej, Verket är en alkohol- och drogfri mötesplats.' },
  { q: 'Hur blir jag volontär?', a: 'Skapa ett konto, gå till din profil och anmäl intresse under Volontär-sidan, så hör styrelsen av sig.' },
  { q: 'Kan jag boka replokal?', a: 'Ja, aktiva medlemmar kan boka replokalen via medlemsportalen (lanseras inom kort).' },
  { q: 'Hur avslutar jag mitt medlemskap?', a: 'Kontakta styrelsen via kontaktformuläret så hjälper vi dig.' },
];

export default function FaqPage() {
  return (
    <div className="container max-w-3xl py-16">
      <p className="eyebrow mb-2">Hjälp</p>
      <h1 className="mb-10 text-4xl font-bold sm:text-5xl">Vanliga frågor</h1>
      <div className="space-y-4">
        {FAQ.map((f) => (
          <details key={f.q} className="group rounded-lg border border-white/10 bg-white/[0.02] p-5 open:border-signal-500/40">
            <summary className="cursor-pointer list-none font-display text-lg font-semibold marker:content-none">
              {f.q}
            </summary>
            <p className="mt-3 text-sm text-mist">{f.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
