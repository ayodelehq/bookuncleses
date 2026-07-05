import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { ShowcaseCard } from "@/components/ui/ShowcaseCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { PricingCard } from "@/components/ui/PricingCard";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { CTASection } from "@/components/ui/CTASection";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { getGalleryItems } from "@/lib/data/gallery";
import { getTestimonials } from "@/lib/data/testimonials";
import { getPublishedEvents } from "@/lib/data/events";
import { getRateCard } from "@/lib/data/rate-card";
import { formatPrice } from "@/lib/format";
import { bookingDepositNaira, siteConfig } from "@/lib/site-config";
import type { RateCardCategory } from "@/lib/supabase/types";

const homeFaqs = [
  {
    question: "How does the deposit work?",
    answer: `A flat ${formatPrice(
      bookingDepositNaira,
    )} deposit holds your date — paid securely through Paystack or Flutterwave, and it comes off your final package total.`,
  },
  {
    question: "What if my event doesn't fit a fixed package?",
    answer:
      "Multi-day events, destination weddings, or unusual guest counts get a custom quote — reach out and we'll put one together.",
  },
];

const rateCardHighlights: { category: RateCardCategory; packageName: string }[] = [
  { category: "photography", packageName: "Signature" },
  { category: "videography", packageName: "Full Coverage" },
  { category: "event_hosting", packageName: "Full Event Hosting" },
];

export default async function HomePage() {
  const [gallery, testimonials, events, rateCard] = await Promise.all([
    getGalleryItems(),
    getTestimonials(),
    getPublishedEvents(),
    getRateCard(),
  ]);

  const featuredWork = gallery.filter((item) => item.media_type === "image").slice(0, 2);
  const btsPhoto = gallery.filter((item) => item.media_type === "image")[2];
  const upcomingEvents = events.slice(0, 3);

  const pricingPicks = rateCardHighlights
    .map(({ category, packageName }) =>
      rateCard.items.find((item) => item.category === category && item.package_name === packageName) ??
      rateCard.items.find((item) => item.category === category),
    )
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <>
      <Hero
        title={siteConfig.tagline}
        description={siteConfig.description}
        primaryCta={{ label: "Check Availability", href: "/bookings" }}
        secondaryCta={{ label: "View Portfolio", href: "/photos" }}
        media={<MediaPlaceholder kind="image" label="Hero image required" fill />}
        topNote="Trusted for weddings, corporate events, and private celebrations."
      />

      <Section>
        <SectionHeading
          align="split"
          title={
            <>
              <span className="text-foreground">Featured</span> Work
            </>
          }
          description="Recent shoots and productions we've delivered."
          cta={{ label: "View All Work", href: "/photos" }}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {[0, 1].map((slot) => {
            const item = featuredWork[slot];
            return (
              <div key={slot} className="group relative aspect-[4/3] overflow-hidden rounded-2xl">
                {item ? (
                  <>
                    <Image src={item.url} alt={item.caption ?? "Featured work"} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    {item.caption ? (
                      <span className="font-accent absolute bottom-6 left-6 rounded-full bg-black/40 px-3 py-1 text-sm font-medium text-white opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
                        {item.caption}
                      </span>
                    ) : null}
                  </>
                ) : (
                  <MediaPlaceholder kind="image" label="Portfolio photo required" fill />
                )}
              </div>
            );
          })}
        </div>
      </Section>

      <Section className="bg-surface-alt">
        <SectionHeading
          align="split"
          title={
            <>
              <span className="text-foreground">Behind</span> the Scenes
            </>
          }
          description="A glimpse into how we bring each event to life."
        />
        <div className="relative mt-10 aspect-[21/9] overflow-hidden rounded-2xl">
          {btsPhoto ? (
            <Image src={btsPhoto.url} alt={btsPhoto.caption ?? "Behind the scenes"} fill className="object-cover" />
          ) : (
            <MediaPlaceholder kind="image" label="Behind-the-scenes photo required" fill />
          )}
        </div>
      </Section>

      {testimonials.length > 0 ? (
        <Section>
          <SectionHeading
            align="split"
            title={
              <>
                <span className="text-foreground">Client</span> Feedback
              </>
            }
            description="Real words from the people we've worked with."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.name}
                quote={testimonial.quote}
                eventType={testimonial.event_type}
                featured={index === 1}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {pricingPicks.length > 0 ? (
        <Section className="bg-surface-alt">
          <SectionHeading
            align="split"
            title={
              <>
                <span className="text-foreground">Simple</span> Pricing
              </>
            }
            description="Transparent packages across photography, videography, and hosting."
            cta={{ label: "View Full Rate Card", href: "/rate-card" }}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {pricingPicks.map((pkg, index) => (
              <PricingCard
                key={pkg.id}
                name={pkg.package_name}
                price={formatPrice(pkg.price)}
                duration={pkg.duration}
                description={pkg.description}
                featured={index === 1}
              />
            ))}
          </div>
        </Section>
      ) : null}

      <Section>
        <div className="grid gap-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="flex min-h-105 flex-col rounded-2xl bg-surface-alt p-8 sm:min-h-130">
            <MediaPlaceholder kind="image" label="" className="h-16 w-16 rounded-full" />
            <h3 className="text-ink mt-6 text-2xl font-semibold uppercase tracking-[-0.04em]">Book an Event</h3>
            <p className="mt-3 font-mono text-sm text-muted">
              Reach out today to book your event, secure your spot, and get all the details you need
              to make it unforgettable.
            </p>
            <Link
              href="/bookings#reserve"
              className="mt-6 inline-block w-fit rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Book an Event
            </Link>

            <div className="mt-auto flex items-center gap-3 pt-10 text-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 6h18v12H3z" strokeLinejoin="round" />
                  <path d="m3 6 9 7 9-7" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                Do you prefer email communication?
                <br />
                <a href={`mailto:${siteConfig.email}`} className="font-mono text-ink hover:text-brand">
                  {siteConfig.email}
                </a>
              </span>
            </div>
          </div>

          <div>
            <SectionHeading title="Frequently Asked Questions" align="left" />
            <div className="mt-8">
              <FAQAccordion items={homeFaqs} />
            </div>
          </div>
        </div>
      </Section>

      {upcomingEvents.length > 0 ? (
        <Section className="bg-surface-alt">
          <SectionHeading
            align="split"
            title={
              <>
                <span className="text-foreground">Upcoming</span> Events
              </>
            }
            description="See what we're hosting next and grab a spot."
            cta={{ label: "See All Events", href: "/tickets" }}
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {upcomingEvents.map((event) => (
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
        </Section>
      ) : null}

      <Section>
        <CTASection />
      </Section>
    </>
  );
}
