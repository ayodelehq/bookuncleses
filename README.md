# Bookuncleses.com

Photography & videography, event hosting, and venue planning — built with Next.js
(App Router) and Supabase. See `PRD` context and `supabase/migrations/` for the
data model this app expects.

## Local Setup

1. Install dependencies: `npm install`
2. Copy `.env.local.example` to `.env.local` and fill in real values (see below).
3. Run the dev server: `npm run dev` — http://localhost:3000

Every page degrades gracefully without a configured Supabase project: rate card
shows the PRD's package structure with "Price on request", and gallery/tickets/
testimonials show honest empty states. **`/admin` requires Supabase** — there's
no meaningful fallback for authenticated admin actions.

## Provisioning Supabase

1. Create a project at supabase.com.
2. Run the SQL files in `supabase/migrations/` in order (SQL Editor, or the
   Supabase CLI) — this creates all tables, the `blocked_dates` view, RLS
   policies, the ticket-sold-increment function, and the `gallery` storage
   bucket, plus seeds the rate card package structure from the PRD.
3. Create an admin user under Authentication → Users (email + password) —
   that's the login for `/admin`.
4. Copy the Project URL, anon key, and service role key into `.env.local`.

## Payments

Paystack is primary, Flutterwave is the fallback — both buttons appear on
every checkout (bookings deposit, ticket purchase). Get test-mode secret/
public keys from each provider's dashboard and set them in `.env.local`.
Webhooks aren't used; verification happens via the redirect callback
(`/bookings/verify`, `/tickets/verify`), so those routes must be reachable
over HTTPS from the payment provider's redirect — this only works against a
deployed URL (e.g. a Vercel preview), not `localhost`.

## Email

Confirmation emails (booking deposit, ticket purchase, contact form) go
through Resend. Set `RESEND_API_KEY`, `NOTIFICATIONS_FROM_EMAIL` (must be a
domain verified in Resend), and `BUSINESS_OWNER_EMAIL`. Without a key, the app
logs a warning and skips sending instead of failing.

## Deployment

Deploy to Vercel and set every variable from `.env.local.example` as an
environment variable there too, including `NEXT_PUBLIC_SITE_URL` (used to
build payment callback URLs).
