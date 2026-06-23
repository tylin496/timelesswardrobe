#!/usr/bin/env node
/**
 * Scan collection_overrides + wardrobe_items for R2 image URLs that return non-200,
 * then clear them so items fall back to local seed images.
 *
 * Usage: node scripts/clear-dead-r2-covers.mjs [--dry-run]
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

const dryRun = process.argv.includes("--dry-run");
const R2_ORIGIN = (env.R2_PUBLIC_URL ?? "").replace(/\/$/, "");

if (!R2_ORIGIN) {
  console.error("R2_PUBLIC_URL missing from .env");
  process.exit(1);
}

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

function isR2Url(url) {
  return typeof url === "string" && url.startsWith(R2_ORIGIN);
}

async function isDeadUrl(url) {
  try {
    const res = await fetch(url.split("?")[0], { method: "HEAD" });
    return res.status === 404 || res.status === 403;
  } catch {
    return true;
  }
}

// ── 1. collection_overrides (inside wardrobe_app_state) ────────────────────
const { data: stateRow, error: stateErr } = await sb
  .from("wardrobe_app_state")
  .select("collection_overrides")
  .eq("id", "default")
  .single();

if (stateErr) { console.error("wardrobe_app_state fetch error:", stateErr.message); process.exit(1); }

const overrides = stateRow.collection_overrides ?? {};
const deadOverrideIds = [];

for (const [id, ov] of Object.entries(overrides)) {
  if (!isR2Url(ov.image)) continue;
  process.stdout.write(`  checking collection_override[${id}].image … `);
  if (await isDeadUrl(ov.image)) {
    console.log("DEAD");
    deadOverrideIds.push(id);
  } else {
    console.log("ok");
  }
}

if (deadOverrideIds.length) {
  console.log(`\nDead archive_override image URLs: ${deadOverrideIds.join(", ")}`);
  if (!dryRun) {
    for (const id of deadOverrideIds) {
      delete overrides[id].image;
      delete overrides[id].__mediaEditedAt;
    }
    const { error: updateErr } = await sb
      .from("wardrobe_app_state")
      .update({ collection_overrides: overrides })
      .eq("id", "default");
    if (updateErr) { console.error("collection_overrides update error:", updateErr.message); process.exit(1); }
    console.log("  ✓ collection_overrides updated");
  } else {
    console.log("  (dry-run — skipped write)");
  }
}

// ── 2. wardrobe_items.image ────────────────────────────────────────────────
const { data: items, error: itemsErr } = await sb
  .from("wardrobe_items")
  .select("id, image")
  .not("image", "is", null);

if (itemsErr) { console.error("wardrobe_items fetch error:", itemsErr.message); process.exit(1); }

const deadItemIds = [];

for (const row of (items ?? [])) {
  if (!isR2Url(row.image)) continue;
  process.stdout.write(`  checking wardrobe_items[${row.id}].image … `);
  if (await isDeadUrl(row.image)) {
    console.log("DEAD");
    deadItemIds.push(row.id);
  } else {
    console.log("ok");
  }
}

if (deadItemIds.length) {
  console.log(`\nDead wardrobe_items image URLs: ${deadItemIds.join(", ")}`);
  if (!dryRun) {
    for (const id of deadItemIds) {
      const { error } = await sb
        .from("wardrobe_items")
        .update({ image: null })
        .eq("id", id);
      if (error) console.error(`  wardrobe_items update error (${id}):`, error.message);
      else console.log(`  ✓ cleared wardrobe_items[${id}].image`);
    }
  } else {
    console.log("  (dry-run — skipped write)");
  }
}

if (!deadOverrideIds.length && !deadItemIds.length) {
  console.log("All R2 cover URLs are alive — nothing to clear.");
}
