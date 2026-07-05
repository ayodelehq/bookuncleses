import type { ReactNode } from "react";
import Link from "next/link";
import { Container } from "@/components/layout/Container";

export function Hero({
  title,
  description,
  primaryCta,
  secondaryCta,
  media,
  align = "left",
  topNote,
}: {
  title: string;
  description?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  media?: ReactNode;
  align?: "left" | "center";
  /** Short blurb pinned to the top-right of a photo hero, next to the wordmark. */
  topNote?: string;
}) {
  const onMedia = Boolean(media);

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
          <p className="ml-auto max-w-xs text-right text-sm leading-[1.4] text-white/90">{topNote}</p>
        </Container>
      ) : null}

      <Container
        className={
          onMedia
            ? "flex min-h-[70vh] flex-col justify-end py-20 sm:py-25 lg:py-31"
            : "pt-35 pb-15 sm:pt-45 sm:pb-25 lg:pt-55 lg:pb-31"
        }
      >
        <div
          className={`max-w-2xl ${align === "center" ? "mx-auto text-center" : "text-left"} ${
            onMedia ? "text-white" : ""
          }`}
        >
          <h1
            className={`text-[40px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[56px] lg:text-[80px] ${
              onMedia ? "text-white" : "text-ink"
            }`}
          >
            {title}
          </h1>
          {description ? (
            <p className={`mt-6 text-lg leading-[1.4] ${onMedia ? "text-white/85" : "text-muted"}`}>
              {description}
            </p>
          ) : null}

          {(primaryCta || secondaryCta) && (
            <div className={`mt-8 flex flex-wrap items-center gap-4 ${align === "center" ? "justify-center" : ""}`}>
              {primaryCta ? (
                <Link
                  href={primaryCta.href}
                  className="rounded-full bg-brand px-8 py-4 text-sm font-semibold text-brand-foreground transition-opacity hover:opacity-90"
                >
                  {primaryCta.label}
                </Link>
              ) : null}
              {secondaryCta ? (
                <Link
                  href={secondaryCta.href}
                  className={`rounded-full border px-8 py-4 text-sm font-semibold transition-colors ${
                    onMedia
                      ? "border-white/40 text-white hover:border-white"
                      : "border-border-subtle hover:border-brand hover:text-brand"
                  }`}
                >
                  {secondaryCta.label}
                </Link>
              ) : null}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
