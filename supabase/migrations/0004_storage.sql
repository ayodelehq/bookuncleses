-- Public bucket for portfolio images uploaded via /admin. Public read so
-- next/image and <img> tags can load them directly; writes still only ever
-- happen server-side with the service role key.
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;
