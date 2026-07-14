# Handoff — Data-Pipeline Audit (roadmap item "single flow")

> **✅ RESOLVED 2026-07-14.** All three actions in §4 are done. The decision the
> handoff left open (§4.2) was made: **stop depending on line numbers, don't build a
> line-number checker.** Every `app.js:<line>` anchor across the map docs was removed
> and re-expressed as a symbol name (`` `mergeWardrobeFromSources` (app.js) `` — grep
> it). New guard `scripts/check-doc-anchors.mjs` (`npm run check:doc-anchors`, wired
> into the `npm run check` pre-commit hook) **bans line-number anchors** and **verifies
> every symbol anchor still resolves** in app.js. ARCHITECTURE.md prose re-confirmed
> against the 48-line merge. The pipeline chapter is closed; only the optional roadmap
> tails in §5 remain. The line numbers quoted below are the historical drift evidence
> that motivated the fix — the guard exempts this HANDOFF file so they can stand.

**For:** a cold Claude session picking up the last structural roadmap item.
**Written:** 2026-07-14, verified against HEAD (`app.js` = 31302 lines).
**TL;DR:** The pipeline restructuring is already **done**. What's left is not
"shorten the merge" — it's **the orientation docs have silently drifted, and
nothing detects it.** Fix the drift, then add a guard so it can't rot again.

---

## 1. What you were probably told to expect (and why it's wrong)

Old framing (memory [[project-architecture-debt]] ③): *"a single item passes
through seed → cloud → override → local cache → merge → wardrobeBase; the
5-source merge is too long, hard to debug."*

That was true in Jun 2026. It is **no longer true.** The `collection_overrides`
layer was neutered, parity-verified, and its column dropped (roadmap steps 6–7,
migration `20260630120000_drop_unused_columns.sql`). Do not "fix" a 5-source
merge — go read the actual one first.

## 2. The actual merge today — verified

`mergeWardrobeFromSources()` — **`app.js:10152`** (48 lines, one choke point).
It is short and honest. Current flow:

```
wardrobeBase (seed rows, already cloud-metadata-aligned)   app.js:7207 decl
   │  filter out collection_hidden_ids  (wardrobe_app_state)
   │  stamp __collectionOrdinal
   ▼
dedupe vs custom items:
   hybrid-local ON  → [...base, ...filterCloudRowsForHybridCatalogue(cloud custom)]
   cloud mode       → [...base]
   offline          → [...loadCustomItems(), ...base]
   ▼
normalize derived fields + is_future = deriveItemIsFuture(out)   ← the projection
   ▼
items   (the single read model the whole UI renders from)
```

Real remaining sources feeding the model: **seed** (`data/wardrobe.js`, image
truth) · **cloud `wardrobe_items`** metadata (aligned into `wardrobeBase`
*before* this fn) · **`collection_hidden_ids`** · **cloud/local custom items**.
`is_future` is derived here, not stored — the ownership-status migration
([[project-ownership-status-migration]]) already moved that off text-scanning.

**Conclusion:** the merge itself needs no restructuring. Steps 0–8 of the
roadmap are done; steps 9–11 were deliberately DECLINED (see roadmap memory).

## 3. The real open problem — doc drift with zero guard

The AI-maintainer strategy leans on orientation docs that carry hardcoded
`app.js:<line>` anchors — **48 anchors across five docs**, nothing checks them,
and they have rotted. Extract the full inventory with:

```sh
for f in docs/*.md; do grep -Hno "app\.js:[0-9]\+" "$f"; done   # excludes this handoff
```

Distribution (HEAD, 2026-07-14): **`DEBUG-RUNBOOK.md` 25** (by far the biggest —
do not skip it), `ARCHITECTURE.md` 7, `DATA-CONTRACT.md` 4,
`TEXT-LOGIC-INVENTORY.md` 11, `SEARCH-OVERLAY-COLLAPSE.md` 1. Confirmed rot:

