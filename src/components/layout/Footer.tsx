import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { mainNav, siteConfig } from "@/lib/site-config";
import { getPublishedEvents } from "@/lib/data/events";

const mainPages = mainNav.slice(0, 3);
const morePages = mainNav.slice(3);

export async function Footer() {
  const events = await getPublishedEvents();
  const upcomingCount = events.length;

  return (
    <footer className="overflow-hidden border-t border-border-subtle bg-foreground text-background">
      <Container className="grid gap-10 py-[124px] sm:grid-cols-2">
        <h2 className="text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[34px] md:text-[40px]">
          Let&apos;s set the stage for your next moment.
        </h2>

        <div className="grid grid-cols-2 gap-8 sm:justify-self-end">
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-background/60">
              Main Pages
            </p>
            <ul className="mt-4 space-y-2">
              {mainPages.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-background/85 hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-background/60">
              More
            </p>
            <ul className="mt-4 space-y-2">
              {morePages.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-background/85 hover:text-brand">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>

      <Container>
        <div className="border-y border-background/20">
          <div className="grid divide-background/20 sm:grid-cols-3 sm:divide-x">
            <div className="flex flex-col">
              <div className="border-b border-background/20 px-4 py-5">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block text-center font-mono text-sm font-semibold hover:text-brand"
                >
                  {siteConfig.email}
                </a>
              </div>
              <p className="flex min-h-55 flex-col justify-end px-6 py-6 font-mono text-sm font-bold text-background/70">
                We&apos;re here to answer any question, big or small.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="border-b border-background/20 bg-surface-alt px-4 py-5">
                <Link href="/bookings" className="text-ink block text-center font-mono text-sm font-semibold">
                  Book an Event
                </Link>
              </div>
              <p className="flex min-h-55 flex-col justify-end px-6 py-6 font-mono text-sm font-bold text-background/70">
                Reserve your date for photography, videography, or hosting.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="border-b border-background/20 px-4 py-5">
                <Link
                  href="/tickets"
                  className="block text-center font-mono text-sm font-semibold hover:text-brand"
                >
                  Discover Events
                </Link>
              </div>
              <div className="flex min-h-55 items-end justify-between gap-4 px-6 py-6">
                <p className="font-display text-[100px] font-semibold leading-none text-brand">{upcomingCount}</p>
                <p className="text-right font-mono text-sm font-bold text-background/70">
                  See what we&apos;re hosting next.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <Container>
        <div className="flex flex-col gap-4 border-b border-background/20 py-6 font-mono text-xs text-background/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href={siteConfig.instagram} className="hover:text-brand">
              Instagram
            </a>
            <a href={siteConfig.tiktok} className="hover:text-brand">
              TikTok
            </a>
          </div>
        </div>
      </Container>

      <Container>
        <div style={{ containerType: "inline-size" }}>
          <p
            aria-hidden
            className="w-full select-none whitespace-nowrap pt-2 pb-2 text-center font-display font-semibold leading-none tracking-[-0.04em] text-brand-soft/25"
            style={{ fontSize: `${178 / siteConfig.name.length}cqw` }}
          >
            {siteConfig.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
