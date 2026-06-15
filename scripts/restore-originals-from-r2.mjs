/**
 * Restore original high-quality images from R2 (flat files + large structured PNGs)
 * to replace compressed local webp/jpg versions.
 */
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WARDROBE = path.join(ROOT, 'images', 'wardrobe');

const client = new S3Client({
  region: 'auto',
  endpoint: 'https://dce1aa514f342f3acdb4a21529a2103d.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: 'b29c98cef6845768016189d1b677308b',
    secretAccessKey: '114ffaf4efa175ece5d3911f182725adc6fed2324865fc3d39093517ba01bbf9',
  },
});

// Map flat filenames → item IDs + slot
const FLAT_MAP = {
  'ALDEN 563 Tassel Loafer Color 8 Cordovan (US 10.5 E).png': { id: 'tassel-moccasin-loafer', slot: 'cover' },
  'BROOKS BROTHERS Golden Fleece Navy Twill Blazer.png':      { id: 'golden-fleece-navy-blazer', slot: 'cover' },
  'BROOKS BROTHERS Light Brown Houndstooth Tweed Jacket (450 gsm).png': { id: 'houndstooth-tweed-jacket', slot: 'cover' },
  'BURBERRYS Beige Single-Breasted Balmacaan Coat.png':       { id: 'balmacaan-coat', slot: 'cover' },
  'COMMON PROJECTS Achilles Low White (EU 45).png':           { id: 'achilles-low', slot: 'cover' },
  'CULTUM Brown Glen Check Tweed Jacket (620 gsm).png':       { id: 'glen-check-tweed-jacket', slot: 'cover' },
  'Curb Bracelet (18ct yellow gold, 5.2 mm).png':            { id: 'curb-bracelet', slot: 'cover' },
  'DW-5600.png':                                              { id: 'dw-5600e', slot: 'cover' },
  'Eloy Bernal Panama Hat 2.png':                             { id: 'panama-hat', slot: 'gallery', n: 2 },
  'Eloy Bernal Panama Hat.png':                               { id: 'panama-hat', slot: 'cover' },
  'GU Wine Cable-Knit Polo (White Striped Trim).png':         { id: 'cable-knit-polo', slot: 'cover' },
  'GU olive brown wide-straight trousers (crease front, airy poly-blend, all-season)_2.png': { id: 'wide-straight-trousers', slot: 'gallery', n: 2 },
  'Grand Soir.png':                                           { id: 'grand-soir-eau-de-parfum', slot: 'cover' },
  'H&M Hole-Knit Beige Polo.png':                            { id: 'cutwork-knit-polo-shirt', slot: 'cover' },
  'H&M Linen Pleated Shorts (Beige).png':                    { id: 'linen-pleated-shorts', slot: 'cover' },
  'H&M Oatmeal Stripe Camp Collar Shirt.png':                { id: 'striped-camp-collar-shirt', slot: 'cover' },
  'JWA Straight Jeans.png':                                   { id: 'jwa-straight-jeans', slot: 'cover' },
  'L.L.BEAN Camel Corduroy Trousers.png':                    { id: 'corduroy-trousers', slot: 'cover' },
  'MUJI Black Fine Knit Wool Ribbed Turtle Neck Lightweight Jumper.png': { id: 'rib-knit-roll-neck-jumper', slot: 'cover' },
  'MUJI Ecru Sherpa Fleece Vest (Olive Trim).png':           { id: 'boa-fleece-vest', slot: 'cover' },
  'MUJI Oatmeal Beige Heavy Aran Wool Cable-Knit Jumper.png': { id: 'aran-cable-knit-jumper', slot: 'cover' },
  'MUJI Slate Blue Lightweight Fine Knit T-Shirt.png':       { id: 'fine-knit-t-shirt', slot: 'cover' },
  'MUJI Washed Off-White Breton-Stripe Midweight Boat-Neck 34 Sleeve T-Shirt.png': { id: 'breton-sailor-shirt', slot: 'cover' },
  'PRL Beige Basket-Weave Linen Jacket 2.png':               { id: 'basket-weave-linen-jacket', slot: 'gallery', n: 2 },
  'PRL Beige Basket-Weave Linen Jacket.png':                 { id: 'basket-weave-linen-jacket', slot: 'cover' },
  'PRL Polo Bear Wine Wool-Cashmere Jumper.png':             { id: 'polo-bear-jumper', slot: 'cover' },
  'PRL Washed Wine Cream Rugby Shirt.png':                   { id: 'washed-rugby-shirt', slot: 'cover' },
  'PRL Wine Polo Bear Wool-Cashmere Jumper.png':             { id: 'polo-bear-jumper', slot: 'gallery', n: 2 },
  'Polo coat 2.png':                                         { id: 'camel-hair-polo-coat', slot: 'gallery', n: 2 },
  'Polo coat.png':                                           { id: 'camel-hair-polo-coat', slot: 'cover' },
  'Private White VC Midnight Navy Ventile Harrington.png':   { id: 'ventile-harrington-jacket', slot: 'cover' },
  'Rolo chain.png':                                          { id: 'rolo-chain-necklace', slot: 'cover' },
  'Ruby Gypsy Ring.png':                                     { id: 'ruby-gypsy-ring', slot: 'cover' },
  'Sapphir copy 2.png':                                      { id: 'sapphire-ring', slot: 'gallery', n: 2 },
  'Sapphir copy.png':                                        { id: 'sapphire-ring', slot: 'cover' },
  'Smathers & Branson American Flag Hat.png':                { id: 'american-flag-cap', slot: 'cover' },
  'THE ENGINEER Brown Fair Isle Wool Vest.png':              { id: 'fair-isle-vest', slot: 'cover' },
  'THE ENGINEER Black Cotton Long-Sleeve Polo.png':          { id: 'knit-long-sleeve-polo', slot: 'cover' },
  'Tudor Black Bay 58.png':                                  { id: 'black-bay-58', slot: 'cover' },
  'UNIQLO Beige Kataaze Knit Mock Neck (Acrylic Blend).png': { id: 'kataaze-knit-mock-neck-jumper', slot: 'cover' },
  'UNIQLO Ecru Cricket Cable-Knit Jumper Vest (Navy Yellow Trim, Cotton-Acrylic).png': { id: 'cricket-cable-knit-jumper-vest', slot: 'cover' },
  'UNIQLO Light Blue Linen Camp Collar Shirt.png':           { id: 'linen-camp-collar-shirt', slot: 'cover' },
  'UNIQLO Tuck Trousers x2 (Grey Beige, all-season).png':   { id: 'pleated-trousers', slot: 'cover' },
  'Wedding Bands.png':                                       { id: 'wedding-bands', slot: 'cover' },
  'ZARA Cream Linen Loop-Collar Shirt.png':                  { id: 'linen-loop-collar-shirt', slot: 'cover' },
  'ZARA Dark Grey Open-Knit Polo.png':                       { id: 'cutwork-knit-polo-shirt', slot: 'gallery', n: 2 },
  'ZARA Ecru Purl-Knit T-Shirt.png':                         { id: 'purl-knit-t-shirt', slot: 'cover' },
  'ZARA Navy Baker Neck Knitted T-Shirt Button-Neck knit T-shirt.png': { id: 'baker-neck-knitted-t-shirt', slot: 'cover' },
  'ZARA RIB KNIT POLO SHIRT.png':                            { id: 'rib-knit-polo-shirt-dusty-ice-blue', slot: 'cover' },
  'ZARA STRUCTURED KNIT POLO SHIRT.png':                     { id: 'structured-knit-polo-shirt', slot: 'cover' },
  'ZARA ZARA RIBBED KNIT POLO SHIRT.png':                    { id: 'rib-knit-polo-shirt-dark-chocolate', slot: 'cover' },
  'new york.png':                                            { id: 'new-york-intense-eau-de-parfum', slot: 'cover' },
  'tweed.png':                                               { id: 'herringbone-tweed-jacket', slot: 'cover' },
};

