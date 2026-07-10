"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { SERVICE_DESCRIPTION_MAX_LENGTH } from "@/lib/services";
import type { ServiceCategory, ServiceIconKey, ServiceKind } from "@/lib/supabase/types";

function parseSortOrder(value: FormDataEntryValue | null): number {
  const parsed = Number(value ?? 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

// The public ServiceCard tile has no button — kind only ever drove a CTA in
// an earlier design that's since been dropped. The services table still has
// not-null cta_label/cta_href columns, so we fill them with a value that
// matches the service's kind rather than asking the admin to type dead data.
function defaultCta(kind: ServiceKind): { label: string; href: string } {
  if (kind === "quote") return { label: "Request a Quote", href: "/contact" };
  if (kind === "teaser") return { label: "Get Notified", href: "/contact" };
  return { label: "View Packages", href: "/rate-card" };
}

export async function updateService(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));
  const kind = String(formData.get("kind")) as ServiceKind;
  const category = String(formData.get("category")) as ServiceCategory;
  const icon = String(formData.get("icon")) as ServiceIconKey;
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim().slice(0, SERVICE_DESCRIPTION_MAX_LENGTH);
  const badge = String(formData.get("badge") ?? "").trim();
  const sortOrder = parseSortOrder(formData.get("sortOrder"));

  if (!title || !description) return;

  const cta = defaultCta(kind);
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
      cta_label: cta.label,
      cta_href: cta.href,
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
  const description = String(formData.get("description") ?? "").trim().slice(0, SERVICE_DESCRIPTION_MAX_LENGTH);
  const badge = String(formData.get("badge") ?? "").trim();
  const sortOrder = parseSortOrder(formData.get("sortOrder"));

  if (!title || !description) return;

  const cta = defaultCta(kind);
  const supabase = createServiceRoleClient();
  await supabase.from("services").insert({
    kind,
    category,
    icon,
    title,
    description,
    badge: badge || null,
    cta_label: cta.label,
    cta_href: cta.href,
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
