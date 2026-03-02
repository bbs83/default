# Valtiq — Setup & Deployment Guide

> **AI-Powered Business Valuation Platform**
> "Know What Your Business Is Worth — In Minutes"

This guide walks you through setting up and deploying Valtiq from scratch.
No developer experience required — just follow each step carefully.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Local Development Setup](#2-local-development-setup)
3. [Supabase Setup (Database + Auth)](#3-supabase-setup)
4. [Stripe Setup (Payments)](#4-stripe-setup)
5. [Anthropic Setup (AI)](#5-anthropic-setup)
6. [Resend Setup (Email)](#6-resend-setup)
7. [Running Locally](#7-running-locally)
8. [Deploy to Vercel](#8-deploy-to-vercel)
9. [Post-Deployment Configuration](#9-post-deployment-configuration)
10. [Testing the Full Flow](#10-testing-the-full-flow)

---

## 1. Prerequisites

You'll need accounts on these services (all have free tiers for getting started):

- **Node.js** (v18+) — [Download here](https://nodejs.org/)
- **GitHub** account — [Sign up](https://github.com)
- **Supabase** account — [Sign up](https://supabase.com)
- **Stripe** account — [Sign up](https://stripe.com)
- **Anthropic** account — [Sign up](https://console.anthropic.com)
- **Resend** account — [Sign up](https://resend.com)
- **Vercel** account — [Sign up](https://vercel.com)

---

## 2. Local Development Setup

```bash
# Clone the repository
git clone <your-repo-url>
cd valtiq

# Install dependencies
npm install

# Copy environment variables template
cp .env.example .env.local
```

Now open `.env.local` in a text editor and fill in each variable as described in the following sections.

---

## 3. Supabase Setup

### Create a Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New project"**
3. Choose a name (e.g., "valtiq"), set a database password, choose a region
4. Wait for the project to be created (~2 minutes)

### Get Your API Keys

1. Go to **Project Settings → API**
2. Copy these values into your `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL` → Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` → service_role key (secret!)

### Run the Database Migration

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **"New query"**
3. Copy the entire contents of `supabase/migration.sql` and paste it
4. Click **"Run"**
5. You should see "Success" — this creates the `profiles` and `reports` tables

### Configure Authentication

1. Go to **Authentication → Providers**
2. **Email** should already be enabled
3. For **Google OAuth**:
   - Enable the Google provider
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create OAuth 2.0 credentials
   - Add your callback URL: `https://<your-supabase-url>/auth/v1/callback`
   - Copy the Client ID and Client Secret into Supabase

### Set Redirect URLs

1. Go to **Authentication → URL Configuration**
2. Add these to **Redirect URLs**:
   - `http://localhost:3000/api/auth/callback` (for local dev)
   - `https://your-vercel-url.vercel.app/api/auth/callback` (add after deploying)

---

## 4. Stripe Setup

### Get API Keys

1. Go to [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Copy these into your `.env.local`:
   - `STRIPE_SECRET_KEY` → Secret key (starts with `sk_test_`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` → Publishable key (starts with `pk_test_`)

### Set Up Webhook (Local Development)

For local testing, install the [Stripe CLI](https://stripe.com/docs/stripe-cli):

```bash
# Install Stripe CLI (macOS)
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI will display a webhook signing secret (starts with `whsec_`).
Copy it to `STRIPE_WEBHOOK_SECRET` in your `.env.local`.

### Set Up Webhook (Production)

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Click **"Add endpoint"**
3. URL: `https://your-vercel-url.vercel.app/api/stripe/webhook`
4. Select event: `checkout.session.completed`
5. Copy the **Signing secret** to your Vercel environment variables

---

## 5. Anthropic Setup

1. Go to [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
2. Create a new API key
3. Copy it to `ANTHROPIC_API_KEY` in your `.env.local`
4. Make sure your account has credits — report generation uses Claude Opus

---

## 6. Resend Setup

1. Go to [resend.com/api-keys](https://resend.com/api-keys)
2. Create a new API key
3. Copy it to `RESEND_API_KEY` in your `.env.local`
4. Optionally, verify a custom domain in Resend for branded emails

> **Note:** By default, Resend's free tier sends from `onboarding@resend.dev`.
> To send from `reports@valtiq.com`, you need to verify the `valtiq.com` domain.

---

## 7. Running Locally

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

To test the full payment flow locally:
1. Make sure the Stripe CLI is forwarding webhooks (Step 4)
2. Use Stripe test card: `4242 4242 4242 4242` (any future expiry, any CVC)

---

## 8. Deploy to Vercel

### Push to GitHub

```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial Valtiq build"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/your-username/valtiq.git
git push -u origin main
```

### Connect to Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Vercel will auto-detect it as a Next.js project
4. Before deploying, add ALL environment variables:

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `STRIPE_SECRET_KEY` | Your Stripe secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Your Stripe publishable key |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook signing secret |
| `RESEND_API_KEY` | Your Resend API key |
| `ANTHROPIC_API_KEY` | Your Anthropic API key |
| `NEXT_PUBLIC_BASE_URL` | `https://your-app.vercel.app` |

5. Click **Deploy**

---

## 9. Post-Deployment Configuration

After your first deploy, you need to update a few things:

### Update NEXT_PUBLIC_BASE_URL

1. In Vercel dashboard, go to **Settings → Environment Variables**
2. Set `NEXT_PUBLIC_BASE_URL` to your actual Vercel URL (e.g., `https://valtiq.vercel.app`)
3. Redeploy for the change to take effect

### Register Stripe Webhook

1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/webhooks)
2. Add endpoint: `https://your-vercel-url.vercel.app/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy the signing secret to Vercel's `STRIPE_WEBHOOK_SECRET` environment variable

### Update Supabase Auth Redirect URLs

1. Go to **Supabase → Authentication → URL Configuration**
2. Add your Vercel URL to the allowed redirect URLs:
   - `https://your-vercel-url.vercel.app/api/auth/callback`

### Vercel Function Duration (Important!)

1. Go to **Vercel → Settings → Functions**
2. Set the **Max Duration** to at least **300 seconds** (5 minutes)
   for the AI report generation endpoint
3. This may require a Vercel Pro plan ($20/month)

---

## 10. Testing the Full Flow

Run through this checklist to verify everything works:

- [ ] Landing page loads at your URL
- [ ] "See a Sample Report" opens the demo report modal
- [ ] Sign up with email/password works
- [ ] Google OAuth sign-in works (if configured)
- [ ] Dashboard loads after login (empty state)
- [ ] "New Valuation" form loads with all 4 steps
- [ ] Each form step validates required fields
- [ ] SaaS-specific fields appear when selecting "Technology — SaaS"
- [ ] "Proceed to Payment" redirects to Stripe Checkout
- [ ] Use test card `4242 4242 4242 4242` to complete payment
- [ ] After payment, redirects to report page with "Generating" status
- [ ] Report generates within 60-90 seconds
- [ ] Completed report displays all 9 sections
- [ ] "Download PDF" triggers browser print dialog
- [ ] Dashboard shows the completed report with valuation range
- [ ] Email notification is received (check spam folder)

---

## Tech Stack Summary

| Component | Technology |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth + DB | Supabase |
| Payments | Stripe |
| AI | Anthropic Claude Opus |
| Email | Resend |
| Hosting | Vercel |

---

## Troubleshooting

### "Report stuck on Generating"
- Check Vercel function logs for errors
- Ensure `ANTHROPIC_API_KEY` is set and has credits
- Ensure Vercel function timeout is set to 300s

### "Stripe webhook not firing"
- Verify the webhook URL is correct in Stripe Dashboard
- Ensure `STRIPE_WEBHOOK_SECRET` matches the production webhook (not the CLI one)
- Check that `checkout.session.completed` event is selected

### "Google OAuth not working"
- Verify Google OAuth credentials in Supabase
- Ensure redirect URL is added to both Google Cloud Console and Supabase

### "Email not received"
- Check Resend dashboard for delivery status
- Verify the `RESEND_API_KEY` is correct
- For custom domains, ensure DNS records are configured in Resend

---

&copy; 2025 Valtiq
