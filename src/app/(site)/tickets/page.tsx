import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/layout/Section";
import { ShowcaseCard } from "@/components/ui/ShowcaseCard";
import { getPublishedEvents } from "@/lib/data/events";

export const metadata: Metadata = {
  title: "Tickets — Bookuncleses",
  description: "Buy tickets to events we host ourselves — workshops, mixers, and exhibitions.",
};

export default async function TicketsPage() {
  const events = await getPublishedEvents();

  return (
    <>
      <Hero
        title="Events we host ourselves."
        description="Styled shoot days, vendor mixers, workshops, and exhibitions — grab a ticket before they sell out."
        secondaryCta={{ label: "Look Up My Ticket", href: "/tickets/lookup" }}
        titleTone="warm"
      />

      <Section>
        {events.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border-subtle bg-surface p-16 text-center">
            <p className="text-ink text-lg font-semibold">No upcoming events yet</p>
            <p className="mt-2 text-sm text-muted">Check back soon, or follow our socials for announcements.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {events.map((event) => (
              <ShowcaseCard
                key={event.id}
                href={`/tickets/${event.slug}`}
                image={event.cover_image_url ?? undefined}
                title={event.title}
                meta={new Date(event.event_date).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                description={event.venue}
                cta="Get Tickets"
              />
            ))}
          </div>
        )}

        <p className="mt-10 text-center text-sm text-muted">
          Already bought a ticket?{" "}
          <Link href="/tickets/lookup" className="font-semibold text-brand hover:underline">
            Look it up here
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
