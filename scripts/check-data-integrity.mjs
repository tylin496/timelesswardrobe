#!/usr/bin/env node
/**
 * Minimal data-integrity invariants for the seed catalogue (data/wardrobe.js).
 *
 * This is the "runnable ground truth" guard: after any edit to the catalogue,
 * `npm run check:data` answers — without reading app.js or guessing — whether the
 * row set is still structurally valid. See docs/DATA-INVARIANTS.md for the full
 * map of what every data check guarantees and what a failure means.
 *
 * Scope here is deliberately narrow: invariants that run on committed local data
 * with NO network and NO build artifact. Two checks live here today:
 *
 *   1. No duplicate `id`. Ids are immutable surrogate keys (PK + outfit_items FK
 *      + image-folder name + URL slug). check:id-drift compares id *sets* against
 *      the lock, so a true duplicate inside the seed is silently swallowed there —
 *      this catches it. A dup means two rows fight over one folder/slug/FK target.
 *   2. Required identity fields present and non-empty: id, category, name.
 *      A row missing one of these renders as a broken/empty card and breaks
 *      grouping and routing. `brand` is intentionally NOT required: it represents
 *      the maker only and is legitimately empty when the maker is unknown (e.g.
 *      aspirational/future pieces). Ownership is an independent fact stored in
 *      metadata.ownership_status — never inferred from brand. See
 *      [[project-ownership-status-migration]] / docs/DATA-INVARIANTS.md.
 *
 * Deferred (documented in docs/DATA-INVARIANTS.md, not yet enforced here):
 *   - showcase order integrity (unique, dense 0..N, no orphans) — needs the baked
 *     showcase artifact / Supabase, which this network-free check must not touch.
 *   - no cloud-hosted cutout cover — needs the cover-path convention.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wardrobePath = path.join(root, "data", "wardrobe.js");

const REQUIRED_FIELDS = ["id", "category", "name"];

function loadWardrobeItems() {
  const source = fs.readFileSync(wardrobePath, "utf8");
  return vm.runInNewContext(`${source}\n;WARDROBE_ITEMS;`, Object.create(null), {
    filename: wardrobePath,
  });
}

const items = loadWardrobeItems();
const errors = [];

// 1. Duplicate ids.
const seen = new Map(); // id -> first index
items.forEach((item, index) => {
  const id = String(item?.id ?? "").trim();
  if (!id) return; // emptiness is caught by the required-fields check below
  if (seen.has(id)) {
    errors.push(`duplicate id "${id}" at items[${index}] (first seen at items[${seen.get(id)}])`);
  } else {
    seen.set(id, index);
  }
});

// 2. Required identity fields present and non-empty.
items.forEach((item, index) => {
  for (const field of REQUIRED_FIELDS) {
    const value = String(item?.[field] ?? "").trim();
    if (!value) {
      const label = String(item?.id ?? "").trim() || `items[${index}]`;
      errors.push(`${label}: missing/empty required field "${field}"`);
    }
  }
});

if (errors.length) {
  console.error(`Data integrity check failed (${errors.length} issue(s)) in data/wardrobe.js:\n`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error("\nSee docs/DATA-INVARIANTS.md for what each invariant guards.");
  process.exit(1);
}

console.log(`OK - data integrity (${items.length} items): unique ids, required fields present.`);
