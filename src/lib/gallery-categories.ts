import type { GalleryCategory } from "@/lib/supabase/types";

export const galleryCategories: { value: GalleryCategory; label: string }[] = [
  { value: "weddings", label: "Weddings" },
  { value: "corporate", label: "Corporate" },
  { value: "portraits", label: "Portraits" },
  { value: "hosted_events", label: "Hosted Events" },
];
