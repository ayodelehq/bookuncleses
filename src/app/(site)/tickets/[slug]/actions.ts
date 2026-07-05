"use server";

import { createPendingOrder } from "@/lib/tickets/orders";
import { initializePayment } from "@/lib/payments";
import type { PaymentProvider } from "@/lib/supabase/types";

export interface StartCheckoutState {
  status: "idle" | "error" | "redirect";
  message?: string;
  redirectUrl?: string;
}

export async function startTicketCheckout(
  _prevState: StartCheckoutState,
  formData: FormData,
): Promise<StartCheckoutState> {
  const eventId = String(formData.get("eventId"));
  const tierId = String(formData.get("tierId"));
  const buyerName = String(formData.get("buyerName") ?? "").trim();
  const buyerEmail = String(formData.get("buyerEmail") ?? "").trim();
  const quantity = Number(formData.get("quantity") ?? 1);
  const provider = String(formData.get("provider")) as PaymentProvider;

  if (!buyerName || !buyerEmail || !quantity || quantity < 1) {
    return { status: "error", message: "Please fill in your name, email, and a valid quantity." };
  }

  try {
    const order = await createPendingOrder({ eventId, tierId, buyerName, buyerEmail, quantity });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { authorization_url } = await initializePayment(provider, {
      email: buyerEmail,
      amountNaira: order.amount,
      reference: order.id,
      callbackUrl: `${siteUrl}/tickets/verify?order=${order.id}&provider=${provider}`,
      metadata: { orderId: order.id, kind: "ticket_order" },
    });

    return { status: "redirect", redirectUrl: authorization_url };
  } catch (error) {
    console.error("Ticket checkout failed", error);
    // "Tier not found" / "Only N left" are genuinely useful to the buyer;
    // anything else (missing env vars, raw DB errors, provider outages) is
    // an internal problem that shouldn't be shown verbatim.
    const isKnownMessage =
      error instanceof Error && (error.message === "Ticket tier not found." || error.message.startsWith("Only "));
    return {
      status: "error",
      message: isKnownMessage
        ? (error as Error).message
        : "Something went wrong starting checkout. Please try again in a moment.",
    };
  }
}
