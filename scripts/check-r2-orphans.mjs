#!/usr/bin/env node
/**
 * Read-only audit: list R2 objects under wardrobe/ that no current item
 * (Supabase wardrobe_items, falling back to the local seed for rows the
 * cloud doesn't override) references.
 *
 * Orphans accumulate from non-atomic operations — e.g. the upload worker's
 * PATCH rename does put-then-delete, so a failure after put leaves the old
 * key behind — and from any manual R2 edits outside the app's save flow.
 * This script only reports; it never deletes. Review the list, then delete
 * confirmed orphans by hand (or extend this script once you trust it).
 *
 *   node scripts/check-r2-orphans.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

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
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!accountId || !accessKeyId || !secretAccessKey) {
  console.error("Missing R2_ACCOUNT_ID / R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY in .env");
  process.exit(1);
}
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId, secretAccessKey },
});

/** Every R2 key under wardrobe/, paginated. */
async function listAllWardrobeKeys() {
  const keys = [];
  let ContinuationToken;
  do {
    const res = await s3.send(
      new ListObjectsV2Command({ Bucket: bucket, Prefix: "wardrobe/", ContinuationToken })
    );
    for (const obj of res.Contents ?? []) if (obj.Key) keys.push(obj.Key);
    ContinuationToken = res.IsTruncated ? res.NextContinuationToken : undefined;
  } while (ContinuationToken);
  return keys;
}

/** Storage-relative path (wardrobe/<id>/...) from any cover/gallery URL, or "". */
function storagePathFromUrl(url) {
  const raw = String(url ?? "").trim().split("?")[0];
  const m = raw.match(/\/(wardrobe\/.+)$/i);
  if (!m) return "";
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

function collectItemPaths(row) {
  const out = new Set();
  const add = (u) => {
    const p = storagePathFromUrl(u);
    if (p) out.add(p);
  };
  add(row?.image);
  for (const u of Array.isArray(row?.gallery) ? row.gallery : []) add(u);
  for (const v of Array.isArray(row?.colourVariants) ? row.colourVariants : []) {
    add(v?.image);
    add(v?.previewImage);
    for (const u of Array.isArray(v?.gallery) ? v.gallery : []) add(u);
  }
  return out;
}

/** Local seed catalogue (data/wardrobe.js) — covers local-catalogue rows the cloud hasn't overridden. */
function loadSeedRows() {
  const wardrobePath = path.join(root, "data", "wardrobe.js");
  const src = fs.readFileSync(wardrobePath, "utf8");
  const items = new Function(`${src}\n;return typeof WARDROBE_ITEMS !== "undefined" ? WARDROBE_ITEMS : null;`)();
  return Array.isArray(items) ? items : [];
}

const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Listing R2 objects under wardrobe/…");
const r2Keys = await listAllWardrobeKeys();
console.log(`  ${r2Keys.length} objects.`);

console.log("Fetching wardrobe_items from Supabase…");
const { data: cloudRows, error } = await supabase.from("wardrobe_items").select("*");
if (error) {
  console.error("Supabase error:", error.message);
  process.exit(1);
}
console.log(`  ${cloudRows.length} rows.`);

const seedRows = loadSeedRows();
console.log(`Loaded ${seedRows.length} local seed rows.`);

const referenced = new Set();
for (const row of cloudRows) for (const p of collectItemPaths(row)) referenced.add(p);
for (const row of seedRows) for (const p of collectItemPaths(row)) referenced.add(p);

// Manifests / non-image support files under wardrobe/ aren't item references — skip.
const orphans = r2Keys.filter((k) => /\.(?:webp|png|jpe?g)$/i.test(k) && !referenced.has(k));

console.log(`\n${orphans.length} R2 object(s) not referenced by any item (read-only report, nothing deleted):\n`);
for (const k of orphans) console.log(`  ${k}`);
if (!orphans.length) console.log("  (none)");
