/**
 * Local wardrobe image paths — mirror Supabase `wardrobe-images` object layout under `/images/wardrobe/`.
 */

export const WARDROBE_IMAGE_BUCKET = "wardrobe-images";
export const LOCAL_WARDROBE_IMAGE_ROOT = "/images/wardrobe";

export function safeStorageSegment(value, fallback = "item") {
  const cleaned = String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return cleaned || fallback;
}

/** @param {string} [fileName] @param {string} [mimeType] */
export function fileExtensionFromName(fileName, mimeType = "") {
  const name = String(fileName ?? "").trim();
  const m = name.match(/\.([a-z0-9]+)$/i);
  if (m) return m[1].toLowerCase();
  const type = String(mimeType ?? "").toLowerCase();
  if (type.includes("avif")) return "avif";
  if (type.includes("png")) return "png";
  if (type.includes("webp")) return "webp";
  if (type.includes("gif")) return "gif";
  return "jpg";
}

/**
 * Object path under `images/wardrobe/` (no leading slash).
 * @param {string} itemId
 * @param {string} ext
 * @param {{ type: "main_cover" } | { type: "main_gallery", index: number } | { type: "variant_cover", key: string } | { type: "variant_preview", key: string }} slot
 */
export function wardrobeImageStorageObjectPath(itemId, ext, slot) {
  const root = safeStorageSegment(itemId);
  const e = String(ext ?? "jpg")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "") || "jpg";
  if (!slot || slot.type === "main_cover") {
    return `${root}/main/cover.${e}`;
  }
  if (slot.type === "main_gallery") {
    const n = Math.min(99, Math.max(1, Math.floor(Number(slot.index) || 1)));
    return `${root}/main/gallery/${String(n).padStart(2, "0")}.${e}`;
  }
  if (slot.type === "variant_cover" || slot.type === "variant_preview") {
    const vk = safeStorageSegment(String(slot.key ?? "").trim(), "variant");
    const role = slot.type === "variant_preview" ? "preview" : "cover";
    return `${root}/variants/${vk}/${role}.${e}`;
  }
  if (slot.type === "variant_gallery") {
    const vk = safeStorageSegment(String(slot.key ?? "").trim(), "variant");
    const n = Math.min(99, Math.max(1, Math.floor(Number(slot.index) || 1)));
    return `${root}/variants/${vk}/gallery/${String(n).padStart(2, "0")}.${e}`;
  }
  return `${root}/main/cover.${e}`;
}

/** @param {string} u */
export function storagePathFromWardrobeImageUrl(u) {
  const s = String(u ?? "").trim().split("?")[0];
  if (!s || !/^https?:\/\//i.test(s)) return "";
  const esc = WARDROBE_IMAGE_BUCKET.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const re = new RegExp(`/storage/v1/(?:object/public|render/image/public)/${esc}/(.+)$`, "i");
  const m = s.match(re);
  if (!m) return "";
  try {
    return decodeURIComponent(m[1]);
  } catch {
    return m[1];
  }
}

/** @param {string} storagePath */
export function localPublicUrlForStoragePath(storagePath) {
  const p = String(storagePath ?? "")
    .trim()
    .replace(/^\/+/, "");
  if (!p) return "";
  return `${LOCAL_WARDROBE_IMAGE_ROOT}/${p}`;
}

/** @param {string} url */
export function rewriteWardrobeUrlToLocal(url) {
  const path = storagePathFromWardrobeImageUrl(url);
  if (!path) return String(url ?? "").trim();
  return localPublicUrlForStoragePath(path);
}

/** @param {unknown} item */
export function collectWardrobeImageUrlsFromItem(item) {
  if (!item || typeof item !== "object") return [];
  const out = [];
  const seen = new Set();
  const add = (u) => {
    const path = storagePathFromWardrobeImageUrl(u);
    if (!path || seen.has(path)) return;
    seen.add(path);
    out.push({ url: String(u).trim().split("?")[0], path });
  };
  add(item.image);
  const gallery = item.gallery;
  if (Array.isArray(gallery)) {
    for (const u of gallery) add(u);
  }
  const variants = item.colourVariants || item.colorVariants;
  if (Array.isArray(variants)) {
    for (const v of variants) {
      if (!v || typeof v !== "object") continue;
      add(v.image);
      add(v.previewImage);
      if (Array.isArray(v.gallery)) {
        for (const u of v.gallery) add(u);
      }
    }
  }
  const meta = item.metadata;
  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    const mcv = meta.colourVariants || meta.colorVariants;
    if (Array.isArray(mcv)) {
      for (const v of mcv) {
        if (!v || typeof v !== "object") continue;
        add(v.image);
        add(v.previewImage);
        if (Array.isArray(v.gallery)) {
          for (const u of v.gallery) add(u);
        }
      }
    }
  }
  return out;
}

