#!/usr/bin/env node
/**
 * Generate dist/item/[id].html for every wardrobe item.
 *
 * Static files take precedence over Vercel rewrites, so bots fetching
 * /item/[id] receive HTML with per-item OG meta tags. Browsers get the
 * same file — the SPA extracts the id from the URL path (parseItemPageRoute
 * already handles /item/[id] path-based lookup, no query string needed).
 *
 * Run after vercel-build.mjs (needs dist/item.html to exist).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIST = path.join(ROOT, "dist");
const BASE_URL = "https://timelesswardrobe.uk";

// ── Load wardrobe data ────────────────────────────────────────────────────────
const wardrobeSrc = fs.readFileSync(path.join(ROOT, "data", "wardrobe.js"), "utf8");
let items;
{
  // wardrobe.js declares `const WARDROBE_ITEMS = [...]` — evaluate in isolation
  const fn = new Function(`${wardrobeSrc}\n; return WARDROBE_ITEMS;`);
  items = fn();
}

// ── Load item.html template ───────────────────────────────────────────────────
const templatePath = path.join(DIST, "item.html");
if (!fs.existsSync(templatePath)) {
  console.error("[item-og] dist/item.html not found — run vercel-build.mjs first");
  process.exit(1);
}
const template = fs.readFileSync(templatePath, "utf8");

// ── Helpers ───────────────────────────────────────────────────────────────────
function setMetaContent(html, property, value) {
  const escaped = value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
  const prop = escapeRegex(property);
  // (?:(?!\/>)[\s\S]) matches any char that is NOT the start of />, keeping the
  // match inside a single self-closing tag and preventing cross-tag clobbering.
  return html.replace(
    new RegExp(`<meta(?:(?!\\/>)[\\s\\S])*?(?:property|name)="${prop}"(?:(?!\\/>)[\\s\\S])*?\\/>`, 'g'),
    (match) => match.replace(/(\bcontent=")[^"]*(")/g, `$1${escaped}$2`)
  );
}

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildTitle(item) {
  return `${item.brand} — ${item.name} · Timeless Wardrobe`;
}

function buildDescription(item) {
  const parts = [];
  if (item.colour) parts.push(item.colour);
  if (item.fabric) parts.push(item.fabric);
  const detail = parts.length ? ` · ${parts.join(", ")}` : "";
  return `${item.brand} ${item.name}${detail}`;
}

function buildOgImageUrl(item) {
  const raw = String(item.image ?? "").trim().split("?")[0]; // strip ?v= hash
  if (!raw) return `${BASE_URL}/og-image.png`;
  // CDN URLs: use directly — no thumb/ substitution needed.
  if (/^https?:\/\//i.test(raw)) return raw;
  // Local paths (dev fallback): rewrite main/ → thumb/.
  let thumb = raw;
  if (/\/main\//.test(raw)) {
    thumb = raw.replace(/\/main\//, "/thumb/");
  } else {
    const m = raw.match(/^(.*\/variants\/[^/]+\/)([^/]+\.(?:webp|png|jpe?g))$/i);
    if (m && !/^preview\./i.test(m[2])) thumb = `${m[1]}thumb/${m[2]}`;
  }
  return `${BASE_URL}${thumb.startsWith("/") ? thumb : `/${thumb}`}`;
}

// ── Generate per-item HTML ────────────────────────────────────────────────────
const itemDir = path.join(DIST, "item");
fs.mkdirSync(itemDir, { recursive: true });

let count = 0;
for (const item of items) {
  if (!item.id) continue;

  const title = buildTitle(item);
  const description = buildDescription(item);
  const canonicalUrl = `${BASE_URL}/item/${encodeURIComponent(item.id)}`;
  const imageUrl = buildOgImageUrl(item);

  let html = template;

  // <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${title.replace(/&/g, "&amp;")}</title>`);

  // og: / twitter: meta
  html = setMetaContent(html, "og:title", title);
  html = setMetaContent(html, "og:description", description);
  html = setMetaContent(html, "og:url", canonicalUrl);
  html = setMetaContent(html, "og:image", imageUrl);
  html = setMetaContent(html, "og:image:alt", `${item.brand} ${item.name}`);
  html = setMetaContent(html, "twitter:title", title);
  html = setMetaContent(html, "twitter:description", description);
  html = setMetaContent(html, "twitter:image", imageUrl);

  // Remove fixed image dimensions (item images are portrait, not 1200×630)
  html = html.replace(/<meta\s+property="og:image:width"[^>]*>\s*/g, "");
  html = html.replace(/<meta\s+property="og:image:height"[^>]*>\s*/g, "");

  // canonical <link>
  html = html.replace(
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${canonicalUrl}" />`
  );

  fs.writeFileSync(path.join(itemDir, `${item.id}.html`), html, "utf8");
  count++;
}

console.log(`[item-og] generated ${count} item OG pages → dist/item/`);
