#!/usr/bin/env node
/**
 * Generate og-image.png (1200×630) from real collection item thumbnails.
 *
 * Item selection: items with metadata.showcase_rank set in data/wardrobe.js,
 * sorted by rank. Falls back to a hardcoded editorial selection when fewer
 * than 5 showcase items are present in the frozen seed.
 *
 * Layout:
 *   ┌──────────────────────┬──────────┬──────────┐
 *   │                      │  item 2  │  item 4  │
 *   │   hero (item 1)      ├──────────┼──────────┤
 *   │                      │  item 3  │  item 5  │
 *   └──────────────────────┴──────────┴──────────┘
 *
 * Branding (dark gradient + text) is overlaid on the hero panel only.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outPath = path.join(root, "og-image.png");

// ── Dimensions ────────────────────────────────────────────────────────────────

const W = 1200;
const H = 630;
const GAP = 3; // px between panels

// Hero panel: left ~55%
const HERO_W = 660;
const HERO_H = H;

// Right 2×2 grid fills the rest
const RIGHT_W = W - HERO_W - GAP;          // 537
const CELL_W = Math.floor((RIGHT_W - GAP) / 2);  // 267
const CELL_H = Math.floor((H - GAP) / 2);         // 313

// ── Item selection ────────────────────────────────────────────────────────────

const FALLBACK_IDS = [
  "polo-coat",
  "datejust-36-mod",
  "balmacaan-coat",
  "beaufort-waxed-jacket",
  "glen-check-tweed-jacket",
];

function loadWardrobeItems() {
  const src = fs.readFileSync(path.join(root, "data", "wardrobe.js"), "utf8");
  const fn = new Function(`${src}\n; return WARDROBE_ITEMS;`);
  return fn();
}

// Originals live on R2 behind the img worker — local images/wardrobe/ copies
// were retired with the R2 migration, so the CDN is the normal source here.
const CDN_BASE = "https://img.timelesswardrobe.uk";

async function fetchImageBuffer(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return Buffer.from(await res.arrayBuffer());
  } catch {
    return null;
  }
}

// Source image for an item: prefers cutout/1.webp (transparent, 720×960),
// falls back to main/1.webp, then the seed's own image URL. Local disk is
// checked first so a dev with local copies skips the network.
async function thumbBufferForItem(item) {
  const id = String(item?.id ?? "").trim();
  if (id) {
    for (const slot of ["cutout", "main"]) {
      const local = path.join(root, "images", "wardrobe", id, slot, "1.webp");
      if (fs.existsSync(local)) return fs.readFileSync(local);
    }
    for (const slot of ["cutout", "main"]) {
      const buf = await fetchImageBuffer(`${CDN_BASE}/wardrobe/${encodeURIComponent(id)}/${slot}/1.webp`);
      if (buf) return buf;
    }
  }
  const raw = String(item?.image ?? "").trim();
  if (/^https?:\/\//i.test(raw)) return fetchImageBuffer(raw);
  return null;
}

async function resolveItems() {
  const all = loadWardrobeItems();
  const byId = new Map(all.map((it) => [String(it.id), it]));

  // Prefer items with showcase_rank, sorted by rank; then top up from fallback.
  const ranked = all
    .filter((it) => {
      const r = it?.metadata?.showcase_rank;
      return typeof r === "number" && Number.isInteger(r) && r >= 0;
    })
    .sort((a, b) => a.metadata.showcase_rank - b.metadata.showcase_rank);
  const candidates = [...ranked, ...FALLBACK_IDS.map((id) => byId.get(id))];

  const picks = []; // { id, buf }
  const seen = new Set();
  for (const item of candidates) {
    if (picks.length >= 5) break;
    const id = String(item?.id ?? "").trim();
    if (!id || seen.has(id)) continue;
    const buf = await thumbBufferForItem(item);
    if (!buf) continue;
    seen.add(id);
    picks.push({ id, buf });
  }
  return picks;
}

// ── Text overlay (hero panel only) ───────────────────────────────────────────

function heroOverlaySvg() {
  const cx = HERO_W / 2;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${HERO_W}" height="${HERO_H}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#0d1f18" stop-opacity="0"/>
      <stop offset="48%"  stop-color="#0d1f18" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#0d1f18" stop-opacity="0.86"/>
    </linearGradient>
    <radialGradient id="v" cx="50%" cy="50%" r="70%">
      <stop offset="55%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.22"/>
    </radialGradient>
  </defs>

  <!-- bottom gradient for text legibility -->
  <rect x="0" y="${HERO_H - 260}" width="${HERO_W}" height="260" fill="url(#g)"/>

  <!-- subtle vignette -->
  <rect width="${HERO_W}" height="${HERO_H}" fill="url(#v)"/>

  <!-- top micro-label -->
  <text x="${cx}" y="28"
    text-anchor="middle"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-size="9" font-weight="500" letter-spacing="0.26em"
    fill="#ffffff" fill-opacity="0.36">PRIVATE ARCHIVE</text>
  <line x1="48" y1="35" x2="${HERO_W - 48}" y2="35"
    stroke="#ffffff" stroke-opacity="0.14" stroke-width="0.8"/>

  <!-- main title -->
  <text x="${cx}" y="${HERO_H - 76}"
    text-anchor="middle"
    font-family="Georgia, Times New Roman, serif"
    font-size="36" letter-spacing="0.28em"
    fill="#ffffff" fill-opacity="0.97">TIMELESS WARDROBE</text>

  <!-- rule -->
  <line x1="${cx - 130}" y1="${HERO_H - 56}" x2="${cx + 130}" y2="${HERO_H - 56}"
    stroke="#ffffff" stroke-opacity="0.22" stroke-width="0.8"/>

  <!-- subtitle -->
  <text x="${cx}" y="${HERO_H - 34}"
    text-anchor="middle"
    font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
    font-size="12.5" font-weight="400" letter-spacing="0.08em"
    fill="#ffffff" fill-opacity="0.58">A private archive of classic menswear</text>
</svg>`;
}

// ── Build ─────────────────────────────────────────────────────────────────────

const sharp = (await import("sharp")).default;

const picks = await resolveItems();
console.log(`[og-build] hero: ${picks[0]?.id}`);
console.log(`[og-build] supporting: ${picks.slice(1).map((p) => p.id).join(", ")}`);

if (picks.length < 5) {
  console.log(`[og-build] only ${picks.length}/5 thumbs found (local or CDN) — skipping og-image generation (keeping existing if present)`);
  process.exit(0);
}

// Resize each slot — contain keeps transparent cutouts from being cropped.
const [heroBuf, s2, s3, s4, s5] = await Promise.all([
  sharp(picks[0].buf)
    .resize(HERO_W, HERO_H, { fit: "contain", background: { r: 251, g: 248, b: 241, alpha: 1 } })
    .toBuffer(),
  sharp(picks[1].buf)
    .resize(CELL_W, CELL_H, { fit: "contain", background: { r: 251, g: 248, b: 241, alpha: 1 } })
    .toBuffer(),
  sharp(picks[2].buf)
    .resize(CELL_W, CELL_H, { fit: "contain", background: { r: 251, g: 248, b: 241, alpha: 1 } })
    .toBuffer(),
  sharp(picks[3].buf)
    .resize(CELL_W, CELL_H, { fit: "contain", background: { r: 251, g: 248, b: 241, alpha: 1 } })
    .toBuffer(),
  sharp(picks[4].buf)
    .resize(CELL_W, CELL_H, { fit: "contain", background: { r: 251, g: 248, b: 241, alpha: 1 } })
    .toBuffer(),
]);

// Hero overlay (gradient + text rendered into HERO_W×HERO_H SVG)
const overlayBuf = await sharp(Buffer.from(heroOverlaySvg()))
  .resize(HERO_W, HERO_H)
  .toBuffer();

// Composite onto parchment base
await sharp({
  create: {
    width: W,
    height: H,
    channels: 4,
    background: { r: 251, g: 248, b: 241, alpha: 1 },
  },
})
  .composite([
    // Hero
    { input: heroBuf,    left: 0,                   top: 0 },
    // Top-left supporting
    { input: s2,         left: HERO_W + GAP,         top: 0 },
    // Top-right supporting
    { input: s3,         left: HERO_W + GAP + CELL_W + GAP, top: 0 },
    // Bottom-left supporting
    { input: s4,         left: HERO_W + GAP,         top: CELL_H + GAP },
    // Bottom-right supporting
    { input: s5,         left: HERO_W + GAP + CELL_W + GAP, top: CELL_H + GAP },
    // Text overlay on hero
    { input: overlayBuf, left: 0,                   top: 0 },
  ])
  .png({ compressionLevel: 9 })
  .toFile(outPath);

console.log("[og-build] → og-image.png");
