# Product

## Register

brand

## Users

Prospective clients in Nigeria (primarily Abuja) looking to book photography,
videography, event hosting/MC services, or venue/event planning — browsing on
mobile most of the time, comparing a rate card, and deciding whether to pay a
deposit to hold a date. Secondary audience: attendees browsing/buying tickets
to events the business hosts. The `/admin` area is a separate product-register
surface (the business owner managing bookings, events, gallery, rate card) and
is out of scope for this brand-register work.

## Product Purpose

Bookuncleses.com is the public storefront for a photography/videography/event
hosting business: showcase the portfolio, publish transparent pricing, accept
booking-deposit payments (Paystack/Flutterwave), sell tickets to hosted
events, and collect contact enquiries — all self-serve, no back-and-forth DMs
required to get a quote or hold a date.

## Brand Personality

Confident, premium, editorial-bold — the same layout/type/spacing register
as **Eventry** (the Framer event-booking template this project's structure is
deliberately matched to: same type pairing, same spacing scale, same section
rhythm). Bold uppercase display headlines, generous whitespace, alternating
light/dark section blocks, flat solid color (no gradients as fills, no
glassmorphism). The site should read like a well-funded event/booking
platform, not a personal portfolio.

Color, specifically, is **not** Eventry's — see Anti-references and
DESIGN.md. The palette is the business's own, extracted from the real Uncle
Ses Kreativ Studio logo (`public/brand/logo-color.png`): Royal Purple ->
Vivid Rose -> Sunset Orange. Rose leads as the primary/CTA color, purple
gives the site's dark section blocks their own identity (replacing Eventry's
dark green), and orange is a rare, deliberate accent — mirroring the logo's
own gradient story without turning it into gradient fills or gradient text.

## Anti-references

- **Two prior palettes, both discarded**: (1) the original codebase's
  unsourced pink/magenta/purple gradient system, and (2) the Eventry-clone
  green system (`#038262`) this project moved to afterward. The current
  palette supersedes both — it looks purple/rose again, but this time it's
  the business's actual verified logo colors, not a guess.
- The logo's gradient is an asset to use once, deliberately (the mark
  itself), not a fill or gradient-text effect to scatter around the UI.
- Generic AI-landing-page tells: tiny uppercase tracked eyebrows on every
  section, numbered 01/02/03 scaffolding, side-stripe card borders, identical
  card grids. Eventry itself avoids these, so the clone must too.

## Design Principles

- **Exact-fidelity clone for layout, type, and spacing — not color.** Every
  non-color token (type pairing, spacing, radius) is pulled from Eventry's
  actual shipped CSS (verified via the live site's rendered
  `rgb()`/`var(--token-*)` values), not eyeballed from screenshots. Color
  values are the business's own brand, per DESIGN.md.
- **Content is the only thing that changes.** Section structure, visual
  rhythm, color blocking, and component patterns replicate Eventry's; copy,
  imagery, and data are Bookuncleses' own (services, portfolio, rate card,
  events, testimonials — all already data-driven from Supabase).
- **Placeholder discipline for missing assets.** Anywhere Eventry's real
  design calls for a photo/video the business hasn't supplied yet, render a
  clearly labeled placeholder ("Image required" / "Video required") instead
  of a broken image or a stock photo — swappable later without a rebuild.
- **One fixed light theme, no OS dark-mode flip.** This is a single authored
  light brand with intentional dark-purple section blocks (footer, CTA
  bands) — not a light/dark toggle. The site must not auto-invert under
  `prefers-color-scheme: dark`.
- **Every page degrades gracefully without Supabase**, per the existing
  README contract — restyling must preserve the honest empty states, not
  break them.

## Accessibility & Inclusion

- Body text must hit WCAG AA contrast (>=4.5:1) against its background at
  all times, including inside the dark-purple footer/CTA sections. Sunset
  Orange (`--accent`) is the one brand color that fails AA as a text color on
  both white and the dark-purple band — it's for icon fills and badge
  backgrounds paired with dark text, never for text directly on a light or
  dark surface.
- Preserve existing semantic structure (headings, form labels, aria on the
  mobile nav toggle) through the restyle — this is a visual pass, not a
  markup rewrite.
- Respect `prefers-reduced-motion` for any new hover/reveal motion introduced
  while matching Eventry's interaction feel.
