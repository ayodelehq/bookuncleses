import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { Section, SectionHeading } from "@/components/layout/Section";
import { PricingCard } from "@/components/ui/PricingCard";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { getRateCard } from "@/lib/data/rate-card";
import { formatPrice } from "@/lib/format";
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
  description: "Transparent pricing for photography, videography, and event hosting packages.",
};

const categoryLabels: Record<RateCardCategory, string> = {
  photography: "Photography",
  videography: "Videography",
  event_hosting: "Event Hosting & MC",
};

export default async function RateCardPage() {
  const { items, addons } = await getRateCard();

  const categories: RateCardCategory[] = ["photography", "videography", "event_hosting"];

  return (
    <>
      <Hero
        title="Transparent pricing, no back-and-forth."
        description="Every package below is bookable directly — see what's included, pick a date, and confirm with a deposit."
        primaryCta={{ label: "Check Availability", href: "/bookings" }}
      />

      {categories.map((category) => {
        const packages = items.filter((item) => item.category === category);
        if (packages.length === 0) return null;

        return (
          <Section key={category}>
            <SectionHeading title={categoryLabels[category]} align="left" />
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
        <SectionHeading title="Extend any package" align="left" />
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

      <Section className="bg-surface-alt">
        <SectionHeading title="Frequently Asked Questions" align="left" />
        <div className="mt-8 max-w-2xl">
          <FAQAccordion items={pricingFaqs} />
        </div>
      </Section>
    </>
  );
}
