/* ============================================================
   Dashboard Page — /dashboard
   ============================================================
   Protected route. Shows a list of the user's valuation
   reports (or an empty state if they have none yet).
   ============================================================ */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import DashboardNavbar from '@/components/DashboardNavbar';
import { FileText, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { Report } from '@/types';

export default async function DashboardPage() {
  const supabase = await createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch the user's reports, newest first
  const { data: reports } = await supabase
    .from('reports')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar email={user.email || ''} />

      <main className="section-container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-navy">My Reports</h1>
          <Link
            href="/dashboard/new"
            className="btn-gold text-sm py-2.5 px-5 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Valuation
          </Link>
        </div>

        {/* Empty state */}
        {(!reports || reports.length === 0) && (
          <div className="card text-center py-16">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy mb-2">
              Your reports will appear here
            </h2>
            <p className="text-gray-500 mb-6">
              Start your first valuation to see it on your dashboard.
            </p>
            <Link
              href="/dashboard/new"
              className="btn-gold inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Start Your First Valuation
            </Link>
          </div>
        )}

        {/* Report cards grid */}
        {reports && reports.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(reports as Report[]).map((report) => (
              <div key={report.id} className="card hover:shadow-lg transition-shadow">
                {/* Status badge */}
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge status={report.status} />
                  <span className="text-xs text-gray-400">
                    {formatDate(report.created_at)}
                  </span>
                </div>

                {/* Company name */}
                <h3 className="text-lg font-semibold text-navy mb-1 truncate">
                  {report.company_name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{report.sector}</p>

                {/* Valuation range (only if complete) */}
                {report.status === 'complete' && report.valuation_low && report.valuation_high && (
                  <div className="bg-navy/5 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Estimated Value</p>
                    <p className="text-lg font-bold text-navy">
                      {formatCurrency(report.valuation_low, report.valuation_currency || 'USD')}
                      {' – '}
                      {formatCurrency(report.valuation_high, report.valuation_currency || 'USD')}
                    </p>
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Link
                    href={`/dashboard/report/${report.id}`}
                    className="flex-1 text-center text-sm font-medium py-2 px-3 rounded-lg
                               bg-navy text-white hover:bg-navy-light transition-colors"
                  >
                    {report.status === 'complete' ? 'View Report' : 'View Status'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

/** Status badge component */
function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { icon: React.ReactNode; label: string; classes: string }> = {
    pending: {
      icon: <Clock className="w-3 h-3" />,
      label: 'Pending',
      classes: 'bg-yellow-100 text-yellow-700',
    },
    generating: {
      icon: <Clock className="w-3 h-3" />,
      label: 'Generating',
      classes: 'bg-blue-100 text-blue-700',
    },
    complete: {
      icon: <CheckCircle className="w-3 h-3" />,
      label: 'Complete',
      classes: 'bg-green-100 text-green-700',
    },
    error: {
      icon: <AlertCircle className="w-3 h-3" />,
      label: 'Error',
      classes: 'bg-red-100 text-red-700',
    },
  };

  const { icon, label, classes } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${classes}`}>
      {icon}
      {label}
    </span>
  );
}
