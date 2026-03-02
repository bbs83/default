/* ============================================================
   Supabase Browser Client
   ============================================================
   Use this in Client Components (anything with 'use client').
   It automatically handles auth token refresh in the browser.
   ============================================================ */

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Provide placeholder values during build/SSR when env vars aren't set.
  // The client will only be used in the browser where env vars are available.
  return createBrowserClient(
    url || 'https://placeholder.supabase.co',
    key || 'placeholder-key'
  );
}
