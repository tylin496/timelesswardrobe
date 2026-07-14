# Text-Logic Inventory

Business logic that depends on free-form string matching rather than explicit
state. Produced by auditing `app.js`. Sorted by risk — data-driven paths first,
internal UI state last.

---

## Severity key

| Level | Meaning |
|---|---|
| **Critical** | Core routing / filtering; typo or data-drift silently misbehaves |
| **High** | Affects ranking or visible counts; fragile but not silent |
| **Medium** | Internal UI state strings; controlled via constants, lower fragility |
| **Low** | Utility / URL parsing; not data-driven |

---

## Critical — core business logic on data fields

### 1. ~~`isFuturePiece()` — wishlist/ownership detection via text scan~~ ✅ RESOLVED

**Resolved Jun 2026.** Text scan removed. `deriveItemIsFuture` (app.js)
now reads `metadata.ownership_status === "future"` only. No substring scanning.
See [[project-ownership-status-migration]].

---

### 2. `itemSlot()` — navigation tab routing via 30+ hardcoded category strings

**File:** `itemSlot` (app.js)

```js
if (rawCat === "Objects" || rawCat === "Small Goods" || rawCat === "Small accessories") return SLOT_ACCESSORIES;
if (rawCat === "Bags" || rawCat === "Hats" || rawCat === "帽子" || rawCat === "Eyewear" ...) return SLOT_ACCESSORIES;
if (rawCat === "Clothing (incl. shoes)") return SLOT_CLOTHING;
if (rawCat === "Watches") return SLOT_WATCHES;
if (WATCH_RECORD_TYPE_KEYS.includes(rawCat) || rawCat === "Dress watch" || rawCat === "Dive watch" ...) return SLOT_WATCHES;
if (rawCat === "Fragrance" || rawCat === "Day" || rawCat === "Daywear" || rawCat === "Evening") return SLOT_FRAGRANCE;
if (rawCat === "Jewellery" || rawCat === "Necklace" || rawCat === "Bracelet" ...) return SLOT_ACCESSORIES;
if (rawCat === "Future") return SLOT_ACCESSORIES;
// fallback: season === "S/S" || "A/W" → SLOT_CLOTHING
```

**Why it exists:** The `category` field has accumulated free-form values and
bilingual aliases across multiple import eras. `itemSlot()` is the canonical
fan-out mapping, supplemented by `LEGACY_UNSPEC_CATEGORY_TO_SLOT` and
`LEGACY_ENGLISH_GRANULAR_SLOT` lookup tables for older aliases.

**Business logic?** Yes — critical routing. Determines which nav tab an item
appears under, which drill subcategories show, which images load, and which
related items are suggested.

**Replacement:** Add a `slot` field (`"Clothing" | "Accessories" | "Watches" |
"Fragrance"`) written at import and enforced in the editor. `itemSlot()` reads
`item.slot` directly; the string fan-out becomes a one-time data-migration
script.

---

### 3. `recordCategoryForDrill()` — drill subcategory routing via category strings

**File:** `recordCategoryForDrill` (app.js)

```js
if (raw === "項鏈" || raw === "手鏈" || raw === "戒指") raw = "Jewellery";
if (raw === "Sunglasses" || raw === "Glasses" || raw === "Eyeglasses") raw = "Eyewear";
if (raw === "Footwear") return "Footwear";
if (raw === "Small Goods" || raw === "Small accessories") return "Objects";
if (raw === "帽子") return "Hats";
if (slot === SLOT_FRAGRANCE && raw === "Daywear") raw = "Day";
```

**Why it exists:** Same multi-era category drift as `itemSlot()`. Maps raw
category values to canonical drill-down keys for subcategory filters and the
type-drill UI.

**Business logic?** Yes. Controls what subcategory label an item files under
in the drill UI. Broken mapping = item disappears from subcategory filter.

**Replacement:** Store a `record_category` canonical key alongside `slot` at
write time. `recordCategoryForDrill()` becomes a passthrough.

---

### 4. `editorialHeroVisualScore()` — homepage hero pool via keyword blob scan

**File:** `editorialHeroVisualScore` (app.js)

