#!/usr/bin/env node
/**
 * Convert wardrobe PNG/JPG to WebP and update references in catalogue data files.
 * Keeps originals on disk for safety (Vercel deploy storage is free; egress is what costs).
 *
 * Usage: node scripts/convert-wardrobe-images-to-webp.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const wardrobeDir = path.join(root, "images", "wardrobe");
const QUALITY = 82;
const CONCURRENCY = 6;

function walk(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

async function pMap(items, limit, fn) {
  const out = new Array(items.length);
  let i = 0;
  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= items.length) return;
      out[idx] = await fn(items[idx], idx);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
  return out;
}

const allFiles = walk(wardrobeDir);
const candidates = allFiles.filter((p) => /\.(png|jpe?g)$/i.test(p));
console.log(`Found ${candidates.length} PNG/JPG files under images/wardrobe/`);

const results = await pMap(candidates, CONCURRENCY, async (src) => {
  const dst = src.replace(/\.(png|jpe?g)$/i, ".webp");
  if (fs.existsSync(dst)) return { src, dst, status: "skip-exists" };
  try {
    const srcSize = fs.statSync(src).size;
    await sharp(src).webp({ quality: QUALITY, effort: 5 }).toFile(dst);
    const dstSize = fs.statSync(dst).size;
    return { src, dst, status: "ok", srcSize, dstSize };
  } catch (e) {
    return { src, dst, status: "fail", err: String(e?.message ?? e) };
  }
});

const ok = results.filter((r) => r.status === "ok");
const skipped = results.filter((r) => r.status === "skip-exists");
const failed = results.filter((r) => r.status === "fail");

const totalIn = ok.reduce((a, r) => a + r.srcSize, 0);
const totalOut = ok.reduce((a, r) => a + r.dstSize, 0);

console.log(`Converted: ${ok.length}  Skipped (already .webp): ${skipped.length}  Failed: ${failed.length}`);
if (ok.length) {
  console.log(
    `Size: ${(totalIn / 1024 / 1024).toFixed(1)} MB → ${(totalOut / 1024 / 1024).toFixed(1)} MB ` +
      `(saved ${(((totalIn - totalOut) / totalIn) * 100).toFixed(1)}%)`,
  );
}
if (failed.length) {
  console.error("Failures (first 5):", failed.slice(0, 5));
}

const mapping = new Map();
for (const r of ok) {
  const fromPath = "/" + path.relative(root, r.src).split(path.sep).join("/");
  const toPath = "/" + path.relative(root, r.dst).split(path.sep).join("/");
  mapping.set(fromPath, toPath);
}

const refTargets = [
  "data/wardrobe.js",
  "data/wardrobe-local-gallery-manifest.json",
  "data/custom-items.json",
  "data/editorial-stories.json",
];

let totalRefs = 0;
for (const rel of refTargets) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) continue;
  let txt = fs.readFileSync(full, "utf8");
  let count = 0;
  for (const [from, to] of mapping) {
    if (!txt.includes(from)) continue;
    const occurrences = txt.split(from).length - 1;
    txt = txt.split(from).join(to);
    count += occurrences;
  }
  // Sweep: catch any lingering .png/.jpg refs that already had a .webp twin on
  // disk from a prior run (e.g. after re-running `db:backup-to-local`, which
  // rewrites seed back to the original extensions).
  const lingerRe = /\/images\/wardrobe\/[^"]+\.(png|jpe?g)/g;
  for (const ref of new Set(txt.match(lingerRe) || [])) {
    const webpRef = ref.replace(/\.(png|jpe?g)$/i, ".webp");
    if (fs.existsSync(path.join(root, webpRef))) {
      const occurrences = txt.split(ref).length - 1;
      txt = txt.split(ref).join(webpRef);
      count += occurrences;
    }
  }
  if (count > 0) {
    fs.writeFileSync(full, txt);
    console.log(`  ${rel}: ${count} refs updated`);
    totalRefs += count;
  }
}
console.log(`Total reference updates: ${totalRefs}`);
