import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/layout/Section";
import { LookupForm } from "@/app/(site)/tickets/lookup/LookupForm";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "My Tickets",
  description: "Look up tickets you've already purchased using the email you checked out with.",
  path: "/tickets/lookup",
});

export default function TicketLookupPage() {
  return (
    <>
      <Hero
        title="Find your ticket."
        description="Enter the email you used to purchase."
        align="center"
        titleTone="warm"
      />
      <Section>
        <LookupForm />
      </Section>
    </>
  );
}
