# Notes Architecture Proposal

> Status: **decision document — no code changes proposed yet.**
> Purpose: decide what Notes *are* before making any incremental schema change.
> Date: 2026-06-25.

The question this document exists to answer:

> **Should Notes remain annotations attached to items, or become first-class
> archive entities?**

Everything below is in service of that one decision. The recommendation is in §6.

---

## 1. Current model

### 1.1 What exists today

A note is **a single free-text `text` column on a parent row.** It has no
identity of its own.

```text
wardrobe_items.notes : text   -- one note string per item
outfits.notes        : text   -- one note string per saved outfit
```

This is the first important fact: **"notes as a string field" already exists in
two places**, added independently —
`20260622140000_wardrobe_items_timestamps.sql` (items carry `notes`) and
`20250519120000_add_notes_to_outfits.sql` (outfits gained their own `notes`,
`default ''`). They share a name and a shape but nothing else: no common table,
no common code path, no common UI. The annotation pattern has already started to
sprawl.

### 1.2 How it behaves

- **Cardinality is 1:1 and forced.** An item has exactly zero-or-one note. You
  cannot write two notes on one item (e.g. "condition log" *and* "styling idea").
- **A note has no metadata of its own.** No id, no title, no author, no type, no
  tags. It is a string.
- **A note has no timestamp of its own.** It borrows the parent's `updated_at`.
  `wardrobe_items` has a server-authoritative `updated_at` trigger (indexed
  `updated_at desc`), but that stamp moves whenever *any* field on the item
  changes — price, measurements, image — not just the note. So Overview's
  "Recently Updated Notes" (`Recently Updated Notes` (app.js) block) ranks by item churn, not note edits.
- **Discoverability is substring search.** The Notes tab filters by
  `name + brand + category + notes` substring (`getFilteredNotesItems` (app.js)). There are no
  tags, facets, or structure to search *by*.
- **Sorting proxies for quality.** The three sorts are `A–Z`,
  `Recently edited`, `Longest first` (`_accountNotesSort` (app.js)). "Longest first" is the
  tell: with no quality or type signal on a note, word-count is the only
  available proxy for "substantial."
- **No relationships.** A note cannot reference another note, cannot be attached
  to a brand or a collection, and the item-note and outfit-note worlds never meet.

### 1.3 What the schema *already* proves is possible

The relational machinery a richer Notes model would need is **already in the
codebase**, used elsewhere:

- `outfit_items(outfit_id, item_id, sort_order, colour_key)` is a working
  many-to-many join table. The pattern "an entity links to many items with
  per-link metadata" is established and understood here.
- `wardrobe_items` already has the `tw_set_updated_at()` trigger + indexes — the
  template for server-authoritative timestamps on any new table.

So the Archive model below is not exotic for this codebase; it reuses patterns
that already ship.

---

## 2. Annotation model (keep today's shape)

**Definition:** a note stays a `text` field hanging off a parent row. We invest
only in the editor/UX around it, never in giving the note its own identity.

### 2.1 Benefits

- **Zero migration, zero new surface.** Nothing to back-fill, no new table, no
  new RLS policy, no new sync path. The cheapest possible posture.
- **Mental model is trivial.** "Each item has a notes box." Every user and every
  future maintainer understands it in one sentence.
- **Editorially weightless.** There is nothing to curate. You type in a box; it
  saves. No tagging discipline, no taxonomy to maintain, no orphan cleanup.
- **Matches the project's stated restraint.** The motion/color/layout direction
  is "catalogue restraint, stillness is the edge." An annotation box is the most
  restrained possible Notes feature.

### 2.2 Limitations

- **One note per parent, forever.** No separating "provenance / condition log /
  styling idea / wear history" — they all mash into one string.
- **Cannot note things that aren't items or outfits.** No brand notes, no
  collection notes, no free-standing essay ("why I buy Italian shoulders").
- **No real cross-linking.** The memory-stated goals — Brand↔Notes,
  Related notes, Item↔Notes as a relation — are structurally impossible without
  an entity to hang the relation on.
- **Discoverability is capped at substring.** You can never browse notes *by
  theme*, only grep them.
