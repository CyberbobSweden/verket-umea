import type { Metadata } from 'next';
import { AlertTriangle } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Medlemskap', description: 'Bli medlem i Verket Umeå — så går det till.' };

export default async function MembershipPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .in('key', ['membership_fee_sek', 'swish_number', 'plusgiro_number', 'contact_email']);

  const get = (key: string) => settings?.find((s) => s.key === key)?.value;
  const fee = (get('membership_fee_sek') as number) ?? 50;
  const swish = (get('swish_number') as string) ?? '123-166 59 42';
  const plusgiro = (get('plusgiro_number') as string) ?? '920287-0 (Nordea)';
  const email = (get('contact_email') as string) ?? 'verketforening@gmail.com';

  return (
    <div className="container max-w-3xl py-16">
      <p className="eyebrow mb-2">Medlemskap</p>
      <h1 className="text-4xl font-bold sm:text-5xl">Bli medlem i Verket</h1>
      <p className="mt-6 text-lg text-mist">
        Medlemsavgiften är {fee} kr och gäller som ideellt stöd till föreningen. Skapa gärna ett konto på
        sajten också — det ger dig profil, digitalt medlemskort och tillgång till community-delarna — men
        själva medlemskapet i föreningen registreras i dagsläget manuellt av styrelsen, enligt processen
        nedan.
      </p>

      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.02] p-8">
        <p className="font-display text-2xl font-bold">{fee} kr / medlemskap</p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-mist">
          <li>
            Swisha {fee} kr till <strong className="text-white">{swish}</strong>, eller betala via
            föreningens plusgirokonto <strong className="text-white">{plusgiro}</strong>.
          </li>
          <li>
            Mejla namn, telefonnummer och personnummer till{' '}
            <a href={`mailto:${email}`} className="text-signal-400 hover:underline">
              {email}
            </a>{' '}
            så registrerar styrelsen ditt medlemskap.
          </li>
        </ol>

        <div className="mt-6 flex gap-3 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4 text-sm">
          <AlertTriangle className="h-5 w-5 shrink-0 text-amber-400" />
          <p className="text-mist">
            Personnummer är en känslig personuppgift enligt GDPR. Undvik att skicka det i vanlig,
            okrypterad e-post om ni kan undvika det — överväg ett formulär med begränsad åtkomst, eller
            informera medlemmen om riskerna och att uppgiften bara används för medlemsmatrikeln.
          </p>
        </div>
      </div>

      <p className="mt-10 text-sm text-mist">
        Vill ni istället ta betalt och registrera medlemskap direkt på sajten (kortbetalning, automatisk
        koppling till kontot) går det att bygga senare — hör av dig så tittar vi på det som ett Fas 2-steg.
      </p>
    </div>
  );
}
