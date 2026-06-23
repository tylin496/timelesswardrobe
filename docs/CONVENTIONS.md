# Conventions

The de-facto design system, reverse-engineered from the current code. These are
patterns the codebase **already follows consistently** — treat them as the rule
for new work so the manual polish stays coherent. Pairs with [CSS.md](CSS.md)
(build pipeline) and lives in `css/main.css` (source) → `styles.css` (output).

## Naming (BEM, kebab-case)

The codebase uses BEM strictly — ~713 `block__element` and ~85 `block--modifier`
selectors, near-zero ad-hoc class names.

| Pattern | Meaning | Example |
| --- | --- | --- |
| `block` | Component root, feature-scoped kebab name | `.card`, `.site-header`, `.outfits-drawer` |
| `block__element` | Child part | `.card__media`, `.site-header__tool-glyph` |
| `block--modifier` | Variant of the block/element | `.site-header__tool-glyph--cap-round` |
| `.is-*` / `.has-*` | Runtime **state** (toggled from JS) | `.is-active`, `.is-open`, `.has-results` |
| `body.<page>` | Page scope for overrides | `body.home-page`, `body.collection-page` |

Rules:
- New components get a new feature-scoped block; don't bolt onto an unrelated block.
- State is `.is-*` / `.has-*`, never a `--modifier`. JS toggles state classes
  (`classList.add/remove`), it does not write inline styles for things CSS can own.
- Page-specific overrides hang off `body.<page>`, not a new global rule (see CSS.md).

## Tokens first — never hardcode

Colour, spacing, motion, and z-index always go through a CSS variable. There are
no arbitrary-value utilities (`w-[437px]`) and no inline `style="…"` in markup —
keep it that way. Add a **semantic** token rather than repeating a raw value.

Token layers (define new ones at the matching layer in `:root` of `main.css`):

1. **Brand palette** — raw brand colours: `--tw-brand-green` `#163229`, `--tw-brand-page` `#f7f4ed`, `--tw-brand-cream`.
2. **Semantic surface / ink / line** — what UI references:
   - Text: `--ink` `#1a2f28`, `--ink-muted`, `--ink-faint`
   - Surfaces: `--tw-surface-page` / `--tw-surface-rail` / `--tw-surface-preview`, `--frost-*`, `--tint-*`
   - Borders: `--line`, `--line-strong`
   - Accent: `--accent` (= brand green), `--error`
3. **Component-scoped** — header / mega-menu / search / card / collection tokens
   (`--site-header-*`, `--mega-menu-*`, `--card-shadow*`, …). Built on layers 1–2.

A component should reference layer 2/3 tokens, not layer-1 raw colours.

## Typography

Three families, loaded via Google Fonts with `display=swap`:

| Token | Family | Use |
| --- | --- | --- |
| `--font-serif` | Cormorant Garamond | Body / editorial serif |
| `--font-serif-display` | Playfair Display | Display headings |
| `--font-sans` | DM Sans | UI / nav / meta |

Size tokens for chrome text: `--font-size-label` `0.66rem`, `--font-size-meta`
`0.8rem`, `--font-size-nav` `0.88rem`. Body/heading sizing uses the Tailwind scale.

## Spacing & radius

- **Fluid inline gutters** use `clamp()` tokens, not fixed px:
  `--page-gutter` `clamp(12px, 1.5vw, 32px)`, `--space-page-inline`,
  `--space-header-inline`, `--space-collection-inline`, `--header-x`.
- **Block rhythm** scale: `--space-block-compact` `0.75rem` / `--space-block-base`
  `1rem` / `--space-block-loose` `1.5rem`.
- **Radius**: `--radius` `5px` (default), `--radius-lg` `12px` (cards/sheets).
- **Touch target floor**: `--tap-min` `2.75rem` — interactive controls respect it.
- **Content cap**: `--content-max` `1600px`.
- **Media aspect**: `--media-frame-ratio` `3 / 4` for product imagery.

## Breakpoints

