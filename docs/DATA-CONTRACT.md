# Data Contract — field ownership, editability, and sort rules

Read this alongside [ARCHITECTURE.md](ARCHITECTURE.md). That doc explains the
data-flow (sources → merge → read model). This doc answers **per-field**:
who owns it, can the editor change it, and can the collection grid sort by it.

"Owner" = the one surface that is authoritative. A field may be written in more
than one place, but only one place is correct when they conflict.

---

## Field table

| Field (in-memory name) | DB column | Owner | Editable in UI? | Sort key? | Notes |
|---|---|---|---|---|---|
| `id` | `id` | seed `wardrobe.js` | **No — immutable** | — | Surrogate PK + image folder + slug. Never rename. |
| `category` | `category` | seed | Yes | — | Drives browse rail + filter. |
| `brand` | `brand` | seed | Yes | — | Maker only. Not ownership inference. |
| `name` | `name` | seed | Yes | — | Display name. Renaming `name`/`slug` is safe; renaming `id` is not. |
| `season` | `season` | seed | Yes | — | "All-season" / season name. |
| `colour` / `color` | `colour` / `color` | seed | Yes | — | Display colour string. |
| `colourCode` / `colorCode` | `colour_code` / `color_code` | seed | Yes | — | Hex swatch. |
| `fabric` | `fabric` | seed | Yes | — | Material description. |
| `weight` | `weight` | seed | Yes | — | Free-text (e.g. "9.29 g"). Not parsed. |
| `size` | `size` | seed | Yes | — | Free-text (e.g. "2.5 mm", "HK 22"). |
| `measuredDimensions` | `measured_dimensions` | **derived** | No — generated | — | `measurementRowsToSummaryString(measurementRows)` at upsert time. Never edit directly. |
| `purchaseDate` | `purchase_date` | cloud `wardrobe_items` | Yes | `date-asc` / `date-desc` | ISO date string. Null = unset; sorts last in any date mode. |
| `image` | `image` | **seed only** | No (pipeline only) | — | Seed path wins at read. Cloud column exists but is ignored at merge. See ARCHITECTURE.md. |
| `gallery` | `gallery` | **seed only** | No (pipeline only) | — | Same as `image`. |
| `notes` | `notes` | cloud | Yes | — | Long-form editorial text. |
| `notesUpdatedAt` | `notes_updated_at` | **derived** | No — set on save | — | Set by the notes editor save path, not the item editor. |
| `metadata.price` | `metadata->price` | cloud | Yes | `price-asc` / `price-desc` | Numeric amount. Null = unset; sorts last. |
| `metadata.priceCurrency` | `metadata->priceCurrency` | cloud | Yes | — | 3-letter ISO (default: "TWD"). |
| `metadata.measurementRows` | `metadata->measurementRows` | cloud | Yes | — | `[{label, value, unit?}]`. `cleanMeasurementRows` strips embedded unit suffixes on load. |
| `metadata.measurementUnit` | `metadata->measurementUnit` | cloud | Yes | — | Global unit for the row set ("mm" stored explicitly; else cm assumed). |
| `metadata.basicColour` | `metadata->basicColour` | **derived** | No — normalized on save | — | `normalizeStoredBasicColourKey`. Set from `item.basicColour` or colour picker. |
| `metadata.secondaryColour` | `metadata->secondaryColour` | cloud | Yes | — | Secondary colour display string. |
| `metadata.secondaryColourCode` | `metadata->secondaryColourCode` | cloud | Yes | — | Secondary colour hex. |
| `metadata.secondaryBasicColour` | `metadata->secondaryBasicColour` | **derived** | No | — | Normalized from `secondaryColour`. |
| `metadata.ownership_status` | `metadata->ownership_status` | cloud | Yes (is_future toggle) | — | "future" = wishlist. Absent = owned. Authored fact. See ownership-status-migration. |
| `metadata.colourVariants` | `metadata->colourVariants` | cloud | Yes | — | Multi-colour variants array. Mutually exclusive with `basicColour`. |
| `metadata.showcase_rank` | `metadata->showcase_rank` | cloud | No (Showcase drag) | — | Legacy order hint; canonical order is now `showcase_order` column. |
| `showcaseOrder` | `showcase_order` | cloud | No (Showcase drag) | `default` (curated grid) | Curated grid position. Integer or null. Managed exclusively by Account → Showcase drag. |
| `showcaseAt` | `showcase_at` | cloud | No | — | Timestamp when item was added to showcase. |
| `pillar` | `pillar` | seed | No | — | Legacy field. Not shown in UI. |
| `section` | `section` | seed | No | — | Legacy field. Not shown in UI. |

---

## Sort contract

`COLLECTION_SORT_MODES = ["default", "price-asc", "price-desc", "date-desc", "date-asc"]`  
Persisted in `localStorage` under key `timeless-wardrobe-collection-sort-v1`.

| Sort mode | Primary key | Null handling | Tiebreak |
|---|---|---|---|
| `default` | `showcase_order` (curated items first by rank), then category/brand/name | — | `compareArchiveItems` (category ladder → brand → name) |
| `price-asc` | `metadata.price` ascending | Nulls last | `compareCollectionGridItems` |
| `price-desc` | `metadata.price` descending | Nulls last | `compareCollectionGridItems` |
| `date-asc` | `purchase_date` ascending (oldest first) | Nulls last | `compareCollectionGridItems` |
| `date-desc` | `purchase_date` descending (newest first) | Nulls last | `compareCollectionGridItems` |

Sort is applied in `compareGridItems` (app.js:22120) → `compareCollectionGridItems`
(app.js:22148) → `compareArchiveItems`. The sort comparator reads the live `items`
array; it does not query Supabase.

**Fields that are NOT sortable:** name, brand, category, season, colour, fabric,
measurements. Adding a new sort key requires: a new entry in `COLLECTION_SORT_MODES`,
a case in `compareGridItems`, and a sort UI control.

---

## Derived fields — do not edit directly

These are computed at write time by `itemToCloudRow` (app.js:8398) and must not
be set by the editor or any other caller:

- `measured_dimensions` — summary string; source of truth is `measurementRows`
- `metadata.basicColour` — normalized from colour input
- `metadata.secondaryBasicColour` — normalized from secondaryColour input
- `notes_updated_at` — set only by the notes save path

---

## Image fields — seed wins, cloud is ignored at read

`image` and `gallery` are written to `wardrobe_items` on every upsert (so the
cloud row is not empty), but `mergeWardrobeFromSources` at app.js:10633 does
**not** apply them back to the in-memory item. The seed `wardrobe.js` path wins.
Updating images = regenerate the seed (pipeline), not editing the cloud row.
See [ARCHITECTURE.md → Layer ownership](ARCHITECTURE.md).
