/* ============================================================
   Root Layout — wraps every page in the app
   ============================================================
   Sets up the Inter font, global styles, and toast notifications.
   ============================================================ */

import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';

export const metadata: Metadata = {
  title: 'Valtiq — AI-Powered Business Valuation',
  description:
    'Know What Your Business Is Worth — In Minutes. Professional-grade valuation reports, powered by AI and grounded in real market data.',
  keywords: ['business valuation', 'AI valuation', 'M&A', 'company valuation', 'DCF', 'EBITDA'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        {children}
        {/* Toast notifications appear in the top-right corner */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#0F1C2E',
              color: '#fff',
              borderRadius: '8px',
            },
            success: {
              iconTheme: { primary: '#C9A84C', secondary: '#0F1C2E' },
            },
          }}
        />
      </body>
    </html>
  );
}
