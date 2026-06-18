#!/usr/bin/env node
/**
 * Generate og-image.png (1200×630) from real collection item thumbnails.
 *
 * Image selection order:
 *   1. data/showcase-order.json   (updated by db:freeze-catalogue)
 *   2. Built-in fallback list     (hardcoded editorial selection)
 *
 * Layout: 5 portrait item panels, full-bleed, separated by 2px parchment dividers.
 * Branding appears as a dark gradient caption at the bottom.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(root, "og-image.png");

const FALLBACK_IDS = [
  "datejust-36-mod",
  "camel-hair-polo-coat",
  "balmacaan-coat",
  "beaufort-waxed-jacket",
  "glen-check-tweed-jacket",
];

const PANEL_COUNT = 5;
const WIDTH = 1200;
const HEIGHT = 630;
const GAP = 2; // px between panels (parchment colour shows through)
const PANEL_W = Math.floor((WIDTH - GAP * (PANEL_COUNT - 1)) / PANEL_COUNT); // 238
const PARCHMENT = { r: 251, g: 248, b: 241, alpha: 1 };

function resolveShowcaseIds() {
  const lockPath = path.join(root, "data", "showcase-order.json");
  if (fs.existsSync(lockPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(lockPath, "utf8"));
      if (Array.isArray(data.ids) && data.ids.length >= 3) return data.ids;
    } catch {
      // fall through
    }
  }
  return FALLBACK_IDS;
}

function thumbPath(id) {
  return path.join(root, "images", "wardrobe", id, "thumb", "1.webp");
}

function pickItems(ids) {
  const resolved = [];
  for (const id of ids) {
    const p = thumbPath(id);
    if (fs.existsSync(p)) {
      resolved.push({ id, p });
      if (resolved.length === PANEL_COUNT) break;
    }
  }
  if (resolved.length < PANEL_COUNT) {
    // Fill remaining slots from fallback
    for (const id of FALLBACK_IDS) {
      if (resolved.find((x) => x.id === id)) continue;
      const p = thumbPath(id);
      if (fs.existsSync(p)) {
        resolved.push({ id, p });
        if (resolved.length === PANEL_COUNT) break;
      }
    }
  }
  return resolved.slice(0, PANEL_COUNT);
}

function textSvg() {
  // Dark gradient overlay + branding text
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0a1f18" stop-opacity="0"/>
      <stop offset="42%" stop-color="#0a1f18" stop-opacity="0.62"/>
      <stop offset="100%" stop-color="#0a1f18" stop-opacity="0.88"/>
    </linearGradient>
    <!-- subtle vignette on all sides -->
    <radialGradient id="v" cx="50%" cy="50%" r="70%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.28"/>
    </radialGradient>
  </defs>

  <!-- bottom gradient for text legibility -->
  <rect x="0" y="${HEIGHT - 240}" width="${WIDTH}" height="240" fill="url(#g)"/>

  <!-- corner vignette -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#v)"/>

  <!-- thin top rule -->
  <line x1="48" y1="32" x2="${WIDTH - 48}" y2="32" stroke="#ffffff" stroke-opacity="0.18" stroke-width="1"/>

  <!-- top micro-label -->
  <text x="${WIDTH / 2}" y="26"
    text-anchor="middle"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-size="9" font-weight="500" letter-spacing="0.26em"
    fill="#ffffff" fill-opacity="0.38">PRIVATE ARCHIVE</text>

  <!-- main title -->
  <text x="${WIDTH / 2}" y="${HEIGHT - 72}"
    text-anchor="middle"
    font-family="Georgia, Times New Roman, serif"
    font-size="38" letter-spacing="0.28em"
    fill="#ffffff" fill-opacity="0.97">TIMELESS WARDROBE</text>

  <!-- divider rule -->
  <line x1="${WIDTH / 2 - 160}" y1="${HEIGHT - 52}" x2="${WIDTH / 2 + 160}" y2="${HEIGHT - 52}"
    stroke="#ffffff" stroke-opacity="0.24" stroke-width="0.8"/>

  <!-- subtitle -->
  <text x="${WIDTH / 2}" y="${HEIGHT - 30}"
    text-anchor="middle"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-size="13" font-weight="400" letter-spacing="0.08em"
    fill="#ffffff" fill-opacity="0.62">A private archive of classic menswear</text>
</svg>`;
}

const sharp = (await import("sharp")).default;

const ids = resolveShowcaseIds();
const items = pickItems(ids);

if (items.length === 0) {
  console.error("[og-build] No item thumbs found — cannot build collage OG image");
  process.exit(1);
}

console.log(`[og-build] Using items: ${items.map((x) => x.id).join(", ")}`);

// Resize each panel
const panelBuffers = await Promise.all(
  items.map(({ p }) =>
    sharp(p)
      .resize(PANEL_W, HEIGHT, { fit: "cover", position: sharp.strategy.attention })
      .toBuffer()
  )
);

// Composite: parchment base → panels (with gap spacing) → text overlay
const composites = [];

for (let i = 0; i < panelBuffers.length; i++) {
  composites.push({
    input: panelBuffers[i],
    left: i * (PANEL_W + GAP),
    top: 0,
  });
}

// Text + gradient overlay
composites.push({
  input: Buffer.from(textSvg()),
  left: 0,
  top: 0,
});

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 4,
    background: PARCHMENT,
  },
})
  .composite(composites)
  .png({ compressionLevel: 9 })
  .toFile(outPath);

console.log("[og-build] → og-image.png");
