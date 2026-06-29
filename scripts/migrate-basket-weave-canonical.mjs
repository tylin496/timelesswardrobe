/**
 * One-time migration: canonicalize basket-weave-linen-jacket images in R2 + Supabase.
 *
 * Before:
 *   image   = https://img.timelesswardrobe.uk/wardrobe/basket-weave-linen-jacket/main/2.webp   (user cover at wrong position)
 *   gallery = [https://pub-*.r2.dev/basket-weave-linen-jacket/main/gallery/1782767457037-qhvona-gallery-01.webp]  (non-canonical prefix + path)
 *
 * After (canonical):
 *   image   = https://img.timelesswardrobe.uk/wardrobe/basket-weave-linen-jacket/main/1.webp
 *   gallery = [https://img.timelesswardrobe.uk/wardrobe/basket-weave-linen-jacket/main/2.webp]
 *
 * R2 operations (S3-compatible API):
 *   COPY wardrobe/basket-weave-linen-jacket/main/2.webp  → wardrobe/basket-weave-linen-jacket/main/1.webp
 *   COPY basket-weave-linen-jacket/main/gallery/1782767457037-qhvona-gallery-01.webp → wardrobe/basket-weave-linen-jacket/main/2.webp
 *   DELETE basket-weave-linen-jacket/main/gallery/1782767457037-qhvona-gallery-01.webp
 */

import { readFileSync } from "fs";
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { createClient } from "@supabase/supabase-js";

const raw = readFileSync(".env", "utf8");
const env = {};
for (const line of raw.split("\n")) {
  const eq = line.indexOf("=");
  if (eq > 0) env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
}

const BUCKET = env.R2_BUCKET || "wardrobe-images";
const ACCOUNT_ID = env.R2_ACCOUNT_ID;
const CDN = "https://img.timelesswardrobe.uk";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: env.R2_ACCESS_KEY_ID, secretAccessKey: env.R2_SECRET_ACCESS_KEY },
});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function r2Copy(srcKey, destKey) {
  console.log(`  copy  ${srcKey} → ${destKey}`);
  await s3.send(new CopyObjectCommand({
    Bucket: BUCKET,
    CopySource: `${BUCKET}/${srcKey}`,
    Key: destKey,
  }));
}

async function r2Delete(key) {
  console.log(`  delete ${key}`);
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}

console.log("=== basket-weave-linen-jacket canonical migration ===\n");

// 1. Move user cover: main/2.webp → main/1.webp
const coverSrc = "wardrobe/basket-weave-linen-jacket/main/2.webp";
const coverDest = "wardrobe/basket-weave-linen-jacket/main/1.webp";
console.log("Step 1: promote cover to canonical position");
await r2Copy(coverSrc, coverDest);
await r2Delete(coverSrc);

// 2. Move gallery: old pub-URL path → wardrobe/…/main/2.webp
const galSrc = "basket-weave-linen-jacket/main/gallery/1782767457037-qhvona-gallery-01.webp";
const galDest = "wardrobe/basket-weave-linen-jacket/main/2.webp";
console.log("\nStep 2: move gallery to canonical position");
await r2Copy(galSrc, galDest);
await r2Delete(galSrc);

// 3. Update Supabase DB
const newImage   = `${CDN}/${coverDest}`;
const newGallery = [`${CDN}/${galDest}`];
console.log("\nStep 3: update Supabase");
console.log("  image  →", newImage);
console.log("  gallery→", JSON.stringify(newGallery));
const { error } = await supabase
  .from("wardrobe_items")
  .update({ image: newImage, gallery: newGallery })
  .eq("id", "basket-weave-linen-jacket");
if (error) { console.error("Supabase update failed:", error); process.exit(1); }

console.log("\nDone. basket-weave-linen-jacket is now canonical.");
