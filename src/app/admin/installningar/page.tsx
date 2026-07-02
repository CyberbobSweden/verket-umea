import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { SiteSettingsForm } from '@/components/admin/site-settings-form';

export const metadata: Metadata = { title: 'Inställningar · Admin' };

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data: settings } = await supabase.from('site_settings').select('*');
  const get = (key: string) => settings?.find((s) => s.key === key)?.value;

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">Inställningar</h1>
      <SiteSettingsForm
        contactEmail={(get('contact_email') as string) ?? ''}
        adminBootstrapEmail={((get('admin_bootstrap_email') as { email: string })?.email) ?? ''}
        openingHours={(get('opening_hours') as Record<string, string>) ?? {}}
      />
    </div>
  );
}