Use the **industry-standard Tailwind scale** (this project runs Tailwind 4, so
these match the framework's own `sm`/`md`/`lg`/`xl`/`2xl`). New media queries use
these boundaries:

| Token | min-width | Typical role |
| --- | --- | --- |
| `sm` | 640px | Large phone |
| `md` | 768px | Tablet |
| `lg` | 1024px | Primary desktop ↔ mobile split |
| `xl` | 1280px | Large desktop |
| `2xl` | 1536px | Max layouts |

Rules:
- In markup, prefer Tailwind responsive prefixes (`md:`, `lg:`) over hand-written
  media queries — they already use this scale.
- In `main.css`, when a `max-width` query is needed, pair it as `max-width: N-1` /
  `min-width: N` around one of these boundaries (e.g. 767/768) so there is no overlap.
- The existing 900/720/520 custom boundaries in `main.css` are **legacy**; migrate
  toward the standard scale when touching a section — don't add new off-scale values.

## Motion & accessibility

- Easing tokens: `--ease-out`, `--ease-snappy`, `--ease-luxe` (signature).
- Duration tokens: `--motion-duration` `0.28s`, `--motion-duration-short` `0.22s`,
  `--transition-ui`; reveal presets `--anim-reveal*`.
- **Always** guard motion with `@media (prefers-reduced-motion: reduce)` — the
  codebase already does this in ~26 places; match it for any new animation.

## Z-index ladder

Use a named `--z-*` token, never a raw number. Current ladder (low → high):

```
--z-mega-menu-backdrop      900
--z-mega-menu              1100
--z-utility-bar            1200
--z-site-header-chrome     1200
--z-outfits-backdrop 1290
--z-outfits-drawer   1300
--z-collection-filter-drawer 1300
--z-header-search-overlay  1400
```

New overlays slot into a gap in this range with a new `--z-*` token.

## Rails (horizontal card scrollers)

Every horizontal card rail follows **one contract** — Collection Highlights
(`.home-hero__rail` / `.home-hero__division-rail`), the item page Related rail
(`.item-detail__related-grid`), and the outfits Current Outfit strip
(`#outfit-strip`). These break constantly when edited piecemeal; treat the rules
below as fixed.

**1. The first card rests aligned with the rail's heading.** At `scrollLeft: 0`
the first card's left edge lines up with the section heading/eyebrow and the body
gutter — never floating left of it.

**2. Full-bleed mobile pattern — the three properties move together.** When a rail
bleeds to the viewport edge (so the next card peeks past the gutter), set all three
on the scroller, all keyed to the **same gutter token**:

```css
margin-inline:               calc(-1 * <gutter>);  /* bleed to the edge */
padding-inline-start:        <gutter>;             /* re-inset first card to the heading */
scroll-padding-inline-start: <gutter>;             /* snap rests on the inset, not the bled edge */
```

Omitting `scroll-padding-inline-start` is the **#1 recurring bug**: with
`scroll-snap-align: start` the snap cancels the padding inset and the first card
rests ~one gutter left of the heading. If the first card looks shifted left, this
is why.

**3. Left rests aligned, right bleeds.** The trailing card runs past the panel edge
to signal scrollability — do **not** add right padding/margin that leaves dead
space, and do **not** "fix" it into a symmetric or no-bleed rail. (The Current
Outfit strip adds the bleed only on real overflow, gated by `.is-rail-scrollable`;
when cards fit, no bleed — both edges at the content gutter.)

**4. Progress track** (`.home-hero__rail-progress`, `.outfits__outfit-rail-progress`):
- `position: relative` — the bar inside is `position: absolute`. If the track is
  `static`/`height:0`, the bar escapes to the nearest positioned ancestor and
  floats a line across the cards (this was a real desktop bug).
- Sits **below** the cards, the bar centred on a 1px hairline (`::before`).
- **Symmetric gutters**: `margin-left` and `margin-right` both equal the rail's
  content gutter token.
- Bar length is tuned via `min-width` (e.g. `40%` of the track); JS sets the inline
  `width`, and `min-width`/`max-width` (%) override it while the scroller still
  positions by `offsetWidth`, so travel stays correct.
- Put track + bar rules at **base (all widths)** or mirror them across breakpoints
  — rail CSS that lives in only one `@media` block leaves the other breakpoint
  broken (e.g. progress styled for mobile only → bar floats on desktop).

**5. Gutters come from tokens**, never raw px: `--content-inline`,
`--home-hero-division-rail-pad-left`, `--outfits-scroll-inline`.

Verify after any rail change: at rest the first card aligns with the heading
(`firstCard.left === heading.left`), the right bleeds, and the progress bar sits
below the cards on **both** mobile and desktop.
