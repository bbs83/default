/* ============================================================
   Utility Functions
   ============================================================ */

/**
 * Format a number as currency (e.g., $1,234,567)
 * @param value - The number to format
 * @param currency - Currency code (default: USD)
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format a number with commas (e.g., 1,234,567)
 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * Format a number as a percentage (e.g., 35.2%)
 */
export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}

/**
 * Format a date string to a readable format (e.g., January 15, 2025)
 */
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Abbreviate large numbers (e.g., $4.2M, $18.5M)
 */
export function abbreviateNumber(value: number): string {
  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(1)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(0)}K`;
  }
  return `$${value}`;
}

/**
 * WACC defaults by sector — used in DCF calculations
 */
export const WACC_BY_SECTOR: Record<string, number> = {
  'Technology — SaaS': 13,
  'Technology — Services & Consulting': 12,
  'Healthcare & Life Sciences': 11,
  'Manufacturing & Industrials': 10,
  'Food & Beverage': 10,
  'Logistics & Supply Chain': 10,
  'Professional Services': 11,
  'Retail & Consumer': 11,
  'Education': 11,
  'Energy & Resources': 11,
  'Other': 11,
};

/**
 * List of available sectors for the form dropdown
 */
export const SECTORS = [
  'Technology — SaaS',
  'Technology — Services & Consulting',
  'Healthcare & Life Sciences',
  'Manufacturing & Industrials',
  'Food & Beverage',
  'Logistics & Supply Chain',
  'Professional Services',
  'Retail & Consumer',
  'Education',
  'Energy & Resources',
  'Other',
] as const;

/**
 * List of valuation purposes for the form dropdown
 */
export const VALUATION_PURPOSES = [
  'M&A / Sale Process',
  'Fundraising / Investment',
  'Internal Planning',
  'Shareholder Buyout or Dispute',
  'Other',
] as const;

/**
 * List of supported currencies
 */
export const CURRENCIES = ['USD', 'BRL', 'EUR', 'GBP'] as const;
