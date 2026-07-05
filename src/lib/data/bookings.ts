import { createClient } from "@/lib/supabase/server";

// Reads the `blocked_dates` view (bookings with status deposit_paid/confirmed).
// A date only becomes unavailable once a deposit has actually cleared, per
// the PRD's "avoid double-booking" requirement.
export async function getBlockedDates(): Promise<string[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("blocked_dates").select("event_date");
    return ((data as { event_date: string }[] | null) ?? []).map((row) => row.event_date);
  } catch {
    return [];
  }
}
