#!/usr/bin/env node
/**
 * Export Supabase-only state to a local backup file.
 * Covers: hidden IDs, outfits, custom items.
 *
 *   node scripts/backup.mjs [output-path]
 *   npm run db:backup
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, writeFileSync } from "node:fs";
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

const sb = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const catalogueLock = JSON.parse(
  readFileSync(resolve(root, "data/wardrobe-catalogue-lock.json"), "utf8")
);
const catalogueIds = new Set(catalogueLock.ids ?? []);

// 1. wardrobe_app_state
const { data: state, error: stateErr } = await sb
  .from("wardrobe_app_state")
  .select("collection_hidden_ids")
  .eq("id", "default")
  .single();
if (stateErr) { console.error("wardrobe_app_state:", stateErr.message); process.exit(1); }

// 2. outfits + outfit_items
const { data: outfits, error: outfitsErr } = await sb
  .from("outfits")
  .select("id, name, notes, created_at");
if (outfitsErr) { console.error("outfits:", outfitsErr.message); process.exit(1); }

const { data: outfitItems, error: oiErr } = await sb
  .from("outfit_items")
  .select("outfit_id, item_id, sort_order, colour_key");
if (oiErr) { console.error("outfit_items:", oiErr.message); process.exit(1); }

const itemsByOutfit = {};
for (const oi of outfitItems ?? []) {
  (itemsByOutfit[oi.outfit_id] ??= []).push({
    item_id: oi.item_id,
    sort_order: oi.sort_order,
    colour_key: oi.colour_key ?? null,
  });
}
for (const items of Object.values(itemsByOutfit)) {
  items.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

const outfitsWithItems = (outfits ?? []).map((o) => ({
  ...o,
  items: itemsByOutfit[o.id] ?? [],
}));

// 3. custom items (not in catalogue lock)
const { data: allItems, error: itemsErr } = await sb
  .from("wardrobe_items")
  .select("*");
if (itemsErr) { console.error("wardrobe_items:", itemsErr.message); process.exit(1); }

const customItems = (allItems ?? []).filter((r) => !catalogueIds.has(String(r.id ?? "")));

// Write
const stamp = new Date().toISOString().slice(0, 10);
const outPath = process.argv[2]
  ? resolve(process.argv[2])
  : resolve(root, "data/local", `backup-${stamp}.json`);

const payload = {
  _schema: "timeless-wardrobe-backup-v1",
  exportedAt: new Date().toISOString(),
  app_state: {
    collection_hidden_ids: state.collection_hidden_ids ?? [],
  },
  outfits: outfitsWithItems,
  custom_items: customItems,
};

writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");

const hiddenCount = payload.app_state.collection_hidden_ids.length;
console.log(`Backup written to ${outPath}`);
console.log(`  collection_hidden_ids: ${hiddenCount}`);
console.log(`  outfits: ${outfitsWithItems.length}`);
console.log(`  custom_items: ${customItems.length}`);
