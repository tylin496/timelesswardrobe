#!/usr/bin/env node
/**
 * Export every wardrobe item's TEXT fields from data/wardrobe.js into one
 * editable JSON file (image/gallery deliberately excluded — text only).
 *
 * Edit the output by hand, then apply it back with:
 *   npm run text:apply
 *
 * Usage:
 *   npm run text:export                 # -> data/local/wardrobe-text-<date>.json
 *   node scripts/export-wardrobe-text.mjs path/to/out.json
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  rowToLocalTextRecord,
  buildTextLocalPayload,
  readFileItemsFromJs,
} from "./lib/wardrobe-text.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const seedPath = path.join(root, "data", "wardrobe.js");

const items = readFileItemsFromJs(seedPath, fs).map(rowToLocalTextRecord);
const payload = buildTextLocalPayload(items, "seed");

const stamp = new Date().toISOString().slice(0, 10);
const outPath = process.argv[2]
  ? path.resolve(root, process.argv[2])
  : path.join(root, "data", "local", `wardrobe-text-${stamp}.json`);

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), "utf8");

console.log(`Exported text for ${items.length} pieces → ${path.relative(root, outPath)}`);
console.log("Edit it, then run: npm run text:apply");
