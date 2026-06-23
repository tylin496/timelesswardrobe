#!/usr/bin/env node
/**
 * Restore one catalogue row from data/wardrobe.js into Supabase and unhide it in wardrobe_app_state.
 *
 *   node scripts/restore_wardrobe_item_to_supabase.mjs dw-5600
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const itemId = String(process.argv[2] ?? "").trim();

if (!itemId) {
  console.error("Usage: node scripts/restore_wardrobe_item_to_supabase.mjs <item-id>");
  process.exit(1);
}

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

loadEnvFile();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

function loadSeedItems() {
  const code = fs.readFileSync(path.join(root, "data", "wardrobe.js"), "utf8");
  const fn = new Function(`${code}\n;return WARDROBE_ITEMS;`);
  const items = fn();
  if (!Array.isArray(items)) throw new Error("WARDROBE_ITEMS missing");
  return items;
}

function pillarFromSection(section) {
  const s = String(section ?? "");
  if (s.includes("A/W")) return "English Heritage";
  if (s.includes("S/S")) return "Mediterranean Leisure";
  return "Collections";
}

function toRow(i) {
  let metadata = i.metadata && typeof i.metadata === "object" ? { ...i.metadata } : null;
  if (
    metadata &&
    Array.isArray(metadata.colorVariants) &&
    !Array.isArray(metadata.colourVariants)
  ) {
    metadata.colourVariants = metadata.colorVariants;
    delete metadata.colorVariants;
  }
  return {
    id: String(i.id),
    pillar: String(i.pillar ?? pillarFromSection(i.section)),
    section: String(i.section ?? ""),
    category: String(i.category ?? ""),
    brand: String(i.brand ?? ""),
    name: String(i.name ?? ""),
    season: String(i.season ?? ""),
    colour: String(i.colour ?? i.color ?? ""),
    colour_code: String(i.colourCode ?? i.colorCode ?? i.colour_code ?? i.color_code ?? ""),
    fabric: String(i.fabric ?? ""),
    weight: String(i.weight ?? ""),
    size: String(i.size ?? ""),
    measured_dimensions: String(i.measuredDimensions ?? ""),
    purchase_date: String(i.purchaseDate ?? ""),
    image: String(i.image ?? ""),
    gallery: Array.isArray(i.gallery) ? i.gallery : [],
    notes: String(i.notes ?? ""),
    metadata,
  };
}

const seed = loadSeedItems().find((x) => String(x?.id ?? "") === itemId);
if (!seed) {
  console.error(`No seed row for id "${itemId}" in data/wardrobe.js`);
  process.exit(1);
}

const client = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const row = toRow(seed);
const { error: upErr } = await client.from("wardrobe_items").upsert(row, { onConflict: "id" });
if (upErr) {
  console.error("Upsert failed:", upErr.message);
  process.exit(1);
}
console.log(`Restored wardrobe_items row: ${itemId} (${seed.brand} — ${seed.name})`);

const { data: stateRow, error: sErr } = await client
  .from("wardrobe_app_state")
  .select("*")
  .eq("id", "default")
  .maybeSingle();
if (sErr && sErr.code !== "PGRST116") {
  console.warn("wardrobe_app_state read:", sErr.message);
} else if (stateRow) {
  const hiddenRaw = Array.isArray(stateRow.collection_hidden_ids)
    ? stateRow.collection_hidden_ids
    : [];
  const nextHidden = hiddenRaw.filter((id) => String(id) !== itemId);
  if (nextHidden.length !== hiddenRaw.length) {
    const patch = { id: "default", updated_at: new Date().toISOString(), collection_hidden_ids: nextHidden };
    const { error: stErr } = await client.from("wardrobe_app_state").upsert(patch, { onConflict: "id" });
    if (stErr) console.warn("wardrobe_app_state update:", stErr.message);
    else console.log(`Removed "${itemId}" from collection_hidden_ids in cloud app state.`);
  } else {
    console.log("No cloud hidden-id entry for this piece (browser-only hide may remain until refresh).");
  }
}

console.log("Done. Hard-refresh the collection / item page.");
