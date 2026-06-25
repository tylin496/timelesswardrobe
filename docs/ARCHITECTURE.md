# Architecture — the data flow, for a cold reader

Read this first. It is the map a new session needs to reason about the catalogue
without reading `app.js` (32k lines) end to end. It describes **what the code does
today**, with file:line anchors you can verify. When it goes stale, fix it — this
doc is load-bearing.

Companion docs: [DATA-INVARIANTS.md](DATA-INVARIANTS.md) (what's guaranteed about
the data + how to verify), [SUPABASE.md](SUPABASE.md) (cloud tables/auth),
[CONVENTIONS.md](CONVENTIONS.md) (CSS/design system).

## The one-paragraph model

The catalogue is **seed-first, cloud-hydrated**. A synchronous `<script>`
(`data/wardrobe.js`, 82 rows) paints immediately with zero network. A deferred
Supabase fetch then merges editable metadata on top. Everything the UI renders
comes from a single in-memory array, `items`, produced by one function,
`mergeWardrobeFromSources()`. Images are **never** taken from the cloud row — the
seed path is the sole image truth ([app.js:10635](../app.js)).

## Data flow

```
SOURCES (truth)                          BUILD                         READ MODEL        UI
─────────────────────────────────────    ─────────────────────────    ─────────────     ──────
data/wardrobe.js  (seed: catalogue       wardrobeBase                  items             grid,
  fields + image paths — image truth)    = seed rows,                  = merge of        PDP,
        │                                   aligned + metadata-          base + custom    search,
Supabase wardrobe_items (editable          merged from cloud            − hidden ids      outfits
  metadata: name/notes/price/…)            (deferred fetch)             (deduped)
        │                                        │                          │
Supabase wardrobe_app_state                      ▼                          ▼
  • collection_hidden_ids  ─────────────►  filtered out at  ──────►  mergeWardrobeFromSources()
      (LIVE: hides rows)                     merge                     app.js:10633
  • collection_overrides   ──╳ NOT READ ── (dead on read; see Audit Matrix below)
        │
dist/data/showcase-order.js (baked from   orders the curated
  Supabase showcase_order; gitignored)      collection grid
```

Anchors: `wardrobeBase` declared [app.js:7170](../app.js); built from
`seedItemsFromScript()` then cloud-aligned (app.js:31332, 31360, 31866);
`mergeWardrobeFromSources()` [app.js:10633](../app.js) produces `items`.

## Layer ownership

| Concern | Owned by | Editable? | Read at merge? |
|---|---|---|---|
| Catalogue identity (`id`, category, brand, name) | seed `data/wardrobe.js` | id immutable; name/slug yes | yes (via wardrobeBase) |
| Image / gallery URLs | **seed only** | regenerate pipeline | yes (seed paths win) |
| Editable metadata (notes, price, measurements, season…) | Supabase `wardrobe_items` | yes (editor → upsert full row) | yes (merged into wardrobeBase) |
| Hidden rows | `wardrobe_app_state.collection_hidden_ids` | yes | **yes** (filtered out) |
| Curated grid order | `wardrobe_items.showcase_order` → baked `showcase-order.js` | yes (Account → Showcase) | order only |
| ~~Per-field overrides~~ | ~~`wardrobe_app_state.collection_overrides`~~ | — | **no — dead, see below** |

## Audit Matrix — `collection_overrides` (2026-06-26)

`wardrobe_app_state` (single row, `id="default"`) has two jsonb columns. They were
introduced together ("cloud sync for hybrid catalogue edits", renamed from
`archive_overrides`/`archive_hidden_ids`) but have **diverged in status**:

| Column | Status | Evidence |
|---|---|---|
| `collection_hidden_ids` | **LIVE — keep** | Read every merge; filters rows out at [app.js:10637](../app.js). 10 ids in prod. |
| `collection_overrides` | **DEAD on read, redundant, still dual-written → RETIRE** | Merge explicitly skips it ([app.js:10634](../app.js): "No override patch is applied"). |

Live contents of `collection_overrides`: 14 item ids. 12 carry only `notes`; 2
(`polo-coat`, `tank-solo`) carry a full field set. **Parity check vs
`wardrobe_items`** (snake_case + `metadata` jsonb aware): every substantive field
is identical. The only diff is `image`/`gallery`, and that diff is purely the
`?v=` cache-buster (`…/1.webp?v=…` vs `…/1.webp`) — immaterial, since images come
from the seed, not this column. **Conclusion: zero unique data. Safe to retire.**

Why it still exists: ~6 call sites in `app.js` still `loadCollectionOverrides()` /
`saveCollectionOverrides()` (e.g. 3038/3070, 4410, 4946, 21051, 25725, 25759,
25794), and the catalogue editor (25703/25783) **dual-writes** — it upserts the
full row to `wardrobe_items` (the truth) *and* writes the override blob (the
residue). Retirement = stop the dual-write/read in code first, drop the column
later once soaked.

## Where NOT to look (dead paths a cold reader would otherwise chase)

- **`collection_overrides` apply logic** — there is none. Editing a catalogue piece
  flows editor → `wardrobe_items` upsert. The override write is residue.
- **`editorial-priorities` / `featured_rank`** — fully dead, replaced by
  Showcase / `showcase_order`. Migration `20260622_drop_editorial.sql` dropped the
  cloud side.
- **`archive_overrides` / `archive_hidden_ids`** — old column names; renamed to
  `collection_*`. Only the rename migrations mention them.