```js
const blob = `${rec} ${sub} ${nm}`;
for (const k of ["outerwear","coat","jacket","blazer","suit","tailor",
                  "watch","jewel","bracelet","loafer","derby","oxford",
                  "boot","fragrance","sunglass"]) {
  if (blob.includes(k)) s += 3;
}
```

**Why it exists:** No explicit "hero-eligible" flag exists; scoring infers visual
weight from garment type keywords in category + subcategory + name.

**Business logic?** Yes. An item that doesn't carry one of these keywords (e.g.
an accessory named differently) is penalised in hero selection regardless of
editorial quality.

**Replacement:** Add a `hero_eligible: boolean` metadata flag, or include `slot`
+ `record_category` in scoring so it routes on structured fields not substrings.

---

## High — affects ranking or visible counts

### 5. `normalizeSeason()` — season enum derivation from free-form strings ✅ TRAP FIXED

**File:** `normalizeSeason` (app.js)

`"Fall".includes("all")` trap fixed Jun 2026: replaced `v.includes("all")` with
`v === "all" || v.startsWith("all-") || v.startsWith("all ")`. Actual seed values
are only `"A/W"` / `"All-season"` / `"S/S"` so the trap never fired in prod, but
it's now closed.

**Still present:** function still uses substring matching for spring/summer/autumn/winter.
Not a real risk given current data, but could be eliminated by enforcing a
`season_code` enum (`"SS" | "AW" | "ALL"`) at write time (migration-gated).

---

### 6. ~~`startsWith("future")` — brand list filter~~ ✅ RESOLVED

**Resolved Jun 2026.** Filter removed. Brand index is now built from items
pre-filtered by `item.is_future === false` (using the structured ownership field),
not a brand-name prefix check.

---

### 7. `startsWith("custom-")` — custom-item identification via ID prefix

**File:** `startsWith("custom-")` (app.js) — single call site now (the merge cleanup collapsed the earlier four)

```js
const isCustom = sid.startsWith("custom-");
```

**Why it exists:** Custom items created in the app are assigned IDs with a
`"custom-"` prefix to distinguish them from catalogue seed items without a
separate boolean column.

**Business logic?** Yes — gates save/delete paths, image upload behaviour,
and edit UI visibility. Currently safe because the prefix is injected at
creation, but it couples item-type semantics to the ID format.

**Replacement:** Add `source: "seed" | "custom"` field to the item record.
Retain `"custom-"` prefix generation for now; remove the `startsWith` guards
once the field is available.

---

### 8. `searchQueryIntentForTokens()` + `searchCategoryAffinityAdjustment()` — search ranking via name substring

**File:** `searchQueryIntentForTokens` (app.js), `searchCategoryAffinityAdjustment` (app.js)

```js
const poloFamily = tokens.includes("polo") || joined.includes("polo");
// ...
if (bundle.nameNorm.includes("polo")) adj += 620;
if (bundle.nameNorm.includes("shirt") || bundle.nameNorm.includes("shirting")) adj += 360;
if (bundle.nameNorm.includes("coat") && intent.poloFamily) adj -= 280;
if (bundle.nameNorm.includes("jacket") && intent.shirtFamily) adj -= 340;
// scoreItemSearchRelevance:
if (tok === "polo") score += 700;
if (tok === "shirt" || tok === "shirts") score += 420;
```

**Why it exists:** Search needs to boost polo shirts (a dominant category in the
archive) over coats when a user queries "polo". Adjustments were tuned by feel.

**Business logic?** High — directly controls search result order. Hardcoded token
names mean adding a new dominant subcategory requires a code change.

**Replacement:** Replace hard-token bonuses with a `search_weight` field on
record categories, or compute boosts from `slot` + `record_category` rather
than name substrings.

---

## Medium — internal UI state strings

These are string-literal comparisons on internal state variables, not data
fields. They are controlled by JavaScript constants defined nearby, so a
rename stays local. Risk is lower but they would benefit from enum extraction
if the codebase is ever modularised.

### 9. Collection status filter strings

**File:** `st === "showcase"` (app.js) — status-filter block

