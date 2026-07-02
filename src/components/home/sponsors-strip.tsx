import Image from 'next/image';
import { createClient } from '@/lib/supabase/server';
import { SectionHeading } from '@/components/shared/section-heading';

export async function SponsorsStrip() {
  const supabase = await createClient();
  const { data: sponsors } = await supabase.from('sponsors').select('*').order('sort_order');

  if (!sponsors || sponsors.length === 0) return null;

  return (
    <section className="container py-16">
      <SectionHeading eyebrow="Tack till" title="Våra samarbetspartners" href="/sponsorer" />
      <div className="flex flex-wrap items-center gap-10 opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0">
        {sponsors.map((s) => (
          <a key={s.id} href={s.website_url ?? '#'} target="_blank" rel="noopener noreferrer" className="relative h-10 w-32">
            <Image src={s.logo_url} alt={s.name} fill className="object-contain" />
          </a>
        ))}
      </div>
    </section>
  );
}
