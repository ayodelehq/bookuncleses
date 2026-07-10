"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/layout/Container";
import { mainNav, siteConfig } from "@/lib/site-config";

const mainPages = mainNav.slice(0, 3);
const morePages = mainNav.slice(3);
const easeOut = [0.16, 1, 0.3, 1] as const;

export function FooterContent({ upcomingCount }: { upcomingCount: number }) {
  const footerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: footerRef, offset: ["start end", "start 40%"] });
  const logoScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const logoOpacity = useTransform(scrollYProgress, [0, 1], [0.5, 1]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: reduceMotion ? 0 : 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.65, delay, ease: easeOut },
  });

  return (
    <footer ref={footerRef} className="overflow-hidden border-t border-border-subtle bg-surface-dark text-background">
      <Container className="grid gap-10 py-[124px] sm:grid-cols-2">
        <motion.h2
          className="text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[48px] lg:text-[64px]"
          {...rise(0)}
        >
          Let&apos;s set the stage for your next moment.
        </motion.h2>

        <motion.div className="grid grid-cols-2 gap-8 sm:justify-self-end" {...rise(0.1)}>
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-background/60">
              Main Pages
            </p>
            <ul className="mt-4 space-y-2">
              {mainPages.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-background/85 hover:text-background">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-mono text-xs font-medium uppercase tracking-[0.08em] text-background/60">More</p>
            <ul className="mt-4 space-y-2">
              {morePages.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-background/85 hover:text-background">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </motion.div>
      </Container>

      <Container>
        <motion.div className="border-y border-background/20" {...rise(0.18)}>
          <div className="grid divide-background/20 sm:grid-cols-3 sm:divide-x">
            <div className="flex flex-col">
              <div className="border-b border-background/20 px-4 py-5">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="block text-center font-mono text-sm font-semibold hover:text-background"
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
                Reserve your date for photography, video, hosting, and more.
              </p>
            </div>
            <div className="flex flex-col">
              <div className="border-b border-background/20 px-4 py-5">
                <Link href="/tickets" className="block text-center font-mono text-sm font-semibold hover:text-background">
                  Discover Events
                </Link>
              </div>
              <div className="flex min-h-55 items-end justify-between gap-4 px-6 py-6">
                <p className="font-display text-[100px] font-semibold leading-none text-accent">{upcomingCount}</p>
                <p className="text-right font-mono text-sm font-bold text-background/70">
                  See what we&apos;re hosting next.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>

      <Container>
        <motion.div
          className="flex flex-col gap-4 border-b border-background/20 py-6 font-mono text-xs text-background/60 sm:flex-row sm:items-center sm:justify-between"
          {...rise(0.26)}
        >
          <p className="flex items-center gap-3">
            <motion.span style={reduceMotion ? undefined : { scale: logoScale, opacity: logoOpacity }}>
              <Image src="/brand/logo-white.png" alt="" aria-hidden width={20} height={25} className="h-5 w-auto" />
            </motion.span>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href={siteConfig.instagram} className="hover:text-background">
              Instagram
            </a>
          </div>
        </motion.div>
      </Container>

      <Container>
        <div
          className="relative w-full overflow-hidden"
          style={{ containerType: "inline-size", height: `${((178 / siteConfig.name.length) * 0.78).toFixed(2)}cqw` }}
        >
          <p
            aria-hidden
            className="absolute inset-x-0 top-0 w-full select-none whitespace-nowrap text-center font-display font-semibold leading-none tracking-[-0.04em] text-brand-soft/25"
            style={{ fontSize: `${178 / siteConfig.name.length}cqw` }}
          >
            {siteConfig.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
