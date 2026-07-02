import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getCurrentProfile } from '@/lib/authorize';
import { MembershipCard } from '@/components/member/membership-card';

export const metadata: Metadata = { title: 'Medlemskort' };

export default async function MembershipCardPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect('/logga-in?next=/medlem/kort');

  return (
    <div className="container py-12">
      <p className="eyebrow mb-2">Mitt konto</p>
      <h1 className="mb-8 text-4xl font-bold">Digitalt medlemskort</h1>
      <MembershipCard profile={profile} />
      {profile.membership_status !== 'active' && (
        <p className="mt-6 max-w-md text-center text-sm text-mist">
          Du har inget aktivt medlemskap ännu.{' '}
          <a href="/medlemskap" className="text-signal-400 hover:underline">
            Bli medlem här
          </a>
          .
        </p>
      )}
    </div>
  );
}
