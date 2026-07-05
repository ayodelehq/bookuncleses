"use server";

import { revalidatePath } from "next/cache";
import { requireAdminUser } from "@/lib/auth/admin";
import { createServiceRoleClient } from "@/lib/supabase/server";
import type { GalleryCategory } from "@/lib/supabase/types";

export async function uploadGalleryImage(formData: FormData) {
  await requireAdminUser();
  const category = String(formData.get("category")) as GalleryCategory;
  const caption = String(formData.get("caption") ?? "").trim();
  const file = formData.get("file") as File | null;

  if (!file || file.size === 0) return;

  const supabase = createServiceRoleClient();
  const path = `${category}/${Date.now()}-${file.name}`;

  const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("gallery").getPublicUrl(path);

  await supabase.from("gallery_items").insert({
    category,
    media_type: "image",
    url: publicUrl,
    caption: caption || null,
  });

  revalidatePath("/admin/gallery");
  revalidatePath("/photos");
  revalidatePath("/");
}

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

export async function deleteGalleryItem(formData: FormData) {
  await requireAdminUser();
  const id = String(formData.get("id"));

  const supabase = createServiceRoleClient();
  await supabase.from("gallery_items").delete().eq("id", id);

  revalidatePath("/admin/gallery");
  revalidatePath("/photos");
  revalidatePath("/");
}