- **The two `notes` columns will keep diverging.** Each new "thing that needs a
  note" (a brand page? a lookbook?) tempts another ad-hoc `notes text` column,
  each with its own editor and search. Entropy, not architecture.

### 2.3 Long-term implications

Annotation is a **ceiling, not a floor.** It is genuinely sufficient if Notes
are meant to be *captions* — short context attached to a thing you're already
looking at. It will never become an *archive* — a browsable, linkable body of
writing that has value independent of the item you happened to be on. Choosing
annotation is choosing that Notes are captions and accepting that ceiling
permanently. That is a legitimate choice, not a failure — but it should be made
on purpose, not by default.

---

## 3. Archive model (promote note to entity)

**Definition:** a note becomes its own row with its own identity, able to attach
to any subject (item, brand, outfit, collection) and to carry metadata.

### 3.1 Note as entity

```text
notes
  id            uuid pk
  body          text            -- the writing
  title         text null       -- optional; absence is meaningful (= caption)
  kind          text            -- 'general' | 'provenance' | 'condition'
                                --  | 'styling' | 'essay'  (small closed vocab)
  created_at    timestamptz     -- own lifecycle
  updated_at    timestamptz     -- own trigger, NOT the parent's
  archived_at   timestamptz null
```

The single most important property: **a note now has its own `updated_at`.**
That is the thing the current model cannot express, and the reason Overview's
"recently updated notes" lies today.

### 3.2 Note ownership

A note belongs to the wardrobe owner (the single-user archive). Ownership is not
the interesting axis here — *subject* is. (RLS mirrors the existing
`wardrobe_editors` allowlist; no new auth concept.)

### 3.3 Note relationships

Reuse the proven `outfit_items` join-table pattern. A note attaches to **one or
more subjects** of mixed type:

```text
note_links
  note_id     uuid fk -> notes.id
  subject_type text   -- 'item' | 'brand' | 'outfit' | 'collection'
  subject_id   text   -- wardrobe_items.id, a brand slug, outfits.id, …
  pk (note_id, subject_type, subject_id)
```

This single table delivers, with no further structure, the entire memory wish
list:

- **Item↔Notes** — many notes per item (`subject_type='item'`), removing the 1:1
  cap.
- **Brand↔Notes** — `subject_type='brand'`, finally notable without inventing a
  Brand table (brands are slugs today).
- **Outfit↔Notes** — folds the orphaned `outfits.notes` column into the same
  system instead of a parallel one.
- **Collection↔Notes** — `subject_type='collection'` for showcase/theme essays.
- **Related notes** — two notes sharing a subject are, by definition, related; no
  extra structure needed for a first cut.

### 3.4 Metadata

`kind` (closed vocabulary) + optional `title`. Deliberately *small* — see Risks.
The point is to give Notes tab a real facet to sort/filter by, replacing the
"Longest first" word-count proxy with "show me condition logs."

### 3.5 Timestamps

Own `created_at` / `updated_at`, stamped by a trigger cloned from
`tw_set_updated_at()`. Overview's "Recently Updated Notes" becomes truthful for
free, because the timestamp now means what the label says.

### 3.6 Tags

**Phase 2, explicitly deferred.** `kind` covers the 80% need. Free-form tags add
a taxonomy-maintenance burden (see §5) and should not be in the first cut. A
`note_tags` table can follow once `kind` proves the facet model is wanted.

### 3.7 Links to items, brands, outfits, collections

All four are the same mechanism — rows in `note_links` differing only by
`subject_type`. No per-subject special-casing. This is the model's main payoff:
one relationship table replaces both today's `notes` columns *and* every future
one we'd otherwise be tempted to add.

---

## 4. Migration strategy

The migration is unusually safe because the source data is small and additive.

1. **Add, don't move.** Create `notes` + `note_links`. Leave
   `wardrobe_items.notes` and `outfits.notes` in place, untouched.
