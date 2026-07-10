import type { Metadata } from "next";
import Link from "next/link";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/layout/Section";

export const metadata: Metadata = {
  title: "Booking Confirmed",
  robots: { index: false, follow: false },
};

export default function BookingSuccessPage() {
  return (
    <>
      <Hero
        title="Your date is reserved!"
        description="We've received your deposit and sent a confirmation to your email. We'll be in touch about next steps."
        align="center"
        titleTone="warm"
      />
      <Section>
        <p className="text-center text-sm text-muted">
          <Link href="/" className="font-semibold text-brand hover:underline">
            Back to Home
          </Link>
        </p>
      </Section>
    </>
  );
}
