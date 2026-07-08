"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { siteConfig } from "@/lib/site-config";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function CTASection({
  title = "Ready to book your date?",
  description = "Tell us about your event and we'll confirm availability within 24 hours.",
  primaryCta = { label: "Check Availability", href: "/bookings" },
}: {
  title?: string;
  description?: string;
  primaryCta?: { label: string; href: string };
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="rounded-3xl bg-surface-dark px-8 py-14 text-center text-background sm:px-16"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 32, scale: reduceMotion ? 1 : 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: easeOut }}
    >
      <motion.h2
        className="text-[30px] font-semibold leading-[1.1] tracking-[-0.04em] sm:text-[34px] md:text-[40px]"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.1, ease: easeOut }}
      >
        {title}
      </motion.h2>
      <motion.p
        className="mx-auto mt-4 max-w-xl leading-[1.4] text-background/80"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.18, ease: easeOut }}
      >
        {description}
      </motion.p>
      <motion.div
        className="mt-8 flex flex-wrap items-center justify-center gap-4"
        initial={{ opacity: 0, y: reduceMotion ? 0 : 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.26, ease: easeOut }}
      >
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link
            href={primaryCta.href}
            className="inline-block rounded-full bg-brand px-6 py-3 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
          >
            {primaryCta.label}
          </Link>
        </motion.div>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <a
            href={`mailto:${siteConfig.email}`}
            className="inline-block rounded-full border border-background/30 px-6 py-3 text-sm font-semibold text-background transition-colors hover:border-background"
          >
            Email Us
          </a>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
