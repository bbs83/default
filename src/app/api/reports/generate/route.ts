/* ============================================================
   AI Report Generation API — /api/reports/generate
   ============================================================
   Called after successful Stripe payment (via webhook).
   Uses Anthropic's Claude Opus with web search to generate
   a comprehensive valuation report.
   ============================================================ */

import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { WACC_BY_SECTOR } from '@/lib/utils';
import type { ValuationFormData, ReportContent } from '@/types';

// Lazy-initialize clients to avoid build-time errors when env vars aren't set
function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function getAnthropic() {
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
  });
}

export const maxDuration = 300; // Allow up to 5 minutes for AI generation

export async function POST(request: Request) {
  try {
    const { reportId } = await request.json();

    if (!reportId) {
      return NextResponse.json({ error: 'Missing reportId' }, { status: 400 });
    }

    // Fetch the report record to get form data
    const { data: report, error: fetchError } = await getSupabase()
      .from('reports')
      .select('*')
      .eq('id', reportId)
      .single();

    if (fetchError || !report) {
      console.error('Report not found:', fetchError);
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const formData: ValuationFormData = report.form_data;
    const wacc = WACC_BY_SECTOR[formData.companyOverview.sector] || 11;
    const isSaaS = formData.companyOverview.sector === 'Technology — SaaS';

    // Build the user prompt with all form data
    const userPrompt = buildPrompt(formData, wacc, isSaaS);

    // Call Claude Opus with web search enabled
    const response = await getAnthropic().messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 16000,
      tools: [{ type: 'web_search' as any }] as any,
      system: `You are a senior M&A advisor at a top-tier boutique investment bank with deep expertise in business valuation across multiple sectors. You produce investment-grade valuation reports that are precise, methodical, data-backed, and written in a professional advisory tone. Use your web search capability to research current industry data, recent M&A transactions, and applicable valuation multiples before writing the report. Return only valid JSON matching the report schema provided. Do not include any text outside the JSON.`,
      messages: [
        {
          role: 'user',
          content: userPrompt,
        },
      ],
    });

    // Extract the text content from the response
    let reportJson: string = '';
    for (const block of response.content) {
      if (block.type === 'text') {
        reportJson += block.text;
      }
    }

    // Clean up the JSON (remove markdown code fences if present)
    reportJson = reportJson.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Parse the report JSON
    let reportContent: ReportContent;
    try {
      reportContent = JSON.parse(reportJson);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', parseError);
      console.error('Raw response:', reportJson.substring(0, 500));

      // Update status to error
      await getSupabase()
        .from('reports')
        .update({ status: 'error' })
        .eq('id', reportId);

      return NextResponse.json(
        { error: 'AI generated invalid JSON' },
        { status: 500 }
      );
    }

    // Extract valuation range from the parsed report
    const valuationLow = reportContent.valuationSummary?.finalRange?.low || null;
    const valuationHigh = reportContent.valuationSummary?.finalRange?.high || null;
    const valuationCurrency = reportContent.valuationSummary?.currency || formData.financialHistory.currency;

    // Save the completed report to Supabase
    const { error: saveError } = await getSupabase()
      .from('reports')
      .update({
        report_content: reportContent,
        status: 'complete',
        valuation_low: valuationLow,
        valuation_high: valuationHigh,
        valuation_currency: valuationCurrency,
      })
      .eq('id', reportId);

    if (saveError) {
      console.error('Failed to save report:', saveError);
      return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
    }

    // Send notification email
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
      await fetch(`${baseUrl}/api/reports/${reportId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.delivery.email,
          companyName: formData.companyOverview.companyName,
          reportId,
          reportContent,
        }),
      });
    } catch (emailError) {
      // Don't fail the report if email fails — the report is still saved
      console.error('Failed to send email notification:', emailError);
    }

    return NextResponse.json({ success: true, reportId });
  } catch (error: any) {
    console.error('Report generation error:', error);

    // Try to update the report status to error
    try {
      const { reportId } = await request.clone().json();
      if (reportId) {
        await getSupabase()
          .from('reports')
          .update({ status: 'error' })
          .eq('id', reportId);
      }
    } catch {}

    return NextResponse.json(
      { error: error.message || 'Report generation failed' },
      { status: 500 }
    );
  }
}

/**
 * Builds the complete prompt for the AI, including all form data
 * and the expected JSON schema for the report.
 */
function buildPrompt(formData: ValuationFormData, wacc: number, isSaaS: boolean): string {
  const { companyOverview, financialHistory, financialProjections } = formData;

  return `
Generate a complete, investment-grade business valuation report for the following company.
Use web search to research current industry data, recent M&A transactions, and applicable valuation multiples.

=== COMPANY DATA ===

Company Name: ${companyOverview.companyName}
Sector: ${companyOverview.sector}
Country: ${companyOverview.country}
Employees: ${companyOverview.employees}
Founded: ${companyOverview.yearFounded}
Description: ${companyOverview.description}
Purpose: ${companyOverview.purpose}

=== FINANCIAL HISTORY ===

Currency: ${financialHistory.currency}
Revenue Year 1 (most recent): ${financialHistory.revenueY1}
Revenue Year 2: ${financialHistory.revenueY2}
${financialHistory.revenueY3 ? `Revenue Year 3: ${financialHistory.revenueY3}` : ''}
EBITDA Year 1: ${financialHistory.ebitdaY1}
EBITDA Year 2: ${financialHistory.ebitdaY2}
${financialHistory.ebitdaY3 ? `EBITDA Year 3: ${financialHistory.ebitdaY3}` : ''}
Net Debt: ${financialHistory.netDebt}
Gross Margin: ${financialHistory.grossMargin}%
${isSaaS ? `ARR: ${financialHistory.arr}
NRR: ${financialHistory.nrr}%
${financialHistory.payingCustomers ? `Paying Customers: ${financialHistory.payingCustomers}` : ''}` : ''}

=== FINANCIAL PROJECTIONS ===

Revenue Growth Y1: ${financialProjections.growthRateY1}%
Revenue Growth Y2: ${financialProjections.growthRateY2}%
Revenue Growth Y3: ${financialProjections.growthRateY3}%
Long-term Growth Rate: ${financialProjections.longTermGrowthRate}%
Target EBITDA Margin (stabilized): ${financialProjections.targetEbitdaMargin}%
Capex planned: ${financialProjections.hasCapex ? 'Yes — ' + financialProjections.capexDescription : 'No'}

=== VALUATION PARAMETERS ===

WACC: ${wacc}%
${isSaaS
    ? 'Use EV/Revenue and EV/ARR multiples for the Market Multiple approach.'
    : 'Use EV/EBITDA multiples for the Market Multiple approach.'
  }

=== INSTRUCTIONS ===

1. Use web search to research: recent M&A deals in the "${companyOverview.sector}" sector, current valuation multiples, and industry growth data for ${companyOverview.country}.
2. Generate the COMPLETE report as a single JSON object.
3. For the DCF: build a 3-year explicit forecast using the provided growth rates, apply ${wacc}% WACC, and use Gordon Growth Model with ${financialProjections.longTermGrowthRate}% terminal growth.
4. Sensitivity matrix: create a 3x3 grid with WACC ±1% and terminal growth rate ±1%.
5. List 3-5 comparable M&A transactions (real or realistic) with details.
6. All monetary values should be numbers (not strings), in ${financialHistory.currency}.

=== REQUIRED JSON SCHEMA ===

{
  "coverPage": {
    "companyName": string,
    "valuationDate": string (e.g. "March 2, 2026"),
    "preparedBy": "Valtiq AI Advisory"
  },
  "executiveSummary": {
    "businessSnapshot": string (1-2 paragraphs),
    "valuationConclusion": string (1 paragraph with specific numbers),
    "topValueDrivers": [string, string, string],
    "topRisks": [string, string]
  },
  "businessOverview": {
    "description": string,
    "productsAndServices": string,
    "customerBase": string,
    "competitivePositioning": string,
    "keyDifferentiators": [string, ...]
  },
  "industryOverview": {
    "sectorSize": string,
    "growthOutlook": string,
    "keyDynamics": string,
    "recentMAActivity": string,
    "typicalAcquirers": string,
    "typicalMultiples": string
  },
  "financialAnalysis": {
    "revenueTable": {
      "years": [string, string, ...],
      "revenue": [number, number, ...],
      "revenueGrowth": [string, string, ...],
      "ebitda": [number, number, ...],
      "ebitdaMargin": [string, string, ...]
    },
    "grossMarginAnalysis": string,
    "ebitdaMarginTrend": string,
    ${isSaaS ? `"saasMetrics": {
      "arr": number,
      "nrr": number,
      "arrGrowthRate": string
    },` : ''}
    "commentary": string
  },
  "valuationMethodology": {
    "marketMultiple": {
      "approach": string,
      "multipleType": string (e.g. "EV/ARR" or "EV/EBITDA"),
      "multipleRange": string (e.g. "4.0x - 6.0x"),
      "appliedMetric": number,
      "impliedEvLow": number,
      "impliedEvHigh": number,
      "netDebt": number,
      "equityValueLow": number,
      "equityValueHigh": number,
      "commentary": string
    },
    "comparableTransactions": {
      "transactions": [
        {
          "company": string,
          "description": string,
          "dealSize": string,
          "impliedMultiple": string,
          "year": number
        }
      ],
      "commentary": string
    },
    "dcf": {
      "wacc": number,
      "terminalGrowthRate": number,
      "projections": [
        {
          "year": string,
          "revenue": number,
          "ebitda": number,
          "fcf": number,
          "pvFactor": number,
          "pvFcf": number
        }
      ],
      "terminalValue": number,
      "enterpriseValue": number,
      "netDebt": number,
      "equityValue": number,
      "sensitivityMatrix": [
        { "wacc": number, "terminalGrowth": number, "equityValue": number }
      ],
      "commentary": string
    }
  },
  "valuationSummary": {
    "methodologies": [
      { "method": string, "equityValueLow": number, "equityValueHigh": number }
    ],
    "finalRange": { "low": number, "high": number, "central": number },
    "currency": "${financialHistory.currency}",
    "conclusion": string
  },
  "keyValueDrivers": [
    { "driver": string, "commentary": string }
  ],
  "riskFactors": [
    { "risk": string, "commentary": string }
  ],
  "conclusionAndRecommendations": {
    "summary": string,
    "recommendations": [string, ...]
  }
}

Return ONLY the JSON. No additional text or explanation.`;
}
