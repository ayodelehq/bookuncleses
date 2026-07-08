"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function deleteContactMessage(formData: FormData) {
  await requireAdminUser();

  const id = String(formData.get("id"));

  const supabase = createServiceRoleClient();
  await supabase.from("contact_messages").delete().eq("id", id);

  revalidatePath("/admin/messages");
}