// Large structured PNGs to use as better gallery frames
// (pick the LARGEST/most recent per item/slot that's a PNG)
const STRUCTURED_MIN_SIZE = 500 * 1024; // only take PNGs > 500 KB

async function downloadR2(key, dest) {
  const res = await client.send(new GetObjectCommand({ Bucket: 'wardrobe-images', Key: key }));
  const chunks = [];
  for await (const chunk of res.Body) chunks.push(chunk);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, Buffer.concat(chunks));
}

function localDestForSlot(id, slot, n) {
  const dir = path.join(WARDROBE, id, 'main');
  if (slot === 'cover') return path.join(dir, '1.png');
  return path.join(dir, `${n}.png`);
}

// List all R2 objects
let token;
const allObjects = [];
do {
  const res = await client.send(new ListObjectsV2Command({ Bucket: 'wardrobe-images', ContinuationToken: token }));
  allObjects.push(...(res.Contents || []));
  token = res.NextContinuationToken;
} while (token);

const flat = allObjects.filter(o => !o.Key.includes('/'));
const structured = allObjects.filter(o => o.Key.includes('/'));

// === Download flat files ===
console.log('=== Restoring flat original files ===\n');
for (const obj of flat) {
  const mapping = FLAT_MAP[obj.Key];
  if (!mapping) continue;
  const dest = localDestForSlot(mapping.id, mapping.slot, mapping.n);
  const localSize = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
  process.stdout.write(`[${mapping.id}] ${mapping.slot}${mapping.n ? mapping.n : ''} — R2: ${(obj.Size/1024).toFixed(0)} KB, local: ${(localSize/1024).toFixed(0)} KB ... `);
  await downloadR2(obj.Key, dest);
  console.log('✓');
}

