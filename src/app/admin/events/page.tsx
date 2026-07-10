import Link from "next/link";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { deleteEvent, togglePublish } from "@/app/admin/events/actions";
import type { EventRow, TicketTier } from "@/lib/supabase/types";

export default async function AdminEventsPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();

  const [{ data: eventsData }, { data: tiersData }] = await Promise.all([
    supabase.from("events").select("*").order("event_date"),
    supabase.from("ticket_tiers").select("*"),
  ]);

  const events = (eventsData as EventRow[] | null) ?? [];
  const tiers = (tiersData as TicketTier[] | null) ?? [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Events & Tickets</h1>
        <Link
          href="/admin/events/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
        >
          New Event
        </Link>
      </div>

      <div className="mt-6 space-y-4">
        {events.length === 0 ? (
          <p className="text-sm text-muted">No events yet.</p>
        ) : (
          events.map((event) => {
            const eventTiers = tiers.filter((tier) => tier.event_id === event.id);
            const sold = eventTiers.reduce((sum, tier) => sum + tier.quantity_sold, 0);
            const available = eventTiers.reduce((sum, tier) => sum + tier.quantity_available, 0);

            return (
              <div key={event.id} className="rounded-2xl border border-border-subtle bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{event.title}</p>
                    <p className="text-sm text-muted">
                      {event.venue} &middot; {new Date(event.event_date).toLocaleDateString("en-NG")}
                    </p>
                    <p className="mt-1 text-xs text-muted">
                      {sold}/{available} tickets sold across {eventTiers.length} tier(s)
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        event.status === "published"
                          ? "bg-status-success-soft text-status-success"
                          : "bg-status-warning-soft text-status-warning"
                      }`}
                    >
                      {event.status}
                    </span>
                    <Link
                      href={`/admin/events/${event.id}`}
                      className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-brand hover:underline"
                    >
                      Orders
                    </Link>
                    <form action={togglePublish}>
                      <input type="hidden" name="id" value={event.id} />
                      <input
                        type="hidden"
                        name="nextStatus"
                        value={event.status === "published" ? "draft" : "published"}
                      />
                      <button
                        type="submit"
                        className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-brand hover:underline"
                      >
                        {event.status === "published" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deleteEvent}>
                      <input type="hidden" name="id" value={event.id} />
                      <button
                        type="submit"
                        className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-status-danger hover:underline"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
