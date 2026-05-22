#!/usr/bin/env node
/**
 * Scan images/wardrobe/{id}/main/gallery and variants/{key}/gallery → manifest for hybrid mode.
 * Run: node scripts/build-wardrobe-local-gallery-manifest.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const imgRoot = path.join(root, "images", "wardrobe");
const outPath = path.join(root, "data", "wardrobe-local-gallery-manifest.json");
const MEDIA_EXT = new Set([".avif", ".gif", ".jpg", ".jpeg", ".png", ".webp"]);

function listGalleryDir(absDir, itemId, relPrefix) {
  if (!fs.existsSync(absDir)) return [];
  const names = fs.readdirSync(absDir).filter((n) => MEDIA_EXT.has(path.extname(n).toLowerCase()));
  return names
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }))
    .map((n) => `/images/wardrobe/${itemId}/${relPrefix}/${n}`);
}

function scanItem(itemId) {
  const main = listGalleryDir(path.join(imgRoot, itemId, "main", "gallery"), itemId, "main/gallery");
  /** @type {Record<string, string[]>} */
  const variants = {};
  const variantsDir = path.join(imgRoot, itemId, "variants");
  if (fs.existsSync(variantsDir)) {
    for (const key of fs.readdirSync(variantsDir, { withFileTypes: true })) {
      if (!key.isDirectory()) continue;
      const rel = `variants/${key.name}/gallery`;
      const urls = listGalleryDir(path.join(variantsDir, key.name, "gallery"), itemId, rel);
      if (urls.length) variants[key.name] = urls;
    }
  }
  return { main, variants };
}

let lockIds = [];
try {
  const lock = JSON.parse(fs.readFileSync(path.join(root, "data", "wardrobe-catalogue-lock.json"), "utf8"));
  lockIds = Array.isArray(lock.ids) ? lock.ids : [];
} catch {
  lockIds = [];
}

/** @type {Record<string, { main: string[], variants: Record<string, string[]> }>} */
const manifest = {};
if (fs.existsSync(imgRoot)) {
  const ids = lockIds.length
    ? lockIds
    : fs.readdirSync(imgRoot, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  for (const id of ids) {
    const row = scanItem(String(id));
    if (row.main.length || Object.keys(row.variants).length) manifest[id] = row;
  }
}

const payload = {
  _schema: "timeless-wardrobe-local-gallery-manifest-v1",
  generatedAt: new Date().toISOString(),
  items: manifest,
};

fs.writeFileSync(outPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`Wrote ${outPath} (${Object.keys(manifest).length} items)`);
for (const id of ["ocbd-shirt", "pleated-trousers"]) {
  const row = manifest[id];
  if (row) console.log(id, "main:", row.main, "variants:", row.variants);
}
