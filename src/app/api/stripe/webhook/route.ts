/* ============================================================
   Stripe Webhook — /api/stripe/webhook
   ============================================================
   Listens for checkout.session.completed events from Stripe.
   When a payment succeeds:
   1. Updates the report status to 'generating'
   2. Triggers the AI report generation
   ============================================================ */

import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// Lazy-initialize to avoid build-time errors when env vars aren't set
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-06-20' as any,
  });
}

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  // Read the raw body for signature verification
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    // Verify the webhook signature to ensure it's from Stripe
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const reportId = session.metadata?.report_id;

    if (!reportId) {
      console.error('No report_id in session metadata');
      return NextResponse.json({ error: 'Missing report ID' }, { status: 400 });
    }

    // Update the report: mark as paid and generating
    const { error: updateError } = await getSupabase()
      .from('reports')
      .update({
        stripe_session_id: session.id,
        status: 'generating',
      })
      .eq('id', reportId);

    if (updateError) {
      console.error('Failed to update report:', updateError);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    // Trigger AI report generation in the background
    // We call our own API endpoint to generate the report
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    fetch(`${baseUrl}/api/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportId }),
    }).catch((err) => {
      console.error('Failed to trigger report generation:', err);
    });
  }

  return NextResponse.json({ received: true });
}
