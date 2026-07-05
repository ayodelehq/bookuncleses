import { NextResponse, type NextRequest } from "next/server";
import { verifyPayment } from "@/lib/payments";
import { fulfillOrder } from "@/lib/tickets/orders";
import type { PaymentProvider } from "@/lib/supabase/types";

export async function GET(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const orderId = request.nextUrl.searchParams.get("order");
  const provider = request.nextUrl.searchParams.get("provider") as PaymentProvider | null;
  // Paystack appends `reference`, Flutterwave appends `transaction_id`.
  const gatewayReference =
    request.nextUrl.searchParams.get("reference") ?? request.nextUrl.searchParams.get("transaction_id");

  if (!orderId || !provider || !gatewayReference) {
    return NextResponse.redirect(`${siteUrl}/tickets?error=missing_reference`);
  }

  try {
    const result = await verifyPayment(provider, gatewayReference);
    if (!result.success) {
      return NextResponse.redirect(`${siteUrl}/tickets?error=payment_failed`);
    }

    await fulfillOrder(orderId, gatewayReference, provider);
    return NextResponse.redirect(`${siteUrl}/tickets/success?order=${orderId}`);
  } catch (error) {
    console.error("Ticket payment verification failed", error);
    return NextResponse.redirect(`${siteUrl}/tickets?error=verification_failed`);
  }
}
