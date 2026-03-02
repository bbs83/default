/* ============================================================
   New Valuation Form — /dashboard/new
   ============================================================
   Multi-step form with progress bar (4 steps):
   1. Company Overview
   2. Financial History
   3. Financial Projections (for DCF)
   4. Delivery & Payment
   ============================================================ */

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import DashboardNavbar from '@/components/DashboardNavbar';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, Loader2, CreditCard, HelpCircle, CheckCircle } from 'lucide-react';
import { SECTORS, VALUATION_PURPOSES, CURRENCIES } from '@/lib/utils';
import type {
  CompanyOverview,
  FinancialHistory,
  FinancialProjections,
  DeliveryInfo,
  ValuationFormData,
} from '@/types';

export default function NewValuationPage() {
  const router = useRouter();
  const supabase = createClient();

  // Current step (1-4)
  const [step, setStep] = useState(1);
  // Loading state for the payment button
  const [loading, setLoading] = useState(false);
  // User email (fetched from Supabase)
  const [userEmail, setUserEmail] = useState('');

  // --- Step 1: Company Overview ---
  const [companyOverview, setCompanyOverview] = useState<CompanyOverview>({
    companyName: '',
    sector: '' as CompanyOverview['sector'],
    country: '',
    employees: 0,
    yearFounded: 2020,
    description: '',
    purpose: '' as CompanyOverview['purpose'],
  });

  // --- Step 2: Financial History ---
  const [financials, setFinancials] = useState<FinancialHistory>({
    currency: 'USD',
    revenueY1: 0,
    revenueY2: 0,
    revenueY3: undefined,
    ebitdaY1: 0,
    ebitdaY2: 0,
    ebitdaY3: undefined,
    netDebt: 0,
    grossMargin: 0,
    arr: undefined,
    nrr: undefined,
    payingCustomers: undefined,
  });

  // --- Step 3: Financial Projections ---
  const [projections, setProjections] = useState<FinancialProjections>({
    growthRateY1: 0,
    growthRateY2: 0,
    growthRateY3: 0,
    longTermGrowthRate: 3,
    targetEbitdaMargin: 0,
    hasCapex: false,
    capexDescription: '',
  });

  // --- Step 4: Delivery ---
  const [delivery, setDelivery] = useState<DeliveryInfo>({
    email: '',
  });

  // Fetch user email on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email) {
        setUserEmail(user.email);
        setDelivery({ email: user.email });
      }
    };
    getUser();
  }, [supabase.auth]);

  /** Whether the current sector is SaaS (shows extra fields) */
  const isSaaS = companyOverview.sector === 'Technology — SaaS';

  /** Move to the next step (with basic validation) */
  const nextStep = () => {
    // Validate current step
    if (step === 1) {
      if (!companyOverview.companyName || !companyOverview.sector || !companyOverview.country ||
          !companyOverview.employees || !companyOverview.description || !companyOverview.purpose) {
        toast.error('Please fill in all required fields.');
        return;
      }
    }
    if (step === 2) {
      if (!financials.revenueY1 || !financials.revenueY2 || !financials.grossMargin) {
        toast.error('Please fill in all required financial fields.');
        return;
      }
      if (isSaaS && (!financials.arr || !financials.nrr)) {
        toast.error('ARR and Net Revenue Retention are required for SaaS companies.');
        return;
      }
    }
    if (step === 3) {
      if (!projections.growthRateY1 || !projections.growthRateY2 ||
          !projections.growthRateY3 || !projections.targetEbitdaMargin) {
        toast.error('Please fill in all projection fields.');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, 4));
  };

  /** Move to the previous step */
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  /** Handle the final "Proceed to Payment" action */
  const handlePayment = async () => {
    setLoading(true);

    const formData: ValuationFormData = {
      companyOverview,
      financialHistory: financials,
      financialProjections: projections,
      delivery,
    };

    try {
      // Create a Stripe Checkout session via our API
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNavbar email={userEmail} />

      <main className="section-container py-8 max-w-3xl">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {['Company Overview', 'Financials', 'Projections', 'Payment'].map((label, i) => (
              <div key={label} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
                    ${step > i + 1
                      ? 'bg-gold text-navy'
                      : step === i + 1
                        ? 'bg-navy text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-sm hidden sm:inline ${step === i + 1 ? 'font-semibold text-navy' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
          {/* Progress bar track */}
          <div className="h-1 bg-gray-200 rounded-full">
            <div
              className="h-1 bg-gold rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form card */}
        <div className="card animate-fade-in">
          {/* ============================================================
              STEP 1 — Company Overview
              ============================================================ */}
          {step === 1 && (
            <div>
              <h2 className="text-xl font-bold text-navy mb-1">Company Overview</h2>
              <p className="text-gray-500 text-sm mb-6">
                Tell us about your company. This information shapes the analysis.
              </p>

              <div className="space-y-4">
                <FormField label="Company Name" required>
                  <input
                    type="text"
                    value={companyOverview.companyName}
                    onChange={(e) => setCompanyOverview({ ...companyOverview, companyName: e.target.value })}
                    className="input-field"
                    placeholder="e.g., Acme Corp"
                  />
                </FormField>

                <FormField label="Industry / Sector" required>
                  <select
                    value={companyOverview.sector}
                    onChange={(e) => setCompanyOverview({ ...companyOverview, sector: e.target.value as CompanyOverview['sector'] })}
                    className="input-field"
                  >
                    <option value="">Select a sector...</option>
                    {SECTORS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Country of Operation" required>
                  <input
                    type="text"
                    value={companyOverview.country}
                    onChange={(e) => setCompanyOverview({ ...companyOverview, country: e.target.value })}
                    className="input-field"
                    placeholder="e.g., United States"
                  />
                </FormField>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Number of Employees" required>
                    <input
                      type="number"
                      value={companyOverview.employees || ''}
                      onChange={(e) => setCompanyOverview({ ...companyOverview, employees: parseInt(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="e.g., 50"
                      min={1}
                    />
                  </FormField>

                  <FormField label="Year Founded" required>
                    <input
                      type="number"
                      value={companyOverview.yearFounded || ''}
                      onChange={(e) => setCompanyOverview({ ...companyOverview, yearFounded: parseInt(e.target.value) || 2020 })}
                      className="input-field"
                      placeholder="e.g., 2018"
                      min={1900}
                      max={new Date().getFullYear()}
                    />
                  </FormField>
                </div>

                <FormField label="Brief Business Description" required>
                  <textarea
                    value={companyOverview.description}
                    onChange={(e) => setCompanyOverview({ ...companyOverview, description: e.target.value.slice(0, 600) })}
                    className="input-field min-h-[100px] resize-none"
                    maxLength={600}
                    placeholder="Describe what your company does, who your customers are, and what makes it different."
                  />
                  <p className="text-xs text-gray-400 mt-1 text-right">
                    {companyOverview.description.length}/600
                  </p>
                </FormField>

                <FormField label="Purpose of Valuation" required>
                  <select
                    value={companyOverview.purpose}
                    onChange={(e) => setCompanyOverview({ ...companyOverview, purpose: e.target.value as CompanyOverview['purpose'] })}
                    className="input-field"
                  >
                    <option value="">Select purpose...</option>
                    {VALUATION_PURPOSES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </FormField>
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 2 — Financial History
              ============================================================ */}
          {step === 2 && (
            <div>
              <h2 className="text-xl font-bold text-navy mb-1">Financial History</h2>
              <p className="text-gray-500 text-sm mb-6">
                Provide your last 2–3 years of financial data.
              </p>

              <div className="space-y-4">
                <FormField label="Currency" required>
                  <select
                    value={financials.currency}
                    onChange={(e) => setFinancials({ ...financials, currency: e.target.value as FinancialHistory['currency'] })}
                    className="input-field"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </FormField>

                {/* Revenue rows */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Revenue Year 1 (most recent)" required>
                    <input
                      type="number"
                      value={financials.revenueY1 || ''}
                      onChange={(e) => setFinancials({ ...financials, revenueY1: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="e.g., 5000000"
                    />
                  </FormField>
                  <FormField label="Revenue Year 2 (prior)" required>
                    <input
                      type="number"
                      value={financials.revenueY2 || ''}
                      onChange={(e) => setFinancials({ ...financials, revenueY2: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </FormField>
                  <FormField label="Revenue Year 3 (optional)">
                    <input
                      type="number"
                      value={financials.revenueY3 || ''}
                      onChange={(e) => setFinancials({ ...financials, revenueY3: parseFloat(e.target.value) || undefined })}
                      className="input-field"
                    />
                  </FormField>
                </div>

                {/* EBITDA rows */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="EBITDA Year 1" required>
                    <input
                      type="number"
                      value={financials.ebitdaY1 || ''}
                      onChange={(e) => setFinancials({ ...financials, ebitdaY1: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="Can be negative"
                    />
                  </FormField>
                  <FormField label="EBITDA Year 2" required>
                    <input
                      type="number"
                      value={financials.ebitdaY2 || ''}
                      onChange={(e) => setFinancials({ ...financials, ebitdaY2: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </FormField>
                  <FormField label="EBITDA Year 3 (optional)">
                    <input
                      type="number"
                      value={financials.ebitdaY3 || ''}
                      onChange={(e) => setFinancials({ ...financials, ebitdaY3: parseFloat(e.target.value) || undefined })}
                      className="input-field"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField label="Net Debt (debt minus cash)" required tooltip="Enter 0 if debt-free. Enter a negative number if you have more cash than debt (net cash position).">
                    <input
                      type="number"
                      value={financials.netDebt || ''}
                      onChange={(e) => setFinancials({ ...financials, netDebt: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="Can be negative for net cash"
                    />
                  </FormField>
                  <FormField label="Gross Margin % (most recent year)" required>
                    <input
                      type="number"
                      value={financials.grossMargin || ''}
                      onChange={(e) => setFinancials({ ...financials, grossMargin: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="e.g., 70"
                      min={0}
                      max={100}
                    />
                  </FormField>
                </div>

                {/* SaaS-specific fields */}
                {isSaaS && (
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <p className="text-sm font-semibold text-navy mb-4">SaaS-Specific Metrics</p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <FormField label="ARR (Annual Recurring Revenue)" required>
                        <input
                          type="number"
                          value={financials.arr || ''}
                          onChange={(e) => setFinancials({ ...financials, arr: parseFloat(e.target.value) || undefined })}
                          className="input-field"
                          placeholder="e.g., 4200000"
                        />
                      </FormField>
                      <FormField label="Net Revenue Retention %" required tooltip="Expansion minus churn from existing customers. 100% = flat, 120% = strong growth from existing base.">
                        <input
                          type="number"
                          value={financials.nrr || ''}
                          onChange={(e) => setFinancials({ ...financials, nrr: parseFloat(e.target.value) || undefined })}
                          className="input-field"
                          placeholder="e.g., 115"
                        />
                      </FormField>
                      <FormField label="Paying Customers (optional)">
                        <input
                          type="number"
                          value={financials.payingCustomers || ''}
                          onChange={(e) => setFinancials({ ...financials, payingCustomers: parseInt(e.target.value) || undefined })}
                          className="input-field"
                        />
                      </FormField>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 3 — Financial Projections
              ============================================================ */}
          {step === 3 && (
            <div>
              <h2 className="text-xl font-bold text-navy mb-1">Financial Projections</h2>
              <p className="text-gray-500 text-sm mb-6">
                These projections are used to calculate a Discounted Cash Flow
                valuation. Be realistic — conservative assumptions produce more
                credible results.
              </p>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField label="Revenue Growth Y1 (%)" required>
                    <input
                      type="number"
                      value={projections.growthRateY1 || ''}
                      onChange={(e) => setProjections({ ...projections, growthRateY1: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="e.g., 30"
                    />
                  </FormField>
                  <FormField label="Revenue Growth Y2 (%)" required>
                    <input
                      type="number"
                      value={projections.growthRateY2 || ''}
                      onChange={(e) => setProjections({ ...projections, growthRateY2: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </FormField>
                  <FormField label="Revenue Growth Y3 (%)" required>
                    <input
                      type="number"
                      value={projections.growthRateY3 || ''}
                      onChange={(e) => setProjections({ ...projections, growthRateY3: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                    />
                  </FormField>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Long-Term Growth Rate (%)"
                    required
                    tooltip="Typically 2–4% for mature businesses, 5–8% for high-growth."
                  >
                    <input
                      type="number"
                      value={projections.longTermGrowthRate || ''}
                      onChange={(e) => setProjections({ ...projections, longTermGrowthRate: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="e.g., 3"
                    />
                  </FormField>
                  <FormField
                    label="Expected EBITDA Margin (stabilized) %"
                    required
                    tooltip="What do you expect your EBITDA margin to be once the business reaches cruising speed?"
                  >
                    <input
                      type="number"
                      value={projections.targetEbitdaMargin || ''}
                      onChange={(e) => setProjections({ ...projections, targetEbitdaMargin: parseFloat(e.target.value) || 0 })}
                      className="input-field"
                      placeholder="e.g., 20"
                    />
                  </FormField>
                </div>

                <FormField label="Major planned capital expenditures in next 3 years?">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={!projections.hasCapex}
                        onChange={() => setProjections({ ...projections, hasCapex: false })}
                        className="text-gold focus:ring-gold"
                      />
                      <span className="text-sm">No</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        checked={projections.hasCapex}
                        onChange={() => setProjections({ ...projections, hasCapex: true })}
                        className="text-gold focus:ring-gold"
                      />
                      <span className="text-sm">Yes</span>
                    </label>
                  </div>
                </FormField>

                {projections.hasCapex && (
                  <FormField label="Describe planned capital expenditures">
                    <textarea
                      value={projections.capexDescription || ''}
                      onChange={(e) => setProjections({ ...projections, capexDescription: e.target.value })}
                      className="input-field min-h-[80px] resize-none"
                      placeholder="Briefly describe your planned investments..."
                    />
                  </FormField>
                )}
              </div>
            </div>
          )}

          {/* ============================================================
              STEP 4 — Delivery & Payment
              ============================================================ */}
          {step === 4 && (
            <div>
              <h2 className="text-xl font-bold text-navy mb-1">Delivery & Payment</h2>
              <p className="text-gray-500 text-sm mb-6">
                Confirm your details and proceed to payment.
              </p>

              <div className="space-y-6">
                <FormField label="Email for Report Delivery" required>
                  <input
                    type="email"
                    value={delivery.email}
                    onChange={(e) => setDelivery({ email: e.target.value })}
                    className="input-field"
                    placeholder="you@company.com"
                  />
                </FormField>

                {/* Summary checklist */}
                <div className="bg-gray-50 rounded-lg p-5">
                  <p className="font-semibold text-navy mb-3">Your Report Will Include:</p>
                  <div className="space-y-2">
                    {[
                      'Executive Summary',
                      'Business & Industry Overview',
                      '3-Year Financial Analysis',
                      'Three Valuation Methodologies (Market Multiple, Comparable Transactions, DCF)',
                      'Sensitivity Analysis Table',
                      'Value Drivers & Risk Factors',
                      'Strategic Recommendations',
                      'PDF Download + Email Delivery',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                        <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Company summary */}
                <div className="bg-navy/5 rounded-lg p-5">
                  <p className="font-semibold text-navy mb-2">Report For</p>
                  <p className="text-gray-700">{companyOverview.companyName}</p>
                  <p className="text-sm text-gray-500">{companyOverview.sector} · {companyOverview.country}</p>
                </div>

                {/* Price */}
                <div className="border-2 border-gold rounded-lg p-5 text-center">
                  <p className="text-sm text-gray-500 mb-1">Total</p>
                  <p className="text-4xl font-bold text-navy">$49</p>
                  <p className="text-xs text-gray-400 mt-1">One-time payment. No subscription.</p>
                </div>

                {/* Payment button */}
                <button
                  onClick={handlePayment}
                  disabled={loading || !delivery.email}
                  className="btn-gold w-full flex items-center justify-center gap-2 text-lg py-4 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 spinner" />
                  ) : (
                    <CreditCard className="w-5 h-5" />
                  )}
                  {loading ? 'Redirecting to Stripe...' : 'Proceed to Payment'}
                </button>

                <p className="text-xs text-gray-400 text-center">
                  Secure payment processed by Stripe. You will be redirected to complete payment.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================
              Navigation Buttons (Back / Next)
              ============================================================ */}
          {step < 4 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </button>
              ) : (
                <div />
              )}
              <button onClick={nextStep} className="btn-gold flex items-center gap-2">
                Next
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {step === 4 && step > 1 && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={prevStep}
                className="flex items-center gap-2 text-gray-500 hover:text-navy transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Projections
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   FormField — reusable form field wrapper with label & tooltip
   ============================================================ */
function FormField({
  label,
  required,
  tooltip,
  children,
}: {
  label: string;
  required?: boolean;
  tooltip?: string;
  children: React.ReactNode;
}) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
        {tooltip && (
          <span className="relative inline-block ml-1">
            <button
              type="button"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="text-gray-400 hover:text-gray-600"
            >
              <HelpCircle className="w-3.5 h-3.5 inline" />
            </button>
            {showTooltip && (
              <span className="absolute z-10 bottom-full left-1/2 -translate-x-1/2 mb-2
                               bg-navy text-white text-xs rounded-lg py-2 px-3 w-56 shadow-lg">
                {tooltip}
              </span>
            )}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}
