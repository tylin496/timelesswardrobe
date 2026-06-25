# Data Invariants

What the catalogue data is *guaranteed* to satisfy, how to verify it, and what a
failure means. This is the runnable ground truth: after any edit to the data, you
verify with a command instead of reading `app.js` or guessing.

> Run everything: `npm run check`
> Data only: `npm run check:data`

## The data, in one line

`data/wardrobe.js` is the **seed catalogue** — 82 rows, the synchronous source of
truth for catalogue fields (id, category, brand, name, image, gallery, …). It is
loaded as a plain `<script>` (no network) for the first paint. `showcase_rank` is
**not** in the seed — it lives in Supabase and is baked into the gitignored
`dist/data/showcase-order.js` (`window.TW_SHOWCASE_ORDER`). See
[SUPABASE.md](SUPABASE.md) for the cloud side.

## Enforced invariants

| # | Invariant | Command | Script |
|---|-----------|---------|--------|
| 1 | Catalogue id set matches the frozen lock (ids are immutable) | `npm run check:id-drift` | `scripts/check-catalogue-id-drift.mjs` |
| 2 | No duplicate `id` in the seed | `npm run check:data` | `scripts/check-data-integrity.mjs` |
| 3 | Required identity fields present & non-empty (`id`, `category`, `name`) — `brand` is the maker and may be empty when unknown; ownership is `metadata.ownership_status`, never inferred from brand | `npm run check:data` | `scripts/check-data-integrity.mjs` |
| 4 | Every local (`/images/…`) image reference exists on disk | `npm run check:wardrobe-images` | `scripts/check-wardrobe-local-images.mjs` |
| 5 | No legacy misspelled Vercel hostname in source | `npm run check:urls` | `scripts/check-public-urls.mjs` |

### What a failure means

- **#1 id drift** — an id was added/renamed/removed vs `data/wardrobe-catalogue-lock.json`.
  Ids are surrogate keys (PK + `outfit_items` FK + image-folder name + URL slug).
  Renaming orphans outfit references. Fix `name`/`slug` instead; if the id change is
  truly intended, re-freeze: `npm run db:freeze-catalogue`.
- **#2 duplicate id** — two rows claim one id, so they fight over one image folder,
  one slug, one FK target. `check:id-drift` (#1) compares id *sets* and silently
  swallows duplicates, which is exactly why #2 exists separately. Delete or re-id one row.
- **#3 missing required field** — a row renders as a broken/empty card and breaks
  category grouping / routing. Fill the field in `data/wardrobe.js`.
- **#4 missing image** — a row points at a `/images/…` path that isn't on disk.
  Add the file or fix the path. (Non-local URLs are intentionally skipped — gallery
  images may be cloud-hosted.)
- **#5 bad hostname** — the legacy misspelled Vercel hostname (the `timless…` typo,
  missing the `e`) leaked into source. Fix it, or allowlist if it's documentation.

## Layer map (which check guards which layer)

```
seed catalogue (data/wardrobe.js)  → #1 id drift · #2 dup id · #3 fields · #4 images
public URLs / hostnames            → #5
showcase order (Supabase → bake)   → NOT YET CHECKED (see below)
```

## Deferred — known gaps, not oversights

These are real invariants we want, but they can't run inside the network-free,
committed-data `check:data`. Pick them up when the matching layer is worked on.

- **Showcase order integrity** (unique ranks, dense `0..N`, no orphan ids, no missing
  curated pieces). Needs the baked `dist/data/showcase-order.js` (a build artifact) or
  a live Supabase read. Belongs with the showcase/Supabase migration work, not here.
- **No cloud-hosted cutout cover.** 去背 covers must be local-only (resize on R2
  breaks alpha). Needs the cover-path convention wired in before it can be asserted.

When you add either, add a row to the **Enforced invariants** table above and move
the bullet out of this section — keep this doc the single source of truth for "what
is guaranteed about the data."
