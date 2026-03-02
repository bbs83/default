/* ============================================================
   Report Renderer — displays a full valuation report
   ============================================================
   Takes a ReportContent object and renders all 9 sections
   in a professional, print-friendly layout.
   Used for both paid reports and the demo report.
   ============================================================ */

'use client';

import { ReportContent } from '@/types';
import { formatCurrency } from '@/lib/utils';

interface ReportRendererProps {
  report: ReportContent;
}

export default function ReportRenderer({ report }: ReportRendererProps) {
  const currency = report.valuationSummary?.currency || 'USD';

  return (
    <div className="report-content text-gray-800 leading-relaxed">
      {/* ============================================================
          COVER PAGE
          ============================================================ */}
      <div className="text-center py-16 border-b border-gray-200 mb-12">
        <p className="text-gold font-bold text-3xl tracking-tight mb-8">Valtiq</p>
        <h1 className="text-navy text-2xl md:text-3xl font-bold mb-2">
          Confidential Business Valuation Report
        </h1>
        <div className="w-16 h-0.5 bg-gold mx-auto my-6" />
        <p className="text-xl font-semibold text-navy mb-2">
          {report.coverPage.companyName}
        </p>
        <p className="text-gray-500 mb-1">{report.coverPage.valuationDate}</p>
        <p className="text-gray-500 text-sm">{report.coverPage.preparedBy}</p>
      </div>

      {/* ============================================================
          SECTION 1 — EXECUTIVE SUMMARY
          ============================================================ */}
      <section className="mb-12 print-break">
        <SectionTitle number={1} title="Executive Summary" />
        <p className="mb-4">{report.executiveSummary.businessSnapshot}</p>
        <div className="bg-navy/5 rounded-lg p-5 mb-4">
          <p className="font-semibold text-navy mb-1">Valuation Conclusion</p>
          <p>{report.executiveSummary.valuationConclusion}</p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p className="font-semibold text-navy mb-2">Top Value Drivers</p>
            <ul className="space-y-1">
              {report.executiveSummary.topValueDrivers.map((d, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-gold mt-1">&#9679;</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-semibold text-navy mb-2">Key Risks</p>
            <ul className="space-y-1">
              {report.executiveSummary.topRisks.map((r, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">&#9679;</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ============================================================
          SECTION 2 — BUSINESS OVERVIEW
          ============================================================ */}
      <section className="mb-12 print-break">
        <SectionTitle number={2} title="Business Overview" />
        <p className="mb-4">{report.businessOverview.description}</p>
        <SubSection title="Products & Services">
          <p>{report.businessOverview.productsAndServices}</p>
        </SubSection>
        <SubSection title="Customer Base">
          <p>{report.businessOverview.customerBase}</p>
        </SubSection>
        <SubSection title="Competitive Positioning">
          <p>{report.businessOverview.competitivePositioning}</p>
        </SubSection>
        <SubSection title="Key Differentiators">
          <ul className="space-y-1">
            {report.businessOverview.keyDifferentiators.map((d, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-gold mt-1">&#10003;</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </SubSection>
      </section>

      {/* ============================================================
          SECTION 3 — INDUSTRY OVERVIEW & M&A TRENDS
          ============================================================ */}
      <section className="mb-12 print-break">
        <SectionTitle number={3} title="Industry Overview & M&A Trends" />
        <SubSection title="Sector Size & Growth Outlook">
          <p className="mb-2">{report.industryOverview.sectorSize}</p>
          <p>{report.industryOverview.growthOutlook}</p>
        </SubSection>
        <SubSection title="Key Industry Dynamics">
          <p>{report.industryOverview.keyDynamics}</p>
        </SubSection>
        <SubSection title="Recent M&A Activity">
          <p>{report.industryOverview.recentMAActivity}</p>
        </SubSection>
        <SubSection title="Typical Acquirer Profiles">
          <p>{report.industryOverview.typicalAcquirers}</p>
        </SubSection>
        <SubSection title="Typical Valuation Multiples">
          <p>{report.industryOverview.typicalMultiples}</p>
        </SubSection>
      </section>

      {/* ============================================================
          SECTION 4 — FINANCIAL ANALYSIS
          ============================================================ */}
      <section className="mb-12 print-break">
        <SectionTitle number={4} title="Financial Analysis" />

        {/* Revenue & EBITDA Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="py-3 px-4 text-left font-semibold">Metric</th>
                {report.financialAnalysis.revenueTable.years.map((year) => (
                  <th key={year} className="py-3 px-4 text-right font-semibold">
                    {year}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">Revenue</td>
                {report.financialAnalysis.revenueTable.revenue.map((v, i) => (
                  <td key={i} className="py-3 px-4 text-right">
                    {formatCurrency(v, currency)}
                  </td>
                ))}
              </tr>
              <tr className="border-b border-gray-100 bg-gray-50">
                <td className="py-3 px-4 font-medium">Revenue Growth</td>
                {report.financialAnalysis.revenueTable.revenueGrowth.map((v, i) => (
                  <td key={i} className="py-3 px-4 text-right">{v}</td>
                ))}
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">EBITDA</td>
                {report.financialAnalysis.revenueTable.ebitda.map((v, i) => (
                  <td key={i} className="py-3 px-4 text-right">
                    {formatCurrency(v, currency)}
                  </td>
                ))}
              </tr>
              <tr className="bg-gray-50">
                <td className="py-3 px-4 font-medium">EBITDA Margin</td>
                {report.financialAnalysis.revenueTable.ebitdaMargin.map((v, i) => (
                  <td key={i} className="py-3 px-4 text-right">{v}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        <SubSection title="Gross Margin Analysis">
          <p>{report.financialAnalysis.grossMarginAnalysis}</p>
        </SubSection>
        <SubSection title="EBITDA Margin Trend">
          <p>{report.financialAnalysis.ebitdaMarginTrend}</p>
        </SubSection>

        {/* SaaS-specific metrics */}
        {report.financialAnalysis.saasMetrics && (
          <SubSection title="SaaS Metrics">
            <div className="grid grid-cols-3 gap-4">
              <MetricCard
                label="ARR"
                value={formatCurrency(report.financialAnalysis.saasMetrics.arr, currency)}
              />
              <MetricCard
                label="Net Revenue Retention"
                value={`${report.financialAnalysis.saasMetrics.nrr}%`}
              />
              <MetricCard
                label="ARR Growth Rate"
                value={report.financialAnalysis.saasMetrics.arrGrowthRate}
              />
            </div>
          </SubSection>
        )}

        <SubSection title="Commentary">
          <p>{report.financialAnalysis.commentary}</p>
        </SubSection>
      </section>

      {/* ============================================================
          SECTION 5 — VALUATION METHODOLOGY
          ============================================================ */}
      <section className="mb-12 print-break">
        <SectionTitle number={5} title="Valuation Methodology" />

        {/* 5A. Market Multiple */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-navy mb-3">
            5A. Market Multiple Approach
          </h3>
          <p className="mb-4">{report.valuationMethodology.marketMultiple.approach}</p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium bg-gray-50">Multiple Type</td>
                  <td className="py-2 px-4">{report.valuationMethodology.marketMultiple.multipleType}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium bg-gray-50">Multiple Range</td>
                  <td className="py-2 px-4">{report.valuationMethodology.marketMultiple.multipleRange}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium bg-gray-50">Applied Metric</td>
                  <td className="py-2 px-4">{formatCurrency(report.valuationMethodology.marketMultiple.appliedMetric, currency)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium bg-gray-50">Implied EV Range</td>
                  <td className="py-2 px-4">
                    {formatCurrency(report.valuationMethodology.marketMultiple.impliedEvLow, currency)} – {formatCurrency(report.valuationMethodology.marketMultiple.impliedEvHigh, currency)}
                  </td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium bg-gray-50">Net Debt</td>
                  <td className="py-2 px-4">{formatCurrency(report.valuationMethodology.marketMultiple.netDebt, currency)}</td>
                </tr>
                <tr className="bg-gold/10">
                  <td className="py-2 px-4 font-semibold">Implied Equity Value</td>
                  <td className="py-2 px-4 font-semibold">
                    {formatCurrency(report.valuationMethodology.marketMultiple.equityValueLow, currency)} – {formatCurrency(report.valuationMethodology.marketMultiple.equityValueHigh, currency)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600">{report.valuationMethodology.marketMultiple.commentary}</p>
        </div>

        {/* 5B. Comparable Transactions */}
        <div className="mb-8 print-break">
          <h3 className="text-lg font-semibold text-navy mb-3">
            5B. Comparable Transactions
          </h3>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="py-3 px-4 text-left font-semibold">Company</th>
                  <th className="py-3 px-4 text-left font-semibold">Description</th>
                  <th className="py-3 px-4 text-right font-semibold">Deal Size</th>
                  <th className="py-3 px-4 text-right font-semibold">Multiple</th>
                  <th className="py-3 px-4 text-right font-semibold">Year</th>
                </tr>
              </thead>
              <tbody>
                {report.valuationMethodology.comparableTransactions.transactions.map((t, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                    <td className="py-3 px-4 font-medium">{t.company}</td>
                    <td className="py-3 px-4 text-gray-600">{t.description}</td>
                    <td className="py-3 px-4 text-right">{t.dealSize}</td>
                    <td className="py-3 px-4 text-right">{t.impliedMultiple}</td>
                    <td className="py-3 px-4 text-right">{t.year}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-gray-600">{report.valuationMethodology.comparableTransactions.commentary}</p>
        </div>

        {/* 5C. DCF */}
        <div className="print-break">
          <h3 className="text-lg font-semibold text-navy mb-3">
            5C. Discounted Cash Flow (DCF)
          </h3>

          {/* DCF Projection Table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="py-3 px-4 text-left font-semibold">Year</th>
                  <th className="py-3 px-4 text-right font-semibold">Revenue</th>
                  <th className="py-3 px-4 text-right font-semibold">EBITDA</th>
                  <th className="py-3 px-4 text-right font-semibold">FCF</th>
                  <th className="py-3 px-4 text-right font-semibold">PV Factor</th>
                  <th className="py-3 px-4 text-right font-semibold">PV of FCF</th>
                </tr>
              </thead>
              <tbody>
                {report.valuationMethodology.dcf.projections.map((row, i) => (
                  <tr key={i} className={`border-b border-gray-100 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                    <td className="py-3 px-4 font-medium">{row.year}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(row.revenue, currency)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(row.ebitda, currency)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(row.fcf, currency)}</td>
                    <td className="py-3 px-4 text-right">{row.pvFactor.toFixed(4)}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(row.pvFcf, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* DCF Summary */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium bg-gray-50">Terminal Value</td>
                  <td className="py-2 px-4 text-right">{formatCurrency(report.valuationMethodology.dcf.terminalValue, currency)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium bg-gray-50">Enterprise Value</td>
                  <td className="py-2 px-4 text-right">{formatCurrency(report.valuationMethodology.dcf.enterpriseValue, currency)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium bg-gray-50">Net Debt</td>
                  <td className="py-2 px-4 text-right">{formatCurrency(report.valuationMethodology.dcf.netDebt, currency)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-2 px-4 font-medium bg-gray-50">WACC</td>
                  <td className="py-2 px-4 text-right">{report.valuationMethodology.dcf.wacc}%</td>
                </tr>
                <tr className="bg-gold/10">
                  <td className="py-2 px-4 font-semibold">Equity Value (DCF)</td>
                  <td className="py-2 px-4 text-right font-semibold">{formatCurrency(report.valuationMethodology.dcf.equityValue, currency)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Sensitivity Matrix */}
          <p className="font-semibold text-navy mb-2">Sensitivity Analysis</p>
          <p className="text-sm text-gray-500 mb-3">
            Equity value under different WACC and terminal growth rate assumptions ({currency})
          </p>
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-navy text-white">
                  <th className="py-2 px-3 text-left font-semibold">WACC \ Growth</th>
                  {/* Extract unique terminal growth rates from sensitivity data */}
                  {[...new Set(report.valuationMethodology.dcf.sensitivityMatrix.map(e => e.terminalGrowth))]
                    .sort((a, b) => a - b)
                    .map(tg => (
                      <th key={tg} className="py-2 px-3 text-right font-semibold">{tg}%</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {/* Group by WACC */}
                {[...new Set(report.valuationMethodology.dcf.sensitivityMatrix.map(e => e.wacc))]
                  .sort((a, b) => a - b)
                  .map((wacc, wi) => (
                    <tr key={wacc} className={`border-b border-gray-100 ${wi % 2 === 1 ? 'bg-gray-50' : ''}`}>
                      <td className="py-2 px-3 font-medium">{wacc}%</td>
                      {[...new Set(report.valuationMethodology.dcf.sensitivityMatrix.map(e => e.terminalGrowth))]
                        .sort((a, b) => a - b)
                        .map(tg => {
                          const entry = report.valuationMethodology.dcf.sensitivityMatrix.find(
                            e => e.wacc === wacc && e.terminalGrowth === tg
                          );
                          const isCenter = wacc === report.valuationMethodology.dcf.wacc &&
                            tg === report.valuationMethodology.dcf.terminalGrowthRate;
                          return (
                            <td
                              key={tg}
                              className={`py-2 px-3 text-right ${isCenter ? 'bg-gold/20 font-semibold' : ''}`}
                            >
                              {entry ? formatCurrency(entry.equityValue, currency) : '—'}
                            </td>
                          );
                        })}
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <p className="text-sm text-gray-600">{report.valuationMethodology.dcf.commentary}</p>
        </div>
      </section>

      {/* ============================================================
          SECTION 6 — VALUATION SUMMARY
          ============================================================ */}
      <section className="mb-12 print-break">
        <SectionTitle number={6} title="Valuation Summary" />

        {/* Methodology comparison table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-navy text-white">
                <th className="py-3 px-4 text-left font-semibold">Methodology</th>
                <th className="py-3 px-4 text-right font-semibold">Low</th>
                <th className="py-3 px-4 text-right font-semibold">High</th>
              </tr>
            </thead>
            <tbody>
              {report.valuationSummary.methodologies.map((m, i) => (
                <tr key={i} className={`border-b border-gray-100 ${i % 2 === 1 ? 'bg-gray-50' : ''}`}>
                  <td className="py-3 px-4 font-medium">{m.method}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(m.equityValueLow, currency)}</td>
                  <td className="py-3 px-4 text-right">{formatCurrency(m.equityValueHigh, currency)}</td>
                </tr>
              ))}
              <tr className="bg-gold/10 font-semibold">
                <td className="py-3 px-4">Final Estimated Range</td>
                <td className="py-3 px-4 text-right">
                  {formatCurrency(report.valuationSummary.finalRange.low, currency)}
                </td>
                <td className="py-3 px-4 text-right">
                  {formatCurrency(report.valuationSummary.finalRange.high, currency)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Central estimate callout */}
        <div className="bg-navy text-white rounded-lg p-6 text-center mb-6">
          <p className="text-white/70 text-sm uppercase tracking-wide mb-1">Central Estimate</p>
          <p className="text-3xl md:text-4xl font-bold text-gold">
            {formatCurrency(report.valuationSummary.finalRange.central, currency)}
          </p>
        </div>

        <p>{report.valuationSummary.conclusion}</p>
      </section>

      {/* ============================================================
          SECTION 7 — KEY VALUE DRIVERS
          ============================================================ */}
      <section className="mb-12 print-break">
        <SectionTitle number={7} title="Key Value Drivers" />
        <div className="space-y-4">
          {report.keyValueDrivers.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="bg-gold/10 text-gold font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-navy">{item.driver}</p>
                <p className="text-gray-600 text-sm">{item.commentary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 8 — RISK FACTORS
          ============================================================ */}
      <section className="mb-12 print-break">
        <SectionTitle number={8} title="Risk Factors" />
        <div className="space-y-4">
          {report.riskFactors.map((item, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="bg-red-50 text-red-500 font-bold rounded-full w-7 h-7 flex items-center justify-center text-sm shrink-0 mt-0.5">
                {i + 1}
              </span>
              <div>
                <p className="font-semibold text-navy">{item.risk}</p>
                <p className="text-gray-600 text-sm">{item.commentary}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
          SECTION 9 — CONCLUSION & STRATEGIC RECOMMENDATIONS
          ============================================================ */}
      <section className="mb-12 print-break">
        <SectionTitle number={9} title="Conclusion & Strategic Recommendations" />
        <p className="mb-6">{report.conclusionAndRecommendations.summary}</p>
        <div className="bg-navy/5 rounded-lg p-5">
          <p className="font-semibold text-navy mb-3">Recommendations</p>
          <ol className="space-y-2 list-decimal list-inside">
            {report.conclusionAndRecommendations.recommendations.map((rec, i) => (
              <li key={i} className="text-gray-700">{rec}</li>
            ))}
          </ol>
        </div>
      </section>

      {/* ============================================================
          DISCLAIMER
          ============================================================ */}
      <div className="border-t border-gray-200 pt-6 mt-12">
        <p className="text-xs text-gray-400 leading-relaxed">
          This report was generated by Valtiq AI Advisory and is intended for
          informational purposes only. It does not constitute financial advice
          or a formal valuation opinion. Valtiq recommends consulting a
          qualified financial advisor before making decisions based on this report.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   Helper sub-components (only used within ReportRenderer)
   ============================================================ */

function SectionTitle({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className="bg-navy text-white text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
        {number}
      </span>
      <h2 className="text-xl md:text-2xl font-bold text-navy">{title}</h2>
    </div>
  );
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <h4 className="font-semibold text-navy mb-2">{title}</h4>
      {children}
    </div>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-navy/5 rounded-lg p-4 text-center">
      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-lg font-bold text-navy">{value}</p>
    </div>
  );
}
