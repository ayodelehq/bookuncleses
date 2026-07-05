import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { updateBookingStatus } from "@/app/admin/bookings/actions";
import { formatPrice } from "@/lib/format";
import type { Booking } from "@/lib/supabase/types";

const statusColors: Record<Booking["status"], string> = {
  pending: "bg-yellow-500/15 text-yellow-700",
  deposit_paid: "bg-blue-500/15 text-blue-700",
  confirmed: "bg-green-500/15 text-green-700",
  cancelled: "bg-red-500/15 text-red-700",
};

export default async function AdminBookingsPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("bookings").select("*").order("event_date");
  const bookings = (data as Booking[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Bookings</h1>

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
            {bookings.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-6 text-center text-muted">
                  No bookings yet.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
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
                          <button type="submit" className="text-xs font-semibold text-brand hover:underline">
                            Confirm
                          </button>
                        </form>
                      ) : null}
                      {booking.status !== "cancelled" ? (
                        <form action={updateBookingStatus}>
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <input type="hidden" name="status" value="cancelled" />
                          <button type="submit" className="text-xs font-semibold text-red-600 hover:underline">
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
    </div>
  );
}
