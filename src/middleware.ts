/* ============================================================
   Next.js Middleware
   ============================================================
   Runs on every request to keep the Supabase auth session
   fresh. Also protects /dashboard routes by redirecting
   unauthenticated users to /login.
   ============================================================ */

import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';
import { createServerClient } from '@supabase/ssr';

export async function middleware(request: NextRequest) {
  // First, refresh the Supabase session cookies
  const response = await updateSession(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip auth protection if env vars are not set
  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  // Protect /dashboard routes — redirect to /login if not logged in
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const supabase = createServerClient(
      supabaseUrl,
      supabaseAnonKey,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll() {
            // No-op: we already set cookies in updateSession
          },
        },
      }
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return response;
}

// Run middleware on all pages except static files and API routes
// that handle their own auth (like webhooks)
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
