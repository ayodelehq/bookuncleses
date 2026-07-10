"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { RateCardCategory } from "@/lib/supabase/types";

function parsePrice(value: FormDataEntryValue | null): number | null {
  const str = String(value ?? "").trim();
  if (!str) return null;
  const parsed = Number(str);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function updateRateCardItem(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));
  const packageName = String(formData.get("packageName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const price = parsePrice(formData.get("price"));

  if (!packageName || !description || !duration) return;

  const supabase = createServiceRoleClient();
  await supabase
    .from("rate_card")
    .update({ package_name: packageName, description, duration, price })
    .eq("id", id);
  revalidatePath("/admin/rate-card");
  revalidatePath("/rate-card");
}

export async function createRateCardItem(formData: FormData) {
  await requireAdminUser();
  const category = String(formData.get("category")) as RateCardCategory;
  const packageName = String(formData.get("packageName") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const duration = String(formData.get("duration") ?? "").trim();
  const price = parsePrice(formData.get("price"));

  if (!packageName || !description || !duration) return;

  const supabase = createServiceRoleClient();
  await supabase
    .from("rate_card")
    .insert({ category, package_name: packageName, description, duration, price });
  revalidatePath("/admin/rate-card");
  revalidatePath("/rate-card");
}

export async function deleteRateCardItem(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));
  const supabase = createServiceRoleClient();
  await supabase.from("rate_card").delete().eq("id", id);
  revalidatePath("/admin/rate-card");
  revalidatePath("/rate-card");
}

export async function updateAddon(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));
  const name = String(formData.get("name") ?? "").trim();
  const price = parsePrice(formData.get("price"));

  if (!name) return;

  const supabase = createServiceRoleClient();
  await supabase.from("addons").update({ name, price }).eq("id", id);
  revalidatePath("/admin/rate-card");
  revalidatePath("/rate-card");
}

export async function createAddon(formData: FormData) {
  await requireAdminUser();
  const name = String(formData.get("name") ?? "").trim();
  const price = parsePrice(formData.get("price"));
  if (!name) return;

  const supabase = createServiceRoleClient();
  await supabase.from("addons").insert({ name, price });
  revalidatePath("/admin/rate-card");
  revalidatePath("/rate-card");
}

export async function deleteAddon(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));
  const supabase = createServiceRoleClient();
  await supabase.from("addons").delete().eq("id", id);
  revalidatePath("/admin/rate-card");
  revalidatePath("/rate-card");
}
