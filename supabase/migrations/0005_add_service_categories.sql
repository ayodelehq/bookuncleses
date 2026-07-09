-- Adds two service categories the business actually offers (Venue Planning,
-- Stand-up Comedy bookings) that were missing from the original schema.
-- These enum values must land in their own migration/transaction: Postgres
-- forbids using a value added via ALTER TYPE ... ADD VALUE in the same
-- transaction block that added it, so 0006 (which references them) has to
-- run as a separate statement batch after this one commits.

alter type rate_card_category add value 'venue_planning';
alter type rate_card_category add value 'stand_up_comedy';
alter type booking_service_type add value 'venue_planning';
alter type booking_service_type add value 'stand_up_comedy';
