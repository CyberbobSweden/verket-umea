import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/authorize';
import { ProfileForm } from '@/components/member/profile-form';

export const metadata: Metadata = { title: 'Min profil' };

export default async function ProfilePage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/logga-in?next=/medlem/profil');

  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Mitt konto</p>
      <h1 className="mb-8 text-4xl font-bold">Min profil</h1>
      <ProfileForm profile={profile} />
    </div>
  );
}
