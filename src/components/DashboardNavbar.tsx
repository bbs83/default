/* ============================================================
   Dashboard Navbar — navigation bar for authenticated pages
   ============================================================
   Shows the Valtiq logo, "New Valuation" button, and user info.
   ============================================================ */

'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { LogOut, Plus } from 'lucide-react';
import toast from 'react-hot-toast';

interface DashboardNavbarProps {
  email: string;
}

export default function DashboardNavbar({ email }: DashboardNavbarProps) {
  const router = useRouter();
  const supabase = createClient();

  /** Sign the user out and redirect to the landing page */
  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success('Logged out successfully');
    router.push('/');
    router.refresh();
  };

  return (
    <nav className="sticky top-0 z-50 bg-navy border-b border-white/10">
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo — links back to dashboard */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-gold font-bold text-2xl tracking-tight">Valtiq</span>
        </Link>

        {/* Right side: New Valuation + user info */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard/new"
            className="btn-gold text-sm py-2 px-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New Valuation</span>
          </Link>

          {/* User email display */}
          <span className="text-white/70 text-sm hidden md:inline truncate max-w-[200px]">
            {email}
          </span>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="text-white/60 hover:text-white transition-colors p-2"
            title="Log out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}
