import { Section, SectionHeading } from "@/components/layout/Section";
import { Container } from "@/components/layout/Container";
import { BookingForm } from "@/components/bookings/BookingForm";
import { FAQAccordion } from "@/components/ui/FAQAccordion";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { getBlockedDates } from "@/lib/data/bookings";
import { bookingDepositNaira, siteConfig } from "@/lib/site-config";
import { formatPrice } from "@/lib/format";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Book an Event",
  description: "Reserve your date for photography, video, event hosting, venue planning, or comedy with a deposit.",
  path: "/bookings",
});

const bookingFaqs = [
  {
    question: "How does the deposit work?",
    answer: `A flat ${formatPrice(
      bookingDepositNaira
    )} deposit holds your date — it's paid securely through Paystack or Flutterwave right after you submit the form, and it comes off your final package total.`,
  },
  {
    question: "What happens right after I book?",
    answer:
      "Once your deposit clears, your date is locked and you'll get a confirmation email with next steps. We'll follow up to confirm package details, location, and any add-ons before the event.",
  },
  {
    question: "Do you travel outside Abuja?",
    answer:
      "Yes — destination weddings and out-of-state events are welcome. Mention the location in the form and we'll factor travel into your quote.",
  },
  {
    question: "Can I change the date after booking?",
    answer:
      "Reach out as early as possible if your date changes. We'll do our best to move your booking, subject to availability on the new date.",
  },
];

export default async function BookingsPage() {
  const blockedDates = await getBlockedDates();

  return (
    <>
      <section className="pt-35 sm:pt-45 lg:pt-55">
        <Container className="text-center">
          <h1 className="text-heading text-[40px] font-semibold uppercase leading-[1.05] tracking-[-0.04em] sm:text-[56px] lg:text-[80px]">
            Book an Event
          </h1>
        </Container>
      </section>

      <Section id="reserve">
        <div className="mx-auto max-w-xl">
          <div className="rounded-2xl border border-border-subtle bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-semibold tracking-[-0.04em] sm:text-2xl">
              Reserve your spot for your event
            </h2>
            <p className="mt-2 text-sm text-muted">
              Fill out the form below to hold your date — pick a service, choose a date, and confirm
              with a deposit.
            </p>
            <div className="mt-6">
              <BookingForm blockedDates={blockedDates} />
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            Trusted for weddings, corporate events, and private celebrations.
          </p>
        </div>
      </Section>

      <Section className="bg-surface-alt">
        <SectionHeading title="Get in Touch" tone="warm" />
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">Email</p>
            <a href={`mailto:${siteConfig.email}`} className="mt-2 block font-medium hover:text-brand">
              {siteConfig.email}
            </a>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">Phone</p>
            <a href={`tel:${siteConfig.phone}`} className="mt-2 block font-medium hover:text-brand">
              {siteConfig.phone}
            </a>
          </div>
          <div className="rounded-2xl border border-border-subtle bg-surface p-6">
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-muted">Address</p>
            <p className="mt-2 font-medium">{siteConfig.address}</p>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-12 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
          <div className="flex min-h-105 flex-col rounded-2xl bg-surface-alt p-8 sm:min-h-130">
            <MediaPlaceholder kind="image" label="" className="h-16 w-16 rounded-full" />
            <h3 className="text-ink mt-6 text-2xl font-semibold uppercase tracking-[-0.04em]">Book an Event</h3>
            <p className="mt-3 font-mono text-sm text-muted">
              Reach out today to book your event, secure your spot, and get all the details you need
              to make it unforgettable.
            </p>
            <a
              href="#reserve"
              className="mt-6 inline-block w-fit rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
            >
              Book an Event
            </a>

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
            <SectionHeading title="Frequently Asked Questions" align="left" tone="warm" />
            <div className="mt-8">
              <FAQAccordion items={bookingFaqs} />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
