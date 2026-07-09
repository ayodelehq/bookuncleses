import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { PricingCard } from "@/components/ui/PricingCard";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { getRateCard } from "@/lib/data/rate-card";
import { formatPrice } from "@/lib/format";
import { siteConfig } from "@/lib/site-config";
import type { RateCardCategory } from "@/lib/supabase/types";

const pricingFaqs = [
  {
    question: "Is the price on the card the final price?",
    answer:
      "Yes — what's listed is what you pay for that package, no hidden fees. Add-ons are priced separately and shown below.",
  },
  {
    question: "What if my event doesn't fit a fixed package?",
    answer:
      "Multi-day events, destination weddings, or unusual guest counts get a custom quote instead — use the request form below.",
  },
  {
    question: "How do I lock in a package?",
    answer:
      "Head to Bookings, pick the matching service, and confirm your date with a deposit — the rest is settled closer to or on the day.",
  },
];

export const metadata: Metadata = {
  title: "Rate Card — Bookuncleses",
  description: "Transparent pricing for photography, video, event hosting, venue planning, and comedy packages.",
};

const categoryLabels: Record<RateCardCategory, string> = {
  photography: "Photography",
  videography: "Video Coverage & Content Creation",
  event_hosting: "Event Hosting & MC",
  stand_up_comedy: "Stand-up Comedy",
  hype_man: "Hype Man",
  event_planning: "Event Planning",
};

export default async function RateCardPage() {
  const { items, addons } = await getRateCard();

  const categories: RateCardCategory[] = [
    "photography",
    "videography",
    "event_hosting",
    "stand_up_comedy",
    "hype_man",
    "event_planning",
  ];

  return (
    <>
      <Hero
        title="Transparent pricing, no back-and-forth."
        description="Every package below is bookable directly — see what's included, pick a date, and confirm with a deposit."
        primaryCta={{ label: "Check Availability", href: "/bookings" }}
        titleTone="warm"
      />

      {categories.map((category) => {
        const packages = items.filter((item) => item.category === category);
        if (packages.length === 0) return null;

        return (
          <Section key={category} id={category}>
            <SectionHeading title={categoryLabels[category]} align="left" tone="warm" />
            <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
              {packages.map((pkg, index) => (
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
        );
      })}

      <Section className="bg-surface-alt">
        <SectionHeading title="Extend any package" align="left" tone="warm" />
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {addons.map((addon) => (
            <div
              key={addon.id}
              className="flex items-center justify-between rounded-xl border border-border-subtle bg-background px-5 py-4"
            >
              <span className="text-sm font-medium">{addon.name}</span>
              <span className="text-sm font-semibold text-brand">{formatPrice(addon.price)}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <div className="rounded-2xl border border-border-subtle bg-surface p-8 text-center sm:p-12">
          <h3 className="text-ink text-2xl font-semibold">Planning something bigger?</h3>
          <p className="mx-auto mt-2 max-w-xl text-muted">
            Multi-day events, destination weddings, or large guest counts don&apos;t fit a fixed
            price — tell us the details and we&apos;ll put together a custom quote.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            Request a Custom Quote
          </Link>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="flex min-h-105 flex-col rounded-2xl bg-surface-alt p-8 sm:min-h-130">
            <MediaPlaceholder kind="image" label="" className="h-16 w-16 rounded-full" />
            <h3 className="text-ink mt-6 text-2xl font-semibold uppercase tracking-[-0.04em]">Ready to Book?</h3>
            <p className="mt-3 font-mono text-sm text-muted">
              Pick a package above, choose your date, and confirm with a deposit — no back-and-forth
              needed.
            </p>
            <Link
              href="/bookings"
              className="mt-6 inline-block w-fit rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Check Availability
            </Link>

            <div className="mt-auto flex items-center gap-3 pt-10 text-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface text-brand">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 6h18v12H3z" strokeLinejoin="round" />
                  <path d="m3 6 9 7 9-7" strokeLinejoin="round" />
                </svg>
              </span>
              <span>
                Have a custom request?
                <br />
                <a href={`mailto:${siteConfig.email}`} className="font-mono text-ink hover:text-brand">
                  {siteConfig.email}
                </a>
              </span>
            </div>
          </div>

          <div>
            <SectionHeading title="Frequently Asked Questions" align="left" tone="warm" />
            <div className="mt-8">
              <FAQAccordion items={pricingFaqs} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
