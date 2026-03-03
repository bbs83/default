/* ============================================================
   Supabase Middleware Helper
   ============================================================
   Refreshes the auth session on every request so cookies
   stay valid. Called from the root middleware.ts file.
   Updated: Force rebuild
   ============================================================ */

import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function updateSession(request: NextRequest) {
  // Create a response that we can modify (add cookies)
  const supabaseResponse = NextResponse.next({ request });

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Skip Supabase session refresh if env vars are not set
  if (!supabaseUrl || !supabaseAnonKey) {
    console.log('[v0] Middleware: Supabase env vars not found, skipping session refresh');
    return supabaseResponse;
  }

  // Create Supabase client with cookie handling
  let response = supabaseResponse;
  
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
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
