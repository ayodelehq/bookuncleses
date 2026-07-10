import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { toggleCheckIn } from "@/app/admin/events/[id]/actions";
import { formatPrice } from "@/lib/format";
import type { EventRow, Ticket, TicketOrder, TicketTier } from "@/lib/supabase/types";

export default async function AdminEventOrdersPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdminUser();
  const { id } = await params;
  const supabase = createServiceRoleClient();

  const { data: eventData } = await supabase.from("events").select("*").eq("id", id).single();
  const event = eventData as EventRow | null;
  if (!event) notFound();

  const [{ data: tiersData }, { data: ordersData }] = await Promise.all([
    supabase.from("ticket_tiers").select("*").eq("event_id", id),
    supabase
      .from("ticket_orders")
      .select("*")
      .eq("event_id", id)
      .eq("status", "paid")
      .order("created_at"),
  ]);
  const tiers = (tiersData as TicketTier[] | null) ?? [];
  const orders = (ordersData as TicketOrder[] | null) ?? [];

  const { data: ticketsData } = await supabase
    .from("tickets")
    .select("*")
    .in("order_id", orders.length > 0 ? orders.map((order) => order.id) : ["00000000-0000-0000-0000-000000000000"]);
  const tickets = (ticketsData as Ticket[] | null) ?? [];

  const tierNameById = new Map(tiers.map((tier) => [tier.id, tier.name]));
  const totalCheckedIn = tickets.filter((ticket) => ticket.checked_in_at).length;

  return (
    <div>
      <Link href="/admin/events" className="text-sm font-medium text-brand hover:underline">
        &larr; Events & Tickets
      </Link>
      <h1 className="mt-2 text-2xl font-semibold">{event.title}</h1>
      <p className="text-sm text-muted">
        {event.venue} &middot; {new Date(event.event_date).toLocaleDateString("en-NG")}
      </p>
      <p className="mt-1 text-sm font-medium">
        {totalCheckedIn}/{tickets.length} attendees checked in
      </p>

      <div className="mt-6 space-y-4">
        {orders.length === 0 ? (
          <p className="rounded-2xl border border-border-subtle bg-surface p-6 text-center text-sm text-muted">
            No paid orders yet for this event.
          </p>
        ) : (
          orders.map((order) => {
            const orderTickets = tickets.filter((ticket) => ticket.order_id === order.id);
            return (
              <div key={order.id} className="rounded-2xl border border-border-subtle bg-surface p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{order.buyer_name}</p>
                    <a href={`mailto:${order.buyer_email}`} className="text-sm text-brand hover:underline">
                      {order.buyer_email}
                    </a>
                    <p className="mt-1 text-xs text-muted">
                      {tierNameById.get(order.tier_id) ?? "Ticket"} &middot; {order.quantity}x &middot;{" "}
                      {formatPrice(order.amount)}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {orderTickets.map((ticket, index) => {
                    const checkedIn = Boolean(ticket.checked_in_at);
                    return (
                      <form key={ticket.id} action={toggleCheckIn}>
                        <input type="hidden" name="ticketId" value={ticket.id} />
                        <input type="hidden" name="eventId" value={event.id} />
                        <input type="hidden" name="currentlyCheckedIn" value={String(checkedIn)} />
                        <button
                          type="submit"
                          className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                            checkedIn
                              ? "bg-status-success text-brand-foreground hover:opacity-90"
                              : "border border-border-subtle hover:border-brand hover:text-brand"
                          }`}
                        >
                          Ticket {index + 1}: {checkedIn ? "Checked in ✓" : "Check in"}
                        </button>
                      </form>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
