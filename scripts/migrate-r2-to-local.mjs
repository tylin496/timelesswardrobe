/**
 * Migrate R2-hosted images to local /images/wardrobe/ tree.
 * - Downloads cover → images/wardrobe/{id}/main/1.{ext}
 * - Downloads gallery[i] → images/wardrobe/{id}/main/{i+2}.{ext}
 * - Updates data/wardrobe.js seed entries
 * - Nulls out image/gallery in Supabase wardrobe_items so seed is authoritative
 */

import fs from "fs";
import path from "path";
import https from "https";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// Load .env
const env = fs.readFileSync(path.join(ROOT, ".env"), "utf8");
const getEnv = (k) => env.match(new RegExp(`^${k}=(.+)$`, "m"))?.[1]?.trim();
const SUPABASE_URL = getEnv("SUPABASE_URL");
const SERVICE_KEY = getEnv("SUPABASE_SERVICE_ROLE_KEY");

function download(url, dest) {
  return new Promise((resolve, reject) => {
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      res.pipe(file);
      file.on("finish", () => file.close(resolve));
    }).on("error", reject);
  });
}

async function supabaseFetch(path_, opts = {}) {
  const { default: fetch } = await import("node-fetch").catch(() => ({ default: globalThis.fetch }));
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path_}`, {
    ...opts,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) throw new Error(`Supabase ${res.status}: ${await res.text()}`);
  return res.status === 204 ? null : res.json();
}

// Fetch all rows with R2 URLs
const rows = await supabaseFetch("wardrobe_items?select=id,image,gallery&order=id");
const r2Rows = rows.filter(
  (r) => (r.image || "").includes("r2.dev") || (r.gallery || []).some((g) => g.includes("r2.dev"))
);
console.log(`Found ${r2Rows.length} items with R2 URLs\n`);

// Read wardrobe.js seed
const seedPath = path.join(ROOT, "data", "wardrobe.js");
let seedSrc = fs.readFileSync(seedPath, "utf8");

const results = [];

for (const row of r2Rows) {
  const id = row.id;
  const imgDir = path.join(ROOT, "images", "wardrobe", id, "main");
  const galDir = path.join(imgDir, "gallery");

  const localPaths = { cover: null, gallery: [] };

  // Download cover
  if (row.image && row.image.includes("r2.dev")) {
    const ext = path.extname(new URL(row.image).pathname) || ".webp";
    const dest = path.join(imgDir, `1${ext}`);
    process.stdout.write(`  [${id}] cover... `);
    try {
      await download(row.image, dest);
      localPaths.cover = `/images/wardrobe/${id}/main/1${ext}`;
      console.log(`✓ 1${ext}`);
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }

  // Download gallery
  const gallery = (row.gallery || []).filter((g) => g.includes("r2.dev"));
  for (let i = 0; i < gallery.length; i++) {
    const url = gallery[i];
    const ext = path.extname(new URL(url).pathname) || ".webp";
    const num = i + 2; // gallery starts at 2 (cover is 1)
    const dest = path.join(imgDir, `${num}${ext}`);
    process.stdout.write(`  [${id}] gallery[${i + 1}]... `);
    try {
      await download(url, dest);
      localPaths.gallery.push(`/images/wardrobe/${id}/main/${num}${ext}`);
      console.log(`✓ ${num}${ext}`);
    } catch (e) {
      console.log(`✗ ${e.message}`);
    }
  }

  results.push({ id, localPaths });

  // Update seed
  // Find the item block and replace image/gallery
  const itemRegex = new RegExp(
    `("id":\\s*"${id}"[^}]*?"image":\\s*)"[^"]*"`,
    "s"
  );
  if (localPaths.cover && itemRegex.test(seedSrc)) {
    seedSrc = seedSrc.replace(itemRegex, `$1"${localPaths.cover}"`);
  }

  // Replace gallery array for this item
  if (localPaths.gallery.length > 0) {
    // Find the gallery array within the item block
    // We'll do a targeted replace: find "id": "{id}" then find the next "gallery": [...]
    const idIdx = seedSrc.indexOf(`"id": "${id}"`);
    if (idIdx !== -1) {
      const afterId = seedSrc.indexOf('"gallery"', idIdx);
      const nextItem = seedSrc.indexOf('"id":', idIdx + 1);
      if (afterId !== -1 && (nextItem === -1 || afterId < nextItem)) {
        const arrStart = seedSrc.indexOf("[", afterId);
        const arrEnd = seedSrc.indexOf("]", arrStart);
        const newGallery =
          "[\n" +
          localPaths.gallery.map((p) => `      "${p}"`).join(",\n") +
          "\n    ]";
        seedSrc =
          seedSrc.slice(0, arrStart) + newGallery + seedSrc.slice(arrEnd + 1);
      }
    }
  }

  // Null out image/gallery in Supabase
  await supabaseFetch(`wardrobe_items?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ image: null, gallery: null }),
  });
  console.log(`  [${id}] Supabase cleared ✓\n`);
}

fs.writeFileSync(seedPath, seedSrc);
console.log("\nSeed updated ✓");
console.log(`\nDone. Migrated ${r2Rows.length} items.`);
