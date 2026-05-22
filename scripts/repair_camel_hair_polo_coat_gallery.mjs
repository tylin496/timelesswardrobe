#!/usr/bin/env node
/**
 * Repair camel-hair-polo-coat gallery: sync local 01/02 to Storage, drop duplicate 04, fix DB order.
 *
 *   node scripts/repair_camel_hair_polo_coat_gallery.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const ITEM_ID = "camel-hair-polo-coat";
const BUCKET = "wardrobe-images";

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

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const sb = createClient(url, serviceKey);
const imgRoot = path.join(root, "images", "wardrobe", ITEM_ID, "main");
const galleryDir = path.join(imgRoot, "gallery");

async function uploadLocal(name) {
  const localPath = path.join(galleryDir, name);
  if (!fs.existsSync(localPath)) {
    console.warn(`Skip upload (missing): ${localPath}`);
    return;
  }
  const storagePath = `${ITEM_ID}/main/gallery/${name}`;
  const buf = fs.readFileSync(localPath);
  const { error } = await sb.storage.from(BUCKET).upload(storagePath, buf, {
    upsert: true,
    contentType: "image/jpeg",
  });
  if (error) throw new Error(`upload ${storagePath}: ${error.message}`);
  console.log(`Uploaded ${storagePath} (${buf.length} bytes)`);
}

async function downloadCloud03() {
  const storagePath = `${ITEM_ID}/main/gallery/03.jpg`;
  const { data, error } = await sb.storage.from(BUCKET).download(storagePath);
  if (error) throw new Error(`download ${storagePath}: ${error.message}`);
  const out = path.join(galleryDir, "03.jpg");
  const buf = Buffer.from(await data.arrayBuffer());
  fs.writeFileSync(out, buf);
  console.log(`Saved local ${out} (${buf.length} bytes)`);
}

async function removeStorage04() {
  const storagePath = `${ITEM_ID}/main/gallery/04.jpg`;
  const { error } = await sb.storage.from(BUCKET).remove([storagePath]);
  if (error) console.warn(`remove ${storagePath}:`, error.message);
  else console.log(`Removed storage ${storagePath}`);
}

async function updateRow() {
  const gallery = [
    `/images/wardrobe/${ITEM_ID}/main/gallery/02.jpg`,
    `/images/wardrobe/${ITEM_ID}/main/gallery/01.jpg`,
    `/images/wardrobe/${ITEM_ID}/main/gallery/03.jpg`,
  ];
  const { error } = await sb
    .from("wardrobe_items")
    .update({ gallery, updated_at: new Date().toISOString() })
    .eq("id", ITEM_ID);
  if (error) throw error;
  console.log("Updated wardrobe_items.gallery:", gallery);
}

async function main() {
  fs.mkdirSync(galleryDir, { recursive: true });
  await uploadLocal("01.jpg");
  await uploadLocal("02.jpg");
  await downloadCloud03();
  await removeStorage04();
  await updateRow();
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
