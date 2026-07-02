import 'server-only';
import { createClient } from '@/lib/supabase/server';
import type { UserRole } from '@/types/database.types';

const ROLE_RANK: Record<UserRole, number> = {
  visitor: 0,
  member: 1,
  volunteer: 2,
  editor: 3,
  admin: 4,
};

/**
 * Loads the current user + profile and throws if they don't meet the
 * minimum required role. Use this at the top of every Server Action
 * and Route Handler that mutates data — middleware only protects
 * page navigation, not direct API/action calls.
 */
export async function requireRole(minimum: UserRole) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('UNAUTHENTICATED');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  if (!profile) throw new Error('NO_PROFILE');

  if (ROLE_RANK[profile.role] < ROLE_RANK[minimum]) {
    throw new Error('FORBIDDEN');
  }

  return { user, profile };
}

export async function getCurrentProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return profile;
}
