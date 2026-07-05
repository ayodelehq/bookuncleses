import Link from "next/link";
import { siteConfig } from "@/lib/site-config";

export function CTASection({
  title = "Ready to book your date?",
  description = "Tell us about your event and we'll confirm availability within 24 hours.",
  primaryCta = { label: "Check Availability", href: "/bookings" },
}: {
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
}) {
  return (
    <div className="rounded-3xl bg-foreground px-8 py-14 text-center text-background sm:px-16">
      <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[34px] md:text-[40px]">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-xl leading-[1.4] text-background/80">{description}</p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={primaryCta.href}
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
        >
          {primaryCta.label}
        </Link>
        <a
          href={`mailto:${siteConfig.email}`}
          className="rounded-full border border-background/30 px-6 py-3 text-sm font-semibold text-background transition-colors hover:border-background"
        >
          Email Us
        </a>
      </div>
    </div>
  );
}
