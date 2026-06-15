#!/usr/bin/env node
/**
 * Rebuild data/wardrobe-local-gallery-manifest.json from canonical wardrobe ids
 * and the local images/wardrobe filesystem.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

import { manifestEntryForItem } from "./lib/wardrobe-local-files.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wardrobePath = path.join(root, "data", "wardrobe.js");
const manifestPath = path.join(root, "data", "wardrobe-local-gallery-manifest.json");

function loadItems() {
  const source = fs.readFileSync(wardrobePath, "utf8");
  return vm.runInNewContext(`${source}\n;WARDROBE_ITEMS;`, Object.create(null), {
    filename: wardrobePath,
  });
}

const items = loadItems();
if (!Array.isArray(items)) {
  console.error("WARDROBE_ITEMS not found in data/wardrobe.js");
  process.exit(1);
}

const manifestItems = {};
for (const item of items) {
  const id = String(item?.id ?? "").trim();
  if (!id) continue;
  manifestItems[id] = manifestEntryForItem(item, root);
}

const manifest = {
  _schema: "timeless-wardrobe-local-gallery-manifest-v1",
  generatedAt: new Date().toISOString(),
  items: manifestItems,
};

fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
console.log(`Wrote ${path.relative(root, manifestPath)} (${Object.keys(manifestItems).length} items).`);
