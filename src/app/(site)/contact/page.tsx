import type { Metadata } from "next";
import { Hero } from "@/components/ui/Hero";
import { Section } from "@/components/layout/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Contact — Bookuncleses",
  description: "Reach out for enquiries, custom quotes, and partnerships.",
};

export default function ContactPage() {
  return (
    <>
      <Hero
        title="Let's talk about your event."
        description="Have a question that doesn't fit a booking yet? Send a message, chat on WhatsApp, or reach us directly."
      />

      <Section>
        <div className="grid gap-12 sm:grid-cols-2">
          <div>
            <h2 className="text-ink text-2xl font-semibold">Send a Message</h2>
            <div className="mt-6">
              <ContactForm />
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted">
                Get in Touch Directly
              </h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li>
                  <a href={`https://wa.me/${siteConfig.whatsappNumber}`} className="text-brand hover:underline">
                    Chat on WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`mailto:${siteConfig.email}`} className="hover:underline">
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a href={`tel:${siteConfig.phone}`} className="hover:underline">
                    {siteConfig.phone}
                  </a>
                </li>
                <li>{siteConfig.address}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted">Follow Us</h3>
              <ul className="mt-4 flex gap-4 text-sm">
                <li>
                  <a href={siteConfig.instagram} className="text-brand hover:underline">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href={siteConfig.tiktok} className="text-brand hover:underline">
                    TikTok
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-widest text-muted">Hours</h3>
              <p className="mt-4 text-sm text-muted">
                Monday – Saturday, 9am – 6pm WAT. We typically respond within 24 hours.
              </p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-border-subtle">
              <iframe
                title="Studio location map"
                src={`https://maps.google.com/maps?q=${encodeURIComponent(siteConfig.address)}&z=13&output=embed`}
                className="h-64 w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
