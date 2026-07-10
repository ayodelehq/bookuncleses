"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function toggleCheckIn(formData: FormData) {
  await requireAdminUser();
  const ticketId = String(formData.get("ticketId"));
  const eventId = String(formData.get("eventId"));
  const currentlyCheckedIn = formData.get("currentlyCheckedIn") === "true";

  const supabase = createServiceRoleClient();
  await supabase
    .from("tickets")
    .update({ checked_in_at: currentlyCheckedIn ? null : new Date().toISOString() })
    .eq("id", ticketId);

  revalidatePath(`/admin/events/${eventId}`);
}