2. **Back-fill** (one idempotent SQL pass):
   - For each `wardrobe_items` row with non-empty `notes`: insert one `notes`
     row (`kind='general'`, `created_at`/`updated_at` ← item's `updated_at`) and
     one `note_links` row (`subject_type='item'`, `subject_id=item.id`).
   - Same for each `outfits` row with non-empty `notes`
     (`subject_type='outfit'`). This is where the two divergent columns finally
     converge into one model.
3. **Dual-read, single-write window.** New Notes UI reads/writes the `notes`
   table. The old columns are kept readable as a fallback during one release so
   nothing regresses if a path is missed.
4. **Verify, then retire.** Once parity is confirmed, the old columns become
   dead (a future cleanup batch — they slot naturally alongside the existing
   "legacy retirement batch" the project already tracks). The string columns are
   *never edited again* after cutover; they're frozen evidence until deletion.

No data is at risk at any step: every transform is additive and the originals
remain the source of truth until explicitly retired.

---

## 5. Risks

### 5.1 Complexity

- Two new tables, a trigger, RLS policies, and a join-aware read path in
  `supabase-client.js` (which today selects flat columns). The Notes tab editor
  moves from "bind a textarea to one field" to "render a list of note entities
  with subjects." This is the real cost and it is not trivial.
- Mitigation: the join pattern (`outfit_items`) and the trigger
  (`tw_set_updated_at`) already exist to copy. We are not inventing, we are
  duplicating known-good patterns.

### 5.2 Maintenance burden

- A second entity type with its own sync, its own RLS, its own bake/cold-start
  considerations (cf. showcase-order). Every future "where do notes show up"
  question now has a real answer to maintain.
- Orphan management: a note whose only subject is deleted needs a policy
  (cascade-delete the link; soft-orphan the note vs. delete it).

### 5.3 Editorial overhead

- **This is the most underrated risk.** An archive only has value if it is
  *kept*. The moment notes have `kind` and multiple-per-item, there is curation
  work: choosing the right kind, deciding what deserves a note, periodically
  pruning. Annotation has *zero* such overhead; Archive imports the same
  upkeep cost that any real archive carries.
- For a single-user wardrobe, ask honestly: will the notes actually be written
  and maintained at archive quality, or will the structure sit mostly empty —
  in which case the annotation box was the right size all along?

---

## 6. Recommendation

**Adopt the Archive model — but commit to it as a decision, not as code, today,
and gate the build behind one honest test.**

The reasoning:

1. **The annotation model is already failing quietly.** Two `notes` columns
   exist, added independently, with nothing in common. That is not a stable end
   state; it is the first two data points of a sprawl. Every future notable
   surface (brands, collections) will either get its own orphan column or be
   left un-notable. Archive stops that by giving every subject the *same* notes
   mechanism.

2. **The stated goals are only reachable in the Archive model.** Brand↔Notes,
   Related notes, multiple notes per item — these are not UX polish on top of the
   current model; they are structurally impossible without an entity. If those
   goals are real (they're in the project's own memory as "Notes' long-term
   potential"), the decision is already implied.

3. **The cost is honest and bounded.** Migration is additive and safe; the
   patterns are already in the repo. The risk that actually matters is §5.3
   *editorial overhead*, not technical complexity.

So the recommendation is conditional, and the condition is the §5.3 question:

> **Will these notes be written and kept at archive quality?**
>
> - **Yes / "I want Notes to be the thing I come back to read"** → build Archive.
>   The annotation ceiling is the wrong ceiling and you'll hit it fast.
> - **No / "Notes are context I glance at while looking at an item"** → stay
>   annotation. Spend the saved effort on the editor UX instead, and accept the
>   ceiling deliberately.

My read, from how Notes have been described as the most under-designed,
highest-potential surface: the intent is Archive. **The thing blocking a `yes`
is not architecture — it's whether the writing habit will exist to fill it.**
That is a question only the owner can answer, and it should be answered before
the first migration, because the schema is cheap to build and expensive to keep
half-empty.

### If "yes": the correct first move

Not `notes_updated_at` (that's patching the annotation model we'd be leaving).
The first move is the **`notes` + `note_links` tables with the additive
back-fill (§4 steps 1–2)** — stand up the entity, migrate the existing strings
into it read-only, and *then* build the new Notes tab against it. The truthful
"recently updated" timestamp falls out for free, which is why the symptom-fix
was never worth doing on its own.

### If "no": the correct first move

Stop here. Do nothing to the schema. Treat the two `notes` columns as the final
form, and the only follow-up is editor/UX polish on the existing annotation box.
