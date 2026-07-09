-- Service directory content (the "What We Offer" tiles on Home) as its own
-- admin-editable table, separate from `rate_card` which only holds pricing
-- for the bookable categories. This is content, not pricing: title,
-- description, and which CTA the tile points to. Business owner edits this
-- from /admin/services instead of the copy being hardcoded in page.tsx.
--
-- Must run after 0005 has committed (new rate_card_category /
-- booking_service_type enum values aren't visible until that transaction
-- lands).

create type service_kind as enum ('bookable', 'quote', 'teaser');

create table services (
  id uuid primary key default gen_random_uuid(),
  kind service_kind not null default 'bookable',
  title text not null,
  description text not null,
  badge text,
  cta_label text not null,
  cta_href text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table services enable row level security;
create policy "public can read services" on services for select using (true);

insert into services (kind, title, description, badge, cta_label, cta_href, sort_order) values
  ('bookable', 'Photography',
   'Every celebration deserves to be remembered. From birthdays and weddings to corporate events and private celebrations, we deliver vibrant, high-quality photography that preserves the genuine moments and emotions you''ll cherish for years.',
   null, 'View Packages', '/rate-card#photography', 1),
  ('bookable', 'Video Coverage & Content Creation',
   'Your event deserves more than memories — it deserves a story. Professional video coverage and engaging content creation that captures every important moment, ready to share with family, friends, or on social media.',
   null, 'View Packages', '/rate-card#videography', 2),
  ('bookable', 'Event Hosting',
   'A great event deserves a great host. Uncle Ses brings energy, confidence, and professionalism to every stage, keeping your audience engaged while the programme flows seamlessly from start to finish.',
   null, 'View Packages', '/rate-card#event_hosting', 3),
  ('bookable', 'Venue Planning',
   'Planning an event can be overwhelming — we make it easier. From concept to execution, we help create well-organized, beautifully coordinated experiences tailored to your vision, with every detail handled.',
   null, 'View Packages', '/rate-card#venue_planning', 4),
  ('bookable', 'Stand-up Comedy',
   'Turn every gathering into an unforgettable experience with Uncle Ses'' unique brand of stand-up comedy. Clean, engaging, and relatable sets that keep any crowd — corporate, wedding, birthday, or private — smiling all night.',
   null, 'View Packages', '/rate-card#stand_up_comedy', 5),
  ('quote', 'Brand Promotion & Adverts',
   'Looking for a trusted face to promote your brand? Engaging promotional campaigns and branded content that help businesses increase visibility, build credibility, and connect with the right audience — real estate or otherwise.',
   null, 'Request a Quote', '/contact', 6),
  ('quote', 'Appearance (Cameo)',
   'Need Uncle Ses at your event? Whether it''s a grand opening, product launch, or private function, his presence adds excitement and gives your guests an experience they won''t forget.',
   null, 'Request a Quote', '/contact', 7),
  ('teaser', 'JustKidding with Uncle Ses',
   'More than a comedy show — it''s an experience. An unforgettable night of laughter, live performances, and amazing vibes. Come connect with Uncle Ses in person at the comedy club everyone will be talking about.',
   'Coming Soon', 'Get Notified', '/contact', 8);
