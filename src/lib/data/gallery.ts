import { createClient } from "@/lib/supabase/server";
import type { GalleryCategoryRow, GalleryItem } from "@/lib/supabase/types";

// No fallback rows here on purpose: portfolio photos/videos are the
// business's real past work, and we won't fabricate placeholder shoots.
// The gallery page shows an honest "coming soon" empty state per category
// until real items are uploaded through /admin.
export async function getGalleryItems(): Promise<GalleryItem[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("gallery_items").select("*").order("sort_order");
    return (data as GalleryItem[] | null) ?? [];
  } catch {
    return [];
  }
}

export async function getGalleryCategories(): Promise<GalleryCategoryRow[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("gallery_categories").select("*").order("sort_order");
    return (data as GalleryCategoryRow[] | null) ?? [];
  } catch {
    return [];
  }
}
