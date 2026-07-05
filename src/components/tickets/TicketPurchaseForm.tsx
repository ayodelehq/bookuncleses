"use client";

import { useEffect, useState } from "react";
import { useActionState } from "react";
import { startTicketCheckout, type StartCheckoutState } from "@/app/(site)/tickets/[slug]/actions";
import type { TicketTier } from "@/lib/supabase/types";
import { formatPrice } from "@/lib/format";

const initialState: StartCheckoutState = { status: "idle" };

export function TicketPurchaseForm({ eventId, tiers }: { eventId: string; tiers: TicketTier[] }) {
  const [selectedTierId, setSelectedTierId] = useState(tiers[0]?.id ?? "");
  const [state, formAction, pending] = useActionState(startTicketCheckout, initialState);

  useEffect(() => {
    if (state.status === "redirect" && state.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state]);

  if (tiers.length === 0) {
    return <p className="text-sm text-muted">Ticket sales for this event haven&apos;t opened yet.</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4 rounded-2xl border border-border-subtle bg-surface p-6">
      <input type="hidden" name="eventId" value={eventId} />

      <div>
        <label className="text-sm font-medium">Ticket Tier</label>
        <div className="mt-2 flex flex-col gap-2">
          {tiers.map((tier) => {
            const remaining = tier.quantity_available - tier.quantity_sold;
            const soldOut = remaining <= 0;
            return (
              <label
                key={tier.id}
                className={`flex items-center justify-between rounded-lg border px-4 py-3 text-sm ${
                  soldOut ? "cursor-not-allowed opacity-50" : "cursor-pointer"
                } ${selectedTierId === tier.id ? "border-brand" : "border-border-subtle"}`}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="tierId"
                    value={tier.id}
                    checked={selectedTierId === tier.id}
                    disabled={soldOut}
                    onChange={() => setSelectedTierId(tier.id)}
                  />
                  {tier.name}
                </span>
                <span className="font-semibold text-brand">
                  {soldOut ? "Sold Out" : formatPrice(tier.price)}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="quantity" className="text-sm font-medium">
          Quantity
        </label>
        <input
          id="quantity"
          name="quantity"
          type="number"
          min={1}
          max={10}
          defaultValue={1}
          className="mt-1 w-24 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
        />
      </div>

      <div>
        <label htmlFor="buyerName" className="text-sm font-medium">
          Name
        </label>
        <input
          id="buyerName"
          name="buyerName"
          required
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label htmlFor="buyerEmail" className="text-sm font-medium">
          Email
        </label>
        <input
          id="buyerEmail"
          name="buyerEmail"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
        />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="submit"
          name="provider"
          value="paystack"
          disabled={pending}
          className="flex-1 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground disabled:opacity-60"
        >
          Pay with Paystack
        </button>
        <button
          type="submit"
          name="provider"
          value="flutterwave"
          disabled={pending}
          className="flex-1 rounded-full border border-border-subtle px-5 py-3 text-sm font-semibold disabled:opacity-60"
        >
          Pay with Flutterwave
        </button>
      </div>

      {state.status === "error" ? <p className="text-sm text-red-600">{state.message}</p> : null}
    </form>
  );
}
