-- Makes gallery categories admin-manageable instead of a fixed enum.
-- Run this once in the Supabase Dashboard: SQL Editor > New query > paste > Run.

create table gallery_categories (
  value text primary key,
  label text not null,
  sort_order integer not null default 0
);

insert into gallery_categories (value, label, sort_order) values
  ('weddings', 'Weddings', 0),
  ('corporate', 'Corporate', 1),
  ('portraits', 'Portraits', 2),
  ('hosted_events', 'Hosted Events', 3);

-- Convert gallery_items.category from the fixed enum to text, backed by a
-- foreign key into gallery_categories so the admin can add/remove categories
-- without a further schema migration.
alter table gallery_items
  alter column category type text using category::text;

alter table gallery_items
  add constraint gallery_items_category_fkey
  foreign key (category) references gallery_categories (value);

drop type gallery_category;

alter table gallery_categories enable row level security;
create policy "public can read gallery categories" on gallery_categories for select using (true);
