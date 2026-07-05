-- Seeds the rate card structure straight from the approved PRD (package names,
-- what's included, durations). Prices are left null for the business owner to
-- fill in via /admin — the PRD marks these as [₦____] placeholders, not
-- confirmed numbers, so we don't fabricate figures here.

insert into rate_card (category, package_name, description, duration, sort_order) values
  ('photography', 'Essential', '2 hours coverage, 1 photographer, edited gallery', '2 hrs', 1),
  ('photography', 'Signature', 'Half-day coverage, 2nd photographer, same-day previews', 'Half-day', 2),
  ('photography', 'Premium', 'Full-day coverage, drone shots, premium album', 'Full day', 3),
  ('videography', 'Highlight Reel', '3-5 min edited highlight video', 'Half-day', 1),
  ('videography', 'Full Coverage', 'Full ceremony/event recording + highlight reel', 'Full day', 2),
  ('event_hosting', 'Standard Hosting', 'MC for up to 4 hours, run-of-show coordination', '4 hrs', 1),
  ('event_hosting', 'Full Event Hosting', 'Full-day MC, vendor coordination, rehearsal call', 'Full day', 2);

insert into addons (name, sort_order) values
  ('Extra hour of coverage (per hour)', 1),
  ('Second photographer/videographer', 2),
  ('Drone footage', 3),
  ('Raw/unedited footage handover', 4);