| Doc claim | Cited | Actual (HEAD) | Drift |
|---|---|---|---|
| `mergeWardrobeFromSources()` def | `app.js:10633` | `app.js:10152` | **−481** |
| `wardrobeBase` declared | `app.js:7170` | `app.js:7207` | −37 |
| cloud-align steps | `app.js:31332/31360/31866` | **past EOF (31302)** | **dangling** |

For a cold Claude, a stale anchor is not cosmetic — it is an **active trap**
(the governing lens in [[project-refactor-roadmap]]: Claude pattern-matches on
anchors and jumps to the wrong code). This is now the highest-leverage,
lowest-risk work on the pipeline.

## 4. What to actually do (in order)

1. **Refresh the anchors.** Re-verify every `app.js:<line>` from the extraction
   command above against HEAD and correct it — all 48, across the five docs
   (`DEBUG-RUNBOOK.md` holds 25, so start there). Most drift is uniform (content
   shifted down), so a re-grep per symbol is fast.
2. **Add `check:doc-anchors` to the invariant suite.** A ~30-line
   `scripts/check-doc-anchors.mjs`: parse `app.js:<line>` (and `:line` on
   markdown file links) from `docs/*.md`, fail if any line is past EOF **or**
   the referenced symbol name in the doc's surrounding text no longer appears on
   that line. Wire into `npm run check` (already a pre-commit hook as of
   `cfbf0b1`). This is a textbook Architecture-Guardian invariant
   ([[feedback-architecture-guardian]]): cheap, objective, kills the whole
   "docs silently lie" bug class forever. *Design choice to make:* line-exact
   anchors are brittle by nature — consider whether the guard should instead
   push docs toward symbol-name references (grep-stable) and keep line numbers
   only where they add value. Decide, don't just patch.
3. **Verify `ARCHITECTURE.md`'s prose still matches §2 above** — the merge
   description there predates the column drop in wording spots; confirm the
   "Layer ownership" table and data-flow ASCII still describe today's 48-line fn.

## 5. Genuinely-open roadmap tails (low priority, optional)

From [[project-refactor-roadmap]] PENDING — real but not urgent:
- **Step 10 (validation gate):** ✅ done cheaply (2026-07-14). Rather than the full
  editor→validate→write layer (which needed the DECLINED Step 9 Repository move), a
  minimal write-invariant gate now sits at the one canonical write,
  `saveWardrobeItemToCloud` (app.js): it refuses any item with a blank `id` or `name`
  (id = PK + image folder + slug; blank name = empty card). Covers every caller, not
  just the item-edit form. Field-level sanitisation (price → number-or-null, etc.)
  already lived in the form + `itemToCloudRow`.
- **Step 8 edge cases:** ✅ flash reduced (2026-07-14). `reconcileItemDetailPageAfterCloudFetch`
  (app.js) used to `innerHTML = ""` + full rebuild on every cloud fetch, even when the
  hydrated item matched the seed-painted one (the common case — images come from the
  seed). It now compares an `itemDetailDisplaySignature` (whole item minus `__`-prefixed
  volatile keys) stamped at first paint, and skips the teardown when nothing the page
  shows changed. Genuine metadata changes still re-render; uncomputable signature falls
  back to the old always-render. Note: the signature is per-item, so it does not re-render
  the related-items rail if the *catalogue pool* grows (custom items arriving) without this
  item changing — acceptable, pre-existing, non-critical; narrow-fix only if reported.

## 6. Where NOT to look / do not do

- Do **not** reintroduce or hunt for `collection_overrides` — dead, dropped,
  gone. Read paths removed.
- Do **not** split `app.js` (Step 11) or lift inline `supabaseClient.from(...)`
  into the module (Step 9). Both DECLINED with reasons in the roadmap memory;
  re-declining wastes a session.
- Do **not** touch image URLs — seed is sole image truth
  ([[project-cover-images-local-only]]); the merge never takes a cloud image.

**Definition of done for this item:** docs' anchors match HEAD, a machine check
prevents re-drift, and `ARCHITECTURE.md` §"Data flow" describes the real
48-line merge. That closes the pipeline chapter — not more refactoring.
