"use client";

import { useMemo, useState } from "react";
import { updateBookingStatus } from "@/app/admin/bookings/actions";
import { formatPrice } from "@/lib/format";
import type { Booking, BookingStatus } from "@/lib/supabase/types";

const PAGE_SIZE = 10;

const statusColors: Record<BookingStatus, string> = {
  pending: "bg-status-warning-soft text-status-warning",
  deposit_paid: "bg-brand-soft/40 text-brand-secondary",
  confirmed: "bg-status-success-soft text-status-success",
  cancelled: "bg-status-danger-soft text-status-danger",
};

const statusOptions: { value: BookingStatus | "all"; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "pending", label: "Pending" },
  { value: "deposit_paid", label: "Deposit Paid" },
  { value: "confirmed", label: "Confirmed" },
  { value: "cancelled", label: "Cancelled" },
];

export function AdminBookingsTable({ bookings }: { bookings: Booking[] }) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<BookingStatus | "all">("all");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesStatus = status === "all" || booking.status === status;
      const matchesSearch =
        !query ||
        booking.client_name.toLowerCase().includes(query) ||
        booking.client_email.toLowerCase().includes(query) ||
        booking.location.toLowerCase().includes(query) ||
        booking.service_type.toLowerCase().includes(query);
      return matchesStatus && matchesSearch;
    });
  }, [bookings, search, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page_ = Math.min(page, totalPages);
  const paginated = filtered.slice((page_ - 1) * PAGE_SIZE, page_ * PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Search</span>
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Name, email, location, service..."
            className="w-64 rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">Status</span>
          <select
            value={status}
            onChange={(event) => {
              setStatus(event.target.value as BookingStatus | "all");
              setPage(1);
            }}
            className="rounded-lg border border-border-subtle bg-background px-3 py-2 text-sm"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm text-muted">
          {filtered.length} of {bookings.length} booking{bookings.length === 1 ? "" : "s"}
        </p>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border-subtle bg-surface">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="border-b border-border-subtle text-left text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="p-4">Date</th>
              <th className="p-4">Service</th>
              <th className="p-4">Client</th>
              <th className="p-4">Location</th>
              <th className="p-4">Deposit</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted">
                  {bookings.length === 0 ? "No bookings yet." : "No bookings match your search."}
                </td>
              </tr>
            ) : (
              paginated.map((booking) => (
                <tr key={booking.id} className="border-b border-border-subtle last:border-0">
                  <td className="p-4">{booking.event_date}</td>
                  <td className="p-4 capitalize">{booking.service_type.replace("_", " ")}</td>
                  <td className="p-4">
                    <p>{booking.client_name}</p>
                    <p className="text-xs text-muted">{booking.client_email}</p>
                  </td>
                  <td className="p-4">{booking.location}</td>
                  <td className="p-4">{formatPrice(booking.deposit_amount)}</td>
                  <td className="p-4">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColors[booking.status]}`}>
                      {booking.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {booking.status === "deposit_paid" ? (
                        <form action={updateBookingStatus}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <input type="hidden" name="status" value="confirmed" />
                          <button
                            type="submit"
                            className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-brand hover:underline"
                          >
                            Confirm
                          </button>
                        </form>
                      ) : null}
                      {booking.status !== "cancelled" ? (
                        <form action={updateBookingStatus}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <input type="hidden" name="status" value="cancelled" />
                          <button
                            type="submit"
                            className="flex min-h-11 items-center rounded-md px-2 text-sm font-semibold text-status-danger hover:underline"
                          >
                            Cancel
                          </button>
                        </form>
                      ) : null}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page_ === 1}
            className="min-h-11 rounded-full border border-border-subtle px-4 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPage(n)}
              aria-current={n === page_}
              className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                n === page_
                  ? "bg-brand text-brand-foreground"
                  : "border border-border-subtle hover:border-brand hover:text-brand"
              }`}
            >
              {n}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page_ === totalPages}
            className="min-h-11 rounded-full border border-border-subtle px-4 text-sm font-medium transition-colors hover:border-brand hover:text-brand disabled:pointer-events-none disabled:opacity-40"
          >
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
}
