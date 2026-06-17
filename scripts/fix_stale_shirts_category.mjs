#!/usr/bin/env node
/**
 * One-time migration: correct stale category = "Shirts" to "Tops" for six
 * catalogue items that were updated in data/wardrobe.js but never synced back
 * to Supabase.
 *
 * Affected items:
 *   breton-sailor-shirt, kataaze-knit-mock-neck-jumper, linen-camp-collar-shirt,
 *   ocbd-shirt, henley-knit-t-shirt, linen-loop-collar-shirt
 *
 * Layers patched:
 *   1. wardrobe_items rows          — SET category = 'Tops'
 *   2. wardrobe_app_state JSONB     — remove 'category' key from override patches
 *      (both archive_overrides and collection_overrides columns)
 *
 * Usage:
 *   node scripts/fix_stale_shirts_category.mjs [--dry-run]
 */

import { createClient } from "@supabase/supabase-js";
import { createServiceClient, loadEnvFile } from "./lib/supabase-env.mjs";

const DRY_RUN = process.argv.includes("--dry-run");
if (DRY_RUN) console.log("[dry-run] No writes will be performed.\n");

const AFFECTED_IDS = [
  "breton-sailor-shirt",
  "kataaze-knit-mock-neck-jumper",
  "linen-camp-collar-shirt",
  "ocbd-shirt",
  "henley-knit-t-shirt",
  "linen-loop-collar-shirt",
];

const { client: sb } = createServiceClient(createClient);

// ── 1. Audit wardrobe_items ─────────────────────────────────────────────────

console.log("=== wardrobe_items ===");
const { data: rows, error: rowsErr } = await sb
  .from("wardrobe_items")
  .select("id, category")
  .in("id", AFFECTED_IDS);

if (rowsErr) { console.error("wardrobe_items select failed:", rowsErr.message); process.exit(1); }

const before_items = {};
for (const row of rows ?? []) {
  before_items[row.id] = row.category;
  console.log(`  ${row.id}: category = ${JSON.stringify(row.category)}`);
}

const toUpdateItems = (rows ?? []).filter((r) => r.category !== "Tops");
if (!toUpdateItems.length) {
  console.log("  → All already 'Tops'. Nothing to update.\n");
} else {
  console.log(`  → ${toUpdateItems.length} row(s) need update: ${toUpdateItems.map((r) => r.id).join(", ")}\n`);
}

// ── 2. Audit wardrobe_app_state ─────────────────────────────────────────────

console.log("=== wardrobe_app_state ===");
const { data: state, error: stateErr } = await sb
  .from("wardrobe_app_state")
  .select("*")
  .eq("id", "default")
  .single();

if (stateErr && stateErr.code !== "PGRST116") {
  console.error("wardrobe_app_state select failed:", stateErr.message);
  process.exit(1);
}
if (!state) {
  console.log("  → No wardrobe_app_state row found. Nothing to patch.\n");
}

const OV_COLUMNS = ["collection_overrides", "archive_overrides"];

const staleOverridesByCol = {};
for (const col of OV_COLUMNS) {
  const ov = state?.[col];
  if (!ov || typeof ov !== "object") continue;
  const stale = [];
  for (const id of AFFECTED_IDS) {
    const patch = ov[id];
    if (patch && typeof patch === "object" && Object.prototype.hasOwnProperty.call(patch, "category")) {
      stale.push({ id, category: patch.category });
    }
  }
  if (stale.length) {
    staleOverridesByCol[col] = stale;
    for (const { id, category } of stale) {
      console.log(`  ${col}.${id}: category = ${JSON.stringify(category)}`);
    }
  } else {
    console.log(`  ${col}: no stale category overrides for affected items`);
  }
}
console.log();

// ── 3. Apply fixes ──────────────────────────────────────────────────────────

if (DRY_RUN) {
  console.log("[dry-run] Would apply the following changes:");
  if (toUpdateItems.length) {
    console.log(`  UPDATE wardrobe_items SET category='Tops' WHERE id IN (${toUpdateItems.map((r) => `'${r.id}'`).join(", ")})`);
  }
  for (const [col, stale] of Object.entries(staleOverridesByCol)) {
    console.log(`  UPDATE wardrobe_app_state: remove category from ${col} for [${stale.map((s) => s.id).join(", ")}]`);
  }
  process.exit(0);
}

// 3a. Fix wardrobe_items
if (toUpdateItems.length) {
  const { error: updateErr } = await sb
    .from("wardrobe_items")
    .update({ category: "Tops" })
    .in("id", toUpdateItems.map((r) => r.id));
  if (updateErr) { console.error("wardrobe_items update failed:", updateErr.message); process.exit(1); }
  console.log(`✓ wardrobe_items: updated ${toUpdateItems.length} row(s) to category='Tops'`);
} else {
  console.log("✓ wardrobe_items: no changes needed");
}

// 3b. Fix wardrobe_app_state JSONB columns
if (state && Object.keys(staleOverridesByCol).length) {
  const patch = {};
  for (const col of OV_COLUMNS) {
    const ov = state[col];
    if (!ov || typeof ov !== "object") continue;
    const stale = staleOverridesByCol[col];
    if (!stale?.length) continue;

    const updated = { ...ov };
    for (const { id } of stale) {
      const { category: _cat, ...rest } = updated[id] ?? {};
      if (Object.keys(rest).length > 0) {
        updated[id] = rest;
      } else {
        delete updated[id];
      }
    }
    patch[col] = updated;
  }

  if (Object.keys(patch).length) {
    const { error: patchErr } = await sb
      .from("wardrobe_app_state")
      .update(patch)
      .eq("id", "default");
    if (patchErr) { console.error("wardrobe_app_state update failed:", patchErr.message); process.exit(1); }
    console.log(`✓ wardrobe_app_state: removed stale category overrides from [${Object.keys(staleOverridesByCol).join(", ")}]`);
  }
} else {
  console.log("✓ wardrobe_app_state: no changes needed");
}

// ── 4. Verify ───────────────────────────────────────────────────────────────

console.log("\n=== Verification ===");

const { data: verifyRows, error: verifyRowsErr } = await sb
  .from("wardrobe_items")
  .select("id, category")
  .in("id", AFFECTED_IDS);

if (verifyRowsErr) { console.error("Verification failed:", verifyRowsErr.message); process.exit(1); }

let itemsOk = true;
for (const row of verifyRows ?? []) {
  const ok = row.category === "Tops";
  console.log(`  wardrobe_items.${row.id}: ${row.category} ${ok ? "✓" : "✗ STILL WRONG"}`);
  if (!ok) itemsOk = false;
}

const { data: verifyState } = await sb
  .from("wardrobe_app_state")
  .select("collection_overrides, archive_overrides")
  .eq("id", "default")
  .single();

let stateOk = true;
for (const col of OV_COLUMNS) {
  const ov = verifyState?.[col];
  if (!ov || typeof ov !== "object") continue;
  for (const id of AFFECTED_IDS) {
    const patch = ov[id];
    if (patch && typeof patch === "object" && Object.prototype.hasOwnProperty.call(patch, "category")) {
      console.log(`  wardrobe_app_state.${col}.${id}: category still present ✗`);
      stateOk = false;
    }
  }
}
if (stateOk) console.log("  wardrobe_app_state overrides: no stale category keys ✓");

console.log();
if (itemsOk && stateOk) {
  console.log("Migration complete. All layers agree on category='Tops'.");
  console.log("Run 'npm run db:backup' to refresh data/local/backup-*.json.");
} else {
  console.error("Migration incomplete — review errors above.");
  process.exit(1);
}
