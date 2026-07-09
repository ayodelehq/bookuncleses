import { createClient } from "@/lib/supabase/server";
import type { Service } from "@/lib/supabase/types";

// Mirrors supabase/migrations/0006_services.sql + 0008_service_groups.sql so
// the page renders correctly even before those migrations have run.
const fallbackServices: Service[] = [
  {
    id: "stand-up-comedy",
    kind: "bookable",
    category: "entertainment",
    icon: "microphone",
    title: "Stand-up Comedy",
    description:
      "Clean, engaging stand-up comedy that keeps any crowd smiling at weddings, birthdays, and corporate celebrations all night.",
    badge: null,
    cta_label: "View Packages",
    cta_href: "/rate-card#stand_up_comedy",
    sort_order: 1,
  },
  {
    id: "event-hosting",
    kind: "bookable",
    category: "entertainment",
    icon: "spotlight",
    title: "Event Hosting",
    description:
      "Confident, professional hosting that keeps your audience engaged while the programme flows smoothly from start to finish.",
    badge: null,
    cta_label: "View Packages",
    cta_href: "/rate-card#event_hosting",
    sort_order: 2,
  },
  {
    id: "hype-man",
    kind: "bookable",
    category: "entertainment",
    icon: "bolt",
    title: "Hype Man",
    description:
      "High energy crowd work that keeps the room buzzing all night, the perfect complement to your MC.",
    badge: null,
    cta_label: "View Packages",
    cta_href: "/rate-card#hype_man",
    sort_order: 3,
  },
  {
    id: "appearance-cameo",
    kind: "quote",
    category: "entertainment",
    icon: "star",
    title: "Appearance (Cameo)",
    description:
      "A special guest appearance that adds excitement to openings, launches, or private functions your guests will remember.",
    badge: null,
    cta_label: "Request a Quote",
    cta_href: "/contact",
    sort_order: 4,
  },
  {
    id: "justkidding",
    kind: "teaser",
    category: "entertainment",
    icon: "ticket",
    title: "JustKidding with Uncle Ses",
    description:
      "A recurring comedy night full of laughter, live performances, and vibes, connecting fans with Uncle Ses directly.",
    badge: "Coming Soon",
    cta_label: "Get Notified",
    cta_href: "/contact",
    sort_order: 5,
  },
  {
    id: "photography",
    kind: "bookable",
    category: "creative",
    icon: "camera",
    title: "Photography",
    description:
      "Vibrant, high quality photography that preserves genuine moments from weddings, birthdays, corporate events for years to come.",
    badge: null,
    cta_label: "View Packages",
    cta_href: "/rate-card#photography",
    sort_order: 1,
  },
  {
    id: "video-content",
    kind: "bookable",
    category: "creative",
    icon: "video",
    title: "Video Coverage & Content Creation",
    description:
      "Professional video coverage and content creation that captures every moment, ready to share across social media platforms.",
    badge: null,
    cta_label: "View Packages",
    cta_href: "/rate-card#videography",
    sort_order: 2,
  },
  {
    id: "brand-promotion",
    kind: "quote",
    category: "creative",
    icon: "megaphone",
    title: "Brand Promotion & Adverts",
    description:
      "Engaging promotional campaigns and branded content that build visibility, credibility, and trust for your growing business today.",
    badge: null,
    cta_label: "Request a Quote",
    cta_href: "/contact",
    sort_order: 3,
  },
  {
    id: "event-planning",
    kind: "bookable",
    category: "event",
    icon: "calendar",
    title: "Event Planning",
    description:
      "Well organized, beautifully coordinated event planning from concept to execution, with every detail carefully handled for you.",
    badge: null,
    cta_label: "View Packages",
    cta_href: "/rate-card#event_planning",
    sort_order: 1,
  },
];

export async function getServices(): Promise<Service[]> {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from("services").select("*").order("sort_order");
    const services = data as Service[] | null;

    return services && services.length > 0 ? services : fallbackServices;
  } catch {
    return fallbackServices;
  }
}