/** @param {Record<string, unknown>} item */
export function rewriteItemMediaUrlsToLocal(item) {
  const out = { ...item };
  if (out.image) out.image = rewriteWardrobeUrlToLocal(out.image);
  if (Array.isArray(out.gallery)) {
    out.gallery = out.gallery.map((u) => rewriteWardrobeUrlToLocal(u)).filter(Boolean);
  }
  const rewriteVariant = (v) => {
    if (!v || typeof v !== "object") return v;
    const nv = { ...v };
    if (nv.image) nv.image = rewriteWardrobeUrlToLocal(nv.image);
    if (nv.previewImage) nv.previewImage = rewriteWardrobeUrlToLocal(nv.previewImage);
    if (Array.isArray(nv.gallery)) {
      nv.gallery = nv.gallery.map((u) => rewriteWardrobeUrlToLocal(u)).filter(Boolean);
    }
    return nv;
  };
  if (Array.isArray(out.colourVariants)) {
    out.colourVariants = out.colourVariants.map(rewriteVariant);
  }
  if (Array.isArray(out.colorVariants)) {
    out.colourVariants = out.colorVariants.map(rewriteVariant);
    delete out.colorVariants;
  }
  if (out.metadata && typeof out.metadata === "object" && !Array.isArray(out.metadata)) {
    const meta = { ...out.metadata };
    if (Array.isArray(meta.colourVariants)) {
      meta.colourVariants = meta.colourVariants.map(rewriteVariant);
    }
    if (Array.isArray(meta.colorVariants)) {
      meta.colourVariants = meta.colorVariants.map(rewriteVariant);
      delete meta.colorVariants;
    }
    out.metadata = meta;
  }
  return out;
}

/** @param {Record<string, unknown>} item */
function variantRowsFromItem(item) {
  const a = Array.isArray(item.colourVariants) ? item.colourVariants : [];
  if (a.length) return a;
  const meta = item.metadata;
  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    const m = meta.colourVariants || meta.colorVariants;
    if (Array.isArray(m)) return m;
  }
  return [];
}

/** @param {Record<string, unknown>} item @param {string} key */
function variantCoverUrlFromItem(item, key) {
  const v = variantRowsFromItem(item).find((row) => row && String(row.key ?? "") === key);
  return v && typeof v === "object" ? String(v.image ?? "").trim() : "";
}

/**
 * Before backup downloads, rewrite legacy Storage URLs that 404 after id migration.
 * @param {Record<string, unknown>} item
 */
export function sanitizeSeedItemMediaForBackup(item) {
  const out = { ...item };
  const id = String(out.id ?? "").trim();
  const img = String(out.image ?? "").trim();
  if (id === "pleated-trousers" && /uniqlo-tuck-trousers/i.test(img)) {
    const grey = variantCoverUrlFromItem(out, "grey");
    if (grey) out.image = grey;
  }
  return out;
}

/**
 * After id migration, Supabase may still point at legacy Storage paths. Prefer on-disk
 * `main/cover.png` or variant covers under the canonical item folder.
 * @param {Record<string, unknown>} item
 */
export function normalizeFrozenItemLocalMedia(item) {
  const out = { ...item };
  const id = String(out.id ?? "").trim();
  const img = String(out.image ?? "").trim();

  if (id === "pleated-trousers" && /uniqlo-tuck-trousers/i.test(img)) {
    out.image =
      variantCoverUrlFromItem(out, "grey") ||
      `${LOCAL_WARDROBE_IMAGE_ROOT}/pleated-trousers/variants/grey/cover.png`;
  }
  if (id === "signet-ring" && /1778698092039-cover-edit/i.test(img)) {
    out.image = `${LOCAL_WARDROBE_IMAGE_ROOT}/signet-ring/main/cover.png`;
  }
  if (id === "wedding-bands" && /1778704141467-cover-edit/i.test(img)) {
    out.image = `${LOCAL_WARDROBE_IMAGE_ROOT}/wedding-bands/main/cover.png`;
  }
  return out;
}
