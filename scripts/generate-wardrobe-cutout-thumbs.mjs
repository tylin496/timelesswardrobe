#!/usr/bin/env node
/**
 * Generate transparent cutout thumbnails for wardrobe items.
 *
 * For each `images/wardrobe/<item>/main/<n>.<ext>` we write
 * `images/wardrobe/<item>/cutout/<n>.webp`: the transparent main source scaled
 * to fit 720×960 — NO background composite. Matches the collection grid card
 * render size so cutouts can serve as grid covers without upscaling.
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

const MAX_WIDTH = 720;
const MAX_HEIGHT = 960;
const QUALITY = 80;
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

// preview.webp is a tiny pre-made swatch (used directly as previewImage), never a cutout source.
const isCutoutSource = (f) => SOURCE_RE.test(f) && !/^preview\./i.test(f);

/**
 * Source→output dir pairs for an item. main/ cutouts are siblings (item/cutout/);
 * each variant's source images live directly in variants/<key>/, so their cutouts
 * nest one level deeper at variants/<key>/cutout/.
 */
function collectCutoutGroups(itemDir) {
  const groups = [];
  const mainDir = path.join(itemDir, "main");
  if (existsSync(mainDir)) groups.push({ srcDir: mainDir, outDir: path.join(itemDir, "cutout") });
  const variantsDir = path.join(itemDir, "variants");
  if (existsSync(variantsDir)) {
    for (const d of readdirSync(variantsDir, { withFileTypes: true })) {
      if (!d.isDirectory()) continue;
      const vDir = path.join(variantsDir, d.name);
      groups.push({ srcDir: vDir, outDir: path.join(vDir, "cutout") });
    }
  }
  return groups;
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
    for (const { srcDir, outDir } of collectCutoutGroups(path.join(WARDROBE_DIR, item))) {
      const sources = readdirSync(srcDir).filter(isCutoutSource);
      const manifest = loadManifest(outDir);
      let manifestDirty = false;

      for (const file of sources) {
        const srcPath = path.join(srcDir, file);
        const name = file.replace(SOURCE_RE, ".webp");
        const outPath = path.join(outDir, name);
        if (isUpToDate(srcPath, outPath, name, manifest)) {
          skipped++;
          continue;
        }
        if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true });
        await buildCutout(srcPath, outPath);
        manifest[name] = { srcHash: fileHash(srcPath) };
        manifestDirty = true;
        built++;
      }

      // Remove orphaned cutouts that no longer have a matching source.
      if (existsSync(outDir)) {
        const expected = new Set(sources.map((f) => f.replace(SOURCE_RE, ".webp")));
        for (const f of readdirSync(outDir).filter((f) => /\.webp$/i.test(f))) {
          if (!expected.has(f)) {
            rmSync(path.join(outDir, f));
            delete manifest[f];
            manifestDirty = true;
            removed++;
          }
        }
      }

      if (manifestDirty) saveManifest(outDir, manifest);
    }
  }
  const removedStr = removed ? `, removed ${removed} orphans` : "";
  console.log(`[cutouts] built ${built}, skipped ${skipped} (up to date)${removedStr}.`);
}

run().catch((err) => {
  console.error("[cutouts] failed:", err);
  process.exit(1);
});
