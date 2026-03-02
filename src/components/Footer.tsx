/* ============================================================
   Footer — site footer for the landing page
   ============================================================ */

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-navy text-white/60 py-12 border-t border-white/10">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo */}
          <Link href="/" className="text-gold font-bold text-xl tracking-tight">
            Valtiq
          </Link>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-sm">
            &copy; 2025 Valtiq. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
