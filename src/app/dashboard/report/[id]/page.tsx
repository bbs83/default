/* ============================================================
   Report Page — /dashboard/report/[id]
   ============================================================
   Protected route that displays a generated valuation report.
   Shows different states: generating, complete, error.
   ============================================================ */

'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import DashboardNavbar from '@/components/DashboardNavbar';
import ReportRenderer from '@/components/ReportRenderer';
import LoadingSpinner from '@/components/LoadingSpinner';
import PdfDownloadButton from '@/components/PdfDownloadButton';
import { ArrowLeft, AlertCircle, RefreshCw } from 'lucide-react';
import type { Report } from '@/types';

export default function ReportPage() {
  const params = useParams();
  const reportId = params.id as string;
  const supabase = createClient();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState('');

  // Fetch the report and poll for updates while generating
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchReport = async () => {
      // Get user email for navbar
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) setUserEmail(user.email);

      // Fetch the report
      const { data, error: fetchError } = await supabase
        .from('reports')
        .select('*')
        .eq('id', reportId)
        .single();

      if (fetchError) {
        setError('Report not found');
        setLoading(false);
        return;
      }

      setReport(data as Report);
      setLoading(false);

      // If still generating, poll every 5 seconds for updates
      if (data.status === 'generating' || data.status === 'pending') {
        interval = setInterval(async () => {
          const { data: updated } = await supabase
            .from('reports')
            .select('*')
            .eq('id', reportId)
            .single();

          if (updated) {
            setReport(updated as Report);
            // Stop polling when done
            if (updated.status === 'complete' || updated.status === 'error') {
              clearInterval(interval);
            }
          }
        }, 5000);
      }
    };

    fetchReport();

    // Clean up polling interval
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [reportId, supabase]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="no-print">
        <DashboardNavbar email={userEmail} />
      </div>

      <main className="section-container py-8 max-w-4xl">
        {/* Back link + actions bar */}
        <div className="no-print flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {/* Download PDF button — only shown when report is complete */}
          {report?.status === 'complete' && report.report_content && (
            <PdfDownloadButton report={report} />
          )}
        </div>

        {/* Loading state */}
        {loading && (
          <div className="card text-center py-16">
            <LoadingSpinner size="lg" message="Loading report..." />
          </div>
        )}

        {/* Error state — report not found */}
        {error && (
          <div className="card text-center py-16">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy mb-2">{error}</h2>
            <Link href="/dashboard" className="text-gold hover:underline">
              Return to Dashboard
            </Link>
          </div>
        )}

        {/* Generating state */}
        {report && (report.status === 'pending' || report.status === 'generating') && (
          <div className="card text-center py-16">
            <LoadingSpinner size="lg" />
            <h2 className="text-xl font-semibold text-navy mt-6 mb-2">
              Your report is being generated
            </h2>
            <p className="text-gray-500 mb-4">
              This takes about 60–90 seconds. The page will update automatically.
            </p>
            <div className="bg-navy/5 rounded-lg p-4 max-w-sm mx-auto">
              <p className="text-sm text-gray-600">
                <strong>Company:</strong> {report.company_name}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Sector:</strong> {report.sector}
              </p>
            </div>
          </div>
        )}

        {/* Error state — generation failed */}
        {report && report.status === 'error' && (
          <div className="card text-center py-16">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy mb-2">
              Report Generation Failed
            </h2>
            <p className="text-gray-500 mb-6">
              We encountered an error while generating your report.
              Please try again or contact support.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => window.location.reload()}
                className="btn-navy flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </button>
              <a
                href="mailto:support@valtiq.com"
                className="text-gold hover:underline"
              >
                Contact Support
              </a>
            </div>
          </div>
        )}

        {/* Complete state — render the full report */}
        {report && report.status === 'complete' && report.report_content && (
          <div className="card">
            <ReportRenderer report={report.report_content} />
          </div>
        )}
      </main>
    </div>
  );
}
