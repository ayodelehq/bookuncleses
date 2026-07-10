import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { AdminBookingsTable } from "@/components/admin/AdminBookingsTable";
import type { Booking } from "@/lib/supabase/types";

export default async function AdminBookingsPage() {
  await requireAdminUser();
  const supabase = createServiceRoleClient();
  const { data } = await supabase.from("bookings").select("*").order("event_date");
  const bookings = (data as Booking[] | null) ?? [];

  return (
    <div>
      <h1 className="text-2xl font-semibold">Bookings</h1>
      <div className="mt-6">
        <AdminBookingsTable bookings={bookings} />
      </div>
    </div>
  );
}
