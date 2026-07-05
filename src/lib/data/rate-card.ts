import { createClient } from "@/lib/supabase/server";
import type { Addon, RateCardItem } from "@/lib/supabase/types";

// Mirrors supabase/migrations/0002_seed_rate_card.sql so the page renders the
// correct package structure even before a Supabase project is wired up.
const fallbackRateCard: RateCardItem[] = [
  { id: "essential", category: "photography", package_name: "Essential", description: "2 hours coverage, 1 photographer, edited gallery", duration: "2 hrs", price: null, sort_order: 1 },
  { id: "signature", category: "photography", package_name: "Signature", description: "Half-day coverage, 2nd photographer, same-day previews", duration: "Half-day", price: null, sort_order: 2 },
  { id: "premium", category: "photography", package_name: "Premium", description: "Full-day coverage, drone shots, premium album", duration: "Full day", price: null, sort_order: 3 },
  { id: "highlight-reel", category: "videography", package_name: "Highlight Reel", description: "3-5 min edited highlight video", duration: "Half-day", price: null, sort_order: 1 },
  { id: "full-coverage", category: "videography", package_name: "Full Coverage", description: "Full ceremony/event recording + highlight reel", duration: "Full day", price: null, sort_order: 2 },
  { id: "standard-hosting", category: "event_hosting", package_name: "Standard Hosting", description: "MC for up to 4 hours, run-of-show coordination", duration: "4 hrs", price: null, sort_order: 1 },
  { id: "full-hosting", category: "event_hosting", package_name: "Full Event Hosting", description: "Full-day MC, vendor coordination, rehearsal call", duration: "Full day", price: null, sort_order: 2 },
];

const fallbackAddons: Addon[] = [
  { id: "extra-hour", name: "Extra hour of coverage (per hour)", price: null, sort_order: 1 },
  { id: "second-shooter", name: "Second photographer/videographer", price: null, sort_order: 2 },
  { id: "drone", name: "Drone footage", price: null, sort_order: 3 },
  { id: "raw-footage", name: "Raw/unedited footage handover", price: null, sort_order: 4 },
];

export async function getRateCard(): Promise<{ items: RateCardItem[]; addons: Addon[] }> {
  try {
    const supabase = await createClient();
    const [ratesResult, addonsResult] = await Promise.all([
      supabase.from("rate_card").select("*").order("sort_order"),
      supabase.from("addons").select("*").order("sort_order"),
    ]);

    const rates = ratesResult.data as RateCardItem[] | null;
    const addonsData = addonsResult.data as Addon[] | null;

    if (!rates || rates.length === 0) {
      return { items: fallbackRateCard, addons: fallbackAddons };
    }

    return {
      items: rates,
      addons: addonsData && addonsData.length > 0 ? addonsData : fallbackAddons,
    };
  } catch {
    return { items: fallbackRateCard, addons: fallbackAddons };
  }
}

