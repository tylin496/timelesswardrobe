/**
 * Showcase order integrity check — requires live Supabase read.
 *
 * Invariants:
 *   A. No duplicate showcase_order among showcased items
 *   B. showcase_order is non-null whenever showcase_at is set
 *   C. All showcased item IDs exist in the catalogue lock (no orphan IDs)
 *
 * Run: npm run check:showcase
 */

import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const raw = readFileSync(".env", "utf8");
const env = {};
for (const line of raw.split("\n")) {
  const eq = line.indexOf("=");
  if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
}

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

// Load catalogue lock
const lock = JSON.parse(readFileSync("data/wardrobe-catalogue-lock.json", "utf8"));
const catalogueIds = new Set(lock.ids ?? lock);

// Fetch showcased rows
const { data, error } = await supabase
  .from("wardrobe_items")
  .select("id, showcase_order, showcase_at")
  .not("showcase_at", "is", null);

if (error) {
  console.error("Supabase error:", error.message);
  process.exit(1);
}

const failures = [];

// B: showcase_order non-null when showcase_at set
const nullOrder = data.filter((r) => r.showcase_order === null || r.showcase_order === undefined);
if (nullOrder.length) {
  failures.push(`#B showcase_order is null for ${nullOrder.length} showcased item(s): ${nullOrder.map((r) => r.id).join(", ")}`);
}

const ranked = data.filter((r) => r.showcase_order != null);

// A: no duplicate showcase_order
const orderCounts = new Map();
for (const r of ranked) orderCounts.set(r.showcase_order, (orderCounts.get(r.showcase_order) ?? 0) + 1);
const dupes = [...orderCounts.entries()].filter(([, n]) => n > 1);
if (dupes.length) {
  for (const [order, count] of dupes) {
    const ids = ranked.filter((r) => r.showcase_order === order).map((r) => r.id);
    failures.push(`#A duplicate showcase_order=${order} (${count} items): ${ids.join(", ")}`);
  }
}

// C: all IDs in catalogue lock
const orphans = ranked.filter((r) => !catalogueIds.has(r.id));
if (orphans.length) {
  failures.push(`#C orphan showcase IDs (not in catalogue lock): ${orphans.map((r) => r.id).join(", ")}`);
}

if (failures.length) {
  console.error(`\nShowcase order: ${failures.length} failure(s)\n`);
  for (const f of failures) console.error("  ✘", f);
  process.exit(1);
}

console.log(`Showcase order: ${ranked.length} items, all invariants satisfied ✓`);
