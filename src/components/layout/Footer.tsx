import { FooterContent } from "@/components/layout/FooterContent";
import { getPublishedEvents } from "@/lib/data/events";

export async function Footer() {
  const events = await getPublishedEvents();
  return <FooterContent upcomingCount={events.length} />;
}
