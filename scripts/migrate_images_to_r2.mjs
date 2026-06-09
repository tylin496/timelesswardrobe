#!/usr/bin/env node
/**
 * Migrate all wardrobe images from Supabase Storage → Cloudflare R2.
 *
 *   node scripts/migrate_images_to_r2.mjs
 *
 * What it does:
 *   1. Lists all objects in Supabase Storage `wardrobe-images` bucket
 *   2. Downloads each file and uploads to R2 under the same path
 *   3. Updates wardrobe_items rows in Supabase DB — replaces Supabase Storage
 *      URLs with R2 public URLs
 *
 * Requires .env:
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 *   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID, R2_BUCKET, R2_PUBLIC_URL
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { S3Client, PutObjectCommand, ListObjectsV2Command } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

function loadEnv() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'")))
      val = val.slice(1, -1);
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_BUCKET = process.env.R2_BUCKET || "wardrobe-images";
const R2_PUBLIC_URL = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
const SUPABASE_BUCKET = "wardrobe-images";

for (const [k, v] of Object.entries({ SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ACCOUNT_ID, R2_PUBLIC_URL })) {
  if (!v) { console.error(`Missing env var: ${k}`); process.exit(1); }
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
});

function supabaseUrlToPath(url) {
  const s = String(url ?? "").trim().split("?")[0];
  const m = s.match(/\/storage\/v1\/(?:object\/public|object\/sign|render\/image\/public)\/wardrobe-images\/(.+)$/i);
  if (!m) return "";
  try { return decodeURIComponent(m[1]); } catch { return m[1]; }
}

function pathToR2Url(storagePath) {
  return `${R2_PUBLIC_URL}/${storagePath.split("/").map(encodeURIComponent).join("/")}`;
}

function replaceUrlInItem(url) {
  const p = supabaseUrlToPath(url);
  if (!p) return url;
  return pathToR2Url(p);
}

async function listAllSupabaseObjects() {
  const all = [];
  let offset = 0;
  const limit = 1000;
  while (true) {
    const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).list("", {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw new Error(`List error: ${error.message}`);
    if (!data?.length) break;
    // Recursively list subdirectories
    for (const obj of data) {
      if (obj.id === null) {
        // It's a folder — list inside
        const sub = await listFolder(obj.name);
        all.push(...sub);
      } else {
        all.push(obj.name);
      }
    }
    if (data.length < limit) break;
    offset += limit;
  }
  return all;
}

async function listFolder(prefix, depth = 0) {
  if (depth > 10) return [];
  const results = [];
  let offset = 0;
  const limit = 1000;
  while (true) {
    const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).list(prefix, {
      limit,
      offset,
      sortBy: { column: "name", order: "asc" },
    });
    if (error) throw new Error(`List error at ${prefix}: ${error.message}`);
    if (!data?.length) break;
    for (const obj of data) {
      const fullPath = `${prefix}/${obj.name}`;
      if (obj.id === null) {
        const sub = await listFolder(fullPath, depth + 1);
        results.push(...sub);
      } else {
        results.push(fullPath);
      }
    }
    if (data.length < limit) break;
    offset += limit;
  }
  return results;
}

async function migrateFile(storagePath) {
  const { data, error } = await supabase.storage.from(SUPABASE_BUCKET).download(storagePath);
  if (error) throw new Error(`Download failed for ${storagePath}: ${error.message}`);
  const buffer = Buffer.from(await data.arrayBuffer());
  const ext = path.extname(storagePath).toLowerCase();
  const contentTypeMap = { ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml" };
  const contentType = contentTypeMap[ext] || "application/octet-stream";
  await r2.send(new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: storagePath,
    Body: buffer,
    ContentType: contentType,
  }));
}

async function updateItemUrls(item) {
  const newImage = replaceUrlInItem(item.image);
  const newGallery = Array.isArray(item.gallery)
    ? item.gallery.map(replaceUrlInItem)
    : item.gallery;

  const changed =
    newImage !== item.image ||
    JSON.stringify(newGallery) !== JSON.stringify(item.gallery);

  if (!changed) return false;

  const { error } = await supabase
    .from("wardrobe_items")
    .update({ image: newImage, gallery: newGallery })
    .eq("id", item.id);

  if (error) throw new Error(`DB update failed for ${item.id}: ${error.message}`);
  return true;
}

async function main() {
  console.log("=== Timeless Wardrobe: Supabase Storage → Cloudflare R2 Migration ===\n");

  // Step 1: migrate files
  console.log("Step 1: Listing all files in Supabase Storage...");
  const files = await listAllSupabaseObjects();
  console.log(`  Found ${files.length} files.\n`);

  let uploaded = 0, skipped = 0, failed = 0;
  for (const filePath of files) {
    try {
      process.stdout.write(`  Uploading: ${filePath} ... `);
      await migrateFile(filePath);
      console.log("✓");
      uploaded++;
    } catch (err) {
      console.log(`✗ ${err.message}`);
      failed++;
    }
  }
  console.log(`\nFiles: ${uploaded} uploaded, ${failed} failed.\n`);

  // Step 2: update DB URLs
  console.log("Step 2: Updating image URLs in Supabase DB...");
  const { data: items, error: fetchErr } = await supabase.from("wardrobe_items").select("id, image, gallery");
  if (fetchErr) throw new Error(`Fetch items failed: ${fetchErr.message}`);

  let dbUpdated = 0;
  for (const item of items) {
    const changed = await updateItemUrls(item);
    if (changed) {
      console.log(`  Updated: ${item.id}`);
      dbUpdated++;
    }
  }
  console.log(`\nDB: ${dbUpdated} items updated.\n`);

  console.log("=== Migration complete ===");
  if (failed > 0) console.log(`⚠️  ${failed} files failed to upload — re-run the script to retry.`);
}

main().catch((err) => {
  console.error("Fatal:", err.message);
  process.exit(1);
});
