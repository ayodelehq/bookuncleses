import { createServiceRoleClient } from "@/lib/supabase/server";
import { sendEmail, ownerEmail } from "@/lib/email";
import type { Booking } from "@/lib/supabase/types";

// Idempotent: safe if a payment provider redirects to the callback twice.
export async function confirmBookingDeposit(
  bookingId: string,
  paymentReference: string,
  provider: "paystack" | "flutterwave",
) {
  const supabase = createServiceRoleClient();

  const { data: bookingData } = await supabase.from("bookings").select("*").eq("id", bookingId).single();
  const booking = bookingData as Booking | null;
  if (!booking) throw new Error("Booking not found.");
  if (booking.status === "deposit_paid" || booking.status === "confirmed") return booking;

  await supabase
    .from("bookings")
    .update({ status: "deposit_paid", payment_reference: paymentReference, payment_provider: provider })
    .eq("id", bookingId);

  await sendEmail({
    to: booking.client_email,
    subject: "Booking confirmed — deposit received",
    html: `<p>Hi ${booking.client_name},</p><p>Your deposit for <strong>${booking.event_date}</strong> (${booking.service_type.replace("_", " ")}) has been received and your date is now reserved. We'll be in touch about next steps.</p>`,
  });

  const owner = ownerEmail();
  if (owner) {
    await sendEmail({
      to: owner,
      subject: `New booking deposit: ${booking.client_name}`,
      html: `<p>${booking.client_name} (${booking.client_email}) paid a deposit for ${booking.service_type} on ${booking.event_date} at ${booking.location}.</p>`,
    });
  }

  return booking;
}
