#!/usr/bin/env node
/**
 * Fail when wardrobe catalogue rows reference local image files that do not exist.
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const wardrobePath = path.join(root, "data", "wardrobe.js");

function loadWardrobeItems() {
  const source = fs.readFileSync(wardrobePath, "utf8");
  return vm.runInNewContext(`${source}\n;WARDROBE_ITEMS;`, Object.create(null), {
    filename: wardrobePath,
  });
}

function localImagePath(url) {
  const raw = String(url ?? "").trim().split("?")[0];
  if (!raw.startsWith("/images/")) return "";
  return raw.replace(/^\/+/, "");
}

function collectMediaUrls(item) {
  const urls = [item?.image, ...(Array.isArray(item?.gallery) ? item.gallery : [])];
  const variants = Array.isArray(item?.colourVariants) ? item.colourVariants : [];
  for (const variant of variants) {
    urls.push(variant?.image, variant?.previewImage);
    if (Array.isArray(variant?.gallery)) urls.push(...variant.gallery);
  }
  return urls.filter(Boolean);
}

const missing = [];
for (const item of loadWardrobeItems()) {
  const id = String(item?.id ?? "").trim() || "(missing id)";
  for (const url of collectMediaUrls(item)) {
    const rel = localImagePath(url);
    if (!rel) continue;
    if (!fs.existsSync(path.join(root, rel))) missing.push({ id, url: `/${rel}` });
  }
}

if (missing.length) {
  console.error(`Found ${missing.length} missing wardrobe local image reference(s):\n`);
  for (const hit of missing) console.error(`  ${hit.id}: ${hit.url}`);
  process.exit(1);
}

console.log("OK - all wardrobe local image references exist.");
