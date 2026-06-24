#!/usr/bin/env node
/**
 * Fail when the seed catalogue id set (data/wardrobe.js) diverges from the
 * frozen lock (data/wardrobe-catalogue-lock.json).
 *
 * Item ids are immutable surrogate keys: they are the PK + the outfit_items FK
 * target in Supabase, the image-folder name, and the URL slug. Renaming one
 * orphans existing outfit references and forces a multi-step cloud migration —
 * for zero user-visible gain (display name lives in `name`, not `id`).
 *
 * So: editorial fixes go to `name` (and `slug` for pretty URLs), never `id`.
 * If you genuinely must add/rename an id, re-freeze the lock deliberately
 * (npm run db:freeze-catalogue) so this guard stays the canary, not the noise.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wardrobePath = path.join(root, "data", "wardrobe.js");
const lockPath = path.join(root, "data", "wardrobe-catalogue-lock.json");

function seedIds() {
  const source = fs.readFileSync(wardrobePath, "utf8");
  const items = vm.runInNewContext(`${source}\n;WARDROBE_ITEMS;`, Object.create(null), {
    filename: wardrobePath,
  });
  return items.map((it) => String(it?.id ?? "").trim()).filter(Boolean);
}

function lockIds() {
  const lock = JSON.parse(fs.readFileSync(lockPath, "utf8"));
  if (!Array.isArray(lock?.ids)) throw new Error("wardrobe-catalogue-lock.json has no `ids` array");
  return lock.ids.map((id) => String(id ?? "").trim()).filter(Boolean);
}

const seed = new Set(seedIds());
const lock = new Set(lockIds());

const addedInSeed = [...seed].filter((id) => !lock.has(id)); // new/renamed ids not in lock
const missingFromSeed = [...lock].filter((id) => !seed.has(id)); // locked ids gone from seed

if (addedInSeed.length || missingFromSeed.length) {
  console.error("Catalogue id drift vs frozen lock — ids are immutable surrogate keys.\n");
  if (addedInSeed.length) {
    console.error(`  In seed but NOT in lock (added or renamed) [${addedInSeed.length}]:`);
    for (const id of addedInSeed) console.error(`    + ${id}`);
  }
  if (missingFromSeed.length) {
    console.error(`  In lock but gone from seed (removed or renamed) [${missingFromSeed.length}]:`);
    for (const id of missingFromSeed) console.error(`    - ${id}`);
  }
  console.error(
    "\nIf this is a rename: prefer fixing `name`/`slug` and keeping the id.\n" +
      "If the id change is intentional, re-freeze the lock: npm run db:freeze-catalogue"
  );
  process.exit(1);
}

console.log(`OK - catalogue ids match lock (${seed.size}).`);
