#!/usr/bin/env node
/**
 * Bulk-insert wardrobe_items from data/wardrobe.js using the service role key.
 *
 * Usage:
 *   export SUPABASE_URL=...
 *   export SUPABASE_SERVICE_ROLE_KEY=...
 *   node scripts/import_seed_to_supabase.mjs
 *
 * Optional: write data/wardrobe.json first (same array shape) — set USE_JSON=1
 *   USE_JSON=1 node scripts/import_seed_to_supabase.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  const text = fs.readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnvFile();

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (see .env.example)."
  );
  process.exit(1);
}

function loadItemsFromJs() {
  const p = path.join(root, "data", "wardrobe.js");
  const code = fs.readFileSync(p, "utf8");
  const fn = new Function(`${code}\n;return WARDROBE_ITEMS;`);
  const items = fn();
  if (!Array.isArray(items)) {
    throw new Error("WARDROBE_ITEMS not found or not an array in data/wardrobe.js");
  }
  return items;
}

function loadItemsFromJson() {
  const p = path.join(root, "data", "wardrobe.json");
  const raw = fs.readFileSync(p, "utf8");
  const items = JSON.parse(raw);
  if (!Array.isArray(items)) throw new Error("data/wardrobe.json must be a JSON array");
  return items;
}

/** Manuscript thesis grouping (matches supabase migration backfill). */
function pillarFromSection(section) {
  const s = String(section ?? "");
  if (s.includes("A/W")) return "English Heritage";
  if (s.includes("S/S")) return "Mediterranean Leisure";
  return "Collections";
}

function toRows(items) {
  return items.map((i) => {
    let metadata =
      i.metadata && typeof i.metadata === "object" ? { ...i.metadata } : null;
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
      colour_code: String(
        i.colourCode ?? i.colorCode ?? i.colour_code ?? i.color_code ?? ""
      ),
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
  });
}

/**
 * Metadata keys managed at runtime (via the UI / Supabase directly).
 * The seed import must never overwrite these — they are preserved from
 * the existing Supabase row regardless of what the seed file contains.
 */
const RUNTIME_METADATA_KEYS = ["showcase_rank"];

const useJson = process.env.USE_JSON === "1" || process.env.USE_JSON === "true";
const rawItems = useJson ? loadItemsFromJson() : loadItemsFromJs();
const rows = toRows(rawItems);

const client = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Fetch existing metadata so runtime-managed keys survive the upsert.
const { data: existingRows, error: fetchErr } = await client
  .from("wardrobe_items")
  .select("id, metadata");
if (fetchErr) {
  console.error("Failed to fetch existing metadata:", fetchErr.message);
  process.exit(1);
}
const existingMetaById = new Map(
  (existingRows ?? []).map((r) => [String(r.id), r.metadata])
);

function mergePreservingRuntime(seedMeta, existingMeta) {
  const merged = { ...(seedMeta ?? {}) };
  if (existingMeta && typeof existingMeta === "object") {
    for (const key of RUNTIME_METADATA_KEYS) {
      if (Object.prototype.hasOwnProperty.call(existingMeta, key)) {
        // Preserve the runtime value (even null = user explicitly cleared it).
        if (existingMeta[key] == null) {
          delete merged[key];
        } else {
          merged[key] = existingMeta[key];
        }
      }
    }
  }
  return Object.keys(merged).length ? merged : null;
}

const safeRows = rows.map((row) => ({
  ...row,
  metadata: mergePreservingRuntime(row.metadata, existingMetaById.get(row.id)),
}));

const chunkSize = 200;
let inserted = 0;
for (let i = 0; i < safeRows.length; i += chunkSize) {
  const chunk = safeRows.slice(i, i + chunkSize);
  const { error } = await client.from("wardrobe_items").upsert(chunk, {
    onConflict: "id",
  });
  if (error) {
    console.error("Upsert failed:", error.message);
    process.exit(1);
  }
  inserted += chunk.length;
  console.error(`Upserted ${inserted} / ${safeRows.length}`);
}

console.log(`Done. Upserted ${safeRows.length} wardrobe_items.`);