// === Download large structured PNGs ===
console.log('\n=== Restoring large structured PNGs (>500 KB) ===\n');
// Group by item+slot, take the largest
const structuredPngs = structured.filter(o => /\.png$/i.test(o.Key) && o.Size >= STRUCTURED_MIN_SIZE);
// Parse item ID from key: "{id}/main/gallery/{ts}-gallery-{nn}.png" or "{id}/main/gallery/{nn}.png"
const byItemSlot = new Map();
for (const obj of structuredPngs) {
  const parts = obj.Key.split('/');
  const id = parts[0];
  const isGallery = parts.includes('gallery');
  // Determine gallery slot number
  let n = null;
  const fname = parts[parts.length - 1];
  const mTs = fname.match(/-gallery-(\d{2})\./);
  const mSimple = fname.match(/^(\d{2})\./);
  if (mTs) n = parseInt(mTs[1], 10) + 1; // gallery-01 → local slot 2, gallery-02 → 3, etc.
  else if (mSimple) n = parseInt(mSimple[1], 10) + 1;
  const slot = isGallery && n ? `gallery_${n}` : 'cover';
  const mapKey = `${id}::${slot}`;
  const existing = byItemSlot.get(mapKey);
  if (!existing || obj.Size > existing.Size) byItemSlot.set(mapKey, { ...obj, id, slot, n });
}

for (const { Key, Size, id, slot, n } of byItemSlot.values()) {
  // Only restore for items we have locally
  const localDir = path.join(WARDROBE, id, 'main');
  if (!fs.existsSync(localDir)) continue;
  const isGallery = slot.startsWith('gallery_');
  const localN = isGallery ? n : 1;
  const dest = path.join(localDir, `${localN}.png`);
  const localExisting = fs.existsSync(dest) ? fs.statSync(dest).size : 0;
  process.stdout.write(`[${id}] ${slot} — R2: ${(Size/1024).toFixed(0)} KB, local: ${(localExisting/1024).toFixed(0)} KB ... `);
  await downloadR2(Key, dest);
  console.log('✓');
}

console.log('\nAll done. Run seed update next.');
