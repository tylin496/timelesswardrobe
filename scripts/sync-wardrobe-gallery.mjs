#!/usr/bin/env node
/**
 * Sync wardrobe.js image/gallery fields from the local filesystem.
 * For each item with a local /images/wardrobe/{id}/main/ directory,
 * reads all image files (sorted by name), sets image = first file,
 * gallery = remaining files.
 *
 * Usage: node scripts/sync-wardrobe-gallery.mjs [--dry-run]
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wardrobePath = path.join(root, "data", "wardrobe.js");
const dryRun = process.argv.includes("--dry-run");
const IMAGE_EXTS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

function loadItems() {
  const source = fs.readFileSync(wardrobePath, "utf8");
  return vm.runInNewContext(`${source}\n;WARDROBE_ITEMS;`, Object.create(null), {
    filename: wardrobePath,
  });
}

function scanDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => IMAGE_EXTS.has(path.extname(f).toLowerCase()) && !f.startsWith("."))
    .sort()
    .map((f) => f);
}

function localImageBase(url) {
  const raw = String(url ?? "").trim().split("?")[0];
  if (!raw.startsWith("/images/wardrobe/")) return null;
  // Must be under {id}/main/ — skip variant-based paths
  if (!/^\/images\/wardrobe\/[^/]+\/main\//.test(raw)) return null;
  return raw;
}

let source = fs.readFileSync(wardrobePath, "utf8");
let changed = 0;

for (const item of loadItems()) {
  const id = String(item?.id ?? "").trim();
  if (!id) continue;

  const imgUrl = String(item?.image ?? "").trim();
  if (!localImageBase(imgUrl)) continue;

  const dir = path.join(root, "images", "wardrobe", id, "main");
  const files = scanDir(dir);
  if (!files.length) continue;

  const base = `/images/wardrobe/${id}/main`;
  const newImage = `${base}/${files[0]}`;
  const newGallery = files.slice(1).map((f) => `${base}/${f}`);

  const currentImage = imgUrl;
  const currentGallery = Array.isArray(item?.gallery) ? item.gallery : [];

  const imageMatch = currentImage === newImage;
  const galleryMatch =
    currentGallery.length === newGallery.length &&
    currentGallery.every((u, i) => u === newGallery[i]);

  if (imageMatch && galleryMatch) continue;

  console.log(`\n${id}:`);
  if (!imageMatch) console.log(`  image: ${currentImage} → ${newImage}`);
  if (!galleryMatch) {
    console.log(`  gallery was: [${currentGallery.join(", ")}]`);
    console.log(`  gallery now: [${newGallery.join(", ")}]`);
  }

  if (dryRun) continue;

  // Replace image field
  source = source.replace(
    new RegExp(`("id":\\s*"${id}"[\\s\\S]*?)"image":\\s*"[^"]*"`, "m"),
    (match) => match.replace(/"image":\s*"[^"]*"/, `"image": "${newImage}"`)
  );

  // Replace gallery block
  const galleryStr =
    newGallery.length === 0
      ? `"gallery": []`
      : `"gallery": [\n      ${newGallery.map((u) => `"${u}"`).join(",\n      ")}\n    ]`;

  source = source.replace(
    new RegExp(
      `("id":\\s*"${id}"[\\s\\S]*?)"gallery":\\s*\\[[^\\]]*\\]`,
      "m"
    ),
    (match) => match.replace(/"gallery":\s*\[[^\]]*\]/, galleryStr)
  );

  changed++;
}

if (dryRun) {
  console.log("\n[dry-run] No files written.");
} else if (changed > 0) {
  fs.writeFileSync(wardrobePath, source, "utf8");
  console.log(`\nUpdated ${changed} item(s) in wardrobe.js`);
} else {
  console.log("All gallery paths already match the filesystem. Nothing to update.");
}
