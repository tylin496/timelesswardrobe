# Architecture — the data flow, for a cold reader

Read this first. It is the map a new session needs to reason about the catalogue
without reading `app.js` (32k lines) end to end. It describes **what the code does
today**, with symbol anchors you can grep in `app.js` (never line numbers — they
rot; `npm run check:doc-anchors` enforces this). When it goes stale, fix it — this
doc is load-bearing.

Companion docs: [DATA-CONTRACT.md](DATA-CONTRACT.md) (per-field ownership,
editability, sort rules), [DEBUG-RUNBOOK.md](DEBUG-RUNBOOK.md) (symptom→layer
table), [DATA-INVARIANTS.md](DATA-INVARIANTS.md) (what's guaranteed about the
data + how to verify), [SUPABASE.md](SUPABASE.md) (cloud tables/auth),
[CONVENTIONS.md](CONVENTIONS.md) (CSS/design system).

## The one-paragraph model

The catalogue is **seed-first, cloud-hydrated**. A synchronous `<script>`
(`data/wardrobe.js`, 82 rows) paints immediately with zero network. A deferred
Supabase fetch then merges editable metadata on top. Everything the UI renders
comes from a single in-memory array, `items`, produced by one function,
`mergeWardrobeFromSources()`. Images are **never** taken from the cloud row — the
seed path is the sole image truth — see `mergeWardrobeFromSources` ([app.js](../app.js)).

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
      (LIVE: hides rows)                     merge                     app.js
  • collection_overrides   ──╳ DROPPED ── (column deleted Jun 30 2026; see Audit Matrix below)
  • showcase_order (wardrobe_items) ─────►  orders the curated collection grid
      (LIVE: read by the deferred cloud     (bake layer deleted Jun 30 2026 —
       fetch; skeleton holds until it lands)  never read by app.js)
```

Anchors: `wardrobeBase` ([app.js](../app.js)) is declared then built from
`seedItemsFromScript` ([app.js](../app.js)) and cloud-aligned in the boot/refresh
paths (grep `seedItemsFromScript` assignments); `mergeWardrobeFromSources`
([app.js](../app.js)) produces `items`.

## Layer ownership

| Concern | Owned by | Editable? | Read at merge? |
|---|---|---|---|
| Catalogue identity (`id`, category, brand, name) | seed `data/wardrobe.js` | id immutable; name/slug yes | yes (via wardrobeBase) |
| Image / gallery URLs | **seed only** | regenerate pipeline | yes (seed paths win) |
| Editable metadata (notes, price, measurements, season…) | Supabase `wardrobe_items` | yes (editor → upsert full row) | yes (merged into wardrobeBase) |
| Hidden rows | `wardrobe_app_state.collection_hidden_ids` | yes | **yes** (filtered out) |
| Curated grid order | `wardrobe_items.showcase_order` (live Supabase fetch) | yes (Account → Showcase) | order only |
| ~~Per-field overrides~~ | ~~`wardrobe_app_state.collection_overrides`~~ | — | **no — column dropped Jun 2026** |

## Data access surface — where all cloud I/O lives

Cloud I/O has **two homes**, and the split is asymmetric (a half-built
Repository). A cold session debugging "did this reach the cloud?" should look
*only* in these two places — there are no Supabase calls anywhere else in the
catalogue code.

### Home 1 — `js/supabase-client.js` (the module, imported as `api`)

A real Repository module. Takes a `client`, returns data; no app state. Owns:
- **Outfits — full CRUD** (all via edge functions): `fetchOutfits`,
  `fetchOutfitBySlugOrId`, `insertOutfitWithItems`, `updateOutfitWithItems`,
  `deleteOutfitById`, `createOutfitViaEdgeFunction`, `mutateOutfitViaEdgeFunction`,
  `duplicateOutfitViaEdgeFunction`.
- **wardrobe_items READ** (deferred hydration): `fetchWardrobeItems(client, excludeIds)`.
- Client + normalizer: `createBrowserClient`, `mapRowToItem`.

### Home 2 — raw `supabaseClient.from(...)` inside `app.js`

These never moved into the module. Each mixes a Supabase call with in-memory
state mutation, which is why they're still inline:

| Table / store | Function (app.js) | Op |
|---|---|---|
| `wardrobe_items` | `loadWardrobeItemsFromCloud` | READ all (boot, non-hybrid) |
| `wardrobe_items` | `saveWardrobeItemToCloud` | **WRITE** (upsert, `onConflict:"id"`) — the one canonical write; payload filtered to `WARDROBE_ITEMS_UPSERT_KEYS_UK` (fields outside it are silently dropped), then schema-checked by `wardrobeItemsUpsertRowViolations` (violations throw and block the save — see DATA-CONTRACT.md → Write gate) |
| `wardrobe_items` | `deleteWardrobePieceFromBrowser` | DELETE one row |
| `wardrobe_items` | `resolveOutfitSlotsForCloudSave` | SELECT id (existence check before outfit save) |
| `wardrobe_app_state` | `fetchWardrobeAppStateFromCloud` | READ the single `id="default"` row |
| `wardrobe_app_state` | `flushWardrobeAppStateToSupabase` | WRITE (upsert) + read-back verify |
| `wardrobe_app_state` | `hydrateCollectionStateFromCloud` | READ at boot + one-time migration WRITE |
| `outfit_items` | `unlinkCloudOutfitsReferencingWardrobeItem` | DELETE links when a piece is deleted |
| Storage (image bucket) | `deleteWardrobeImageUrlFromCloud` / `deleteWardrobeItemImagesFromCloud` | DELETE objects |

**Completing the Repository (roadmap Step 9)** = lifting the Home-2 calls into
`js/supabase-client.js` next to the outfit functions, leaving the state-mutation
orchestration behind in app.js. Not yet done — the asymmetry above is the current
truth, not the target.

**Not Supabase at all (separate boundaries, don't conflate):**
- Image **uploads** → Cloudflare **R2 worker** (`uploadWardrobeImageFileToCloud` →
  `R2_UPLOAD_WORKER_URL`), never Supabase Storage.
- `localStorage` (custom items, hidden-ids cache, season nav) = offline-resilience layer.

## Audit Matrix — `collection_overrides` (2026-06-26; column dropped Jun 30 2026)

> **Status update (Jun 30 2026):** the `collection_overrides` column has since been
> **dropped** from `wardrobe_app_state` (migration `20260630120000_drop_unused_columns.sql`).
> The narrative below is retained as the historical record of *why* it was safe to drop.


`wardrobe_app_state` (single row, `id="default"`) has two jsonb columns. They were
introduced together ("cloud sync for hybrid catalogue edits", renamed from
`archive_overrides`/`archive_hidden_ids`) but have **diverged in status**:

| Column | Status | Evidence |
|---|---|---|
| `collection_hidden_ids` | **LIVE — keep** | Read every merge; filters rows out via `loadCollectionHiddenIds` ([app.js](../app.js)). 10 ids in prod. |
| `collection_overrides` | **DEAD on read, redundant, still dual-written → RETIRE** | Merge explicitly skips it — `mergeWardrobeFromSources` (app.js) carries the comment "No override patch is applied". |

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
