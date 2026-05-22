/**
 * Read / write `data/wardrobe.js` (WARDROBE_ITEMS array).
 */
import fs from "node:fs";
import path from "node:path";
import { formatWardrobeJsFile } from "./cloud-to-seed.mjs";

const LOCAL_IMAGES_NOTE =
  "Images: local files under `/images/wardrobe/` (edit with `npm run dev`, then commit + push).";

/** @param {string} root */
export function readWardrobeItems(root) {
  const wardrobeJsPath = path.join(root, "data", "wardrobe.js");
  const code = fs.readFileSync(wardrobeJsPath, "utf8");
  const fn = new Function(`${code}\n;return WARDROBE_ITEMS;`);
  const items = fn();
  if (!Array.isArray(items)) {
    throw new Error("WARDROBE_ITEMS not found or not an array in data/wardrobe.js");
  }
  return items;
}

/**
 * @param {string} root
 * @param {object[]} items
 * @param {string} [frozenAt]
 */
export function writeWardrobeItems(root, items, frozenAt = new Date().toISOString()) {
  const wardrobeJsPath = path.join(root, "data", "wardrobe.js");
  let body = formatWardrobeJsFile(items, frozenAt);
  body = body.replace(
    /Images: full `https:\/\/…` public URLs \(Supabase `wardrobe-images` bucket\)\./,
    LOCAL_IMAGES_NOTE
  );
  body = body.replace(
    /Images: local files under `\/images\/wardrobe\/`[^\n]*/,
    LOCAL_IMAGES_NOTE
  );
  fs.writeFileSync(wardrobeJsPath, body, "utf8");
}

/**
 * @param {string} root
 * @param {Record<string, unknown>} item
 */
export function upsertWardrobeItemInFile(root, item) {
  const id = String(item?.id ?? "").trim();
  if (!id) throw new Error("Item id is required");
  const items = readWardrobeItems(root);
  const idx = items.findIndex((row) => String(row?.id ?? "") === id);
  const next = { ...item, id };
  if (idx >= 0) items[idx] = next;
  else items.push(next);
  writeWardrobeItems(root, items);
  return next;
}
