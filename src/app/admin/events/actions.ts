"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createEvent(formData: FormData) {
  await requireAdminUser();

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const eventDate = String(formData.get("eventDate") ?? "");
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim();

  if (!title || !description || !venue || !eventDate) return;

  const supabase = createServiceRoleClient();
  const slug = slugify(title) || `event-${Date.now()}`;

  const { data: event, error } = await supabase
    .from("events")
    .insert({
      title,
      slug,
      description,
      venue,
      event_date: new Date(eventDate).toISOString(),
      cover_image_url: coverImageUrl || null,
      status: "draft",
    })
    .select("*")
    .single();

  if (error || !event) throw new Error(error?.message ?? "Failed to create event.");

  const tierRows = [1, 2, 3]
    .map((n) => ({
      name: String(formData.get(`tier${n}Name`) ?? "").trim(),
      price: Number(formData.get(`tier${n}Price`) ?? 0),
      quantity_available: Number(formData.get(`tier${n}Quantity`) ?? 0),
      sort_order: n,
    }))
    .filter((tier) => tier.name && tier.quantity_available > 0);

  if (tierRows.length > 0) {
    await supabase.from("ticket_tiers").insert(tierRows.map((tier) => ({ ...tier, event_id: event.id })));
  }

  revalidatePath("/admin/events");
  redirect("/admin/events");
}

export async function togglePublish(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));
  const nextStatus = String(formData.get("nextStatus"));

  const supabase = createServiceRoleClient();
  await supabase.from("events").update({ status: nextStatus }).eq("id", id);

  revalidatePath("/admin/events");
  revalidatePath("/tickets");
  revalidatePath("/");
}

export async function deleteEvent(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));

  const supabase = createServiceRoleClient();
  await supabase.from("events").delete().eq("id", id);

  revalidatePath("/admin/events");
  revalidatePath("/tickets");
}
