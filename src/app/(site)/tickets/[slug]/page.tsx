import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hero } from "@/components/ui/Hero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { TicketPurchaseForm } from "@/components/tickets/TicketPurchaseForm";
import { ShowcaseCard } from "@/components/ui/ShowcaseCard";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { getEventBySlug, getPublishedEvents } from "@/lib/data/events";
import { siteConfig } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getEventBySlug(slug);
  return { title: result ? `${result.event.title} — Bookuncleses` : "Event — Bookuncleses" };
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [result, allEvents] = await Promise.all([getEventBySlug(slug), getPublishedEvents()]);
  if (!result) notFound();

  const { event, tiers } = result;
  const moreEvents = allEvents.filter((item) => item.slug !== event.slug).slice(0, 3);

  return (
    <>
      <Hero
        title={event.title}
        description={`${new Date(event.event_date).toLocaleDateString("en-NG", {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })} · ${event.venue}`}
      />

      <Container className="pt-10">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl">
          {event.cover_image_url ? (
            <Image src={event.cover_image_url} alt={event.title} fill className="object-cover" />
          ) : (
            <MediaPlaceholder kind="image" label="Event cover image required" fill />
          )}
        </div>
      </Container>

      <Section>
        <div className="grid gap-10 md:grid-cols-3">
          <div className="md:col-span-2">
            <h2 className="text-ink text-2xl font-semibold">About This Event</h2>
            <p className="mt-4 whitespace-pre-line text-muted">{event.description}</p>
          </div>

          <div>
            <TicketPurchaseForm eventId={event.id} tiers={tiers} />
          </div>
        </div>
      </Section>

      {moreEvents.length > 0 ? (
        <Section className="bg-surface-alt">
          <SectionHeading title="More Events" align="left" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {moreEvents.map((item) => (
              <ShowcaseCard
                key={item.id}
                href={`/tickets/${item.slug}`}
                image={item.cover_image_url ?? undefined}
                title={item.title}
                meta={new Date(item.event_date).toLocaleDateString("en-NG", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
                description={item.venue}
                cta="Get Tickets"
              />
            ))}
          </div>
        </Section>
      ) : null}

      <Section className="bg-foreground text-background">
        <div className="flex flex-col items-center gap-4 text-center">
          <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[34px] md:text-[40px]">
            Have a question before you buy?
          </h2>
          <p className="max-w-xl text-background/80">
            Reach out and we&apos;ll help you pick the right ticket tier.
          </p>
          <a
            href={`https://wa.me/${siteConfig.whatsappNumber}`}
            className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Chat on WhatsApp
          </a>
          <Link href="/tickets" className="text-sm text-background/70 hover:text-background">
            &larr; Back to all events
          </Link>
        </div>
      </Section>
    </>
  );
}
