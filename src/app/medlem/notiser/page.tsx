import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/authorize';
import { Bell } from 'lucide-react';

export const metadata: Metadata = { title: 'Notiser' };

export default async function NotificationsPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/logga-in?next=/medlem/notiser');

  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Mitt konto</p>
      <h1 className="mb-8 text-4xl font-bold">Notiser</h1>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/15 py-20 text-center">
        <Bell className="mb-4 h-8 w-8 text-mist" />
        <p className="text-mist">Inga notiser just nu. Nya event och svar på dina kommentarer dyker upp här.</p>
      </div>
    </div>
  );
}
