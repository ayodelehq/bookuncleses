-- Client relabeled "Venue Planning" to the broader "Event Planning" (no rows
-- reference the old value yet, confirmed before running), and added a new
-- Entertainment offering, "Hype Man", alongside Stand-up Comedy/Event
-- Hosting as a real bookable rate-card category.
--
-- RENAME VALUE is safe to use immediately (unlike ADD VALUE, it doesn't
-- require the value to have been committed in an earlier transaction) but
-- the ADD VALUE for hype_man still needs to land before anything selects
-- rate_card/bookings rows with that category, so treat this file as its own
-- migration step same as 0005.

alter type rate_card_category rename value 'venue_planning' to 'event_planning';
alter type booking_service_type rename value 'venue_planning' to 'event_planning';
alter type rate_card_category add value 'hype_man';
alter type booking_service_type add value 'hype_man';
