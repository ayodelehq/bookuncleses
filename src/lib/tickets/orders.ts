import { createServiceRoleClient } from "@/lib/supabase/server";
import { generateTicketQrPng, generateTicketQrDataUrl } from "@/lib/tickets/qr";
import { sendEmail, ownerEmail } from "@/lib/email";
import type { EventRow, Ticket, TicketOrder, TicketTier } from "@/lib/supabase/types";

export async function createPendingOrder(params: {
  eventId: string;
  tierId: string;
  buyerName: string;
  buyerEmail: string;
  quantity: number;
}) {
  const supabase = createServiceRoleClient();

  const { data: tierData } = await supabase
    .from("ticket_tiers")
    .select("*")
    .eq("id", params.tierId)
    .single();
  const tier = tierData as TicketTier | null;

  if (!tier) throw new Error("Ticket tier not found.");

  const remaining = tier.quantity_available - tier.quantity_sold;
  if (params.quantity > remaining) {
    throw new Error(`Only ${remaining} ticket(s) left for this tier.`);
  }

  const amount = tier.price * params.quantity;

  const { data: order, error } = await supabase
    .from("ticket_orders")
    .insert({
      event_id: params.eventId,
      tier_id: params.tierId,
      buyer_name: params.buyerName,
      buyer_email: params.buyerEmail.trim().toLowerCase(),
      quantity: params.quantity,
      amount,
      status: "pending",
    })
    .select("*")
    .single();

  if (error || !order) throw new Error(error?.message ?? "Failed to create order.");

  return order as TicketOrder;
}

// Idempotent: safe to call more than once for the same order (e.g. if a
// payment provider redirects to the callback twice).
export async function fulfillOrder(orderId: string, paymentReference: string, provider: "paystack" | "flutterwave") {
  const supabase = createServiceRoleClient();

  const { data: orderData } = await supabase.from("ticket_orders").select("*").eq("id", orderId).single();
  const order = orderData as TicketOrder | null;
  if (!order) throw new Error("Order not found.");
  if (order.status === "paid") return order;

  await supabase
    .from("ticket_orders")
    .update({ status: "paid", payment_reference: paymentReference, payment_provider: provider })
    .eq("id", orderId);

  await supabase.rpc("increment_ticket_sold", { p_tier_id: order.tier_id, p_qty: order.quantity });

  const ticketRows = Array.from({ length: order.quantity }, () => ({ order_id: order.id }));
  const { data: tickets } = await supabase.from("tickets").insert(ticketRows).select("*");

  const { data: eventData } = await supabase.from("events").select("*").eq("id", order.event_id).single();
  const event = eventData as EventRow | null;

  if (tickets && event) {
    const attachments = await Promise.all(
      tickets.map(async (ticket: { qr_code_token: string }, index: number) => ({
        filename: `ticket-${index + 1}.png`,
        content: await generateTicketQrPng(ticket.qr_code_token),
      })),
    );

    await sendEmail({
      to: order.buyer_email,
      subject: `Your ticket(s) for ${event.title}`,
      html: `<p>Hi ${order.buyer_name},</p><p>Thanks for your purchase! Your ${order.quantity} ticket(s) for <strong>${event.title}</strong> (${event.venue}) are attached as QR codes — show one at the door for each attendee.</p>`,
      attachments,
    });

    const owner = ownerEmail();
    if (owner) {
      await sendEmail({
        to: owner,
        subject: `New ticket sale: ${event.title}`,
        html: `<p>${order.buyer_name} (${order.buyer_email}) bought ${order.quantity} ticket(s) for ${event.title}.</p>`,
      });
    }
  }

  return order;
}

export interface OrderSummary {
  order: TicketOrder;
  event: EventRow;
  tickets: { id: string; qrDataUrl: string }[];
}

export async function getOrderSummary(orderId: string): Promise<OrderSummary | null> {
  const supabase = createServiceRoleClient();

  const { data: orderData } = await supabase
    .from("ticket_orders")
    .select("*")
    .eq("id", orderId)
    .eq("status", "paid")
    .single();
  const order = orderData as TicketOrder | null;
  if (!order) return null;

  const { data: eventData } = await supabase.from("events").select("*").eq("id", order.event_id).single();
  const event = eventData as EventRow | null;
  if (!event) return null;

  const { data: ticketsData } = await supabase.from("tickets").select("*").eq("order_id", order.id);
  const rawTickets = (ticketsData as Ticket[] | null) ?? [];

  const tickets = await Promise.all(
    rawTickets.map(async (ticket) => ({
      id: ticket.id,
      qrDataUrl: await generateTicketQrDataUrl(ticket.qr_code_token),
    })),
  );

  return { order, event, tickets };
}

export async function getOrdersByEmail(email: string): Promise<OrderSummary[]> {
  const supabase = createServiceRoleClient();

  const { data: ordersData } = await supabase
    .from("ticket_orders")
    .select("*")
    .eq("buyer_email", email.trim().toLowerCase())
    .eq("status", "paid")
    .order("created_at", { ascending: false });
  const orders = (ordersData as TicketOrder[] | null) ?? [];

  const summaries = await Promise.all(orders.map((order) => getOrderSummary(order.id)));
  return summaries.filter((summary): summary is OrderSummary => summary !== null);
}
