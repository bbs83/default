/* ============================================================
   Auth Callback — /api/auth/callback
   ============================================================
   Handles the redirect after email confirmation or OAuth.
   Exchanges the auth code for a session and redirects
   the user to the dashboard.
   ============================================================ */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  // Where to redirect after auth (defaults to /dashboard)
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = createClient();
    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // If something went wrong, redirect to login with error
  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
