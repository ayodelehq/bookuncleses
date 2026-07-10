"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { GalleryCategory } from "@/lib/supabase/types";

function slugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export async function uploadGalleryImage(formData: FormData) {
  await requireAdminUser();
  const category = String(formData.get("category")) as GalleryCategory;
  const caption = String(formData.get("caption") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) return;

  const { url } = await uploadToCloudinary(file, "gallery");

  const supabase = createServiceRoleClient();
  await supabase.from("gallery_items").insert({
    category,
    media_type: "image",
    url,
    caption: caption || null,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/photos");
  revalidatePath("/");
}

// A pasted URL for an existing YouTube/Vimeo embed (or any already-hosted
// video) — no upload happens here, unlike uploadGalleryVideoFile below.
export async function addGalleryVideo(formData: FormData) {
  await requireAdminUser();
  const category = String(formData.get("category")) as GalleryCategory;
  const embedUrl = String(formData.get("embedUrl") ?? "").trim();
  const caption = String(formData.get("caption") ?? "").trim();

  if (!embedUrl) return;

  const supabase = createServiceRoleClient();
  await supabase.from("gallery_items").insert({
    category,
    media_type: "video_embed",
    url: embedUrl,
    caption: caption || null,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/photos");
  revalidatePath("/");
}

// Uploads an actual video file to Cloudinary; the resulting direct file URL
// is rendered as a native <video> player (see src/lib/media.ts) rather than
// an iframe embed.
export async function uploadGalleryVideoFile(formData: FormData) {
  await requireAdminUser();
  const category = String(formData.get("category")) as GalleryCategory;
  const caption = String(formData.get("caption") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) return;

  const { url } = await uploadToCloudinary(file, "gallery");

  const supabase = createServiceRoleClient();
  await supabase.from("gallery_items").insert({
    category,
    media_type: "video_embed",
    url,
    caption: caption || null,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/photos");
  revalidatePath("/");
}

export async function deleteGalleryItem(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));

  const supabase = createServiceRoleClient();
  await supabase.from("gallery_items").delete().eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/photos");
  revalidatePath("/");
}

export interface GalleryCategoryState {
  status: "idle" | "error" | "success";
  message?: string;
}

export async function createGalleryCategory(
  _prevState: GalleryCategoryState,
  formData: FormData,
): Promise<GalleryCategoryState> {
  await requireAdminUser();
  const label = String(formData.get("label") ?? "").trim();
  const value = slugify(label);
  if (!label || !value) {
    return { status: "error", message: "Enter a category name." };
  }

  const supabase = createServiceRoleClient();

  const { data: existing } = await supabase
    .from("gallery_categories")
    .select("value")
    .eq("value", value)
    .maybeSingle();
  if (existing) {
    return { status: "error", message: `"${label}" already exists.` };
  }

  const { count } = await supabase
    .from("gallery_categories")
    .select("*", { count: "exact", head: true });
  const { error } = await supabase
    .from("gallery_categories")
    .insert({ value, label, sort_order: count ?? 0 });

  if (error) {
    return { status: "error", message: error.message };
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/photos");
  return { status: "success", message: `Added "${label}".` };
}

// Category deletion is also blocked at the DB level (foreign key) while any
// gallery item still references it; the admin page only renders the delete
// button for categories with zero items, so the DB error below is a safety
// net for the direct-`fetch` edge case, not the primary UX.
export async function deleteGalleryCategory(
  _prevState: GalleryCategoryState,
  formData: FormData,
): Promise<GalleryCategoryState> {
  await requireAdminUser();
  const value = String(formData.get("value"));

  const supabase = createServiceRoleClient();
  const { error } = await supabase.from("gallery_categories").delete().eq("value", value);

  if (error) {
    return { status: "error", message: "Couldn't delete — it may still have items using it." };
  }

  revalidatePath("/admin/gallery");
  revalidatePath("/photos");
  return { status: "success" };
}
