#!/usr/bin/env node
/**
 * Generate transparent WebP thumbnails for wardrobe images.
 *
 * Cover cutouts are RGBA (they float on the page background), which Vercel /
 * Supabase image optimisation reject. So we ship our own small static variant:
 * for each `images/wardrobe/<item>/main/<n>.<ext>` we write
 * `images/wardrobe/<item>/thumb/<n>.webp`, resized to fit 720×960 with alpha
 * preserved. Grid / home / menu cards load the thumb; the detail + zoom views
 * keep loading the full-resolution original.
 *
 * Idempotent: skips thumbs that are already newer than their source.
 *
 * Usage:
 *   node scripts/generate-wardrobe-thumbs.mjs          # only stale/missing
 *   node scripts/generate-wardrobe-thumbs.mjs --force  # rebuild everything
 */
import { existsSync, mkdirSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WARDROBE_DIR = path.join(ROOT, "images", "wardrobe");

const MAX_WIDTH = 720;
const MAX_HEIGHT = 960;
const QUALITY = 80;
const SOURCE_RE = /\.(webp|png|jpg|jpeg)$/i;

const force = process.argv.includes("--force");

async function buildThumb(srcPath, outPath) {
  await sharp(srcPath)
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6, alphaQuality: 100 })
    .toFile(outPath);
}

function isUpToDate(srcPath, outPath) {
  if (force || !existsSync(outPath)) return false;
  try {
    return statSync(outPath).mtimeMs >= statSync(srcPath).mtimeMs;
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
  for (const item of items) {
    const mainDir = path.join(WARDROBE_DIR, item, "main");
    if (!existsSync(mainDir)) continue;
    const sources = readdirSync(mainDir).filter((f) => SOURCE_RE.test(f));
    if (!sources.length) continue;
    const thumbDir = path.join(WARDROBE_DIR, item, "thumb");
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
  }
  console.log(`[thumbs] built ${built}, skipped ${skipped} (up to date).`);
}

run().catch((err) => {
  console.error("[thumbs] failed:", err);
  process.exit(1);
});
