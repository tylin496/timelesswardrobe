#!/usr/bin/env node
/**
 * Upload images/wardrobe/ to R2 bucket (wardrobe-images).
 * R2 key: wardrobe/<id>/main/1.webp  (strips leading "images/" prefix)
 * CDN URL: https://img.timelesswardrobe.uk/wardrobe/<id>/...
 *
 * After uploading, seeds data/wardrobe.js with ?v=<md5> query params so
 * CDN cache is busted automatically when file content changes — no Supabase
 * updated_at touch required.
 *
 *   node scripts/upload-images-to-r2.mjs --dry-run   # list what would be uploaded
 *   node scripts/upload-images-to-r2.mjs             # upload all files
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream, statSync } from "node:fs";
import { createHash } from "node:crypto";
import { S3Client, PutObjectCommand, HeadObjectCommand } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE = process.argv.includes("--force"); // re-upload even if already exists

function loadEnvFile() {
  const envPath = path.join(root, ".env");
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
    if (!m) continue;
    let val = m[2].trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[m[1]]) process.env[m[1]] = val;
  }
}

loadEnvFile();

const accountId = process.env.R2_ACCOUNT_ID;
const accessKeyId = process.env.R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
const bucket = process.env.R2_BUCKET || "wardrobe-images";
const publicUrl = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
const cdnUrl = (process.env.R2_CDN_URL || "https://img.timelesswardrobe.uk").replace(/\/$/, "");
const cfApiToken = process.env.CF_API_TOKEN || "";
const cfZoneId = process.env.CF_ZONE_ID || "";

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("Missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY in .env");
  process.exit(1);
}

const client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const map = { ".webp": "image/webp", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".gif": "image/gif" };
  return map[ext] || "application/octet-stream";
}

function shortHash(filePath) {
  return createHash("md5").update(fs.readFileSync(filePath)).digest("hex").slice(0, 8);
}

async function exists(key) {
  try {
    await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

// Gather all files under images/wardrobe/
const imagesDir = path.join(root, "images", "wardrobe");
const allFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else allFiles.push(full);
  }
}
walk(imagesDir);

// Only image files
const imageFiles = allFiles.filter((f) => /\.(webp|jpg|jpeg|png|gif)$/i.test(f));

console.log(`Found ${imageFiles.length} image files in images/wardrobe/`);
if (DRY_RUN) {
  console.log("\n[dry-run] First 20 keys that would be uploaded:");
  for (const f of imageFiles.slice(0, 20)) {
    const rel = path.relative(path.join(root, "images"), f).replace(/\\/g, "/");
    console.log(`  wardrobe-images/${rel}  →  ${cdnUrl}/${rel}`);
  }
  if (imageFiles.length > 20) console.log(`  ... and ${imageFiles.length - 20} more`);
  process.exit(0);
}

let uploaded = 0, skipped = 0, failed = 0;
const errors = [];
// key → hash for all processed files (used to update seed)
const hashes = new Map();

for (let i = 0; i < imageFiles.length; i++) {
  const f = imageFiles[i];
  const rel = path.relative(path.join(root, "images"), f).replace(/\\/g, "/");
  const key = rel; // e.g. wardrobe/<id>/main/1.webp

  const h = shortHash(f);
  hashes.set(key, h);

  if (!FORCE) {
    const alreadyUp = await exists(key);
    if (alreadyUp) {
      skipped++;
      if (i % 50 === 0) process.stdout.write(`\r  ${i + 1}/${imageFiles.length} (${uploaded} up, ${skipped} skip, ${failed} err)`);
      continue;
    }
  }

  try {
    await client.send(new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: createReadStream(f),
      ContentType: getMimeType(f),
      ContentLength: statSync(f).size,
      CacheControl: "public, max-age=31536000, immutable",
    }));
    uploaded++;
  } catch (e) {
    failed++;
    errors.push({ key, error: e.message });
  }

  if (i % 10 === 0 || i === imageFiles.length - 1) {
    process.stdout.write(`\r  ${i + 1}/${imageFiles.length} (${uploaded} up, ${skipped} skip, ${failed} err)   `);
  }
}

console.log(`\n\nDone: ${uploaded} uploaded, ${skipped} skipped (already exist), ${failed} failed`);
if (errors.length) {
  console.log("\nErrors:");
  for (const e of errors) console.log(`  ${e.key}: ${e.error}`);
}

// Purge Cloudflare cache for all uploaded (overwritten) stable-path keys.
if (uploaded > 0 && cfApiToken && cfZoneId) {
  const urls = [...hashes.keys()].map((key) => `${cdnUrl}/${key}`);
  const BATCH = 30;
  let purged = 0;
  for (let i = 0; i < urls.length; i += BATCH) {
    const batch = urls.slice(i, i + BATCH);
    const res = await fetch(`https://api.cloudflare.com/client/v4/zones/${cfZoneId}/purge_cache`, {
      method: "POST",
      headers: { Authorization: `Bearer ${cfApiToken}`, "Content-Type": "application/json" },
      body: JSON.stringify({ files: batch }),
    });
    const json = await res.json();
    if (json.success) purged += batch.length;
    else console.warn("  CF purge error:", JSON.stringify(json.errors));
  }
  console.log(`\nPurged ${purged} Cloudflare cache entries.`);
} else if (uploaded > 0 && (!cfApiToken || !cfZoneId)) {
  console.log("\n⚠ CF_API_TOKEN / CF_ZONE_ID not set — skipping Cloudflare cache purge.");
  console.log("  Add them to .env to auto-purge after upload.");
}

// Update ?v= params in data/wardrobe.js so CDN cache busts on content change.
const seedPath = path.join(root, "data", "wardrobe.js");
if (hashes.size > 0 && fs.existsSync(seedPath)) {
  let src = fs.readFileSync(seedPath, "utf8");
  let seedChanges = 0;
  for (const [key, hash] of hashes) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match CDN or direct R2 URL for this key, with or without an existing ?v= / query string.
    const re = new RegExp(`(https?://(?:[^"'\\s]*\\.r2\\.dev|img\\.timelesswardrobe\\.uk)/${escaped})(\\?[^"'\\s]*)?`, "g");
    const updated = src.replace(re, (_, base) => {
      // Always rewrite base to CDN origin and refresh ?v=
      const cdnBase = base.replace(/^https?:\/\/[^/]+/, cdnUrl);
      seedChanges++;
      return `${cdnBase}?v=${hash}`;
    });
    src = updated;
  }
  if (seedChanges > 0) {
    fs.writeFileSync(seedPath, src, "utf8");
    console.log(`\nUpdated ${seedChanges} URL(s) in data/wardrobe.js with ?v= hashes.`);
  }
}
