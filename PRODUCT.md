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

Confident, premium, editorial-bold — the same register as **Eventry** (the
Framer event-booking template this project is deliberately restyled to match
pixel-for-pixel: same type pairing, same spacing scale, same color system,
same section rhythm). Bold uppercase display headlines, generous whitespace,
alternating light/dark section blocks, flat solid color (no gradients, no
glassmorphism). The site should read like a well-funded event/booking
platform, not a personal portfolio.

## Anti-references

- The previous design on this codebase: a pink/magenta/purple gradient brand
  system. That palette is being fully discarded — no gradients, no magenta,
  no purple anywhere in the new system.
- Generic AI-landing-page tells: tiny uppercase tracked eyebrows on every
  section, numbered 01/02/03 scaffolding, side-stripe card borders, identical
  card grids. Eventry itself avoids these, so the clone must too.

## Design Principles

- **Exact-fidelity clone, not "inspired by."** Every token (color, type,
  spacing, radius) is pulled from Eventry's actual shipped CSS (verified via
  the live site's rendered `rgb()`/`var(--token-*)` values), not eyeballed
  from screenshots. See DESIGN.md for the verified values and their source.
- **Content is the only thing that changes.** Section structure, visual
  rhythm, color blocking, and component patterns replicate Eventry's; copy,
  imagery, and data are Bookuncleses' own (services, portfolio, rate card,
  events, testimonials — all already data-driven from Supabase).
- **Placeholder discipline for missing assets.** Anywhere Eventry's real
  design calls for a photo/video the business hasn't supplied yet, render a
  clearly labeled placeholder ("Image required" / "Video required") instead
  of a broken image or a stock photo — swappable later without a rebuild.
- **One fixed light theme, no OS dark-mode flip.** Eventry is a single
  authored light brand with intentional dark-green section blocks (footer,
  CTA bands) — not a light/dark toggle. Matching it means the site must not
  auto-invert under `prefers-color-scheme: dark`.
- **Every page degrades gracefully without Supabase**, per the existing
  README contract — restyling must preserve the honest empty states, not
  break them.

## Accessibility & Inclusion

- Body text must hit WCAG AA contrast (>=4.5:1) against its background at
  all times, including inside the dark-green footer/CTA sections.
- Preserve existing semantic structure (headings, form labels, aria on the
  mobile nav toggle) through the restyle — this is a visual pass, not a
  markup rewrite.
- Respect `prefers-reduced-motion` for any new hover/reveal motion introduced
  while matching Eventry's interaction feel.
