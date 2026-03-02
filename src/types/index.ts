/* ============================================================
   VALTIQ — Type Definitions
   ============================================================
   These types define the shape of data used throughout the app.
   ============================================================ */

/** All available industry sectors for the valuation form */
export type Sector =
  | 'Technology — SaaS'
  | 'Technology — Services & Consulting'
  | 'Healthcare & Life Sciences'
  | 'Manufacturing & Industrials'
  | 'Food & Beverage'
  | 'Logistics & Supply Chain'
  | 'Professional Services'
  | 'Retail & Consumer'
  | 'Education'
  | 'Energy & Resources'
  | 'Other';

/** Purpose of the valuation */
export type ValuationPurpose =
  | 'M&A / Sale Process'
  | 'Fundraising / Investment'
  | 'Internal Planning'
  | 'Shareholder Buyout or Dispute'
  | 'Other';

/** Supported currencies */
export type Currency = 'USD' | 'BRL' | 'EUR' | 'GBP';

/** Report generation status */
export type ReportStatus = 'pending' | 'generating' | 'complete' | 'error';

/** Step 1 — Company overview form data */
export interface CompanyOverview {
  companyName: string;
  sector: Sector;
  country: string;
  employees: number;
  yearFounded: number;
  description: string;
  purpose: ValuationPurpose;
}

/** Step 2 — Financial history form data */
export interface FinancialHistory {
  currency: Currency;
  revenueY1: number;
  revenueY2: number;
  revenueY3?: number;
  ebitdaY1: number;
  ebitdaY2: number;
  ebitdaY3?: number;
  netDebt: number;
  grossMargin: number;
  /* SaaS-specific fields (shown only when sector = 'Technology — SaaS') */
  arr?: number;
  nrr?: number;
  payingCustomers?: number;
}

/** Step 3 — Financial projections for DCF */
export interface FinancialProjections {
  growthRateY1: number;
  growthRateY2: number;
  growthRateY3: number;
  longTermGrowthRate: number;
  targetEbitdaMargin: number;
  hasCapex: boolean;
  capexDescription?: string;
}

/** Step 4 — Delivery preferences */
export interface DeliveryInfo {
  email: string;
}

/** All form data combined */
export interface ValuationFormData {
  companyOverview: CompanyOverview;
  financialHistory: FinancialHistory;
  financialProjections: FinancialProjections;
  delivery: DeliveryInfo;
}

/** Comparable transaction entry in the report */
export interface ComparableTransaction {
  company: string;
  description: string;
  dealSize: string;
  impliedMultiple: string;
  year: number;
}

/** DCF table row */
export interface DCFRow {
  year: string;
  revenue: number;
  ebitda: number;
  fcf: number;
  pvFactor: number;
  pvFcf: number;
}

/** Sensitivity matrix entry */
export interface SensitivityEntry {
  wacc: number;
  terminalGrowth: number;
  equityValue: number;
}

/** AI-generated report content (stored as JSON in Supabase) */
export interface ReportContent {
  coverPage: {
    companyName: string;
    valuationDate: string;
    preparedBy: string;
  };
  executiveSummary: {
    businessSnapshot: string;
    valuationConclusion: string;
    topValueDrivers: string[];
    topRisks: string[];
  };
  businessOverview: {
    description: string;
    productsAndServices: string;
    customerBase: string;
    competitivePositioning: string;
    keyDifferentiators: string[];
  };
  industryOverview: {
    sectorSize: string;
    growthOutlook: string;
    keyDynamics: string;
    recentMAActivity: string;
    typicalAcquirers: string;
    typicalMultiples: string;
  };
  financialAnalysis: {
    revenueTable: {
      years: string[];
      revenue: number[];
      revenueGrowth: string[];
      ebitda: number[];
      ebitdaMargin: string[];
    };
    grossMarginAnalysis: string;
    ebitdaMarginTrend: string;
    saasMetrics?: {
      arr: number;
      nrr: number;
      arrGrowthRate: string;
    };
    commentary: string;
  };
  valuationMethodology: {
    marketMultiple: {
      approach: string;
      multipleType: string;
      multipleRange: string;
      appliedMetric: number;
      impliedEvLow: number;
      impliedEvHigh: number;
      netDebt: number;
      equityValueLow: number;
      equityValueHigh: number;
      commentary: string;
    };
    comparableTransactions: {
      transactions: ComparableTransaction[];
      commentary: string;
    };
    dcf: {
      wacc: number;
      terminalGrowthRate: number;
      projections: DCFRow[];
      terminalValue: number;
      enterpriseValue: number;
      netDebt: number;
      equityValue: number;
      sensitivityMatrix: SensitivityEntry[];
      commentary: string;
    };
  };
  valuationSummary: {
    methodologies: {
      method: string;
      equityValueLow: number;
      equityValueHigh: number;
    }[];
    finalRange: {
      low: number;
      high: number;
      central: number;
    };
    currency: string;
    conclusion: string;
  };
  keyValueDrivers: {
    driver: string;
    commentary: string;
  }[];
  riskFactors: {
    risk: string;
    commentary: string;
  }[];
  conclusionAndRecommendations: {
    summary: string;
    recommendations: string[];
  };
}

/** Database report record */
export interface Report {
  id: string;
  user_id: string;
  company_name: string;
  sector: string;
  form_data: ValuationFormData;
  report_content: ReportContent | null;
  tier: string;
  stripe_session_id: string | null;
  status: ReportStatus;
  valuation_low: number | null;
  valuation_high: number | null;
  valuation_currency: string | null;
  created_at: string;
}
