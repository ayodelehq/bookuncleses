"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Container } from "@/components/layout/Container";
import { HeroImageStack } from "@/components/ui/HeroImageStack";

const easeOut = [0.16, 1, 0.3, 1] as const;

export function Hero({
  title,
  description,
  primaryCta,
  secondaryCta,
  media,
  splitMedia,
  stackImages,
  align = "left",
  topNote,
  titleTone = "ink",
}: {
  title: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  /** Full-bleed background media behind the whole hero (dark scrim + white text). */
  media?: ReactNode;
  /** A tall portrait-shaped panel next to the text instead of a full-bleed background — for a single strong portrait photo that shouldn't be cropped into a wide frame. */
  splitMedia?: ReactNode;
  /** An irregular, continuously-cycling stack of photos next to the text, with a caption that changes in sync. Takes priority over `splitMedia` when both are given. */
  stackImages?: { src: string; caption?: string | null }[];
  align?: "left" | "center";
  /** Short blurb — pinned top-right next to the wordmark on a `media` hero, rendered as a caption under the photo on a `splitMedia` hero. Ignored on a `stackImages` hero (the cycling caption takes its place). */
  topNote?: string;
  /** `ink` (default, used by Home) or `warm` — the warm-tinted near-black every other page's hero title uses, distinct from the brand rose so it doesn't compete with CTA buttons. Ignored on a `media` hero (always white for contrast on the photo scrim). */
  titleTone?: "ink" | "warm";
}) {
  const onMedia = Boolean(media);
  const onStack = Boolean(stackImages && stackImages.length > 0);
  const onSplit = Boolean(splitMedia) || onStack;
  const reduceMotion = useReducedMotion();

  const entrance = {
    initial: { opacity: 0, y: reduceMotion ? 0 : 28 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, ease: easeOut },
  };
  const headingScale = {
    initial: { scale: reduceMotion ? 1 : 0.94 },
    animate: { scale: 1 },
    transition: { duration: 0.8, delay: 0.1, ease: easeOut },
  };

  if (onSplit) {
    return (
      <div className="relative overflow-hidden border-b border-border-subtle">
        <Container className="grid gap-10 pt-20 pb-15 sm:grid-cols-2 sm:items-center sm:gap-12 sm:pt-28 sm:pb-25 lg:gap-16 lg:pt-32 lg:pb-31">
          <motion.div className="max-w-xl" {...entrance}>
            <motion.h1
              className={`origin-left text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[48px] lg:text-[64px] ${
                titleTone === "warm" ? "text-heading" : "text-ink"
              }`}
              {...headingScale}
            >
              {title}
            </motion.h1>
            {description ? <p className="mt-6 text-lg leading-[1.4] text-muted">{description}</p> : null}

            {(primaryCta || secondaryCta) && (
              <div className="mt-8 flex flex-wrap items-center gap-4">
                {primaryCta ? (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={primaryCta.href}
                      className="inline-block rounded-full bg-brand px-8 py-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                    >
                      {primaryCta.label}
                    </Link>
                  </motion.div>
                ) : null}
                {secondaryCta ? (
                  <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                    <Link
                      href={secondaryCta.href}
                      className="inline-block rounded-full border border-border-subtle px-8 py-4 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
                    >
                      {secondaryCta.label}
                    </Link>
                  </motion.div>
                ) : null}
              </div>
            )}
          </motion.div>

          <motion.div {...entrance} transition={{ ...entrance.transition, delay: 0.15 }}>
            {onStack ? (
              <HeroImageStack images={stackImages ?? []} />
            ) : (
              <>
                <div className="relative aspect-3/4 w-full overflow-hidden rounded-3xl">{splitMedia}</div>
                {topNote ? <p className="mt-3 font-mono text-xs text-muted">{topNote}</p> : null}
              </>
            )}
          </motion.div>
        </Container>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden border-b border-border-subtle ${
        onMedia ? "-mt-24 min-h-[70vh] pt-24" : ""
      }`}
    >
      {onMedia ? (
        <>
          <div className="absolute inset-0 -z-20">{media}</div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/10 via-black/40 to-black/70" />
        </>
      ) : null}

      {onMedia && topNote ? (
        <Container className="relative pt-10">
          <motion.p
            className="ml-auto max-w-xs text-right text-sm leading-[1.4] text-white/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {topNote}
          </motion.p>
        </Container>
      ) : null}

      <Container
        className={
          onMedia
            ? "flex min-h-[70vh] flex-col justify-end py-20 sm:py-25 lg:py-31"
            : "pt-35 pb-15 sm:pt-45 sm:pb-25 lg:pt-55 lg:pb-31"
        }
      >
        <motion.div
          className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"} ${
            onMedia ? "text-white" : ""
          }`}
          {...entrance}
        >
          <motion.h1
            className={`origin-left text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[56px] lg:text-[80px] ${
              onMedia ? "text-white" : titleTone === "warm" ? "text-heading" : "text-ink"
            } ${align === "center" ? "origin-center" : ""}`}
            {...headingScale}
          >
            {title}
          </motion.h1>
          {description ? (
            <p className={`mt-6 text-lg leading-[1.4] ${onMedia ? "text-white/85" : "text-muted"}`}>
              {description}
            </p>
          ) : null}

          {(primaryCta || secondaryCta) && (
            <div className={`mt-8 flex flex-wrap items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
              {primaryCta ? (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={primaryCta.href}
                    className="inline-block rounded-full bg-brand px-8 py-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                  >
                    {primaryCta.label}
                  </Link>
                </motion.div>
              ) : null}
              {secondaryCta ? (
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    href={secondaryCta.href}
                    className={`inline-block rounded-full border px-8 py-4 text-sm font-semibold transition-colors ${
                      onMedia
                        ? "border-white/40 text-white hover:border-white"
                        : "border-border-subtle hover:border-brand hover:text-brand"
                    }`}
                  >
                    {secondaryCta.label}
                  </Link>
                </motion.div>
              ) : null}
            </div>
          )}
        </motion.div>
      </Container>
    </div>
  );
}
