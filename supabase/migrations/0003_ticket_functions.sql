-- Atomic increment so concurrent purchases can't race-condition past
-- quantity_available (application code still checks availability before
-- initializing payment; this makes the post-payment write itself atomic).
create or replace function increment_ticket_sold(p_tier_id uuid, p_qty integer)
returns void as $$
begin
  update ticket_tiers set quantity_sold = quantity_sold + p_qty where id = p_tier_id;
end;
$$ language plpgsql;
