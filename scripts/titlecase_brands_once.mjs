#!/usr/bin/env node
/**
 * One-time migration: title-case every `brand` in the seed file (and optionally Supabase).
 * Does NOT add runtime formatting in the app — run once, then stop.
 *
 *   npm run db:titlecase-brands-once              # preview changes
 *   npm run db:titlecase-brands-once -- --write   # update data/wardrobe.js (+ backup)
 *   npm run db:titlecase-brands-once -- --write --push   # also upsert brand in Supabase
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { titleCaseBrand } from "./lib/brand-titlecase.mjs";
import { formatWardrobeJsFile } from "./lib/cloud-to-seed.mjs";
import { readFileItemsFromJs } from "./lib/wardrobe-text.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const wardrobeJsPath = path.join(root, "data", "wardrobe.js");
const customItemsPath = path.join(root, "data", "custom-items.json");

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

function applyBrandTitleCase(items) {
  /** @type {{ id: string, from: string, to: string }[]} */
  const changes = [];
  for (const item of items) {
    const from = String(item.brand ?? "").trim();
    if (!from) continue;
    const to = titleCaseBrand(from);
    if (to && to !== from) {
      changes.push({ id: String(item.id ?? ""), from, to });
      item.brand = to;
    }
  }
  return changes;
}

const args = new Set(process.argv.slice(2));
const doWrite = args.has("--write");
const doPush = args.has("--push");

if (!fs.existsSync(wardrobeJsPath)) {
  console.error(`Missing ${wardrobeJsPath}`);
  process.exit(1);
}

const items = readFileItemsFromJs(wardrobeJsPath, fs);
const changes = applyBrandTitleCase(items);

if (fs.existsSync(customItemsPath)) {
  try {
    const customRaw = JSON.parse(fs.readFileSync(customItemsPath, "utf8"));
    if (Array.isArray(customRaw) && customRaw.length) {
      const customChanges = applyBrandTitleCase(customRaw);
      changes.push(...customChanges);
      if (doWrite) {
        fs.writeFileSync(customItemsPath, `${JSON.stringify(customRaw, null, 2)}\n`, "utf8");
        console.error(`Updated ${path.relative(root, customItemsPath)} (${customChanges.length} brand(s)).`);
      }
    }
  } catch (e) {
    console.warn("Could not process custom-items.json:", e);
  }
}

const uniquePairs = new Map();
for (const c of changes) {
  if (!uniquePairs.has(c.from)) uniquePairs.set(c.from, c.to);
}

console.log(`Items scanned: ${items.length}`);
console.log(`Brand values to change: ${uniquePairs.size} unique (${changes.length} row updates)`);
if (!uniquePairs.size) {
  console.log("Nothing to do — brands already match title case.");
  process.exit(0);
}

for (const [from, to] of [...uniquePairs.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
  console.log(`  ${from}  →  ${to}`);
}

if (!doWrite) {
  console.log("\nDry run only. Re-run with --write to update data/wardrobe.js");
  if (doPush) console.log("(Ignored --push without --write.)");
  process.exit(0);
}

const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
const backupPath = path.join(root, "data", `wardrobe.js.backup-${stamp}`);
fs.copyFileSync(wardrobeJsPath, backupPath);
console.error(`Backed up → ${path.relative(root, backupPath)}`);

fs.writeFileSync(
  wardrobeJsPath,
  formatWardrobeJsFile(items, `brand title-case migration ${new Date().toISOString()}`),
  "utf8"
);
console.log(`Wrote ${path.relative(root, wardrobeJsPath)}`);

if (!doPush) {
  console.log("Done (local seed only). Add --push to sync Supabase wardrobe_items.brand.");
  process.exit(0);
}

loadEnvFile();
const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY — local file updated, cloud skipped.");
  process.exit(1);
}

const client = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const byId = new Map(changes.map((c) => [c.id, c.to]));
let pushed = 0;
for (const [id, brand] of byId) {
  const { error } = await client.from("wardrobe_items").update({ brand }).eq("id", id);
  if (error) {
    console.error(`Update failed for ${id}:`, error.message);
    process.exit(1);
  }
  pushed += 1;
}

console.log(`Supabase: updated brand on ${pushed} row(s).`);
console.log("Done. This was a one-time migration — the app does not auto-format brands on display.");
