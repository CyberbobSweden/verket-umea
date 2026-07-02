import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

/**
 * Service-role client. NEVER import this from client-side code — the
 * `server-only` import above makes that a build-time error.
 * Bypasses RLS, so every call site must re-check permissions manually
 * (see src/lib/authorize.ts).
 */
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
