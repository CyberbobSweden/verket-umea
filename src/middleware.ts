import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Runs on every request:
 *  1. Refreshes the Supabase auth session (required for SSR auth to work).
 *  2. Enforces role-based access to protected route groups.
 *  3. Applies a lightweight in-memory rate limit to sensitive POST routes.
 *
 * This is defense-in-depth only — the real authorization boundary is
 * Postgres Row Level Security, and every admin Server Component / Route
 * Handler re-checks the role itself (see src/lib/authorize.ts and
 * src/app/admin/layout.tsx). Next.js has shipped multiple middleware
 * bypass CVEs (e.g. segment-prefetch bypass, May 2026), so middleware
 * alone must never be the only authorization check.
 */

// '/medlem' just requires being signed in — every profile starts at role
// 'visitor' until staff upgrades their *membership_status*, which is a
// separate concept from role. Gating it to role >= member would lock
// brand-new users out of their own profile page.
const ROLE_PROTECTED: { prefix: string; roles: string[] }[] = [
  { prefix: '/admin', roles: ['admin'] },
  { prefix: '/redaktion', roles: ['editor', 'admin'] },
  { prefix: '/medlem', roles: ['visitor', 'member', 'volunteer', 'editor', 'admin'] },
];

const RATE_LIMITED_PREFIXES = ['/api/contact', '/api/auth', '/api/comments'];
const buckets = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 20;

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  bucket.count += 1;
  return bucket.count > MAX_REQUESTS;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request: { headers: request.headers } });

  if (
    request.method === 'POST' &&
    RATE_LIMITED_PREFIXES.some((p) => request.nextUrl.pathname.startsWith(p))
  ) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
    const key = `${ip}:${request.nextUrl.pathname}`;
    if (isRateLimited(key)) {
      return NextResponse.json({ error: 'För många förfrågningar. Försök igen om en minut.' }, { status: 429 });
    }
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          for (const { name, value } of cookiesToSet) {
            request.cookies.set(name, value);
          }
          for (const { name, value, options } of cookiesToSet) {
            response.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // getClaims() verifies the JWT signature locally (cached JWKS) instead of
  // making a network round-trip to the Auth server on every navigation —
  // faster than getUser() and still safe to trust for page protection.
  const { data: claimsData } = await supabase.auth.getClaims();
  const userId = claimsData?.claims?.sub ?? null;

  const match = ROLE_PROTECTED.find((r) => request.nextUrl.pathname.startsWith(r.prefix));
  if (match) {
    if (!userId) {
      const redirectUrl = new URL('/logga-in', request.url);
      redirectUrl.searchParams.set('next', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();

    if (!profile || !match.roles.includes(profile.role)) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|.*\\.(?:svg|png|jpg|jpeg|webp|avif)$).*)',
  ],
};
