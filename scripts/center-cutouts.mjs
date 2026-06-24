#!/usr/bin/env node
/**
 * Force-centre the COVER cutout (1.webp) of every item, WITHOUT resizing.
 *
 * Cover cutouts are placed by hand, so the garment sits at slightly different
 * offsets frame-to-frame. This trims the transparent margin to the content
 * bounding box, then re-composites it dead-centre (horizontal + vertical) on a
 * fresh transparent canvas of the SAME dimensions. Garment scale is untouched;
 * only the position changes. Re-encoded lossless, so no generation loss.
 *
 * This is a SOURCE normaliser that runs BEFORE the thumb / cutout generators in
 * the build + dev pipeline, so any newly-added cover is auto-centred — there is
 * no manual step and no exception. Only real cutouts are processed; full-
 * background / lifestyle photos (no meaningful alpha) are detected and skipped.
 *
 * Scope: only `1.webp` (the grid cover) under main/ and variants/<colour>/.
 *
 * Idempotent + hash-gated via images/wardrobe/.center-manifest.json: a file is
 * re-centred only when its bytes differ from the last centred output, so repeat
 * runs (and the dev-server file watcher) settle without churn.
 *
 * Usage:
 *   node scripts/center-cutouts.mjs           # centre stale/new covers
 *   node scripts/center-cutouts.mjs --force   # re-centre everything
 *   node scripts/center-cutouts.mjs --dry     # report only, write nothing
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

// Alpha threshold for centroid calculation: pixels above this are treated as the
// solid product (not cast shadows). Shadows are typically alpha < 80; the actual
// object is alpha ≈ 200–255.
const SOLID_ALPHA = 80;

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const WARDROBE_DIR = path.join(ROOT, "images", "wardrobe");
const MANIFEST_PATH = path.join(WARDROBE_DIR, ".center-manifest.json");
const COVER_RE = /^1\.webp$/i;
const TRIM_THRESHOLD = 10;

const force = process.argv.includes("--force");
const dry = process.argv.includes("--dry");

function hash(buf) {
  return createHash("md5").update(buf).digest("hex");
}

function loadManifest() {
  try {
    return existsSync(MANIFEST_PATH) ? JSON.parse(readFileSync(MANIFEST_PATH, "utf8")) : {};
  } catch {
    return {};
  }
}

async function isCutout(srcPath) {
  const m = await sharp(srcPath).metadata();
  if (!m.hasAlpha) return false;
  const { data, info } = await sharp(srcPath)
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true });
  let trans = 0;
  for (let i = 0; i < data.length; i++) if (data[i] < 16) trans++;
  const frac = trans / data.length;
  const { width: w, height: h } = info;
  const corners = [data[0], data[w - 1], data[(h - 1) * w], data[(h - 1) * w + w - 1]];
  const cornersTrans = corners.filter((v) => v < 16).length;
  return frac > 0.08 && cornersTrans >= 3;
}

async function centredBytes(srcPath) {
  const m = await sharp(srcPath).metadata();
  const W = m.width, H = m.height;

  // Trim with low threshold to preserve soft edges and cast shadows in the output.
  const trimmed = await sharp(srcPath)
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: TRIM_THRESHOLD })
    .toBuffer();
  const tMeta = await sharp(trimmed).metadata();
  const tw = tMeta.width, th = tMeta.height;

  // Compute centroid of solid pixels (excludes shadows) within the trimmed image.
  // gravity:'centre' uses bbox centre which is biased by shadow bounding boxes.
  const { data: alpha } = await sharp(trimmed)
    .ensureAlpha()
    .extractChannel(3)
    .raw()
    .toBuffer({ resolveWithObject: true });

  let sumX = 0, sumY = 0, count = 0;
  for (let y = 0; y < th; y++) {
    for (let x = 0; x < tw; x++) {
      if (alpha[y * tw + x] >= SOLID_ALPHA) { sumX += x; sumY += y; count++; }
    }
  }
  // Fallback: use all non-transparent pixels if no solid content found.
  if (count === 0) {
    for (let i = 0; i < alpha.length; i++) {
      if (alpha[i] > 0) { sumX += i % tw; sumY += Math.floor(i / tw); count++; }
    }
  }
  if (count === 0) return readFileSync(srcPath);

  // Position trimmed image so solid centroid aligns with canvas centre.
  let left = Math.round(W / 2 - sumX / count);
  let top  = Math.round(H / 2 - sumY / count);

  // Clip any portion that would land outside the canvas.
  let cropLeft = 0, cropTop = 0, cropW = tw, cropH = th;
  if (left < 0) { cropLeft = -left; cropW += left; left = 0; }
  if (top  < 0) { cropTop  = -top;  cropH += top;  top  = 0; }
  if (left + cropW > W) cropW = W - left;
  if (top  + cropH > H) cropH = H - top;

  let input = trimmed;
  if (cropLeft > 0 || cropTop > 0 || cropW < tw || cropH < th) {
    input = await sharp(trimmed)
      .extract({ left: cropLeft, top: cropTop, width: Math.max(1, cropW), height: Math.max(1, cropH) })
      .toBuffer();
  }

  return sharp({
    create: { width: W, height: H, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } },
  })
    .composite([{ input, left, top }])
    .webp({ lossless: true, effort: 6 })
    .toBuffer();
}

// Every cover (1.webp) under main/ and variants/<colour>/.
function collectCovers() {
  const out = [];
  if (!existsSync(WARDROBE_DIR)) return out;
  for (const item of readdirSync(WARDROBE_DIR)) {
    const base = path.join(WARDROBE_DIR, item);
    if (!statSync(base).isDirectory()) continue;
    // Prefer cutout/1.webp (dedicated transparent version); fall back to main/1.webp
    // for items where the main photo itself is a cutout (no background).
    const cutoutCover = path.join(base, "cutout", "1.webp");
    const mainCover = path.join(base, "main", "1.webp");
    if (existsSync(cutoutCover)) out.push(cutoutCover);
    else if (existsSync(mainCover)) out.push(mainCover);
    const variantsDir = path.join(base, "variants");
    if (existsSync(variantsDir)) {
      for (const colour of readdirSync(variantsDir)) {
        const cDir = path.join(variantsDir, colour);
        if (statSync(cDir).isDirectory()) {
          const vCutout = path.join(cDir, "cutout", "1.webp");
          const vMain = path.join(cDir, "1.webp");
          if (existsSync(vCutout)) out.push(vCutout);
          else if (existsSync(vMain)) out.push(vMain);
        }
      }
    }
  }
  return out.filter((p) => COVER_RE.test(path.basename(p)));
}

const manifest = loadManifest();
const covers = collectCovers();
let centred = 0;
let skipped = 0;
let already = 0;

for (const src of covers) {
  const rel = path.relative(WARDROBE_DIR, src);
  const currentHash = hash(readFileSync(src));
  // Already centred (bytes match last centred output) — nothing to do.
  if (!force && manifest[rel] === currentHash) {
    already++;
    continue;
  }
  if (!(await isCutout(src))) {
    skipped++;
    continue;
  }
  const out = await centredBytes(src);
  if (!dry) {
    writeFileSync(src, out);
    manifest[rel] = hash(out);
  }
  centred++;
}

if (!dry && centred > 0) writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(
  `[center] ${dry ? "would centre" : "centred"} ${centred}, unchanged ${already}, skipped ${skipped} non-cutouts (covers: ${covers.length}).`,
);
