/* ============================================================
   Navbar — top navigation bar for the landing page
   ============================================================
   Shows the Valtiq logo and a CTA button.
   A separate DashboardNavbar is used inside /dashboard.
   ============================================================ */

'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-navy/95 backdrop-blur-sm border-b border-white/10">
      <div className="section-container flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-gold font-bold text-2xl tracking-tight">Valtiq</span>
        </Link>

        {/* CTA */}
        <Link
          href="/signup"
          className="btn-gold text-sm py-2 px-5"
        >
          Get My Valuation
        </Link>
      </div>
    </nav>
  );
}
