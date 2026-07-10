import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/layout/Section";
import { getOrderSummary } from "@/lib/tickets/orders";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function TicketSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order: orderId } = await searchParams;
  const summary = orderId ? await getOrderSummary(orderId) : null;

  return (
    <>
      <Hero
        title="You're in!"
        description="Your ticket(s) are below and were also emailed to you."
        align="center"
        titleTone="warm"
      />

      <Section>
        {summary ? (
          <div className="mx-auto max-w-lg text-center">
            <h2 className="text-ink text-xl font-semibold">{summary.event.title}</h2>
            <p className="text-sm text-muted">{summary.event.venue}</p>

            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {summary.tickets.map((ticket, index) => (
                <div key={ticket.id} className="rounded-2xl border border-border-subtle bg-surface p-4">
                  {/* eslint-disable-next-line @next/next/no-img-element -- data: URL QR code, not eligible for next/image optimization */}
                  <img src={ticket.qrDataUrl} alt={`Ticket ${index + 1} QR code`} className="mx-auto h-40 w-40" />
                  <p className="mt-2 text-xs text-muted">Ticket {index + 1}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-center text-muted">We couldn&apos;t find that order. Check your email for confirmation.</p>
        )}

        <p className="mt-10 text-center text-sm text-muted">
          <Link href="/tickets" className="font-semibold text-brand hover:underline">
            Back to Events
          </Link>
        </p>
      </Section>
    </>
  );
}
