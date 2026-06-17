#!/usr/bin/env node
/**
 * Generate composited WebP thumbnails for wardrobe items.
 *
 * For each `images/wardrobe/<item>/main/<n>.<ext>` we write
 * `images/wardrobe/<item>/thumb/<n>.webp`: the item cutout composited onto
 * images/background.jpg, scaled to fit 720×960. thumb/ represents the final
 * presentation asset; main/ remains the transparent source.
 *
 * Idempotent: skips thumbs already newer than both their source and background.jpg.
 *
 * Usage:
 *   node scripts/generate-wardrobe-thumbs.mjs          # only stale/missing
 *   node scripts/generate-wardrobe-thumbs.mjs --force  # rebuild everything
 */
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WARDROBE_DIR = path.join(ROOT, "images", "wardrobe");
const BACKGROUND_PATH = path.join(ROOT, "images", "background.jpg");

const MAX_WIDTH = 720;
const MAX_HEIGHT = 960;
const QUALITY = 80;
const SOURCE_RE = /\.(webp|png|jpg|jpeg)$/i;

const force = process.argv.includes("--force");

// Pre-scale background once for the session — all thumbs share the same plate.
const bgBuffer = await sharp(BACKGROUND_PATH)
  .resize(MAX_WIDTH, MAX_HEIGHT, { fit: "cover", position: "centre" })
  .toBuffer();

// Used by the staleness check so any change to background.jpg busts all thumbs.
const BG_MTIME = statSync(BACKGROUND_PATH).mtimeMs;

async function buildThumb(srcPath, outPath) {
  // Resize item cutout to fit within the frame (preserves aspect ratio).
  const itemBuffer = await sharp(srcPath)
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside", withoutEnlargement: true })
    .toBuffer();

  // Composite item onto background, north-aligned to match CSS flex-start.
  await sharp(bgBuffer)
    .composite([{ input: itemBuffer, gravity: "north" }])
    .webp({ quality: QUALITY, effort: 6 })
    .toFile(outPath);
}

function isUpToDate(srcPath, outPath) {
  if (force || !existsSync(outPath)) return false;
  try {
    const outMtime = statSync(outPath).mtimeMs;
    return outMtime >= statSync(srcPath).mtimeMs && outMtime >= BG_MTIME;
  } catch {
    return false;
  }
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

    // Build/update thumbs for every source image.
    for (const file of sources) {
      const srcPath = path.join(mainDir, file);
      const outPath = path.join(thumbDir, file.replace(SOURCE_RE, ".webp"));
      if (isUpToDate(srcPath, outPath)) {
        skipped++;
        continue;
      }
      if (!existsSync(thumbDir)) mkdirSync(thumbDir, { recursive: true });
      await buildThumb(srcPath, outPath);
      built++;
    }

    // Remove orphaned thumbs that no longer have a matching source in main/.
    if (existsSync(thumbDir)) {
      const expectedThumbs = new Set(sources.map((f) => f.replace(SOURCE_RE, ".webp")));
      for (const thumbFile of readdirSync(thumbDir).filter((f) => /\.webp$/i.test(f))) {
        if (!expectedThumbs.has(thumbFile)) {
          rmSync(path.join(thumbDir, thumbFile));
          removed++;
        }
      }
    }
  }
  const removedStr = removed ? `, removed ${removed} orphans` : "";
  console.log(`[thumbs] built ${built}, skipped ${skipped} (up to date)${removedStr}.`);
}

run().catch((err) => {
  console.error("[thumbs] failed:", err);
  process.exit(1);
});