```js
if (st === "showcase")  …
if (st === "wishlist")  …
if (st === "has-notes") …
if (st === "no-notes")  …
if (st === "no-price")  …
if (st === "no-date")   …
if (st === "no-fabric") …
if (st === "no-measure")…
```

**Why it exists:** Status filter UI sets `_accountCollectionStatus` to one of
these string literals.

**Replacement:** Extract to a `COLLECTION_STATUS` frozen object / TypeScript
`const` enum shared between the setter and the filter function.

---

### 10. Notes filter and sort mode strings

**File:** `app.js` (notes tab)

```js
if (_accountNotesFilter === "with-notes") …
if (_accountNotesFilter === "no-notes")   …
if (_accountNotesSort   === "updated")    …
if (_accountNotesSort   === "longest")    …
```

**Why it exists:** Notes tab filter and sort controls write these literals
directly.

**Replacement:** Same as above — constants object.

---

### 11. Sort mode and view mode validation via `COLLECTION_SORT_MODES.includes()`

**File:** `COLLECTION_SORT_MODES.includes` (app.js)

```js
if (COLLECTION_SORT_MODES.includes(v)) return v;
if (COLLECTION_VIEW_MODES.includes(v)) return v;
```

**Why it exists:** Guards localStorage-persisted values against stale or
corrupted strings before passing to the sort/layout logic.

**Replacement:** Already using constant arrays — this is the correct pattern.
No change needed beyond keeping the arrays as the single source of truth.

---

## Low — utility / URL parsing

These use string methods on non-business data (URLs, MIME types, filenames).
They are not fragile to data-field drift.

### 12. `endsWith("/edit")` / `endsWith("/login")` — URL path normalisation

**File:** `endsWith("/edit")` (app.js)

```js
if (id.endsWith("/edit"))  id = id.slice(0, -"/edit".length);
if (id.endsWith("/login")) id = id.slice(0, -"/login".length);
```

URL parsing util, not business logic. No replacement needed.

---

### 13. Image MIME type detection

**File:** `app.js` (guessImageFormat)

```js
if (type.includes("png"))  return "png";
if (type.includes("webp")) return "webp";
```

Standard MIME substring matching. Acceptable; no replacement needed.

---

### 14. File extension detection for cutout images

**File:** `app.js` (isLikelySeasonalCutoutImage)

```js
if (name.endsWith(".png") || name.endsWith(".webp") || name.endsWith(".gif")) …
```

File utility. Acceptable; no replacement needed.

---

### 15. Search haystack substring match — user query UX

**File:** `hay.includes` (app.js)

```js
const hay = [it?.name, it?.brand, it?.category, ...].join(" ");
if (!hay.includes(q)) return false;
```

**Why it exists:** Fast substring filter for user-typed search queries in the
Collection, Notes, and Showcase pickers.

**Business logic?** No — this is UX search, not state routing. The query `q`
is ephemeral user input, not a persisted flag. Acceptable as-is; a future
improvement would be full-text index, but the pattern is not the same class
of risk as items 1–8 above.

---

## Summary — action priorities

| Priority | Items | Status | Action |
|---|---|---|---|
| 1 | `isFuturePiece` (#1) | ✅ DONE Jun 2026 | `deriveItemIsFuture` reads `ownership_status` |
| 2 | `startsWith("future")` (#6) | ✅ DONE Jun 2026 | Brand index pre-filtered by `is_future` |
| 3 | `normalizeSeason` `"all"` trap (#5) | ✅ DONE Jun 2026 | Replaced `includes("all")` with explicit prefix checks |
| 4 | `itemSlot` (#2) + `recordCategoryForDrill` (#3) | 🚫 Cancelled | Catalogue is a closed one-per-category set; categories frozen; no practical risk |
| 5 | `editorialHeroVisualScore` (#4) | 🚫 Cancelled | Depends on slot/record_category which are cancelled |
| 6 | `startsWith("custom-")` (#7) | ⚠️ Safe for now | Add `source` field to remove ID-prefix coupling |
| 7 | Search bonuses (#8) | ⚠️ Acceptable | Move to record-category weight table |
| 8 | UI state strings (#9–11) | Low urgency | Extract to constants objects |
