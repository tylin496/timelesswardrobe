#!/usr/bin/env node
/**
 * Repair frozen catalogue rows: dedupe gallery by storage path, normalize to public URLs,
 * remove unreferenced gallery objects from Storage.
 *
 *   node scripts/repair_frozen_gallery_drift.mjs
 *   node scripts/repair_frozen_gallery_drift.mjs polo-coat   # one id
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@supabase/supabase-js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const BUCKET = "wardrobe-images";
const onlyId = String(process.argv[2] ?? "").trim();

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

function pathKey(url) {
  const s = String(url ?? "").trim().split("?")[0];
  const m =
    s.match(/\/storage\/v1\/(?:object|render\/image)\/public\/wardrobe-images\/(.+)$/i) ||
    s.match(/\/images\/wardrobe\/(.+)$/i);
  if (!m) return "";
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

function galleryList(row) {
  const g = row?.gallery;
  const arr = Array.isArray(g) ? g : typeof g === "string" ? JSON.parse(g) : [];
  const main = String(row?.image ?? "").trim();
  return arr.map(String).filter((u) => u && u !== main);
}

function dedupeGallery(image, gallery) {
  const seen = new Set();
  const out = [];
  const coverKey = pathKey(image);
  for (const u of gallery) {
    const key = pathKey(u);
    if (!key || (coverKey && key === coverKey) || seen.has(key)) continue;
    seen.add(key);
    out.push(u);
  }
  return out;
}

function toPublicUrl(base, itemId, url) {
  const raw = String(url ?? "").trim().split("?")[0];
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  const key = pathKey(raw);
  if (!key) return raw;
  const encoded = key.split("/").map((s) => encodeURIComponent(s)).join("/");
  return `${base}/storage/v1/object/public/${BUCKET}/${encoded}`;
}

loadEnvFile();
const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const lock = JSON.parse(fs.readFileSync(path.join(root, "data", "wardrobe-catalogue-lock.json"), "utf8"));
const ids = onlyId ? [onlyId] : lock.ids.filter(Boolean);
const sb = createClient(url, serviceKey);
const publicBase = url.replace(/\/$/, "");

const { data: rows, error } = await sb.from("wardrobe_items").select("id,image,gallery").in("id", ids);
if (error) {
  console.error(error);
  process.exit(1);
}

let updated = 0;
let orphansRemoved = 0;

for (const row of rows || []) {
  const id = String(row.id ?? "");
  const image = toPublicUrl(publicBase, id, row.image);
  const gallery = dedupeGallery(image, galleryList(row)).map((u) => toPublicUrl(publicBase, id, u));
  const prevSig = galleryList(row).map(pathKey).join("|");
  const nextSig = gallery.map(pathKey).join("|");
  const imageChanged = pathKey(row.image) !== pathKey(image);

  if (prevSig !== nextSig || imageChanged || galleryList(row).some((u) => !/^https?:/i.test(u))) {
    const { error: upErr } = await sb
      .from("wardrobe_items")
      .update({ image, gallery, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (upErr) {
      console.warn(`DB update failed ${id}:`, upErr.message);
      continue;
    }
    updated += 1;
    console.log(`Updated ${id}: gallery ${gallery.length} (${gallery.map((u) => pathKey(u).split("/").pop()).join(", ")})`);
  }

  const keepPaths = new Set([pathKey(image), ...gallery.map(pathKey)].filter(Boolean));
  const { data: files, error: listErr } = await sb.storage.from(BUCKET).list(`${id}/main/gallery`, { limit: 100 });
  if (listErr) {
    console.warn(`List gallery ${id}:`, listErr.message);
    continue;
  }
  const toDrop = (files || [])
    .map((f) => `${id}/main/gallery/${f.name}`)
    .filter((p) => !keepPaths.has(p));
  if (toDrop.length) {
    const { error: rmErr } = await sb.storage.from(BUCKET).remove(toDrop);
    if (rmErr) console.warn(`Remove orphans ${id}:`, rmErr.message);
    else {
      orphansRemoved += toDrop.length;
      console.log(`  Removed ${toDrop.length} orphan(s): ${toDrop.map((p) => p.split("/").pop()).join(", ")}`);
    }
  }
}

console.log(`Done. Rows updated: ${updated}, orphan files removed: ${orphansRemoved}`);
