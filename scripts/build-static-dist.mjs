#!/usr/bin/env node
/**
 * Copy static site assets into `dist/` (the static host's Output Directory).
 */
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { transform } from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const heroMediaExtensions = new Set([
  ".avif",
  ".gif",
  ".jpg",
  ".jpeg",
  ".mp4",
  ".png",
  ".webm",
  ".webp",
]);

function buildHomeHeroManifestSource() {
  const heroDir = path.join(root, "images", "heroes");
  let images = [];
  if (fs.existsSync(heroDir)) {
    images = fs
      .readdirSync(heroDir, { withFileTypes: true })
      .filter((entry) => entry.isFile() && heroMediaExtensions.has(path.extname(entry.name).toLowerCase()))
      .map((entry) => `images/heroes/${entry.name}`)
      .sort((a, b) => a.localeCompare(b, "en"));
  }
  return `window.TW_HOME_HERO_IMAGES = ${JSON.stringify(images, null, 2)};\n`;
}

const platformConfigFiles = ["_redirects", "_headers"];

const rootFiles = [
  "index.html",
  "collection.html",
  "item.html",
  "login.html",
  "account.html",
  "app.js",
  "styles.css",
  "icon-pwa.png",
  "icon-180.png",
  "icon-192.png",
  "icon-512.png",
  "site.webmanifest",
  "icon.svg",
  "icon-mark.svg",
  "loading-logo.png",
  "og-image.png",
  "robots.txt",
];

const rootDirs = ["js", "data", "images", "icons"];

fs.rmSync(dist, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 });
fs.mkdirSync(dist, { recursive: true });

const publicDir = path.join(root, "public");
if (fs.existsSync(publicDir)) {
  fs.cpSync(publicDir, dist, { recursive: true });
}

for (const name of [...rootFiles, ...platformConfigFiles]) {
  const src = path.join(root, name);
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(dist, name));
}

for (const name of rootDirs) {
  const src = path.join(root, name);
  if (fs.existsSync(src)) fs.cpSync(src, path.join(dist, name), { recursive: true });
}

// Wardrobe masters (images/wardrobe/*/main) are served from R2 — ship only the
// local cutouts the app actually requests (…/cutout/<n>.webp).
const distWardrobe = path.join(dist, "images", "wardrobe");
if (fs.existsSync(distWardrobe)) {
  for (const entry of fs.readdirSync(distWardrobe, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    fs.rmSync(path.join(distWardrobe, entry.name, "main"), { recursive: true, force: true });
  }
}

fs.mkdirSync(path.join(dist, "js"), { recursive: true });
fs.writeFileSync(path.join(dist, "js", "tw-home-hero-manifest.js"), buildHomeHeroManifestSource(), "utf8");

// Minify the JS we ship (source files stay readable; only dist/ is transformed).
const jsTargets = [
  path.join(dist, "app.js"),
  path.join(dist, "data", "wardrobe.js"),
  ...fs
    .readdirSync(path.join(dist, "js"))
    .filter((name) => name.endsWith(".js"))
    .map((name) => path.join(dist, "js", name)),
].filter((file) => fs.existsSync(file));

for (const file of jsTargets) {
  const source = fs.readFileSync(file, "utf8");
  const { code } = await transform(source, { minify: true, target: "es2020", charset: "utf8" });
  fs.writeFileSync(file, code, "utf8");
  console.log(`minified ${path.relative(dist, file)}: ${source.length} → ${code.length} bytes`);
}

// Content-hash versioning (?v=<hash>) on every shipped JS/CSS reference.
// The edge caches .js/.css for 7 days but never caches HTML, so a new deploy
// must change asset URLs or visitors keep getting the previous bundle.
const shortHash = (buf) => crypto.createHash("sha256").update(buf).digest("hex").slice(0, 8);
const relPosix = (file) => path.relative(dist, file).split(path.sep).join("/");

const versions = new Map();
const appJsFile = path.join(dist, "app.js");
for (const file of [path.join(dist, "styles.css"), ...jsTargets]) {
  if (file === appJsFile || !fs.existsSync(file)) continue;
  versions.set(relPosix(file), shortHash(fs.readFileSync(file)));
}

// app.js dynamically imports the supabase module — stamp that specifier first,
// then hash the final app.js content.
let appCode = fs.readFileSync(appJsFile, "utf8");
appCode = appCode.replaceAll(
  "./js/supabase-client.js",
  `./js/supabase-client.js?v=${versions.get("js/supabase-client.js")}`,
);
fs.writeFileSync(appJsFile, appCode, "utf8");
versions.set("app.js", shortHash(appCode));

for (const name of rootFiles.filter((n) => n.endsWith(".html"))) {
  const file = path.join(dist, name);
  if (!fs.existsSync(file)) continue;
  let html = fs.readFileSync(file, "utf8");
  for (const [rel, hash] of versions) {
    html = html.replaceAll(`"${rel}"`, `"${rel}?v=${hash}"`);
  }
  fs.writeFileSync(file, html, "utf8");
}
console.log(`versioned ${versions.size} assets (?v=) across shipped pages`);

console.log("Static build → dist/");
