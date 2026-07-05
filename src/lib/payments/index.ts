import { initializePaystackTransaction, verifyPaystackTransaction } from "@/lib/payments/paystack";
import { initializeFlutterwaveTransaction, verifyFlutterwaveTransaction } from "@/lib/payments/flutterwave";
import type { PaymentProvider } from "@/lib/supabase/types";

interface InitializeParams {
  email: string;
  amountNaira: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

// Paystack is the primary provider; Flutterwave is offered as a fallback
// button so a client whose card/bank fails on one gateway can retry on the
// other without losing their booking/order draft (same `reference`).
export async function initializePayment(provider: PaymentProvider, params: InitializeParams) {
  if (provider === "paystack") {
    return initializePaystackTransaction(params);
  }
  return initializeFlutterwaveTransaction(params);
}

export async function verifyPayment(provider: PaymentProvider, reference: string) {
  if (provider === "paystack") {
    return verifyPaystackTransaction(reference);
  }
  return verifyFlutterwaveTransaction(reference);
}
