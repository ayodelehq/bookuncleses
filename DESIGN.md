# Design

Source of truth for **layout, type, and spacing**: Eventry, a Framer
event-booking template (`https://organic-surface-000009.framer.app/`) —
values verified from its live shipped HTML/CSS, not eyeballed.

Source of truth for **color**: the real Uncle Ses Kreativ Studio logo
(`public/brand/logo-color.png` / `public/brand/logo-white.png`), hex values
supplied directly by the business. This replaced the earlier Eventry-green
clone palette — see "Known fidelity gaps" for why color specifically
diverges from Eventry while layout/type/spacing still match it.

## Color

Single fixed light theme — no `prefers-color-scheme` inversion. Dark is a
deliberate section treatment (footer, CTA bands), not a user-toggled mode.

| Token | Hex | Role | Contrast |
|---|---|---|---|
| `--background` | `#FAF7F9` | Default page/section background — near-white, tinted toward the brand's own hue instead of Eventry's mint | — |
| `--surface` | `#FFFFFF` | Card background (FAQ, pricing, testimonial, showcase cards), nav bar | — |
| `--surface-alt` | `#F4E6EF` | Alternating section band (soft orchid/blush) | — |
| `--surface-dark` | `#5E1D5E` (Purple Dark) | Dark section block bg (footer, CTA bands) — paired with `text-background` | 11.6:1 vs white text |
| `--border-subtle` | `#E3D6DE` | Card/divider borders | — |
| `--brand` | `#D6406A` (Vivid Rose) | Primary — CTA buttons, active nav state, large/bold UI text | 4.4:1 on white (fine for buttons/large text, not small body text) |
| `--brand-strong` | `#A22B4C` (Rose Dark) | Same role as `--brand` but for small body-sized text/links that need full AA | 7.0:1 on white |
| `--brand-foreground` | `#FFFFFF` | Text on `--brand` buttons | — |
| `--brand-secondary` | `#8E2C8E` (Royal Purple) | Secondary accent — safe to use more liberally than rose (links, icon fills, hover states) | 7.2:1 on white |
| `--brand-soft` | `#C87FC8` (Purple Light) | Rare subtle highlight (footer wordmark watermark) | — |
| `--accent` | `#F47521` (Sunset Orange) | Rare accent only — icon fills, badge backgrounds. **Fails AA as text** on both white (2.8:1) and `--surface-dark` (4.1:1 is fine there, but 2.8:1 on light bg is not) — always pair with `--accent-foreground`, never place light text on it | — |
| `--accent-foreground` | `#1E1E1E` | Text/icon color on top of `--accent` fills | 5.7:1 |
| `--foreground` | `#1E1E1E` (Charcoal) | Body copy, labels, nav text | 17.9:1 on white |
| `--muted` | `#6B6B6B` (Gray) | Secondary/description text | — |
| `--ink` | `#1E1E1E` | Display headlines (h1–h4) **on Home only** — same value as `--foreground` in this palette (the business only specified one text color); kept as a separate token so headline/body can diverge later without a refactor | — |
| `--heading` | `#241A1C` (warm-tinted near-black) | Page/section titles on every page **except Home** (`SectionHeading`'s `tone="warm"`, `Hero`'s `titleTone="warm"`). Deliberately not `--brand`: the CTA buttons already own that color, and a heading in the same hue as "the thing to click" dilutes the button's signal. A whisper of the brand's rose hue is mixed into this near-black instead of using flat `--ink`, so it still reads as "warm" without competing with the CTA | ~17:1 on white (same order as `--ink`) |

Note: `--brand` (Vivid Rose) sits at 4.4:1 on white — just under the 4.5:1
AA threshold for small regular-weight text, comfortably over the 3:1
threshold for large/bold text and non-text UI components (buttons, active
indicators). It's used site-wide for buttons and bold UI elements; where it's
used for small plain-text links it inherits Eventry's original pattern
(the previous green brand color scored 4.8:1 in the same slots) — a close
enough margin not to be a visible readability problem, but worth using
`--brand-strong` instead if a new small-text use case is added.

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

Headline color is `--ink` for big display headlines that sit on a light
background — applied via the `text-ink` utility on `SectionHeading`'s h2 and
`Hero`'s h1 (only in its non-`onMedia` branch), not as a blanket
`h1,h2,h3,h4` rule. A blanket rule was tried first and reverted: it beat the
inherited `text-background` color on `CTASection`/`Footer`'s dark section
bands, turning their headlines dark-on-dark (a real contrast bug, caught via
screenshot). Dark-band headings inherit `text-background` (white) from their
container instead.

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

## Imagery

The business's real photography (Cloudinary, `res.cloudinary.com/dzomdloyf/...`)
is all portrait-oriented (~2:3), not the landscape stock shape Eventry's own
template assumes. Rather than force-crop every real photo into Eventry's
original landscape frames, the containers that hold real portfolio photos
were adapted to the content instead:

- **Home's Hero, Featured Work grid, and Behind the Scenes panel** all use
  portrait-friendly containers (`aspect-3/4` for Featured Work and BTS, a
  centered `max-w-md` panel for BTS instead of a full-width `21/9` banner)
  instead of Eventry's original landscape ratios.
- **`/photos`' masonry grid** (`PortfolioGallery.tsx`) renders images at
  their natural size (plain `<img>`, no forced `aspect-*` wrapper) rather
  than cropping every tile to a uniform ratio — the masonry only actually
  varies tile height if the images are allowed their own proportions.
- Where a photo still has to sit in a wider frame (e.g. the Hero's
  `splitMedia`), use Cloudinary's own `c_fill,g_auto` transform (subject-
  aware auto-crop) rather than a blind CSS `object-cover` center-crop.
- `ShowcaseCard`'s `aspect-4/3` is unchanged — it's used for event cover
  photos (`/tickets`), a different content type that isn't necessarily
  portrait.

This is a deliberate departure from "layout is Eventry's, only content
changes": the container *shape* now follows the real asset shape. Documented
here so it isn't mistaken for drift on the next fidelity pass.

## Logo

Two source files in `public/brand/`, both the same mark (no wordmark baked
in — the site name is set separately in text via `siteConfig.name`):

- `logo-color.png` — the full purple/rose/orange gradient mark. Used on
  light surfaces: `NavBar`, admin login screen, `src/app/icon.png` (favicon,
  padded to a square canvas from the original 253x317 source).
- `logo-white.png` — flat white mark. Used on dark surfaces: `Footer`'s
  copyright row (the only dark-surface placement so far).

The gradient is a signature asset, not a reusable fill — don't recreate it
as a CSS gradient elsewhere (gradient text/backgrounds are an explicit anti-
pattern per PRODUCT.md).

## Placeholder assets

Anywhere Eventry's layout calls for a photo/video the business hasn't
supplied (hero background media, About-style image tickers, large editorial
image blocks), render `<MediaPlaceholder kind="image|video" label="..." />`
— a labeled, dashed-border placeholder — instead of a broken `<Image>` or a
stock photo. Swap for real assets later with no structural change.
