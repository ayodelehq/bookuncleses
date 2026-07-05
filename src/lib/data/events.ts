import { createClient } from "@/lib/supabase/server";
import type { EventRow, TicketTier } from "@/lib/supabase/types";

// No fallback rows: hosted events are real, dated, ticketed occasions — we
// won't invent one. Empty state reads "No upcoming events yet."
export async function getPublishedEvents(): Promise<EventRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("events")
      .select("*")
      .eq("status", "published")
      .order("event_date");
    return (data as EventRow[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getEventBySlug(
  slug: string,
): Promise<{ event: EventRow; tiers: TicketTier[] } | null> {
  try {
    const supabase = await createClient();
    const { data: eventData } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .single();

    const event = eventData as EventRow | null;
    if (!event) return null;

    const { data: tiers } = await supabase
      .from("ticket_tiers")
      .select("*")
      .eq("event_id", event.id)
      .order("sort_order");

    return { event, tiers: (tiers as TicketTier[] | null) ?? [] };
  } catch {
    return null;
  }
}
