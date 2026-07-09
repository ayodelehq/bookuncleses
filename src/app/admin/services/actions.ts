"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { ServiceCategory, ServiceIconKey, ServiceKind } from "@/lib/supabase/types";

function parseSortOrder(value: FormDataEntryValue | null): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

export async function updateService(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));
  const kind = String(formData.get("kind")) as ServiceKind;
  const category = String(formData.get("category")) as ServiceCategory;
  const icon = String(formData.get("icon")) as ServiceIconKey;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim();
  const ctaLabel = String(formData.get("ctaLabel") ?? "").trim();
  const ctaHref = String(formData.get("ctaHref") ?? "").trim();
  const sortOrder = parseSortOrder(formData.get("sortOrder"));

  if (!title || !description || !ctaLabel || !ctaHref) return;

  const supabase = createServiceRoleClient();
  await supabase
    .from("services")
    .update({
      kind,
      category,
      icon,
      title,
      description,
      badge: badge || null,
      cta_label: ctaLabel,
      cta_href: ctaHref,
      sort_order: sortOrder,
    })
    .eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function createService(formData: FormData) {
  await requireAdminUser();
  const kind = String(formData.get("kind")) as ServiceKind;
  const category = String(formData.get("category")) as ServiceCategory;
  const icon = String(formData.get("icon")) as ServiceIconKey;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const badge = String(formData.get("badge") ?? "").trim();
  const ctaLabel = String(formData.get("ctaLabel") ?? "").trim();
  const ctaHref = String(formData.get("ctaHref") ?? "").trim();
  const sortOrder = parseSortOrder(formData.get("sortOrder"));

  if (!title || !description || !ctaLabel || !ctaHref) return;

  const supabase = createServiceRoleClient();
  await supabase.from("services").insert({
    kind,
    category,
    icon,
    title,
    description,
    badge: badge || null,
    cta_label: ctaLabel,
    cta_href: ctaHref,
    sort_order: sortOrder,
  });
  revalidatePath("/admin/services");
  revalidatePath("/");
}

export async function deleteService(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));
  const supabase = createServiceRoleClient();
  await supabase.from("services").delete().eq("id", id);
  revalidatePath("/admin/services");
  revalidatePath("/");
}
