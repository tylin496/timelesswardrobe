#!/usr/bin/env node
/**
 * Generate composited WebP thumbnails for wardrobe items.
 *
 * For each `images/wardrobe/<item>/main/<n>.<ext>` we write
 * `images/wardrobe/<item>/thumb/<n>.webp`: the item cutout composited onto
 * images/background.jpg, scaled to fit 720×960. thumb/ represents the final
 * presentation asset; main/ remains the transparent source.
 *
 * Staleness is detected via content hashes stored in thumb/.manifest.json —
 * mtime is unreliable when files are copied, restored from git, or batch-processed.
 *
 * Usage:
 *   node scripts/generate-wardrobe-thumbs.mjs          # only stale/missing
 *   node scripts/generate-wardrobe-thumbs.mjs --force  # rebuild everything
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WARDROBE_DIR = path.join(ROOT, "images", "wardrobe");
const BACKGROUND_PATH = path.join(ROOT, "images", "background.jpg");
const MANIFEST_FILE = ".manifest.json";

const MAX_WIDTH = 720;
const MAX_HEIGHT = 960;
const QUALITY = 80;
const SOURCE_RE = /\.(webp|png|jpg|jpeg)$/i;

const force = process.argv.includes("--force");

// Pre-scale background once for the session — all thumbs share the same plate.
const bgBuffer = await sharp(BACKGROUND_PATH)
  .resize(MAX_WIDTH, MAX_HEIGHT, { fit: "cover", position: "centre" })
  .toBuffer();

const BG_HASH = createHash("md5").update(bgBuffer).digest("hex");

function fileHash(filePath) {
  return createHash("md5").update(readFileSync(filePath)).digest("hex");
}

function loadManifest(thumbDir) {
  const p = path.join(thumbDir, MANIFEST_FILE);
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
  } catch {
    return {};
  }
}

function saveManifest(thumbDir, manifest) {
  writeFileSync(path.join(thumbDir, MANIFEST_FILE), JSON.stringify(manifest, null, 2));
}

async function buildThumb(srcPath, outPath) {
  // Resize item cutout to fit within the frame (preserves aspect ratio).
  const itemBuffer = await sharp(srcPath)
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside" })
    .toBuffer();

  // Composite item onto background, north-aligned to match CSS flex-start.
  await sharp(bgBuffer)
    .composite([{ input: itemBuffer, gravity: "north" }])
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(outPath);
}

function isUpToDate(srcPath, outPath, thumbName, manifest) {
  if (force || !existsSync(outPath)) return false;
  const entry = manifest[thumbName];
  if (!entry) return false;
  return entry.srcHash === fileHash(srcPath) && entry.bgHash === BG_HASH;
}

async function run() {
  if (!existsSync(WARDROBE_DIR)) {
    console.log("[thumbs] no images/wardrobe directory — nothing to do.");
    return;
  }
  const items = readdirSync(WARDROBE_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let built = 0;
  let skipped = 0;
  let removed = 0;
  for (const item of items) {
    const mainDir = path.join(WARDROBE_DIR, item, "main");
    if (!existsSync(mainDir)) continue;
    const sources = readdirSync(mainDir).filter((f) => SOURCE_RE.test(f));
    const thumbDir = path.join(WARDROBE_DIR, item, "thumb");
    const manifest = loadManifest(thumbDir);
    let manifestDirty = false;

    // Build/update thumbs for every source image.
    for (const file of sources) {
      const srcPath = path.join(mainDir, file);
      const thumbName = file.replace(SOURCE_RE, ".webp");
      const outPath = path.join(thumbDir, thumbName);
      if (isUpToDate(srcPath, outPath, thumbName, manifest)) {
        skipped++;
        continue;
      }
      if (!existsSync(thumbDir)) mkdirSync(thumbDir, { recursive: true });
      await buildThumb(srcPath, outPath);
      manifest[thumbName] = { srcHash: fileHash(srcPath), bgHash: BG_HASH };
      manifestDirty = true;
      built++;
    }

    // Remove orphaned thumbs that no longer have a matching source in main/.
    if (existsSync(thumbDir)) {
      const expectedThumbs = new Set(sources.map((f) => f.replace(SOURCE_RE, ".webp")));
      for (const thumbFile of readdirSync(thumbDir).filter((f) => /\.webp$/i.test(f))) {
        if (!expectedThumbs.has(thumbFile)) {
          rmSync(path.join(thumbDir, thumbFile));
          delete manifest[thumbFile];
          manifestDirty = true;
          removed++;
        }
      }
    }

    if (manifestDirty) saveManifest(thumbDir, manifest);
  }
  const removedStr = removed ? `, removed ${removed} orphans` : "";
  console.log(`[thumbs] built ${built}, skipped ${skipped} (up to date)${removedStr}.`);
}

run().catch((err) => {
  console.error("[thumbs] failed:", err);
  process.exit(1);
});
