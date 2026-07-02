import type { Metadata, Viewport } from 'next';
import { Inter, Rajdhani, JetBrains_Mono } from 'next/font/google';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/sonner';
import { getCurrentProfile } from '@/lib/authorize';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const rajdhani = Rajdhani({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-rajdhani',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-jetbrains', display: 'swap' });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://verketumea.se';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Verket Umeå — Kultur, musik & gaming utan filter',
    template: '%s · Verket Umeå',
  },
  description:
    'Verket Umeå är en ideell mötesplats för musik, gaming och alternativ kultur i Umeå. Konserter, LAN, workshops och en community som håller ihop.',
  keywords: ['Verket Umeå', 'ideell förening', 'konserter Umeå', 'metal Umeå', 'gaming Umeå', 'ungdomsgård kultur'],
  authors: [{ name: 'Verket Umeå' }],
  openGraph: {
    type: 'website',
    locale: 'sv_SE',
    url: siteUrl,
    siteName: 'Verket Umeå',
    title: 'Verket Umeå — Kultur, musik & gaming utan filter',
    description: 'En ideell mötesplats för musik, gaming och alternativ kultur i Umeå.',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630, alt: 'Verket Umeå' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verket Umeå',
    description: 'En ideell mötesplats för musik, gaming och alternativ kultur i Umeå.',
    images: ['/og-default.jpg'],
  },
  manifest: '/manifest.webmanifest',
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#0B0B10',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();

  return (
    <html lang="sv" className="dark scroll-smooth">
      <body className={`${inter.variable} ${rajdhani.variable} ${jetbrains.variable} min-h-screen`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-signal-500 focus:px-4 focus:py-2 focus:text-white"
        >
          Hoppa till innehåll
        </a>
        <Header profile={profile} />
        <main id="main-content">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
