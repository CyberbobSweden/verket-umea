import type { Metadata } from 'next';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Sponsorer', description: 'Företag och organisationer som stödjer Verket Umeå.' };

const TIER_LABEL: Record<string, string> = { platinum: 'Platinum', guld: 'Guld', silver: 'Silver', partner: 'Partner' };

export default async function SponsorsPage() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase.from('sponsors').select('*').order('sort_order');
  const byTier = (sponsors ?? []).reduce<Record<string, typeof sponsors>>((acc, s) => {
    (acc[s.tier] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="container py-16">
      <p className="eyebrow mb-2">Tack till</p>
      <h1 className="mb-10 text-4xl font-bold sm:text-5xl">Våra sponsorer</h1>

      {Object.entries(byTier).map(([tier, list]) => (
        <div key={tier} className="mb-12">
          <h2 className="mb-4 font-display text-xl font-semibold text-mist">{TIER_LABEL[tier]}</h2>
          <div className="flex flex-wrap items-center gap-10">
            {list?.map((s) => (
              <a key={s.id} href={s.website_url ?? '#'} target="_blank" rel="noopener noreferrer" className="relative h-12 w-40">
                <Image src={s.logo_url} alt={s.name} fill className="object-contain" />
              </a>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-10 rounded-xl border border-white/10 bg-white/[0.02] p-8">
        <h2 className="font-display text-2xl font-bold">Vill du sponsra Verket?</h2>
        <p className="mt-2 max-w-xl text-mist">
          Vi samarbetar med lokala företag som delar vår vilja att hålla scenen och gamingrummet levande.{' '}
          <a href="/kontakt" className="text-signal-400 hover:underline">
            Kontakta oss
          </a>{' '}
          för att prata sponsring.
        </p>
      </div>
    </div>
  );
}
