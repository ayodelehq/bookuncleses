import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

// Vertical rhythm matches Eventry's real 3-tier variant system: 60px
// (phone, <810px) -> 100px (tablet, >=810px) -> 124px (desktop, >=1440px).
// No intermediate step — Framer's breakpoints are phone/tablet/desktop only.
export function Section({
  children,
  className = "",
  containerClassName = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-15 sm:py-25 lg:py-31 ${className}`}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

const headingBase =
  "text-balance text-[40px] font-semibold uppercase leading-[0.95] tracking-[-0.04em] sm:text-[56px] lg:text-[72px]";

export function SectionHeading({
  title,
  description,
  align = "center",
  cta,
  tone = "ink",
}: {
  title: ReactNode;
  description?: ReactNode;
  align?: "center" | "left" | "split";
  cta?: { label: string; href: string };
  /** `ink` (default) matches Home's headings; `warm` is the warm-tinted near-black used on every other page — deliberately not the brand rose, so titles don't compete with CTA buttons for the same color. */
  tone?: "ink" | "warm";
}) {
  const headingClass = `${tone === "warm" ? "text-heading" : "text-ink"} ${headingBase}`;

  if (align === "split") {
    return (
      <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <h2 className={`max-w-xl ${headingClass}`}>{title}</h2>
        <div className="max-w-sm md:pt-3">
          {description ? <p className="text-base leading-[1.4] text-muted sm:text-lg">{description}</p> : null}
          {cta ? (
            <Link
              href={cta.href}
              className="mt-6 inline-block rounded-full border border-brand px-6 py-3 font-mono text-sm text-brand transition-colors hover:bg-brand hover:text-brand-foreground"
            >
              {cta.label}
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"}`}>
      <h2 className={headingClass}>{title}</h2>
      {description ? (
        <p className="mt-4 text-base leading-[1.4] text-muted sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
