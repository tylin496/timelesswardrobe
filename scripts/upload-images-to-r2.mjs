#!/usr/bin/env node
/**
 * Upload images/wardrobe/ to R2 bucket (wardrobe-images).
 * R2 key: wardrobe/<id>/main/1.webp  (strips leading "images/" prefix)
 * Public URL: https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev/wardrobe/<id>/...
 *
 *   node scripts/upload-images-to-r2.mjs --dry-run   # list what would be uploaded
 *   node scripts/upload-images-to-r2.mjs             # upload all files
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createReadStream, statSync } from "node:fs";
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
    console.log(`  wardrobe-images/${rel}  →  ${publicUrl}/${rel}`);
  }
  if (imageFiles.length > 20) console.log(`  ... and ${imageFiles.length - 20} more`);
  process.exit(0);
}

let uploaded = 0, skipped = 0, failed = 0;
const errors = [];

for (let i = 0; i < imageFiles.length; i++) {
  const f = imageFiles[i];
  const rel = path.relative(path.join(root, "images"), f).replace(/\\/g, "/");
  const key = rel; // e.g. wardrobe/<id>/main/1.webp

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

if (uploaded > 0 || skipped === imageFiles.length) {
  console.log(`\nPublic URL base: ${publicUrl}/wardrobe/<id>/main/1.webp`);
  console.log("Next: run scripts/update-seed-to-r2-urls.mjs to update data/wardrobe.js");
}
