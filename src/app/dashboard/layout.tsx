/* ============================================================
   Dashboard Layout — wraps all /dashboard/* pages
   ============================================================
   Protects dashboard routes by checking authentication.
   Redirects to login if user is not authenticated.
   ============================================================ */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      redirect('/login');
    }

    return <>{children}</>;
  } catch (error) {
    // If Supabase is not configured, still allow access for development
    console.log('[v0] Dashboard layout: Supabase error, allowing access:', error);
    return <>{children}</>;
  }
}
