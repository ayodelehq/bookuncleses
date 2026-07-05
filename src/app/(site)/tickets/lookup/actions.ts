"use server";

import { getOrdersByEmail, type OrderSummary } from "@/lib/tickets/orders";

export interface LookupState {
  status: "idle" | "success" | "error";
  results?: OrderSummary[];
  message?: string;
}

export async function lookupTickets(_prevState: LookupState, formData: FormData): Promise<LookupState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { status: "error", message: "Enter the email you used to purchase." };

  const results = await getOrdersByEmail(email);
  if (results.length === 0) {
    return { status: "error", message: "No paid tickets found for that email." };
  }

  return { status: "success", results };
}
