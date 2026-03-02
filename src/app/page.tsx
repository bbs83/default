/* ============================================================
   Landing Page — the main marketing page at /
   ============================================================
   Contains: Hero section, How It Works, What's Inside,
   Pricing, Demo Report CTA, and Footer.
   ============================================================ */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import DemoReportModal from '@/components/DemoReportModal';
import {
  FileText,
  Brain,
  Zap,
  CheckCircle,
  ArrowRight,
  BarChart3,
  Shield,
  TrendingUp,
} from 'lucide-react';

export default function LandingPage() {
  // Controls visibility of the demo report modal
  const [showDemo, setShowDemo] = useState(false);

  return (
    <>
      <Navbar />

      {/* ============================================================
          HERO SECTION
          ============================================================ */}
      <section className="bg-navy min-h-screen flex items-center pt-16">
        <div className="section-container py-20 text-center">
          {/* Badge */}
          <div className="inline-block bg-gold/10 text-gold text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            AI-Powered Business Valuation
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6 max-w-4xl mx-auto">
            Know What Your Business Is Worth —{' '}
            <span className="text-gold">In Minutes</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
            Investment-grade valuation reports built by AI, grounded in real market
            data and M&amp;A benchmarks. Used by founders, CFOs, and advisors.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setShowDemo(true)}
              className="btn-outline w-full sm:w-auto"
            >
              See a Sample Report
            </button>
            <Link href="/signup" className="btn-gold w-full sm:w-auto text-center">
              Get My Valuation — $49
              <ArrowRight className="inline ml-2 w-4 h-4" />
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 mt-12 text-white/40 text-sm">
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4" /> Confidential
            </span>
            <span className="flex items-center gap-1.5">
              <Brain className="w-4 h-4" /> Claude Opus AI
            </span>
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> Real Market Data
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================
          HOW IT WORKS
          ============================================================ */}
      <section className="py-20 bg-white" id="how-it-works">
        <div className="section-container">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-4">
            How It Works
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Three simple steps to a professional valuation report.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Step 1 */}
            <StepCard
              icon={<FileText className="w-8 h-8" />}
              step="1"
              title="Fill In Your Company Details"
              description="A guided 10-minute form walks you through company overview, financials, and projections step by step."
            />
            {/* Step 2 */}
            <StepCard
              icon={<Brain className="w-8 h-8" />}
              step="2"
              title="AI Builds Your Report"
              description="Claude Opus analyzes your financials, researches your industry in real time, and applies institutional valuation methodology."
            />
            {/* Step 3 */}
            <StepCard
              icon={<Zap className="w-8 h-8" />}
              step="3"
              title="Receive It Instantly"
              description="Your full PDF report is delivered to your browser and inbox — ready to share with investors, advisors, or your board."
            />
          </div>
        </div>
      </section>

      {/* ============================================================
          WHAT'S INSIDE EVERY REPORT
          ============================================================ */}
      <section className="py-20 bg-gray-50">
        <div className="section-container">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-4">
            What&apos;s Inside Every Report
          </h2>
          <p className="text-gray-500 text-center mb-14 max-w-xl mx-auto">
            Comprehensive, institutional-quality analysis in every report.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {[
              'Executive Summary',
              'Business Overview & Competitive Positioning',
              'Industry Overview & M&A Trends (AI-researched)',
              '3-Year Financial Analysis with growth metrics',
              'EV/EBITDA or EV/Revenue Valuation',
              'Comparable Transactions Analysis',
              'Discounted Cash Flow (DCF) Model',
              'Valuation Range with Sensitivity Table',
              'Key Value Drivers',
              'Risk Factors',
              'Conclusion & Strategic Recommendations',
            ].map((item) => (
              <div key={item} className="flex items-start gap-3 p-3">
                <CheckCircle className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          PRICING
          ============================================================ */}
      <section className="py-20 bg-white" id="pricing">
        <div className="section-container">
          <h2 className="text-3xl md:text-4xl font-bold text-navy text-center mb-14">
            Simple, Transparent Pricing
          </h2>

          <div className="max-w-md mx-auto">
            <div className="card border-2 border-navy relative overflow-hidden">
              {/* Popular badge */}
              <div className="absolute top-0 right-0 bg-gold text-navy text-xs font-bold px-4 py-1 rounded-bl-lg">
                ONE-TIME
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-navy mb-1">Full Valuation Report</h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className="text-5xl font-bold text-navy">$49</span>
                </div>
                <p className="text-gray-500 text-sm">One-time payment. No subscription.</p>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  'Executive Summary',
                  'Business & Industry Overview',
                  '3-Year Financial Analysis',
                  'Three Valuation Methodologies',
                  'Sensitivity Analysis Table',
                  'Value Drivers & Risk Factors',
                  'Strategic Recommendations',
                  'PDF Download + Email Delivery',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-gold shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>

              <Link
                href="/signup"
                className="btn-gold w-full text-center block"
              >
                Generate My Report
              </Link>

              <p className="text-xs text-gray-400 text-center mt-3">
                Report saved to your dashboard forever.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          DEMO REPORT CTA
          ============================================================ */}
      <section className="py-20 bg-navy">
        <div className="section-container text-center">
          <BarChart3 className="w-12 h-12 text-gold mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Not Sure What You&apos;ll Get?
          </h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">
            Browse a complete sample report for a fictional company before you pay.
            See exactly what a Valtiq valuation report looks like.
          </p>
          <button
            onClick={() => setShowDemo(true)}
            className="btn-gold"
          >
            View Sample Report
          </button>
        </div>
      </section>

      <Footer />

      {/* Demo Report Modal */}
      <DemoReportModal isOpen={showDemo} onClose={() => setShowDemo(false)} />
    </>
  );
}

/* ============================================================
   StepCard — used in the "How It Works" section
   ============================================================ */
function StepCard({
  icon,
  step,
  title,
  description,
}: {
  icon: React.ReactNode;
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-6">
      <div className="bg-navy/5 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 text-navy">
        {icon}
      </div>
      <div className="bg-gold text-navy text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-3">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-navy mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
