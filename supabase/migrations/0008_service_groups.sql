-- Groups the "What We Offer" tiles into the three named categories the
-- client actually uses (Entertainment / Creative Services / Event
-- Services), separate from `kind` (which still only governs CTA style:
-- bookable / quote / teaser).

create type service_category as enum ('entertainment', 'creative', 'event');

alter table services add column category service_category;

update services set category = 'creative'
  where title in ('Photography', 'Video Coverage & Content Creation', 'Brand Promotion & Adverts');

update services set category = 'entertainment'
  where title in ('Event Hosting', 'Stand-up Comedy', 'Appearance (Cameo)', 'JustKidding with Uncle Ses');

update services set category = 'event'
  where title = 'Venue Planning';

alter table services alter column category set not null;

-- Rename the Venue Planning tile to match the client's own "Event Planning"
-- wording, now that its category is set.
update services
  set title = 'Event Planning', cta_href = '/rate-card#event_planning'
  where title = 'Venue Planning';

insert into services (kind, category, title, description, cta_label, cta_href, sort_order) values
  ('bookable', 'entertainment', 'Hype Man',
   'The right energy can transform any event, and Uncle Ses knows exactly how to create it. From weddings and birthdays to concerts, after-parties, special events, and corporate celebrations, he keeps the crowd engaged with vibrant energy, seamless audience interaction, and an atmosphere that keeps everyone talking long after the event ends.',
   'View Packages', '/rate-card#hype_man', 2);

-- Renumber sort_order within each category to match the client's own list
-- order (Stand-up Comedy, Event Hosting, Hype Man, Appearance, JustKidding /
-- Photography, Video & Content, Brand Promotion / Event Planning).
update services set sort_order = 1 where title = 'Stand-up Comedy';
update services set sort_order = 2 where title = 'Event Hosting';
update services set sort_order = 3 where title = 'Hype Man';
update services set sort_order = 4 where title = 'Appearance (Cameo)';
update services set sort_order = 5 where title = 'JustKidding with Uncle Ses';
update services set sort_order = 1 where title = 'Photography';
update services set sort_order = 2 where title = 'Video Coverage & Content Creation';
update services set sort_order = 3 where title = 'Brand Promotion & Adverts';
update services set sort_order = 1 where title = 'Event Planning';
