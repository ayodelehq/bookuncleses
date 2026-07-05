-- Bookuncleses.com initial schema
-- All writes happen server-side via the Supabase service role key (Next.js
-- Server Actions / Route Handlers). RLS below only grants the anon (browser)
-- key read access to already-published, public-facing content.

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Bookings (Photography / Videography / Event Hosting / Full Package)
-- ---------------------------------------------------------------------------
create type booking_service_type as enum ('photography', 'videography', 'event_hosting', 'full_package');
create type booking_status as enum ('pending', 'deposit_paid', 'confirmed', 'cancelled');
create type payment_provider as enum ('paystack', 'flutterwave');

create table bookings (
  id uuid primary key default gen_random_uuid(),
  service_type booking_service_type not null,
  event_date date not null,
  location text not null,
  client_name text not null,
  client_email text not null,
  client_phone text,
  budget_range text,
  notes text,
  status booking_status not null default 'pending',
  deposit_amount numeric(12, 2),
  payment_reference text,
  payment_provider payment_provider,
  created_at timestamptz not null default now()
);

-- A date is only considered "taken" once a deposit has actually cleared.
create view blocked_dates as
  select event_date
  from bookings
  where status in ('deposit_paid', 'confirmed');

-- ---------------------------------------------------------------------------
-- Hosted events + ticketing
-- ---------------------------------------------------------------------------
create type event_status as enum ('draft', 'published');
create type order_status as enum ('pending', 'paid', 'cancelled');

create table events (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  venue text not null,
  event_date timestamptz not null,
  cover_image_url text,
  status event_status not null default 'draft',
  created_at timestamptz not null default now()
);

create table ticket_tiers (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id) on delete cascade,
  name text not null,
  price numeric(12, 2) not null,
  quantity_available integer not null,
  quantity_sold integer not null default 0,
  sort_order integer not null default 0
);

create table ticket_orders (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references events (id),
  tier_id uuid not null references ticket_tiers (id),
  buyer_name text not null,
  buyer_email text not null,
  quantity integer not null check (quantity > 0),
  amount numeric(12, 2) not null,
  payment_reference text,
  payment_provider payment_provider,
  status order_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table tickets (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references ticket_orders (id) on delete cascade,
  qr_code_token uuid not null default gen_random_uuid() unique,
  checked_in_at timestamptz
);

-- ---------------------------------------------------------------------------
-- Portfolio gallery
-- ---------------------------------------------------------------------------
create type gallery_category as enum ('weddings', 'corporate', 'portraits', 'hosted_events');
create type gallery_media_type as enum ('image', 'video_embed');

create table gallery_items (
  id uuid primary key default gen_random_uuid(),
  category gallery_category not null,
  media_type gallery_media_type not null,
  url text not null,
  caption text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Rate card
-- ---------------------------------------------------------------------------
create type rate_card_category as enum ('photography', 'videography', 'event_hosting');

-- price is nullable: packages can be published with the name/description
-- decided before the business owner has finalized the number in /admin.
create table rate_card (
  id uuid primary key default gen_random_uuid(),
  category rate_card_category not null,
  package_name text not null,
  description text not null,
  duration text not null,
  price numeric(12, 2),
  sort_order integer not null default 0
);

create table addons (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  price numeric(12, 2),
  sort_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Testimonials + contact messages
-- ---------------------------------------------------------------------------
create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quote text not null,
  event_type text,
  sort_order integer not null default 0
);

create table contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Row Level Security: anon key gets read-only access to published content.
-- All inserts/updates happen server-side with the service role key.
-- ---------------------------------------------------------------------------
alter table bookings enable row level security;
alter table events enable row level security;
alter table ticket_tiers enable row level security;
alter table ticket_orders enable row level security;
alter table tickets enable row level security;
alter table gallery_items enable row level security;
alter table rate_card enable row level security;
alter table addons enable row level security;
alter table testimonials enable row level security;
alter table contact_messages enable row level security;

create policy "public can read published events" on events
  for select using (status = 'published');

create policy "public can read ticket tiers of published events" on ticket_tiers
  for select using (
    exists (select 1 from events where events.id = ticket_tiers.event_id and events.status = 'published')
  );

create policy "public can read gallery" on gallery_items for select using (true);
create policy "public can read rate card" on rate_card for select using (true);
create policy "public can read addons" on addons for select using (true);
create policy "public can read testimonials" on testimonials for select using (true);

-- bookings, ticket_orders, tickets, contact_messages have no public policies:
-- they are only ever read/written via the service role key from Server Actions.
