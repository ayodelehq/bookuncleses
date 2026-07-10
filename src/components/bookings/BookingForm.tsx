"use client";

import { useActionState, useEffect, useState } from "react";
import { startBookingCheckout, type StartBookingCheckoutState } from "@/app/(site)/bookings/actions";
import { AvailabilityCalendar } from "@/components/bookings/AvailabilityCalendar";
import { bookingDepositNaira, bookingServiceOptions } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import { SubmitButton } from "@/components/motion/SubmitButton";

const initialState: StartBookingCheckoutState = { status: "idle" };

export function BookingForm({ blockedDates }: { blockedDates: string[] }) {
  const [state, formAction, pending] = useActionState(startBookingCheckout, initialState);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [clickedProvider, setClickedProvider] = useState<"paystack" | "flutterwave" | null>(null);

  useEffect(() => {
    if (state.status === "redirect" && state.redirectUrl) {
      window.location.href = state.redirectUrl;
    }
  }, [state]);

  if (!selectedDate) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-sm font-medium">Pick an available date to get started</p>
        <AvailabilityCalendar blockedDates={blockedDates} onSelect={setSelectedDate} />
      </div>
    );
  }

  const formattedDate = new Date(`${selectedDate}T00:00:00`).toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <form
      action={formAction}
      className="flex flex-col gap-5 rounded-2xl border border-border-subtle bg-surface p-6"
    >
      <div className="flex items-center justify-between rounded-lg bg-background px-4 py-3 text-sm">
        <span className="font-medium">{formattedDate}</span>
        <button
          type="button"
          onClick={() => setSelectedDate(null)}
          className="font-semibold text-brand hover:underline"
        >
          Change date
        </button>
      </div>
      <input type="hidden" name="eventDate" value={selectedDate} />

      <div>
        <label htmlFor="serviceType" className="text-sm font-medium">
          Service
        </label>
        <select
          id="serviceType"
          name="serviceType"
          required
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
        >
          {bookingServiceOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="location" className="text-sm font-medium">
          Location
        </label>
        <input
          id="location"
          name="location"
          required
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="clientName" className="text-sm font-medium">
            Name
          </label>
          <input
            id="clientName"
            name="clientName"
            required
            className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label htmlFor="clientPhone" className="text-sm font-medium">
            Phone
          </label>
          <input
            id="clientPhone"
            name="clientPhone"
            className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
          />
        </div>
      </div>

      <div>
        <label htmlFor="clientEmail" className="text-sm font-medium">
          Email
        </label>
        <input
          id="clientEmail"
          name="clientEmail"
          type="email"
          required
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label htmlFor="budgetRange" className="text-sm font-medium">
          Budget Range (optional)
        </label>
        <input
          id="budgetRange"
          name="budgetRange"
          placeholder="e.g. ₦200,000 - ₦400,000"
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label htmlFor="notes" className="text-sm font-medium">
          Anything else we should know?
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={4}
          className="mt-1 w-full rounded-lg border border-border-subtle bg-background px-4 py-3 text-sm"
        />
      </div>

      <div className="rounded-lg bg-background px-4 py-3 text-sm">
        A <strong>{formatPrice(bookingDepositNaira)}</strong> deposit confirms and reserves your date.
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <SubmitButton
          type="submit"
          name="provider"
          value="paystack"
          onClick={() => setClickedProvider("paystack")}
          disabled={pending}
          pending={pending && clickedProvider === "paystack"}
          pendingLabel="Redirecting..."
          className="flex-1 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-brand-foreground disabled:opacity-60"
        >
          Pay with Paystack
        </SubmitButton>
        <SubmitButton
          type="submit"
          name="provider"
          value="flutterwave"
          onClick={() => setClickedProvider("flutterwave")}
          disabled={pending}
          pending={pending && clickedProvider === "flutterwave"}
          pendingLabel="Redirecting..."
          light={false}
          className="flex-1 rounded-full border border-border-subtle px-5 py-3 text-sm font-semibold disabled:opacity-60"
        >
          Pay with Flutterwave
        </SubmitButton>
      </div>

      {state.status === "error" ? <p className="text-sm text-red-600">{state.message}</p> : null}
    </form>
  );
}
