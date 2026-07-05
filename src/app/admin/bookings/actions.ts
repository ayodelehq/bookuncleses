"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { BookingStatus } from "@/lib/supabase/types";

export async function updateBookingStatus(formData: FormData) {
  await requireAdminUser();

  const bookingId = String(formData.get("bookingId"));
  const status = String(formData.get("status")) as BookingStatus;

  const supabase = createServiceRoleClient();
  await supabase.from("bookings").update({ status }).eq("id", bookingId);

  revalidatePath("/admin/bookings");
}
