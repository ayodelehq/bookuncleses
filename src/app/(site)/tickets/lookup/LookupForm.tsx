"use client";

import { useActionState } from "react";
import { lookupTickets, type LookupState } from "@/app/(site)/tickets/lookup/actions";

const initialState: LookupState = { status: "idle" };

export function LookupForm() {
  const [state, formAction, pending] = useActionState(lookupTickets, initialState);

  return (
    <div className="mx-auto max-w-lg">
      <form action={formAction} className="flex gap-2">
        <input
          type="email"
          name="email"
          placeholder="you@example.com"
          required
          className="flex-1 rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground disabled:opacity-60"
        >
          {pending ? "Looking up..." : "Find Tickets"}
        </button>
      </form>

      {state.status === "error" ? <p className="mt-4 text-sm text-red-600">{state.message}</p> : null}

      {state.status === "success" && state.results ? (
        <div className="mt-8 space-y-8">
          {state.results.map((summary) => (
            <div key={summary.order.id} className="rounded-2xl border border-border-subtle bg-surface p-6">
              <h3 className="font-semibold">{summary.event.title}</h3>
              <p className="text-sm text-muted">{summary.event.venue}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
                {summary.tickets.map((ticket, index) => (
                  <div key={ticket.id} className="text-center">
                    {/* eslint-disable-next-line @next/next/no-img-element -- data: URL QR code */}
                    <img src={ticket.qrDataUrl} alt={`Ticket ${index + 1}`} className="mx-auto h-28 w-28" />
                    <p className="mt-1 text-xs text-muted">Ticket {index + 1}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
