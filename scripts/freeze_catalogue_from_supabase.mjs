#!/usr/bin/env node
/**
 * Freeze the live Supabase catalogue into the repo:
 *   - data/wardrobe.js (new seed, 69+ items)
 *   - data/wardrobe-catalogue-lock.json (id manifest — app refuses partial cloud shrink)
 *   - data/wardrobe.js.backup-<timestamp> (previous seed)
 *
 *   npm run db:freeze-catalogue
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { cloudRowToSeedItem, formatWardrobeJsFile } from "./lib/cloud-to-seed.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const LOCK_SCHEMA = "timeless-wardrobe-catalogue-lock-v1";

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
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const client = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { data, error } = await client.from("wardrobe_items").select("*").order("id");
if (error) {
  console.error("Fetch failed:", error.message);
  process.exit(1);
}

const rawRows = data || [];
const seedItems = rawRows.map((r) => cloudRowToSeedItem(r)).filter(Boolean);
if (!seedItems.length) {
  console.error("No rows in wardrobe_items — nothing to freeze.");
  process.exit(1);
}

const frozenAt = new Date().toISOString();
const wardrobeJsPath = path.join(root, "data", "wardrobe.js");
const lockPath = path.join(root, "data", "wardrobe-catalogue-lock.json");

if (fs.existsSync(wardrobeJsPath)) {
  const stamp = frozenAt.replace(/[:.]/g, "-").slice(0, 19);
  const backupPath = path.join(root, "data", `wardrobe.js.backup-${stamp}`);
  fs.copyFileSync(wardrobeJsPath, backupPath);
  console.error(`Backed up previous seed → ${path.relative(root, backupPath)}`);
}

fs.writeFileSync(wardrobeJsPath, formatWardrobeJsFile(seedItems, frozenAt), "utf8");

const lock = {
  _schema: LOCK_SCHEMA,
  frozenAt,
  count: seedItems.length,
  ids: seedItems.map((i) => String(i.id)),
  source: "supabase:wardrobe_items",
};
fs.writeFileSync(lockPath, JSON.stringify(lock, null, 2), "utf8");

// Write showcase-order.json: ordered list of showcase item IDs (used by build-og-image.mjs)
const showcaseOrderPath = path.join(root, "data", "showcase-order.json");
const showcaseItems = rawRows
  .filter((r) => {
    const rank = r?.metadata?.showcase_rank;
    return typeof rank === "number" && Number.isInteger(rank) && rank >= 0;
  })
  .sort((a, b) => a.metadata.showcase_rank - b.metadata.showcase_rank);

if (showcaseItems.length >= 3) {
  const existing = fs.existsSync(showcaseOrderPath)
    ? JSON.parse(fs.readFileSync(showcaseOrderPath, "utf8"))
    : {};
  const updated = {
    _note: existing._note ?? "Ordered list of showcase item IDs for the default OG image. Updated by db:freeze-catalogue when showcase_rank is set in Supabase. Edit manually to curate the OG image selection.",
    ids: showcaseItems.map((r) => String(r.id)),
  };
  fs.writeFileSync(showcaseOrderPath, JSON.stringify(updated, null, 2), "utf8");
  console.log(`  ${path.relative(root, showcaseOrderPath)} (${showcaseItems.length} showcase items)`);
} else {
  console.log(`  showcase-order.json unchanged (${showcaseItems.length} showcase item${showcaseItems.length === 1 ? "" : "s"} in Supabase — need ≥ 3 to update)`);
}

console.log(`Frozen ${seedItems.length} pieces.`);
console.log(`  ${path.relative(root, wardrobeJsPath)}`);
console.log(`  ${path.relative(root, lockPath)}`);
console.log("");
console.log("Next: commit these files to git. The site will not drop below this count on partial cloud fetch.");
console.log("Delete a piece only via Admin → item page → Delete (removes Supabase row).");
