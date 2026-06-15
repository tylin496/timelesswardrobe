import fs from "node:fs";
import path from "node:path";

import { safeStorageSegment } from "./wardrobe-image-local.mjs";

export const LOCAL_IMAGE_EXTS = new Set([".webp", ".jpg", ".jpeg", ".png"]);

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function localMediaUrl(root, filePath) {
  return `/${path.relative(root, filePath).split(path.sep).join("/")}`;
}

function imageFilesInDir(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((name) => !name.startsWith(".") && LOCAL_IMAGE_EXTS.has(path.extname(name).toLowerCase()))
    .sort((a, b) => collator.compare(a, b))
    .map((name) => path.join(dir, name));
}

function localVariantDirFromUrl(root, itemId, url) {
  const raw = String(url ?? "").trim().split("?")[0];
  const prefix = `/images/wardrobe/${itemId}/variants/`;
  if (!raw.startsWith(prefix)) return "";
  const rest = raw.slice(prefix.length);
  const variantDir = rest.split("/")[0];
  return variantDir ? path.join(root, "images", "wardrobe", itemId, "variants", variantDir) : "";
}

function variantDirForRow(root, itemId, variant) {
  const fromImage = localVariantDirFromUrl(root, itemId, variant?.image);
  if (fromImage && fs.existsSync(fromImage)) return fromImage;

  const fromPreview = localVariantDirFromUrl(root, itemId, variant?.previewImage);
  if (fromPreview && fs.existsSync(fromPreview)) return fromPreview;

  const key = String(variant?.key ?? "").trim();
  if (!key) return "";
  const candidates = [
    key,
    safeStorageSegment(key),
    key.replace(/-/g, " "),
  ];
  for (const candidate of candidates) {
    const dir = path.join(root, "images", "wardrobe", itemId, "variants", candidate);
    if (fs.existsSync(dir)) return dir;
  }
  return "";
}

export function localMainMediaUrls(root, itemId) {
  const dir = path.join(root, "images", "wardrobe", itemId, "main");
  const direct = imageFilesInDir(dir);
  const hasNumberedCover = direct.some((filePath) => /^1\.[^.]+$/i.test(path.basename(filePath)));
  const files = hasNumberedCover ? direct : [...direct, ...imageFilesInDir(path.join(dir, "gallery"))];
  return files.map((filePath) => localMediaUrl(root, filePath));
}

export function localVariantMediaUrls(root, itemId, variant) {
  const dir = variantDirForRow(root, itemId, variant);
  if (!dir) return { images: [], previewImage: "" };

  const files = imageFilesInDir(dir);
  const preview = files.find((filePath) => path.basename(filePath).toLowerCase().startsWith("preview."));
  const images = files
    .filter((filePath) => filePath !== preview)
    .map((filePath) => localMediaUrl(root, filePath));

  return {
    images,
    previewImage: preview ? localMediaUrl(root, preview) : "",
  };
}

export function applyLocalMediaFromFilesystem(item, root) {
  if (!item || typeof item !== "object") return item;

  const out = { ...item };
  const id = String(out.id ?? "").trim();
  if (!id) return out;

  const mainUrls = localMainMediaUrls(root, id);
  if (mainUrls.length) {
    out.image = mainUrls[0];
    out.gallery = mainUrls.slice(1);
  }

  const applyVariant = (variant) => {
    if (!variant || typeof variant !== "object") return variant;
    const next = { ...variant };
    const { images, previewImage } = localVariantMediaUrls(root, id, next);
    if (images.length) {
      next.image = images[0];
      next.gallery = images.slice(1);
    }
    if (previewImage) next.previewImage = previewImage;
    return next;
  };

  if (Array.isArray(out.colourVariants)) {
    out.colourVariants = out.colourVariants.map(applyVariant);
    if (!mainUrls.length && out.colourVariants[0]?.image) {
      out.image = out.colourVariants[0].image;
      out.gallery = Array.isArray(out.colourVariants[0].gallery) ? out.colourVariants[0].gallery : [];
    }
  }

  if (Array.isArray(out.colorVariants)) {
    out.colourVariants = out.colorVariants.map(applyVariant);
    delete out.colorVariants;
    if (!mainUrls.length && out.colourVariants[0]?.image) {
      out.image = out.colourVariants[0].image;
      out.gallery = Array.isArray(out.colourVariants[0].gallery) ? out.colourVariants[0].gallery : [];
    }
  }

  if (out.metadata && typeof out.metadata === "object" && !Array.isArray(out.metadata)) {
    const meta = { ...out.metadata };
    if (Array.isArray(meta.colourVariants)) {
      meta.colourVariants = meta.colourVariants.map(applyVariant);
    }
    if (Array.isArray(meta.colorVariants)) {
      meta.colourVariants = meta.colorVariants.map(applyVariant);
      delete meta.colorVariants;
    }
    out.metadata = meta;
  }

  return out;
}

export function manifestEntryForItem(item, root) {
  const id = String(item?.id ?? "").trim();
  const variants = {};
  if (!id) return { main: [], variants };

  const rows = Array.isArray(item?.colourVariants)
    ? item.colourVariants
    : Array.isArray(item?.colorVariants)
      ? item.colorVariants
      : [];

  for (const variant of rows) {
    const key = String(variant?.key ?? "").trim();
    if (!key) continue;
    variants[key] = localVariantMediaUrls(root, id, variant).images;
  }

  return {
    main: localMainMediaUrls(root, id),
    variants,
  };
}
