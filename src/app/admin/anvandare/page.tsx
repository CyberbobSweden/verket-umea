import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { RoleSelect } from '@/components/admin/role-select';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Användare · Admin' };

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: users } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });

  return (
    <div>
      <h1 className="mb-2 text-3xl font-bold">Användare</h1>
      <p className="mb-8 text-sm text-mist">
        Gör en medlem till admin, redaktör eller volontär här. Alla rolländringar loggas i granskningsloggen.
      </p>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-white/10 bg-white/[0.02] text-xs uppercase tracking-widest text-mist">
            <tr>
              <th className="px-4 py-3">Namn</th>
              <th className="px-4 py-3">Medlemsnr</th>
              <th className="px-4 py-3">Medlem sedan</th>
              <th className="px-4 py-3">Roll</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3">{u.display_name}</td>
                <td className="px-4 py-3 font-mono text-xs text-mist">{u.membership_number ?? '—'}</td>
                <td className="px-4 py-3 text-mist">{formatDate(u.created_at)}</td>
                <td className="px-4 py-3">
                  <RoleSelect userId={u.id} currentRole={u.role} currentUserId={user!.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
