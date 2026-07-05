"use server";

import { createServiceRoleClient } from "@/lib/supabase/server";
import { initializePayment } from "@/lib/payments";
import { bookingDepositNaira } from "@/lib/site-config";
import type { BookingServiceType, PaymentProvider } from "@/lib/supabase/types";

export interface StartBookingCheckoutState {
  status: "idle" | "error" | "redirect";
  message?: string;
  redirectUrl?: string;
}

export async function startBookingCheckout(
  _prevState: StartBookingCheckoutState,
  formData: FormData,
): Promise<StartBookingCheckoutState> {
  const serviceType = String(formData.get("serviceType")) as BookingServiceType;
  const eventDate = String(formData.get("eventDate") ?? "");
  const location = String(formData.get("location") ?? "").trim();
  const clientName = String(formData.get("clientName") ?? "").trim();
  const clientEmail = String(formData.get("clientEmail") ?? "").trim();
  const clientPhone = String(formData.get("clientPhone") ?? "").trim();
  const budgetRange = String(formData.get("budgetRange") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const provider = String(formData.get("provider")) as PaymentProvider;

  if (!eventDate || !location || !clientName || !clientEmail) {
    return { status: "error", message: "Please fill in date, location, name, and email." };
  }

  try {
    const supabase = createServiceRoleClient();

    const { data: blocked } = await supabase.from("blocked_dates").select("event_date").eq("event_date", eventDate);
    if (blocked && blocked.length > 0) {
      return { status: "error", message: "That date was just booked by someone else — please pick another." };
    }

    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        service_type: serviceType,
        event_date: eventDate,
        location,
        client_name: clientName,
        client_email: clientEmail,
        client_phone: clientPhone || null,
        budget_range: budgetRange || null,
        notes: notes || null,
        status: "pending",
        deposit_amount: bookingDepositNaira,
      })
      .select("*")
      .single();

    if (error || !booking) throw new Error(error?.message ?? "Failed to create booking.");

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { authorization_url } = await initializePayment(provider, {
      email: clientEmail,
      amountNaira: bookingDepositNaira,
      reference: booking.id,
      callbackUrl: `${siteUrl}/bookings/verify?booking=${booking.id}&provider=${provider}`,
      metadata: { bookingId: booking.id, kind: "booking_deposit" },
    });

    return { status: "redirect", redirectUrl: authorization_url };
  } catch (error) {
    // Everything that reaches this catch is an internal/config error (missing
    // env vars, DB error, payment provider outage) — never the user's fault,
    // so show a generic friendly message instead of leaking the raw error.
    console.error("Booking checkout failed", error);
    return {
      status: "error",
      message: "Something went wrong starting your payment. Please try again, or reach out on WhatsApp and we'll book you manually.",
    };
  }
}
