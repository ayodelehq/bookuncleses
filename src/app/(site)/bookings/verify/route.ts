import { NextResponse, type NextRequest } from "next/server";
import { verifyPayment } from "@/lib/payments";
import { confirmBookingDeposit } from "@/lib/bookings/confirm";
import type { PaymentProvider } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const bookingId = request.nextUrl.searchParams.get("booking");
  const provider = request.nextUrl.searchParams.get("provider") as PaymentProvider | null;
  const gatewayReference =
    request.nextUrl.searchParams.get("reference") ?? request.nextUrl.searchParams.get("transaction_id");

  if (!bookingId || !provider || !gatewayReference) {
    return NextResponse.redirect(`${siteUrl}/bookings?error=missing_reference`);
  }

  try {
    const result = await verifyPayment(provider, gatewayReference);
    if (!result.success) {
      return NextResponse.redirect(`${siteUrl}/bookings?error=payment_failed`);
    }

    await confirmBookingDeposit(bookingId, gatewayReference, provider);
    return NextResponse.redirect(`${siteUrl}/bookings/success?booking=${bookingId}`);
  } catch (error) {
    console.error("Booking payment verification failed", error);
    return NextResponse.redirect(`${siteUrl}/bookings?error=verification_failed`);
  }
}
