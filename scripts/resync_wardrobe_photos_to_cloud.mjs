#!/usr/bin/env node
/**
 * Force-replace one item's cloud photos with the local files on disk.
 *
 *   node scripts/resync_wardrobe_photos_to_cloud.mjs <item-id>
 *
 * Use when local images/wardrobe/<id>/main/{cover,gallery/*} drifted from
 * Supabase Storage (same filenames but different image content) and the in-app
 * editor save skipped re-upload because path keys matched.
 *
 * Walks images/wardrobe/<id>/main/ on disk, uploads cover.* + gallery/*.* to
 * the matching Supabase Storage keys with upsert=true, then rewrites
 * wardrobe_items.image / .gallery to the canonical public URLs in seed order.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const BUCKET = "wardrobe-images";
const itemId = String(process.argv[2] ?? "").trim();

if (!itemId) {
  console.error("Usage: node scripts/resync_wardrobe_photos_to_cloud.mjs <item-id>");
  process.exit(1);
}

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

loadEnvFile();
const supabaseUrl = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const MIME_BY_EXT = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".avif": "image/avif",
};

function inferMime(file) {
  return MIME_BY_EXT[path.extname(file).toLowerCase()] ?? "application/octet-stream";
}

function publicUrl(key) {
  const encoded = key.split("/").map((s) => encodeURIComponent(s)).join("/");
  return `${supabaseUrl.replace(/\/$/, "")}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

async function uploadFile(client, absPath, key) {
  const body = fs.readFileSync(absPath);
  const { error } = await client.storage.from(BUCKET).upload(key, body, {
    contentType: inferMime(absPath),
    upsert: true,
    cacheControl: "31536000",
  });
  if (error) throw new Error(`upload ${key}: ${error.message}`);
  await deleteSiblingExtensions(client, key);
  return publicUrl(key);
}

/** Drop `{slot}.{otherExt}` siblings — one logical slot must map to one Storage object. */
async function deleteSiblingExtensions(client, key) {
  const last = key.lastIndexOf("/");
  if (last < 0) return;
  const dir = key.slice(0, last);
  const file = key.slice(last + 1);
  const dot = file.lastIndexOf(".");
  if (dot <= 0) return;
  const base = file.slice(0, dot).toLowerCase();
  const { data, error } = await client.storage.from(BUCKET).list(dir, { limit: 100 });
  if (error || !Array.isArray(data)) return;
  const toRemove = data
    .map((e) => String(e?.name ?? ""))
    .filter((name) => {
      if (!name || name === file) return false;
      const idx = name.lastIndexOf(".");
      if (idx <= 0) return false;
      return name.slice(0, idx).toLowerCase() === base;
    })
    .map((name) => `${dir}/${name}`);
  if (!toRemove.length) return;
  await client.storage.from(BUCKET).remove(toRemove);
  for (const p of toRemove) console.log(`  · removed sibling ${p}`);
}

const itemDir = path.join(root, "images", "wardrobe", itemId, "main");
if (!fs.existsSync(itemDir)) {
  console.error(`No local folder: images/wardrobe/${itemId}/main/`);
  process.exit(1);
}

const coverCandidates = fs
  .readdirSync(itemDir, { withFileTypes: true })
  .filter((e) => e.isFile() && /^cover\.(png|jpe?g|webp|avif)$/i.test(e.name))
  .map((e) => e.name);

const galleryDir = path.join(itemDir, "gallery");
const galleryNames = fs.existsSync(galleryDir)
  ? fs
      .readdirSync(galleryDir, { withFileTypes: true })
      .filter((e) => e.isFile() && /\.(png|jpe?g|webp|avif)$/i.test(e.name))
      .map((e) => e.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
  : [];

if (!coverCandidates.length && !galleryNames.length) {
  console.error(`No cover or gallery images in ${itemDir}`);
  process.exit(1);
}

const client = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

let coverUrl = "";
if (coverCandidates.length) {
  const name = coverCandidates[0];
  const key = `${itemId}/main/${name}`;
  coverUrl = await uploadFile(client, path.join(itemDir, name), key);
  console.log(`✓ cover  ${key}`);
}

const galleryUrls = [];
for (const name of galleryNames) {
  const key = `${itemId}/main/gallery/${name}`;
  const url = await uploadFile(client, path.join(galleryDir, name), key);
  galleryUrls.push(url);
  console.log(`✓ gallery ${key}`);
}

const patch = {
  id: itemId,
  image: coverUrl || undefined,
  gallery: galleryUrls,
  updated_at: new Date().toISOString(),
};
Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]);

const { error: upErr } = await client
  .from("wardrobe_items")
  .update(patch)
  .eq("id", itemId);
if (upErr) {
  console.warn(`wardrobe_items update failed: ${upErr.message}`);
} else {
  console.log(`✓ wardrobe_items.image + gallery rewritten (${galleryUrls.length} gallery)`);
}

console.log("Done. Hard-refresh the site (Supabase render cache may still serve old bytes for a few minutes; use ?cb=… to bust).");
