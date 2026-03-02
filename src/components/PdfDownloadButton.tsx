/* ============================================================
   PDF Download Button
   ============================================================
   Uses the browser's print-to-PDF functionality as a reliable
   cross-platform PDF solution. When clicked, it triggers
   window.print() which uses the print-optimized CSS.

   Note: @react-pdf/renderer is available for programmatic
   PDF generation if needed in the future, but browser print
   provides the most faithful reproduction of the report layout.
   ============================================================ */

'use client';

import { Download } from 'lucide-react';
import type { Report } from '@/types';

interface PdfDownloadButtonProps {
  report: Report;
}

export default function PdfDownloadButton({ report }: PdfDownloadButtonProps) {
  const handleDownload = () => {
    // Use the browser's built-in print functionality
    // The CSS @media print rules in globals.css hide nav/footer
    window.print();
  };

  return (
    <button
      onClick={handleDownload}
      className="btn-navy flex items-center gap-2 text-sm py-2 px-4"
    >
      <Download className="w-4 h-4" />
      Download PDF
    </button>
  );
}
