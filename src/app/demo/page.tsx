/* ============================================================
   Demo Report Page — /demo
   ============================================================
   Alternative to the modal — shows the full demo report
   as a standalone page. No login required.
   ============================================================ */

'use client';

import Link from 'next/link';
import ReportRenderer from '@/components/ReportRenderer';
import { demoReport } from '@/data/demoReport';
import Navbar from '@/components/Navbar';

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Banner */}
      <div className="bg-gold text-navy text-center py-3 font-semibold text-sm mt-16">
        Sample Report — Northbridge Tech Solutions (Fictional Company)
      </div>

      {/* Report content */}
      <main className="max-w-4xl mx-auto py-8 px-4">
        <div className="card">
          <ReportRenderer report={demoReport} />
        </div>
      </main>

      {/* Fixed CTA at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-navy border-t border-white/10 p-4 no-print">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="text-white/80 text-sm hidden sm:block">
            Ready to get your own valuation report?
          </p>
          <Link
            href="/signup"
            className="btn-gold text-sm py-2.5 px-6 mx-auto sm:mx-0"
          >
            Get Your Report for $49
          </Link>
        </div>
      </div>
    </div>
  );
}
