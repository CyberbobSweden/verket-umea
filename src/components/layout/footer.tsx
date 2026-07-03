import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Youtube, Facebook } from 'lucide-react';
import { WaveformDivider } from '@/components/shared/waveform-divider';
import { NewsletterForm } from '@/components/shared/newsletter-form';
import { createClient } from '@/lib/supabase/server';

interface SocialLinks {
  instagram?: string;
  facebook?: string;
  youtube?: string;
  discord?: string;
}

export async function Footer() {
  const supabase = await createClient();
  const { data: setting } = await supabase.from('site_settings').select('value').eq('key', 'social_links').maybeSingle();
  const social = (setting?.value as SocialLinks) ?? {};

  return (
    <footer className="border-t border-white/10 bg-graphite">
      <div className="container py-12">
        <WaveformDivider className="mb-10 h-6 opacity-40" />
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="relative block h-8 w-36">
              <Image
                src="/logotyper/verket-logo-wide-inverted.png"
                alt="Verket Umeå"
                fill
                className="object-contain object-left"
                sizes="144px"
              />
            </span>
            <p className="mt-3 max-w-xs text-sm text-mist">
              En ideell mötesplats för musik, gaming och alternativ kultur. Drivs av medlemmar, för medlemmar — sedan
              starten.
            </p>
            {(social.instagram || social.youtube || social.facebook) && (
              <div className="mt-4 flex gap-3">
                {social.instagram && (
                  <a href={social.instagram} aria-label="Instagram" className="rounded-md border border-white/10 p-2 hover:border-signal-500 hover:text-signal-400">
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {social.youtube && (
                  <a href={social.youtube} aria-label="YouTube" className="rounded-md border border-white/10 p-2 hover:border-signal-500 hover:text-signal-400">
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
                {social.facebook && (
                  <a href={social.facebook} aria-label="Facebook" className="rounded-md border border-white/10 p-2 hover:border-signal-500 hover:text-signal-400">
                    <Facebook className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          <div>
            <p className="eyebrow mb-3">Utforska</p>
            <ul className="space-y-2 text-sm text-mist">
              <li><Link href="/event" className="hover:text-white">Event</Link></li>
              <li><Link href="/nyheter" className="hover:text-white">Nyheter</Link></li>
              <li><Link href="/galleri" className="hover:text-white">Galleri</Link></li>
              <li><Link href="/historia" className="hover:text-white">Historia</Link></li>
              <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Engagera dig</p>
            <ul className="space-y-2 text-sm text-mist">
              <li><Link href="/medlemskap" className="hover:text-white">Bli medlem</Link></li>
              <li><Link href="/volontar" className="hover:text-white">Volontär</Link></li>
              <li><Link href="/sponsorer" className="hover:text-white">Sponsorer</Link></li>
              <li><Link href="/community/forslag" className="hover:text-white">Förslagslåda</Link></li>
              <li><Link href="/kontakt" className="hover:text-white">Kontakt</Link></li>
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3">Nyhetsbrev</p>
            <p className="mb-3 text-sm text-mist">Missa inget event. Ett mejl i månaden, inget skräp.</p>
            <NewsletterForm />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-mist sm:flex-row">
          <p>© {new Date().getFullYear()} Verket Umeå — ideell förening, org.nr XXXXXX-XXXX</p>
          <div className="flex gap-4">
            <Link href="/integritetspolicy" className="hover:text-white">Integritetspolicy</Link>
            <Link href="/kontakt" className="hover:text-white">Kontakta styrelsen</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
