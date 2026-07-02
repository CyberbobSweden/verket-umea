import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Newspaper, CalendarDays } from 'lucide-react';
import { getCurrentProfile } from '@/lib/authorize';

export const metadata: Metadata = { title: 'Redaktion' };

export default async function EditorHomePage() {
  const profile = await getCurrentProfile();
  if (!profile || (profile.role !== 'editor' && profile.role !== 'admin')) redirect('/');

  return (
    <div className="container py-12">
      <h1 className="mb-8 text-3xl font-bold">Redaktion</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/nyheter" className="flex items-center gap-3 rounded-lg border border-white/10 p-6 hover:border-signal-500/50">
          <Newspaper className="h-6 w-6 text-signal-400" />
          <div>
            <p className="font-display font-semibold">Hantera nyheter</p>
            <p className="text-sm text-mist">Skriv, redigera och publicera artiklar.</p>
          </div>
        </Link>
        <Link href="/admin/event" className="flex items-center gap-3 rounded-lg border border-white/10 p-6 hover:border-signal-500/50">
          <CalendarDays className="h-6 w-6 text-signal-400" />
          <div>
            <p className="font-display font-semibold">Hantera event</p>
            <p className="text-sm text-mist">Skapa, publicera och importera event.</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
