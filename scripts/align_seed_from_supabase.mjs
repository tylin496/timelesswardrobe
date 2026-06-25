#!/usr/bin/env node
/**
 * Align data/wardrobe.js metadata to the live online truth
 * (wardrobe_items + collection_overrides), WITHOUT changing any local image URL.
 *
 * Why: the seed is a frozen snapshot but the cloud keeps changing, so the seed's
 * metadata drifts. db:freeze-catalogue only reads wardrobe_items and never sees
 * collection_overrides (admin edits like the "Future Piece" marker live there), so
 * those edits never reach the seed. This pipeline re-derives each piece's metadata
 * the way the running app does, but keeps image / gallery / colourVariants from the
 * existing seed (images are local-first and admin-maintained).
 *
 *   node scripts/align_seed_from_supabase.mjs --dry-run   # show metadata diffs only
 *   node scripts/align_seed_from_supabase.mjs             # write data/wardrobe.js
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { formatWardrobeJsFile } from "./lib/cloud-to-seed.mjs";
import { alignedSeedItem, diffSeedMetadata } from "./lib/align-seed-metadata.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

/** Read the existing seed array out of data/wardrobe.js without importing it. */
function loadExistingSeed(wardrobeJsPath) {
  const src = fs.readFileSync(wardrobeJsPath, "utf8");
  // The file ends with `const WARDROBE_ITEMS = [ … ];` and no export.
  const items = new Function(`${src}\n;return typeof WARDROBE_ITEMS !== "undefined" ? WARDROBE_ITEMS : null;`)();
  if (!Array.isArray(items)) throw new Error("Could not parse WARDROBE_ITEMS from data/wardrobe.js");
  return items;
}

loadEnvFile();
const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const client = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const wardrobeJsPath = path.join(root, "data", "wardrobe.js");
const localSeed = loadExistingSeed(wardrobeJsPath);
const localById = new Map(localSeed.map((it) => [String(it.id), it]));

const { data: rows, error } = await client.from("wardrobe_items").select("*").order("id");
if (error) {
  console.error("Fetch wardrobe_items failed:", error.message);
  process.exit(1);
}
if (!rows || !rows.length) {
  console.error("No rows in wardrobe_items — refusing to overwrite seed.");
  process.exit(1);
}

const { data: stateRow, error: stateErr } = await client
  .from("wardrobe_app_state")
  .select("collection_overrides")
  .limit(1)
  .maybeSingle();
if (stateErr) {
  console.error("Fetch wardrobe_app_state failed:", stateErr.message);
  process.exit(1);
}
const overrides =
  stateRow && stateRow.collection_overrides && typeof stateRow.collection_overrides === "object"
    ? stateRow.collection_overrides
    : {};

const aligned = [];
const allDiffs = [];
for (const row of rows) {
  const id = String(row.id ?? "").trim();
  if (!id) continue;
  const local = localById.get(id) || null;
  const patch = overrides[id] || null;
  const next = alignedSeedItem(row, patch, local);
  if (!next) continue;
  aligned.push(next);
  if (local) {
    const diffs = diffSeedMetadata(local, next);
    if (diffs.length) allDiffs.push({ id, diffs });
  } else {
    allDiffs.push({ id, diffs: [{ field: "(new piece)", from: null, to: next.brand }] });
  }
}

// Report.
console.log(`wardrobe_items: ${rows.length}  |  overrides: ${Object.keys(overrides).length}  |  seed pieces: ${localSeed.length}`);
console.log(`Pieces with metadata changes: ${allDiffs.length}\n`);
for (const { id, diffs } of allDiffs) {
  console.log(`• ${id}`);
  for (const d of diffs) {
    const from = JSON.stringify(d.from);
    const to = JSON.stringify(d.to);
    console.log(`    ${d.field}: ${from} -> ${to}`);
  }
}

if (DRY_RUN) {
  console.log(`\n[dry-run] No files written. Re-run without --dry-run to apply.`);
  process.exit(0);
}

if (aligned.length < localSeed.length) {
  console.error(
    `\nRefusing to write: aligned ${aligned.length} < existing seed ${localSeed.length}. Cloud may be partial.`
  );
  process.exit(1);
}

const frozenAt = new Date().toISOString();
const stamp = frozenAt.replace(/[:.]/g, "-").slice(0, 19);
const backupPath = path.join(root, "data", `wardrobe.js.backup-${stamp}`);
fs.copyFileSync(wardrobeJsPath, backupPath);
fs.writeFileSync(wardrobeJsPath, formatWardrobeJsFile(aligned, frozenAt), "utf8");
console.log(`\nBacked up → ${path.relative(root, backupPath)}`);
console.log(`Wrote ${aligned.length} pieces → ${path.relative(root, wardrobeJsPath)} (images preserved).`);
console.log("Next: review the diff and commit data/wardrobe.js.");
