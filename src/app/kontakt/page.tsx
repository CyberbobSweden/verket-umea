import type { Metadata } from 'next';
import { Clock, Mail, MapPin } from 'lucide-react';
import { ContactForm } from '@/components/shared/contact-form';
import { createClient } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Kontakt', description: 'Kontakta Verket Umeå — öppettider, adress och kontaktformulär.' };

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*').in('key', ['opening_hours', 'contact_email']);
  const hours = settings?.find((s) => s.key === 'opening_hours')?.value as Record<string, string> | undefined;
  const email = (settings?.find((s) => s.key === 'contact_email')?.value as string) ?? 'verketforening@gmail.com';

  const dayLabels: Record<string, string> = { mon: 'Måndag', tue: 'Tisdag', wed: 'Onsdag', thu: 'Torsdag', fri: 'Fredag', sat: 'Lördag', sun: 'Söndag' };

  return (
    <div className="container py-16">
      <p className="eyebrow mb-2">Kontakt</p>
      <h1 className="mb-10 text-4xl font-bold sm:text-5xl">Hör av dig</h1>

      <div className="grid gap-12 lg:grid-cols-[1fr,380px]">
        <ContactForm />

        <div className="space-y-8">
          <div>
            <p className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <MapPin className="h-4 w-4 text-signal-400" /> Adress
            </p>
            <p className="text-mist">Götgatan 2, 903 27 Umeå</p>
            <div className="mt-3 overflow-hidden rounded-lg border border-white/10">
              <iframe
                title="Karta till Verket Umeå"
                src="https://www.google.com/maps?q=Götgatan+2,+903+27+Umeå&z=16&output=embed"
                width="100%"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <Clock className="h-4 w-4 text-signal-400" /> Öppettider
            </p>
            <ul className="space-y-1 text-sm text-mist">
              {hours &&
                Object.entries(hours).map(([day, val]) => (
                  <li key={day} className="flex justify-between">
                    <span>{dayLabels[day]}</span>
                    <span>{val}</span>
                  </li>
                ))}
            </ul>
          </div>

          <div>
            <p className="mb-3 flex items-center gap-2 font-display text-lg font-semibold">
              <Mail className="h-4 w-4 text-signal-400" /> E-post
            </p>
            <a href={`mailto:${email}`} className="text-signal-400 hover:underline">
              {email}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
