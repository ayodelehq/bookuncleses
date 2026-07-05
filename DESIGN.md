# Design

Source of truth: **Eventry**, a Framer event-booking template
(`https://organic-surface-000009.framer.app/`). All values below were pulled
from the live site's rendered HTML/CSS (`curl` + grep on the shipped
`rgb()` / `var(--token-*, rgb(...))` declarations and `@font-face` rules),
not estimated from screenshots. Where a value carries a Framer-authored name
(e.g. "Primary Color"), that name is quoted.

## Color

Single fixed light theme — no `prefers-color-scheme` inversion. Dark is a
deliberate section treatment (footer, CTA bands), not a user-toggled mode.

| Token | Hex | Verified role |
|---|---|---|
| `--background` | `#F2F3F3` | Default page/section background |
| `--surface-alt` | `#D8E4E3` | Alternating section band (mint), also the site's general border tint |
| `--surface` | `#FFFFFF` | Card background (FAQ, pricing, testimonial, showcase cards), nav bar |
| `--border-subtle` | `#CED1CE` | Card/divider borders |
| `--brand` | `#038262` | "Primary Color" — CTA buttons, links, active nav state |
| `--brand-foreground` | `#FFFFFF` | Text on `--brand` buttons |
| `--brand-soft` | `#9ACF8B` | Secondary accent (attribution labels, subtle highlights) — used sparingly |
| `--foreground` | `#30403E` | "Dark 2" — body copy, labels, nav text; **also** the dark-section background (footer/CTA bands use `bg-foreground` + `text-background`, matching Eventry reusing this one color both ways) |
| `--muted` | `#52615F` | Secondary/description text (card descriptions, supporting copy) |
| `--ink` | `#000000` | Large display headlines only (h1–h4) — verified distinctly blacker than body text |

Removed: the previous magenta/purple brand palette and its
`--brand-gradient-*` tokens (confirmed unused by any component — Eventry has
no gradients anywhere, flat solid color only).

## Typography

Four-font system matching Eventry's actual text-style roles:

- **Hanken Grotesk** (`--font-display` / `--font-heading-raw`) — headings.
  Applied globally to `h1`–`h4`: hero titles, `SectionHeading`, card-level
  sub-headings. Gives the site its bold event-brand personality.
- **Inter** (`--font-sans` / `--font-body`) — body copy and interface chrome.
  The `body` default, so it's what buttons, form fields, nav, and paragraph
  text render in unless a heading tag or an explicit `font-mono`/`font-accent`
  override applies.
- **Geist Mono** (`--font-mono`) — dates, stats, metadata, labels, ticket/event
  detail text, testimonial quotes. The most frequently used font after Inter;
  gives the structured "event schedule" feel. Applied via the existing
  `font-mono` utility class, unchanged from before.
- **Bricolage Grotesque** (`--font-accent`) — rare accent only, matching
  Eventry's own very light usage (a hover-overlay tag style). Applied to the
  Featured Work image caption on Home, which fades in on hover over the
  photo — the closest analog in this codebase to that hover-tag pattern.
  Not used anywhere else; don't reach for it as a general heading/body font.

Headline color is `--ink` (#000) for big display headlines that sit on a
light background — applied via the `text-ink` utility on `SectionHeading`'s
h2 and `Hero`'s h1 (only in its non-`onMedia` branch), not as a blanket
`h1,h2,h3,h4` rule. A blanket rule was tried first and reverted: it beat the
inherited `text-background` color on `CTASection`/`Footer`'s dark-green
bands, turning their headlines black-on-dark-green (a real contrast bug,
caught via screenshot). Dark-band headings inherit `text-background` (white)
from their container instead.

## Spacing & Layout

Verified via `max-width` frequency in the shipped markup — already correctly
implemented in `Container.tsx` / `Section.tsx`:

- Content container: `1312px` max-width
- Breakpoints: `810px` / `1200px` / `1440px` (replacing Tailwind's defaults)
- Container side padding: `20px` (mobile) → `40px` (tablet/desktop) → `64px` (≥1440px)
- Section vertical padding: `60px` → `80px` → `100px` → `124px` (≥1440px)

## Radius

Verified via `border-radius` frequency: `8px` and `10px` for cards, `16px`/`20px`
for larger content blocks, `100px` for fully-pill buttons/badges (button
height is well under half of 100px, so this is functionally `rounded-full`,
which is what the existing components already use).

## Components (existing, token-driven — confirmed no hardcoded colors to fix)

`NavBar`, `Footer`, `Hero`, `CTASection`, `FAQAccordion`, `PricingCard`,
`ShowcaseCard`, `StatCounter`, `TestimonialCard` all consume the semantic
CSS variables above rather than hardcoded hex — retiming the tokens in
`globals.css` re-skins the entire app without per-component edits. The one
non-token color is `WhatsAppButton`'s `#25D366` (WhatsApp's own brand green),
which is intentionally left as-is — it's a third-party brand mark, not part
of the Eventry system.

## Motion

Eventry's own interactions (per the live template): subtle hover opacity/scale
on cards and buttons, an image-ticker marquee on the About page, sticky nav.
Match with CSS transitions (`transition-opacity`, `transition-transform`)
already used across components; add `prefers-reduced-motion` fallbacks for
any new marquee/reveal motion introduced.

## Known fidelity gaps (found via a direct comparison pass, unresolved)

Checked against the live site's actual markup (not just the PDF screenshots)
for `/`, `/book-an-event`, `/events`:

- **No per-section eyebrows in the real Eventry.** Checked the text
  immediately preceding "Get in Touch", "Our Main Event", "Frequently Asked
  Questions", "Events" in Eventry's own markup — none carry a small uppercase
  label above them. Our `SectionHeading`/`Hero` components' `eyebrow` prop
  (used on every page: "Pricing", "Portfolio", "Tickets", "Contact"...) is a
  pattern **we** added, inherited from before this restyle, not something
  Eventry does — and it's also the exact "tiny uppercase tracked eyebrow
  above every section" pattern impeccable's brand register flags as a
  saturated AI tell. Worth removing to match Eventry exactly (open item,
  not yet applied pending a decision — it touches every page).
- **Big headline reveal animation not replicated.** Eventry's large page
  titles ("Book an Event", "Our Main Event", "Events") render through a
  per-character load animation (blur + translateY + opacity, staggered per
  letter), confirmed in the shipped markup. Our headings render statically.
  Lower priority than the eyebrow fix; would need a small client component
  plus a `prefers-reduced-motion` fallback (letters just render normally).
- **Heading color isn't perfectly uniform even in Eventry itself**: some big
  titles render in pure black (`#000`, e.g. "EVENTS" on the Events page),
  others in the muted charcoal `rgb(72,78,78)` (e.g. "Book an Event" on its
  own page, likely tied to the reveal-animation component). We standardized
  on pure `--ink` for all page-level display headings, which is a reasonable
  simplification, not a fidelity bug — the difference is barely perceptible
  at that weight/size.

## Placeholder assets

Anywhere Eventry's layout calls for a photo/video the business hasn't
supplied (hero background media, About-style image tickers, large editorial
image blocks), render `<MediaPlaceholder kind="image|video" label="..." />`
— a labeled, dashed-border placeholder — instead of a broken `<Image>` or a
stock photo. Swap for real assets later with no structural change.
