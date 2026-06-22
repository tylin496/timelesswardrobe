# Timeless Wardrobe

Static menswear-archive site. Vanilla JS (`app.js`) + a single compiled
stylesheet. Read the docs before styling work:

- [docs/CONVENTIONS.md](docs/CONVENTIONS.md) — the de-facto design system (BEM,
  tokens, typography, spacing, breakpoints, z-index, **Rails**).
- [docs/CSS.md](docs/CSS.md) — the CSS build pipeline.

## CSS pipeline (do not get this wrong)

- **Edit `css/main.css`** (source). **Never hand-edit `styles.css`** — it is the
  built output linked by every page. Run `npm run css:build` after changes
  (`npm run dev` watches and rebuilds automatically).
- Tokens first — no raw px/colours, no inline `style`. New page overrides hang off
  `body.<page>`. State is `.is-*` / `.has-*`, toggled from JS.

## Rails — fixed contract

Horizontal card rails (Collection Highlights, item page Related, styling-board
Current Outfit strip) keep breaking when edited ad-hoc. Before touching any rail,
read **[docs/CONVENTIONS.md → Rails](docs/CONVENTIONS.md#rails-horizontal-card-scrollers)**.
The short version:

1. First card rests aligned with the rail heading at `scrollLeft: 0`.
2. Mobile full-bleed needs all three, same gutter token: `margin-inline` (bleed),
   `padding-inline-start` (re-inset first card), **`scroll-padding-inline-start`**
   (so snap rests on the inset — omitting this is the #1 bug).
3. Left rests aligned, right bleeds for the peek. Don't make it symmetric/no-bleed.
4. Progress track is `position: relative`, sits below the cards, symmetric gutters,
   and its CSS must apply at **all breakpoints** (not one `@media` block).

Verify at rest: `firstCard.left === heading.left`, right bleeds, progress bar below
the cards on **both** mobile and desktop.
