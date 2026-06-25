/**
 * Compute the aligned seed item from a wardrobe_items row, carrying forward
 * image URLs (image / gallery / colourVariants) from the existing local seed.
 *
 * Single truth: wardrobe_items is the metadata source. Images come from the seed
 * (R2 URLs set during migration; preserved across future align runs).
 */

import { cloudRowToSeedItem } from "./cloud-to-seed.mjs";

/** Image-bearing keys always carried forward from the existing seed, never from cloud. */
const IMAGE_KEYS = ["image", "gallery", "colourVariants"];

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

/**
 * @param {Record<string, unknown>} cloudRow   raw wardrobe_items row
 * @param {null} _patch                        unused (override layer retired)
 * @param {Record<string, unknown> | null} localSeed  existing seed item (image carry-forward)
 * @returns {Record<string, unknown> | null}
 */
export function alignedSeedItem(cloudRow, _patch, localSeed) {
  const base = cloudRowToSeedItem(cloudRow);
  if (!base) return null;

  const out = { ...base };

  const meta = isPlainObject(out.metadata) ? { ...out.metadata } : {};
  if (Object.keys(meta).length) out.metadata = meta;
  else delete out.metadata;

  // Images: always carry forward from seed (R2 URLs set during migration).
  for (const k of IMAGE_KEYS) {
    delete out[k];
    if (localSeed && localSeed[k] !== undefined) out[k] = localSeed[k];
  }

  return out;
}

/**
 * Shallow field-level diff between two seed items, ignoring image keys.
 * @returns {{ field: string, from: unknown, to: unknown }[]}
 */
export function diffSeedMetadata(before, after) {
  const skip = new Set(IMAGE_KEYS);
  const keys = new Set([...Object.keys(before || {}), ...Object.keys(after || {})]);
  const out = [];
  for (const k of keys) {
    if (skip.has(k)) continue;
    const a = JSON.stringify(before?.[k] ?? null);
    const b = JSON.stringify(after?.[k] ?? null);
    if (a !== b) out.push({ field: k, from: before?.[k], to: after?.[k] });
  }
  return out;
}
