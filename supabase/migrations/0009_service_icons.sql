-- Adds a small line-icon to each service tile. Plain text (not an enum) —
-- the icon set is a presentational registry maintained in the app code
-- (src/components/ui/ServiceIcon.tsx), not data that needs DB-level
-- integrity, so it can grow without an ALTER TYPE migration each time.

alter table services add column icon text;

update services set icon = 'microphone' where title = 'Stand-up Comedy';
update services set icon = 'spotlight' where title = 'Event Hosting';
update services set icon = 'bolt' where title = 'Hype Man';
update services set icon = 'star' where title = 'Appearance (Cameo)';
update services set icon = 'ticket' where title = 'JustKidding with Uncle Ses';
update services set icon = 'camera' where title = 'Photography';
update services set icon = 'video' where title = 'Video Coverage & Content Creation';
update services set icon = 'megaphone' where title = 'Brand Promotion & Adverts';
update services set icon = 'calendar' where title = 'Event Planning';

alter table services alter column icon set not null;
