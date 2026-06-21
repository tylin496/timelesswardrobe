#!/usr/bin/env node
/**
 * Generate transparent cutout thumbnails for wardrobe items.
 *
 * For each `images/wardrobe/<item>/main/<n>.<ext>` we write
 * `images/wardrobe/<item>/cutout/<n>.webp`: the transparent main source scaled
 * to fit 360×480 — NO background composite. These are used only by the Saved
 * Outfits flatlay, where each piece sits as a clean cutout on the card's own
 * backdrop. `thumb/` (composited on background.jpg) remains the default
 * presentation asset for the grid + current-outfit strip.
 *
 * Kept small on purpose: Saved Outfits renders these pieces tiny, so 360×480 at
 * q72 is plenty. Cutouts are RGBA, so they are served static (never resized via
 * Supabase/Vercel, which reject alpha) — the native size is the display size.
 *
 * Staleness is detected via content hashes in cutout/.manifest.json (mtime is
 * unreliable for copied/restored/batch-processed files).
 *
 * Usage:
 *   node scripts/generate-wardrobe-cutout-thumbs.mjs          # only stale/missing
 *   node scripts/generate-wardrobe-cutout-thumbs.mjs --force  # rebuild everything
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WARDROBE_DIR = path.join(ROOT, "images", "wardrobe");
const MANIFEST_FILE = ".manifest.json";

const MAX_WIDTH = 360;
const MAX_HEIGHT = 480;
const QUALITY = 72;
const SOURCE_RE = /\.(webp|png|jpg|jpeg)$/i;

const force = process.argv.includes("--force");

function fileHash(filePath) {
  return createHash("md5").update(readFileSync(filePath)).digest("hex");
}

function loadManifest(dir) {
  const p = path.join(dir, MANIFEST_FILE);
  try {
    return existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : {};
  } catch {
    return {};
  }
}

function saveManifest(dir, manifest) {
  writeFileSync(path.join(dir, MANIFEST_FILE), JSON.stringify(manifest, null, 2));
}

async function buildCutout(srcPath, outPath) {
  // Resize the transparent cutout to fit the frame (preserves aspect + alpha).
  await sharp(srcPath)
    .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: "inside", withoutEnlargement: true })
    .webp({ quality: QUALITY, effort: 6, alphaQuality: 100 })
    .toFile(outPath);
}

function isUpToDate(srcPath, outPath, name, manifest) {
  if (force || !existsSync(outPath)) return false;
  const entry = manifest[name];
  if (!entry) return false;
  return entry.srcHash === fileHash(srcPath);
}

async function run() {
  if (!existsSync(WARDROBE_DIR)) {
    console.log("[cutouts] no images/wardrobe directory — nothing to do.");
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
    const cutoutDir = path.join(WARDROBE_DIR, item, "cutout");
    const manifest = loadManifest(cutoutDir);
    let manifestDirty = false;

    for (const file of sources) {
      const srcPath = path.join(mainDir, file);
      const name = file.replace(SOURCE_RE, ".webp");
      const outPath = path.join(cutoutDir, name);
      if (isUpToDate(srcPath, outPath, name, manifest)) {
        skipped++;
        continue;
      }
      if (!existsSync(cutoutDir)) mkdirSync(cutoutDir, { recursive: true });
      await buildCutout(srcPath, outPath);
      manifest[name] = { srcHash: fileHash(srcPath) };
      manifestDirty = true;
      built++;
    }

    // Remove orphaned cutouts that no longer have a matching source in main/.
    if (existsSync(cutoutDir)) {
      const expected = new Set(sources.map((f) => f.replace(SOURCE_RE, ".webp")));
      for (const f of readdirSync(cutoutDir).filter((f) => /\.webp$/i.test(f))) {
        if (!expected.has(f)) {
          rmSync(path.join(cutoutDir, f));
          delete manifest[f];
          manifestDirty = true;
          removed++;
        }
      }
    }

    if (manifestDirty) saveManifest(cutoutDir, manifest);
  }
  const removedStr = removed ? `, removed ${removed} orphans` : "";
  console.log(`[cutouts] built ${built}, skipped ${skipped} (up to date)${removedStr}.`);
}

run().catch((err) => {
  console.error("[cutouts] failed:", err);
  process.exit(1);
});
