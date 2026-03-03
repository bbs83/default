/* ============================================================
   Checkout API — /api/stripe/checkout
   ============================================================
   Creates a report record in Supabase and triggers AI generation.
   (Stripe payment bypassed for testing)
   ============================================================ */

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import type { ValuationFormData } from '@/types';

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the form data from the request body
    const formData: ValuationFormData = await request.json();

    // Create a report record in Supabase (bypassing payment)
    const { data: report, error: dbError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        company_name: formData.companyOverview.companyName,
        sector: formData.companyOverview.sector,
        form_data: formData,
        status: 'generating', // Skip pending, go directly to generating
        tier: 'paid',
      })
      .select()
      .single();

    if (dbError || !report) {
      console.error('Database error:', dbError);
      return NextResponse.json(
        { error: 'Failed to create report record' },
        { status: 500 }
      );
    }

    // Trigger AI report generation in the background (bypassing Stripe webhook)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    fetch(`${baseUrl}/api/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId: report.id }),
    }).catch((err) => {
      console.error('Failed to trigger report generation:', err);
    });

    // Redirect to the report page directly (payment bypassed)
    return NextResponse.json({ 
      url: `${baseUrl}/dashboard/report/${report.id}?payment=success` 
    });
  } catch (error: any) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
