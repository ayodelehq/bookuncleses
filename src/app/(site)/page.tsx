import Image from "next/image";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { ShowcaseCard } from "@/components/ui/ShowcaseCard";
import { TestimonialCard } from "@/components/ui/TestimonialCard";
import { PricingCard } from "@/components/ui/PricingCard";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { CTASection } from "@/components/ui/CTASection";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { VideoShowcaseTile } from "@/components/ui/VideoShowcaseTile";
import { Reveal, RevealGroup, RevealItem, ZoomReveal } from "@/components/motion/Reveal";
import { MarqueeRow } from "@/components/motion/MarqueeRow";
import { getGalleryItems } from "@/lib/data/gallery";
import { getTestimonials } from "@/lib/data/testimonials";
import { getPublishedEvents } from "@/lib/data/events";
import { getRateCard } from "@/lib/data/rate-card";
import { getServices } from "@/lib/data/services";
import { formatPrice } from "@/lib/format";
import { bookingDepositNaira, siteConfig } from "@/lib/site-config";
import type { RateCardCategory, ServiceCategory } from "@/lib/supabase/types";

const heroPhrases = [
  "Trusted for weddings, corporate events, and private celebrations.",
  "Every frame planned, every moment captured.",
  "From intimate gatherings to full-scale productions.",
  "Photography, videography, and hosting — all in one place.",
];

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

const serviceCategoryOrder: ServiceCategory[] = ["entertainment", "creative", "event"];

const serviceCategoryLabels: Record<ServiceCategory, string> = {
  entertainment: "Entertainment",
  creative: "Creative Services",
  event: "Event Services",
};

const rateCardHighlights: { category: RateCardCategory; packageName: string }[] = [
  { category: "photography", packageName: "Signature" },
  { category: "videography", packageName: "Full Coverage" },
  { category: "event_hosting", packageName: "Full Event Hosting" },
];

