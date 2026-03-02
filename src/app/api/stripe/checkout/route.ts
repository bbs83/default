/* ============================================================
   Stripe Checkout API — /api/stripe/checkout
   ============================================================
   Creates a Stripe Checkout session for a $49 valuation report.
   Also creates a pending report record in Supabase so the
   webhook can link the payment to the report.
   ============================================================ */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';
import type { ValuationFormData } from '@/types';

// Lazy-initialize Stripe to avoid build-time errors
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20' as any,
  });
}

export async function POST(request: Request) {
  try {
    // Get the authenticated user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse the form data from the request body
    const formData: ValuationFormData = await request.json();

    // Create a pending report record in Supabase
    const { data: report, error: dbError } = await supabase
      .from('reports')
      .insert({
        user_id: user.id,
        company_name: formData.companyOverview.companyName,
        sector: formData.companyOverview.sector,
        form_data: formData,
        status: 'pending',
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

    // Create a Stripe Checkout session
    const session = await getStripe().checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Valtiq Valuation Report — ${formData.companyOverview.companyName}`,
              description: 'Complete AI-powered business valuation report with DCF, market multiples, and comparable transactions analysis.',
            },
            unit_amount: 4900, // $49.00 in cents
          },
          quantity: 1,
        },
      ],
      // Pass the report ID so we can find it in the webhook
      metadata: {
        report_id: report.id,
        user_id: user.id,
      },
      customer_email: formData.delivery.email,
      // Where to redirect after payment
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/report/${report.id}?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/dashboard/new?payment=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
