#!/usr/bin/env node
/**
 * Clear image/gallery/__mediaEditedAt from Supabase archive_overrides for given item IDs.
 * Usage: node scripts/clear-wardrobe-media-overrides.mjs <id1> <id2> ...
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const env = Object.fromEntries(
  readFileSync(resolve(root, ".env"), "utf8")
    .split("\n")
    .filter((l) => l.includes("=") && !l.startsWith("#"))
    .map((l) => l.split("=").map((s) => s.trim()))
    .filter(([k]) => k)
    .map(([k, ...v]) => [k, v.join("=")])
);

const ids = process.argv.slice(2).filter(Boolean);
if (!ids.length) process.exit(0);

const sb = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY
);

// 1. Clear archive_overrides (wardrobe_app_state)
const { data, error } = await sb
  .from("wardrobe_app_state")
  .select("archive_overrides")
  .eq("id", "default")
  .single();

if (error) { console.error("Supabase error:", error.message); process.exit(1); }

const overrides = data.archive_overrides ?? {};
let clearedOverrides = 0;

for (const id of ids) {
  const item = overrides[id];
  if (!item || (!item.image && !item.gallery && !item.__mediaEditedAt)) continue;
  delete item.image;
  delete item.gallery;
  delete item.__mediaEditedAt;
  clearedOverrides++;
  console.log(`  cleared archive_override media: ${id}`);
}

if (clearedOverrides > 0) {
  const { error: updateError } = await sb
    .from("wardrobe_app_state")
    .update({ archive_overrides: overrides })
    .eq("id", "default");
  if (updateError) { console.error("Supabase update error:", updateError.message); process.exit(1); }
}

// 2. Clear wardrobe_items.image / gallery for affected ids
const { data: rows, error: rowsError } = await sb
  .from("wardrobe_items")
  .select("id, image, gallery")
  .in("id", ids);

if (rowsError) { console.error("wardrobe_items fetch error:", rowsError.message); process.exit(1); }

let clearedItems = 0;
for (const row of (rows ?? [])) {
  const hasImage = Boolean(row.image);
  const hasGallery = Array.isArray(row.gallery) && row.gallery.length > 0;
  if (!hasImage && !hasGallery) continue;
  const { error: rowErr } = await sb
    .from("wardrobe_items")
    .update({ image: null, gallery: null })
    .eq("id", row.id);
  if (rowErr) { console.error(`wardrobe_items update error (${row.id}):`, rowErr.message); }
  else { console.log(`  cleared wardrobe_items media: ${row.id}`); clearedItems++; }
}

if (clearedOverrides === 0 && clearedItems === 0) { process.exit(0); }
