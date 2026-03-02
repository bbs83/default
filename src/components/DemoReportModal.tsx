/* ============================================================
   Demo Report Modal — full-screen modal showing sample report
   ============================================================
   Displays the hardcoded Northbridge Tech Solutions report.
   Accessible from the landing page without requiring login.
   ============================================================ */

'use client';

import { X } from 'lucide-react';
import Link from 'next/link';
import ReportRenderer from '@/components/ReportRenderer';
import { demoReport } from '@/data/demoReport';

interface DemoReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DemoReportModal({ isOpen, onClose }: DemoReportModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 overflow-y-auto">
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[110] bg-navy text-white p-2 rounded-full
                   hover:bg-navy-light transition-colors shadow-lg"
        aria-label="Close demo report"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Banner */}
      <div className="sticky top-0 z-[105] bg-gold text-navy text-center py-3 font-semibold text-sm">
        Sample Report — Northbridge Tech Solutions (Fictional Company)
      </div>

      {/* Report content */}
      <div className="bg-white min-h-screen">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <ReportRenderer report={demoReport} />
        </div>
      </div>

      {/* Fixed CTA at bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-[110] bg-navy border-t border-white/10 p-4">
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
