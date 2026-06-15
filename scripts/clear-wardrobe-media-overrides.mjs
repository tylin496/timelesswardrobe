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

const { data, error } = await sb
  .from("wardrobe_app_state")
  .select("archive_overrides")
  .eq("id", "default")
  .single();

if (error) { console.error("Supabase error:", error.message); process.exit(1); }

const overrides = data.archive_overrides ?? {};
let cleared = 0;

for (const id of ids) {
  const item = overrides[id];
  if (!item || (!item.image && !item.gallery && !item.__mediaEditedAt)) continue;
  delete item.image;
  delete item.gallery;
  delete item.__mediaEditedAt;
  cleared++;
  console.log(`  cleared media override: ${id}`);
}

if (cleared === 0) { process.exit(0); }

const { error: updateError } = await sb
  .from("wardrobe_app_state")
  .update({ archive_overrides: overrides })
  .eq("id", "default");

if (updateError) { console.error("Supabase update error:", updateError.message); process.exit(1); }
