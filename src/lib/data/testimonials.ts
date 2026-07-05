import { createClient } from "@/lib/supabase/server";
import type { Testimonial } from "@/lib/supabase/types";

// No fallback quotes: testimonials attribute words to real clients, so an
// empty result means the section simply doesn't render yet.
export async function getTestimonials(): Promise<Testimonial[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("testimonials").select("*").order("sort_order");
    return (data as Testimonial[] | null) ?? [];
  } catch {
    return [];
  }
}
