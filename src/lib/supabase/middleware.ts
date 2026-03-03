/* ============================================================
   Supabase Middleware Helper - v2
   ============================================================
   Refreshes the auth session on every request so cookies
   stay valid. Called from the root middleware.ts file.
   ============================================================ */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Create a response that we can modify (add cookies)
  const defaultResponse = NextResponse.next({ request });

  // Get environment variables - check both naming conventions
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  // Skip Supabase session refresh if env vars are not set
  if (!url || !anonKey) {
    return defaultResponse;
  }

  // Create Supabase client with cookie handling
  let response = defaultResponse;
  
  const supabase = createServerClient(
    url,
    anonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: any }[]) {
          // Set cookies on the request (for downstream server components)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Recreate response with updated request
          response = NextResponse.next({ request });
          // Set cookies on the response (sent back to browser)
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh the auth session (reads and updates cookies)
  await supabase.auth.getUser();

  return response;
}
