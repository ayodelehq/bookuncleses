import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/layout/Section";
import { LookupForm } from "@/app/(site)/tickets/lookup/LookupForm";

export const metadata: Metadata = {
  title: "My Tickets — Bookuncleses",
};

export default function TicketLookupPage() {
  return (
    <>
      <Hero
        title="Find your ticket."
        description="Enter the email you used to purchase."
        align="center"
      />
      <Section>
        <LookupForm />
      </Section>
    </>
  );
}
