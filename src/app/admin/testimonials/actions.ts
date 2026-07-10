"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

function parseSortOrder(value: FormDataEntryValue | null): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function createTestimonial(formData: FormData) {
  await requireAdminUser();
  const name = String(formData.get("name") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const eventType = String(formData.get("eventType") ?? "").trim();
  const sortOrder = parseSortOrder(formData.get("sortOrder"));

  if (!name || !quote) return;

  const supabase = createServiceRoleClient();
  await supabase.from("testimonials").insert({
    name,
    quote,
    event_type: eventType || null,
    sort_order: sortOrder,
  });

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function updateTestimonial(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const quote = String(formData.get("quote") ?? "").trim();
  const eventType = String(formData.get("eventType") ?? "").trim();
  const sortOrder = parseSortOrder(formData.get("sortOrder"));

  if (!name || !quote) return;

  const supabase = createServiceRoleClient();
  await supabase
    .from("testimonials")
    .update({ name, quote, event_type: eventType || null, sort_order: sortOrder })
    .eq("id", id);

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));

  const supabase = createServiceRoleClient();
  await supabase.from("testimonials").delete().eq("id", id);

  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
