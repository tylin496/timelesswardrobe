#!/usr/bin/env node
/**
 * Update data/wardrobe.js image paths from local (/images/wardrobe/...)
 * to R2 public URLs (https://pub-....r2.dev/wardrobe/...).
 *
 * Spaces in paths are URL-encoded (%20).
 *
 *   node scripts/update-seed-to-r2-urls.mjs --dry-run
 *   node scripts/update-seed-to-r2-urls.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatWardrobeJsFile } from "./lib/cloud-to-seed.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

loadEnvFile();

const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
if (!publicUrl) {
  console.error("Missing R2_PUBLIC_URL in .env");
  process.exit(1);
}

const LOCAL_PREFIX = "/images/wardrobe/";
const R2_PREFIX = `${publicUrl}/wardrobe/`;

/** Convert a local path to an R2 URL, encoding spaces. */
function toR2Url(localPath) {
  if (!localPath || typeof localPath !== "string") return localPath;
  if (!localPath.startsWith(LOCAL_PREFIX)) return localPath; // already absolute or different prefix
  const rel = localPath.slice(LOCAL_PREFIX.length);
  // encode each path segment (preserve /)
  const encoded = rel.split("/").map(encodeURIComponent).join("/");
  return R2_PREFIX + encoded;
}

function transformImageFields(obj) {
  if (!obj || typeof obj !== "object") return obj;
  if (Array.isArray(obj)) return obj.map(transformImageFields);

  const out = { ...obj };
  for (const key of Object.keys(out)) {
    const val = out[key];
    if (typeof val === "string" && val.startsWith(LOCAL_PREFIX)) {
      out[key] = toR2Url(val);
    } else if (Array.isArray(val)) {
      out[key] = val.map((v) => (typeof v === "string" && v.startsWith(LOCAL_PREFIX) ? toR2Url(v) : transformImageFields(v)));
    } else if (val && typeof val === "object") {
      out[key] = transformImageFields(val);
    }
  }
  return out;
}

const wardrobeJsPath = path.join(root, "data", "wardrobe.js");
const src = fs.readFileSync(wardrobeJsPath, "utf8");
const items = new Function(`${src}\n;return typeof WARDROBE_ITEMS !== "undefined" ? WARDROBE_ITEMS : null;`)();
if (!Array.isArray(items)) {
  console.error("Could not parse WARDROBE_ITEMS from data/wardrobe.js");
  process.exit(1);
}

const updated = items.map(transformImageFields);

// Count changed paths
let changedPaths = 0;
function countChanges(before, after) {
  if (!before || !after || typeof before !== "object") return;
  if (Array.isArray(before)) {
    before.forEach((v, i) => countChanges(v, after[i]));
    return;
  }
  for (const key of Object.keys(before)) {
    if (typeof before[key] === "string" && before[key] !== after[key]) changedPaths++;
    else countChanges(before[key], after[key]);
  }
}
items.forEach((item, i) => countChanges(item, updated[i]));

console.log(`Items: ${items.length}  |  Path fields to update: ${changedPaths}`);
console.log(`Local prefix: ${LOCAL_PREFIX}`);
console.log(`R2 prefix:    ${R2_PREFIX}`);

if (DRY_RUN) {
  // Show first item with changes
  for (let i = 0; i < items.length; i++) {
    const before = items[i];
    const after = updated[i];
    if (before.image !== after.image || JSON.stringify(before.gallery) !== JSON.stringify(after.gallery)) {
      console.log(`\nExample (${before.id}):`);
      if (before.image) console.log(`  image: ${before.image}\n      -> ${after.image}`);
      if (before.gallery?.[0]) console.log(`  gallery[0]: ${before.gallery[0]}\n           -> ${after.gallery[0]}`);
      break;
    }
  }
  console.log(`\n[dry-run] No files written.`);
  process.exit(0);
}

const frozenAt = new Date().toISOString();
const stamp = frozenAt.replace(/[:.]/g, "-").slice(0, 19);
const backupPath = path.join(root, "data", `wardrobe.js.backup-r2-${stamp}`);
fs.copyFileSync(wardrobeJsPath, backupPath);
fs.writeFileSync(wardrobeJsPath, formatWardrobeJsFile(updated, frozenAt), "utf8");

console.log(`\nBacked up → data/wardrobe.js.backup-r2-${stamp}`);
console.log(`Updated ${changedPaths} path fields in ${items.length} items → data/wardrobe.js`);
console.log("Next: move images/wardrobe/ to backup, commit data/wardrobe.js");
