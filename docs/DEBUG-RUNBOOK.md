# Debug Runbook — symptom → layer → first file to read

For a cold session. Each row: what you see → which layer owns it → where to look
first. Stop reading app.js top-to-bottom; go directly to the anchor.

Companion: [ARCHITECTURE.md](ARCHITECTURE.md) (data flow), [DATA-CONTRACT.md](DATA-CONTRACT.md) (field ownership).

---

## Data / state bugs

| Symptom | Layer | First anchor | Notes |
|---|---|---|---|
| Grid shows stale / wrong item data after an edit | Merge | `mergeWardrobeFromSources` app.js:10145 | Check that `upsertWardrobeBaseRowInMemory` was called after save and that `items` array was rebuilt. |
| An item is missing from the grid entirely | Merge + hidden-ids | `loadCollectionHiddenIds` app.js:10108 → `mergeWardrobeFromSources` app.js:10145 | Item may be in `collection_hidden_ids`. Check Supabase `wardrobe_app_state`. |
| Edit form saves but changes don't appear | Save path | `saveItemDetailEdit` app.js:24336 → `saveWardrobeItemToCloud` app.js:9553 → `upsertWardrobeBaseRowInMemory` app.js:3026 | Confirm the cloud upsert returned successfully and the in-memory row was updated. |
| A field value is lost after save (e.g. measurements) | Serialization | `itemToCloudRow` app.js:8398 → `pickWardrobeItemsUpsertPayload` app.js:8378 | Check that the field is in `WARDROBE_ITEMS_UPSERT_KEYS_UK` (app.js:8314). Fields not in that list are silently dropped. |
| Measurement unit embedded in value on edit form load | Clean step | `cleanMeasurementRows` app.js:6458 | Strips trailing " mm" / " cm" etc. from value strings on load. If unit still shows in value, the data has a format `cleanMeasurementRows` doesn't handle. |
| Showcase order is wrong / changed unexpectedly | Showcase | `getShowcaseItems` app.js:7922 → `showcase_order` column | Canonical order is `showcase_order` integer. `metadata.showcase_rank` is legacy/ignored for ordering. |
| Notes not updating | Notes path | Notes editor save (separate from item editor) → `notes_updated_at` | Notes save is a separate path from the main item edit form. `notes_updated_at` is set only by the notes path. |
| Image shows wrong photo | Image resolution | `coverResolutionCache` + seed `wardrobe.js` | Images come from seed, not cloud. If image is wrong, the seed row is wrong. Cloud `image` column is ignored at read (see ARCHITECTURE.md). |

---

## Sort / filter bugs

| Symptom | Layer | First anchor | Notes |
|---|---|---|---|
| Sort by price/date does nothing | Sort | `compareGridItems` app.js:22120 | Check `collectionSortMode` (app.js:6396). Is it being persisted/loaded correctly from localStorage? |
| Items in wrong order in default view | Sort | `compareCollectionGridItems` app.js:22148 → `compareArchiveItems` | Default = showcase_order first, then `compareArchiveItems` (category ladder). |
| Filter by category not working | Filter | `subcategoryFilters` Set + grid rebuild | The filter drives `subcategoryFilters.size > 0` inside `compareCollectionGridItems`. |
| Showcase-only filter shows wrong items | Filter | `isInShowcase` → `showcase_order != null` | An item is in showcase iff `showcase_order` is a non-null integer. |
| Search returns unexpected items | Search | `wardrobeSearchIndex` Map (app.js:9586) → rebuilt in `mergeWardrobeFromSources` | The haystack is a pre-built normalized string per item. If an item is missing from search, its haystack string may be empty. |

---

## UI / rendering bugs

| Symptom | Layer | First anchor | Notes |
|---|---|---|---|
| Collection grid not repainting | Grid | `renderCollectionGridSkeleton` app.js:22501 → grid rebuild | Check `wardrobeRevision` increment. Grid skeleton shows until `items` is populated. |
| Item detail page blank / wrong item | PDP | `renderItemDetailContent` app.js:25210 → `itemDetailMountRoot` app.js:12432 | PDP pulls from `itemById` Map (app.js:9611). If item isn't there, merge hasn't run yet or the id is wrong. |
| Homepage hero not mounting | Homepage | `mountHomePageHero` app.js:12222 | Check `isSiteHomePage` guard (app.js:26429). |
| Rail scrolling broken / progress bar missing | Rail | `wireHorizontalRailScroller` app.js:11564 → `prepareHomeHorizontalRailScroller` app.js:11535 | See [CONVENTIONS.md → Rails](CONVENTIONS.md#rails-horizontal-card-scrollers). The #1 bug is missing `scroll-padding-inline-start`. |
| Mobile nav sidebar not opening/closing | Nav | mobile nav drill portal (`site-mobile-nav-drill-portal`) | The portal uses `position:fixed; transform:translate3d(100%,0,0)`. Its painted area at x=390–780 can cause `body.scrollWidth:780`; `overscroll-behavior-x:none` on body blocks iOS horizontal rubber-band bounce. |
| CSS change has no effect | CSS pipeline | `styles.css` (built output) | Never edit `styles.css`. Edit `css/main.css` then `npm run css:build`. If change still doesn't appear, confirm `styles.css` was rebuilt (`git diff styles.css`). |
| Token resolves to wrong value | CSS tokens | `css/main.css` `:root` block (line ~25) | Check that the token is defined in `:root`. Undefined tokens resolve to empty → fall back to inherited value (not the initial value of the property). Example: `--paper` was undefined → `color:var(--paper)` inherited `--ink`. |
| Safe-area / notch jump on scroll | iOS | `env(safe-area-inset-*)` | These change mid-scroll on iOS. Never use them in properties that drive layout mid-scroll (e.g. sticky positioning). See `npm run lint:insets`. |

---

## Network / Supabase bugs

| Symptom | Layer | First anchor | Notes |
|---|---|---|---|
| Edits not persisting to cloud | API | `saveWardrobeItemToCloud` app.js:9553 | Check browser network tab for failed upsert. Auth token may be expired; RLS may block the write. |
| Cloud fetch returns stale data | Deferred fetch | `refreshHybridCloud…` (search "refreshHybrid" in app.js) | The deferred fetch hydrates `wardrobeBase` after first paint. If data looks stale, the fetch may have failed silently. Check network tab. |
| R2 image upload fails | Upload | `uploadWardrobeImageFileToCloud` app.js:8573 → `R2_UPLOAD_WORKER_URL` | Worker URL: `timeless-wardrobe-upload.tylin496.workers.dev`. 401 = no auth header sent. OPTIONS must advertise DELETE. |

---

## Where NOT to look first

- **`collection_overrides` apply logic** — there is none. Dead on read since Jun 2026.
- **`editorial-priorities` / `featured_rank`** — fully deleted Jun 2026.
- **`archive_overrides`** — old column name; renamed to `collection_overrides`, then retired.
- **`section` / `pillar` fields** — legacy, not rendered in UI.
- **`measuredDimensions` string** — derived at upsert; source of truth is `measurementRows`.
