import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/layout/Section";
import { PortfolioGallery } from "@/components/photos/PortfolioGallery";
import { getGalleryCategories, getGalleryItems } from "@/lib/data/gallery";

export const metadata: Metadata = {
  title: "Photos & Videos — Bookuncleses",
  description: "Browse past weddings, corporate events, portraits, and hosted events.",
};

export default async function PhotosPage() {
  const [items, categories] = await Promise.all([getGalleryItems(), getGalleryCategories()]);

  return (
    <>
      <Hero
        title="See the work before you book."
        description="A look at past weddings, corporate coverage, portraits, and the events we've hosted ourselves."
        primaryCta={{ label: "Check Availability", href: "/bookings" }}
        titleTone="warm"
      />

      <Section>
        <PortfolioGallery items={items} categories={categories} />
      </Section>
    </>
  );
}
