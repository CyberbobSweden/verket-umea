import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database.types';

/**
 * Supabase client for use in Server Components, Route Handlers and
 * Server Actions. Respects the current user's session cookie, so all
 * queries are subject to Row Level Security as that user.
 *
 * Async because Next.js 15 made `cookies()` an async API — every call
 * site does `await createClient()`.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            for (const { name, value, options } of cookiesToSet) {
              cookieStore.set(name, value, options);
            }
          } catch {
            // Called from a Server Component with no cookie-write access —
            // safe to ignore, middleware refreshes the session on every
            // request instead.
          }
        },
      },
    }
  );
}
