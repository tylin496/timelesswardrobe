/**
 * Compute the "online truth" seed item for a catalogue piece by layering the
 * runtime sources the app itself uses, WITHOUT touching local image URLs.
 *
 * Runtime truth (mirrors app.js mergeWardrobeFromSources + applyCollectionOverrideToRow):
 *   1. wardrobe_items row           — base metadata
 *   2. collection_overrides[id]     — admin edits, override wins (incl. empty = clear)
 *
 * Images are LOCAL-first and admin-maintained: image / gallery / colourVariants
 * are always carried forward from the existing seed, never from the cloud. This
 * is the same media-preservation rule applyCollectionOverrideToRow enforces for
 * local-catalogue rows.
 *
 * The collection_overrides patch is stored WITHOUT `metadata` and `category`
 * (the writer deletes them — see app.js saveItem), and keeps price / currency /
 * secondary-colour fields at the TOP level. We fold those back into `metadata`
 * so the result matches the seed file shape.
 */

import { cloudRowToSeedItem } from "./cloud-to-seed.mjs";

/** Text fields the override may overwrite (empty string = clear the field). */
const OVERRIDE_TEXT_FIELDS = [
  "brand",
  "name",
  "season",
  "colour",
  "colourCode",
  "fabric",
  "weight",
  "size",
  "measuredDimensions",
  "purchaseDate",
  "notes",
  "section",
  "pillar",
];

/** Top-level override fields that belong inside `metadata` in seed shape. */
const OVERRIDE_META_FIELDS = [
  "price",
  "priceCurrency",
  "basicColour",
  "secondaryColour",
  "secondaryColourCode",
  "secondaryBasicColour",
];

/** Image-bearing keys that must always come from the local seed, never cloud. */
const LOCAL_IMAGE_KEYS = ["image", "gallery", "colourVariants"];

function isPlainObject(v) {
  return v && typeof v === "object" && !Array.isArray(v);
}

/**
 * @param {Record<string, unknown>} cloudRow      raw wardrobe_items row
 * @param {Record<string, unknown> | null} patch  collection_overrides[id] (camelCase) or null
 * @param {Record<string, unknown> | null} localSeed  existing seed item (for image carry-forward)
 * @returns {Record<string, unknown> | null}
 */
export function alignedSeedItem(cloudRow, patch, localSeed) {
  const base = cloudRowToSeedItem(cloudRow);
  if (!base) return null;

  const out = { ...base };
  const meta = isPlainObject(out.metadata) ? { ...out.metadata } : {};

  if (isPlainObject(patch)) {
    // 1. Text fields: override wins; empty string clears.
    for (const f of OVERRIDE_TEXT_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(patch, f)) continue;
      const v = String(patch[f] ?? "").trim();
      if (v) out[f] = v;
      else delete out[f];
    }
    // 2. Metadata-bound top-level fields fold into metadata; empty clears.
    for (const f of OVERRIDE_META_FIELDS) {
      if (!Object.prototype.hasOwnProperty.call(patch, f)) continue;
      const raw = patch[f];
      if (raw === "" || raw === null || raw === undefined) {
        delete meta[f];
      } else {
        meta[f] = typeof raw === "string" ? raw.trim() : raw;
      }
    }
    // 3. Explicit metadata object on the patch (rare — writer usually strips it).
    if (isPlainObject(patch.metadata)) Object.assign(meta, patch.metadata);
  }

  if (Object.keys(meta).length) out.metadata = meta;
  else delete out.metadata;

  // 4. Images: always from local seed (admin-maintained, local-first).
  for (const k of LOCAL_IMAGE_KEYS) {
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
  const skip = new Set(LOCAL_IMAGE_KEYS);
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