export default async function HomePage() {
  const [gallery, testimonials, events, rateCard, services] = await Promise.all([
    getGalleryItems(),
    getTestimonials(),
    getPublishedEvents(),
    getRateCard(),
    getServices(),
  ]);

  const galleryPhotos = gallery.filter((item) => item.media_type === "image");
  const featuredWork = galleryPhotos.slice(0, 2);

  // Pinned to the front of the hero rotation by request — the standard
  // slice(3, 7) selection didn't reach this far down the gallery.
  const featuredHeroUrl = "https://res.cloudinary.com/dzomdloyf/image/upload/f_auto,q_auto/THEYPH00013_cx8dch.jpg";
  const featuredHeroPhoto = galleryPhotos.find((item) => item.url === featuredHeroUrl);
  const otherHeroPhotos = galleryPhotos.filter((item) => item.url !== featuredHeroUrl).slice(3, 6);
  const heroStack = [...(featuredHeroPhoto ? [featuredHeroPhoto] : []), ...otherHeroPhotos].map(
    (item, index) => ({ src: item.url, caption: heroPhrases[index % heroPhrases.length] }),
  );
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
        stackImages={heroStack}
      />

      {services.length > 0 ? (
        <Section>
          <SectionHeading
            align="split"
            title={
              <>
                <span className="text-brand">What</span> We Offer
              </>
            }
            description="Every service Uncle Ses brings to your event, in one place."
          />
          {serviceCategoryOrder.map((category, index) => {
            const groupServices = services.filter((service) => service.category === category);
            if (groupServices.length === 0) return null;

            return (
              <Reveal key={category} className="mt-12 first:mt-10">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-[0.08em] text-brand-strong">
                  {serviceCategoryLabels[category]}
                </h3>
                <div className="mt-6">
                  <MarqueeRow
                    items={groupServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        icon={service.icon}
                        title={service.title}
                        description={service.description}
                        badge={service.badge}
                      />
                    ))}
                    direction={index % 2 === 0 ? "right" : "left"}
                  />
                </div>
              </Reveal>
            );
          })}

          <Reveal className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/bookings"
              className="rounded-full bg-brand px-8 py-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Check Availability
            </Link>
            <Link
              href="/rate-card"
              className="rounded-full border border-border-subtle px-8 py-4 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              View Rate Card
            </Link>
          </Reveal>
        </Section>
      ) : null}

      <Section className="bg-surface-alt">
        <SectionHeading
          align="split"
          title={
            <>
              <span className="text-brand">Featured</span> Work
            </>
          }
          description="Recent shoots and productions we've delivered."
          cta={{ label: "View All Work", href: "/photos" }}
        />
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <ZoomReveal>
            <VideoShowcaseTile
              src="https://res.cloudinary.com/dzomdloyf/video/upload/v1783521389/Naturally_I_love_weddings_and_wedding_parties._Extra_points_if_I_m_friends_with_the_couple._Ima_gn5kss.mp4"
              caption="From the day"
            />
          </ZoomReveal>
          {(() => {
            const item = featuredWork[0];
            return (
              <div className="group relative aspect-3/4 overflow-hidden rounded-2xl">
                {item ? (
                  <>
                    <ZoomReveal className="absolute inset-0">
                      <Image
                        src={item.url}
                        alt={item.caption ?? "Featured work"}
                        fill
                        sizes="(min-width: 810px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </ZoomReveal>
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
          })()}
        </div>
      </Section>

      <Section>
        <SectionHeading
          align="split"
          title={
            <>
              <span className="text-brand">Behind</span> the Scenes
            </>
          }
          description="A glimpse into how we bring each event to life."
        />
        <div className="relative mx-auto mt-10 aspect-3/4 max-w-md overflow-hidden rounded-2xl">
          <ZoomReveal className="absolute inset-0">
            <video
              src="https://res.cloudinary.com/dzomdloyf/video/upload/v1783630805/Video_from_Jirova_1_pdd2iz.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover"
            />
          </ZoomReveal>
          <div className="absolute inset-0 bg-black/45" />
        </div>
      </Section>

      {testimonials.length > 0 ? (
        <Section className="bg-surface-alt">
          <SectionHeading
            align="split"
            title={
              <>
                <span className="text-brand">Client</span> Feedback
              </>
            }
            description="Real words from the people we've worked with."
          />
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {testimonials.slice(0, 3).map((testimonial, index) => (
              <RevealItem key={testimonial.id}>
                <TestimonialCard
                  name={testimonial.name}
                  quote={testimonial.quote}
                  eventType={testimonial.event_type}
                  featured={index === 1}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      {pricingPicks.length > 0 ? (
        <Section>
          <SectionHeading
            align="split"
            title={
              <>
                <span className="text-brand">Simple</span> Pricing
              </>
            }
            description="Transparent packages across photography, videography, and hosting."
            cta={{ label: "View Full Rate Card", href: "/rate-card" }}
          />
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-3">
            {pricingPicks.map((pkg, index) => (
              <RevealItem key={pkg.id}>
                <PricingCard
                  name={pkg.package_name}
                  price={formatPrice(pkg.price)}
                  duration={pkg.duration}
                  description={pkg.description}
                  featured={index === 1}
                />
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      <Section>
        <div className="grid gap-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <Reveal className="flex min-h-105 flex-col rounded-2xl bg-surface-alt p-8 sm:min-h-130">
            <Image
              src="/images/book-event.jpg"
              alt=""
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
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
          </Reveal>

          <Reveal delay={0.15}>
            <SectionHeading title="Frequently Asked Questions" align="left" />
            <div className="mt-8">
              <FAQAccordion items={homeFaqs} />
            </div>
          </Reveal>
        </div>
      </Section>

      {upcomingEvents.length > 0 ? (
        <Section className="bg-surface-alt">
          <SectionHeading
            align="split"
            title={
              <>
                <span className="text-brand">Upcoming</span> Events
              </>
            }
            description="See what we're hosting next and grab a spot."
            cta={{ label: "See All Events", href: "/tickets" }}
          />
          <RevealGroup className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {upcomingEvents.map((event) => (
              <RevealItem key={event.id}>
                <ShowcaseCard
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
              </RevealItem>
            ))}
          </RevealGroup>
        </Section>
      ) : null}

      <Section>
        <CTASection />
      </Section>
    </>
  );
}
