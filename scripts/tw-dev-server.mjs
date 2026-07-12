#!/usr/bin/env node
/**
 * Serves the repo root as static files and accepts PUT /api/custom-items
 * to overwrite data/custom-items.json (used by app.js when adding/editing/deleting custom pieces).
 *
 * Usage: npm run dev
 * Open: http://127.0.0.1:8787/
 */
import { createReadStream, watch as watchFs } from "node:fs";
import fs from "node:fs/promises";
import http from "node:http";
import path from "node:path";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const customJsonPath = path.join(root, "data", "custom-items.json");
const cssBuildScriptPath = path.join(root, "scripts", "build-css.mjs");
const cssWatchDir = path.join(root, "css");
let cssBuildRunning = false;
let cssBuildQueued = false;
let cssBuildDebounceTimer = 0;
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

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
};

function isPathInsideRoot(absFile) {
  const r = path.resolve(root);
  const f = path.resolve(absFile);
  return f === r || f.startsWith(r + path.sep);
}

async function readRequestBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks).toString("utf8");
}

function jsonResponse(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

async function handlePutCustomItems(req, res) {
  let body;
  try {
    body = await readRequestBody(req);
  } catch (e) {
    console.error(e);
    res.writeHead(400);
    res.end();
    return;
  }
  let data;
  try {
    data = JSON.parse(body);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Invalid JSON");
    return;
  }
  if (!Array.isArray(data)) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Body must be a JSON array");
    return;
  }
  try {
    await fs.mkdir(path.dirname(customJsonPath), { recursive: true });
    await fs.writeFile(customJsonPath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
    res.writeHead(204);
    res.end();
  } catch (e) {
    console.error(e);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Write failed");
  }
}

function localWardrobeImagePathFromStoragePath(storagePath) {
  const raw = String(storagePath ?? "").trim().replace(/^\/+/, "");
  if (!raw || raw.includes("\0")) return "";
  const parts = raw.split("/");
  if (parts.some((p) => !p || p === "." || p === "..")) return "";
  if (!/\.(?:avif|gif|jpe?g|png|webp)$/i.test(raw)) return "";
  const abs = path.join(root, "images", "wardrobe", raw);
  const imageRoot = path.join(root, "images", "wardrobe");
  const resolved = path.resolve(abs);
  const resolvedRoot = path.resolve(imageRoot);
  if (resolved !== resolvedRoot && !resolved.startsWith(resolvedRoot + path.sep)) return "";
  return resolved;
}

function decodeDataUrlImage(dataUrl) {
  const raw = String(dataUrl ?? "");
  const m = raw.match(/^data:(image\/(?:avif|gif|jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/i);
  if (!m) return null;
  return Buffer.from(m[2].replace(/\s+/g, ""), "base64");
}

async function removeLocalImageSiblingExtensions(absFile) {
  const dir = path.dirname(absFile);
  const file = path.basename(absFile);
  const dot = file.lastIndexOf(".");
  if (dot <= 0) return;
  const base = file.slice(0, dot).toLowerCase();
  let entries = [];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return;
  }
  await Promise.allSettled(
    entries
      .filter((name) => {
        if (!name || name === file) return false;
        const idx = name.lastIndexOf(".");
        if (idx <= 0) return false;
        return name.slice(0, idx).toLowerCase() === base && /\.(?:avif|gif|jpe?g|png|webp)$/i.test(name);
      })
      .map((name) => fs.rm(path.join(dir, name), { force: true }))
  );
}

async function handlePostWardrobeLocalImage(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readRequestBody(req));
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Invalid JSON");
    return;
  }
  const absFile = localWardrobeImagePathFromStoragePath(payload?.storagePath);
  const bytes = decodeDataUrlImage(payload?.dataUrl);
  if (!absFile || !bytes?.length) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Expected { storagePath, dataUrl } for an image under images/wardrobe");
    return;
  }
  try {
    await fs.mkdir(path.dirname(absFile), { recursive: true });
    await fs.writeFile(absFile, bytes);
    await removeLocalImageSiblingExtensions(absFile);
    jsonResponse(res, 200, {
      ok: true,
      path: path.relative(root, absFile).replace(/\\/g, "/"),
      bytes: bytes.length,
    });
  } catch (e) {
    console.error(e);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Write failed");
  }
}

async function serveFaviconAsset(/** @type {http.IncomingMessage} */ req, /** @type {http.ServerResponse} */ res, absFile) {
  if (!isPathInsideRoot(absFile)) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return true;
  }
  try {
    const st = await fs.stat(absFile);
    if (!st.isFile()) return false;
    const ext = path.extname(absFile).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME[ext] || "application/octet-stream",
      "Cache-Control": "no-cache, must-revalidate",
      "Content-Length": String(st.size),
    });
    if (req.method === "HEAD") {
      res.end();
      return true;
    }
    createReadStream(absFile).pipe(res);
    return true;
  } catch {
    return false;
  }
}

async function buildHomeHeroManifestSource() {
  const heroDir = path.join(root, "images", "heroes");
  let entries = [];
  try {
    entries = await fs.readdir(heroDir, { withFileTypes: true });
  } catch {
    entries = [];
  }
  const images = entries
    .filter((entry) => entry.isFile() && heroMediaExtensions.has(path.extname(entry.name).toLowerCase()))
    .map((entry) => `images/heroes/${entry.name}`)
    .sort((a, b) => a.localeCompare(b, "en"));
  return `window.TW_HOME_HERO_IMAGES = ${JSON.stringify(images, null, 2)};\n`;
}

async function serveHomeHeroManifest(/** @type {http.ServerResponse} */ res) {
  const source = await buildHomeHeroManifestSource();
  res.writeHead(200, {
    "Content-Type": "text/javascript; charset=utf-8",
    "Cache-Control": "no-store",
    "Content-Length": String(Buffer.byteLength(source)),
  });
  res.end(source);
}

async function handleStatic(/** @type {http.IncomingMessage} */ req, /** @type {http.ServerResponse} */ res) {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  let pathname = decodeURIComponent(url.pathname).replace(/\/$/, "") || "/";
  if (pathname === "/js/tw-home-hero-manifest.js") {
    await serveHomeHeroManifest(res);
    return;
  }
  if (pathname === "/favicon.ico" || pathname === "/favicon.png") {
    const absFile = path.join(root, "favicon.png");
    if (await serveFaviconAsset(req, res, absFile)) return;
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }
  if (pathname.includes("\0")) {
    res.writeHead(400);
    res.end();
    return;
  }
  const COLLECTION_DIVISION_SLUGS = new Set(["clothing", "accessories", "watches", "fragrance"]);
  if (pathname === "/collection/login") {
    res.writeHead(302, { Location: "/login" });
    res.end();
    return;
  }
  // Mirror vercel.json rewrites for clean URLs
  const itemMatch = pathname.match(/^\/item\/(.+)$/);
  if (itemMatch) {
    res.writeHead(302, { Location: `/item.html?id=${encodeURIComponent(itemMatch[1])}` });
    res.end();
    return;
  }
  let rel = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  if (pathname === "/item.html" || pathname === "/collection/item.html") {
    rel = "item.html";
  } else if (pathname === "/login" || pathname === "/login.html") {
    rel = "login.html";
  } else if (pathname === "/account" || pathname === "/account.html") {
    rel = "account.html";
  } else if (pathname === "/collection" || pathname === "/collection.html") {
    rel = "collection.html";
  } else if (pathname.startsWith("/collection/")) {
    const rest = pathname.slice("/collection/".length);
    const segment = rest.split("/")[0].toLowerCase();
    if (segment === "item.html" || segment === "item") {
      rel = "item.html";
    } else if (segment === "additem" || segment === "editor") {
      rel = "collection.html";
    } else if (COLLECTION_DIVISION_SLUGS.has(segment)) {
      rel = "collection.html";
    } else if (rest && !rest.includes("..")) {
      /* `/collection/styles.css` etc. when HTML lacks `<base href="/">` */
      rel = rest;
    }
  } else if (rel === "collection") {
    rel = "collection.html";
  }
  rel = path.normalize(rel).replace(/^(\.\.(\/|\\|$))+/, "");
  let filePath = path.join(root, rel);
  if (!isPathInsideRoot(filePath)) {
    res.writeHead(403);
    res.end();
    return;
  }
  let st;
  try {
    st = await fs.stat(filePath);
  } catch {
    const publicFile = path.join(root, "public", rel);
    if (isPathInsideRoot(publicFile)) {
      try {
        st = await fs.stat(publicFile);
        filePath = publicFile;
      } catch {
        res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("Not found");
        return;
      }
    } else {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }
  }
  if (st.isDirectory()) {
    filePath = path.join(filePath, "index.html");
    try {
      st = await fs.stat(filePath);
    } catch {
      res.writeHead(404);
      res.end();
      return;
    }
  }
  if (!st.isFile()) {
    res.writeHead(404);
    res.end();
    return;
  }
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || "application/octet-stream";
  const etag = `"${Math.floor(st.mtimeMs)}-${st.size}"`;
  const lastModified = st.mtime.toUTCString();
  // no-store prevents memory-cache bypass of no-cache in Chromium (scripts stay stale otherwise)
  const cacheControl = ext === ".js" || ext === ".mjs" || ext === ".html"
    ? "no-store"
    : "no-cache, must-revalidate";
  const baseHeaders = {
    "Content-Type": type,
    "Cache-Control": cacheControl,
    "Last-Modified": lastModified,
    ETag: etag,
  };
  if (req.headers["if-none-match"] === etag) {
    res.writeHead(304, baseHeaders);
    res.end();
    return;
  }
  if (req.method === "HEAD") {
    res.writeHead(200, { ...baseHeaders, "Content-Length": String(st.size) });
    res.end();
    return;
  }

  // For HTML files: rewrite local .js src/href to include mtime-based cache-buster
  // so each changed version of a script gets a unique URL, bypassing memory cache.
  if (ext === ".html") {
    let html = await fs.readFile(filePath, "utf8");
    html = await rewriteHtmlAssetVersions(html, path.dirname(filePath));
    const buf = Buffer.from(html, "utf8");
    res.writeHead(200, { ...baseHeaders, "Content-Length": String(buf.length) });
    res.end(buf);
    return;
  }

  res.writeHead(200, { ...baseHeaders, "Content-Length": String(st.size) });
  createReadStream(filePath).pipe(res);
}

/**
 * Rewrite <script src="foo.js"> and <link href="foo.css"> in HTML to
 * <script src="foo.js?_v=MTIME"> so each changed asset gets a unique URL.
 * Only applies to local (non-protocol-relative, non-absolute-URL) paths.
 */
async function rewriteHtmlAssetVersions(html, baseDir) {
  const localSrcRe = /(<script\b[^>]*?\ssrc=["'])([^"']+)(["'][^>]*>)/gi;
  const localLinkRe = /(<link\b[^>]*?\shref=["'])([^"']+)(["'][^>]*>)/gi;

  async function stampSrc(match, before, src, after) {
    if (/^https?:\/\/|^\/\//.test(src)) return match;
    const stripped = src.replace(/\?.*$/, "");
    const absPath = path.join(baseDir, stripped.replace(/^\//, ""));
    try {
      const s = await fs.stat(absPath);
      const v = Math.floor(s.mtimeMs);
      const sep = stripped === src ? "?" : src.includes("?") ? "&" : "?";
      return `${before}${stripped}${sep}_v=${v}${after}`;
    } catch {
      return match;
    }
  }

  // Process all matches sequentially
  const scriptMatches = [];
  html.replace(localSrcRe, (m, b, s, a) => { scriptMatches.push({ m, b, s, a }); return m; });
  for (const { m, b, s, a } of scriptMatches) {
    const stamped = await stampSrc(m, b, s, a);
    html = html.replace(m, stamped);
  }

  const linkMatches = [];
  html.replace(localLinkRe, (m, b, s, a) => { linkMatches.push({ m, b, s, a }); return m; });
  for (const { m, b, s, a } of linkMatches) {
    const stamped = await stampSrc(m, b, s, a);
    html = html.replace(m, stamped);
  }

  return html;
}

function runCssBuild(reason = "change") {
  if (cssBuildRunning) {
    cssBuildQueued = true;
    return;
  }
  cssBuildRunning = true;
  const started = Date.now();
  console.log(`[css] building styles.css (${reason})`);
  const child = spawn(process.execPath, [cssBuildScriptPath], {
    cwd: root,
    stdio: "inherit",
    env: process.env,
  });
  child.once("exit", (code) => {
    cssBuildRunning = false;
    if (code === 0) {
      console.log(`[css] build complete in ${Date.now() - started}ms`);
    } else {
      console.warn(`[css] build failed (exit ${code ?? "unknown"})`);
    }
    if (cssBuildQueued) {
      cssBuildQueued = false;
      runCssBuild("queued");
    }
  });
}

function queueCssBuild(reason = "change") {
  if (cssBuildDebounceTimer) clearTimeout(cssBuildDebounceTimer);
  cssBuildDebounceTimer = setTimeout(() => {
    cssBuildDebounceTimer = 0;
    runCssBuild(reason);
  }, 120);
}

const wardrobeMainDir = path.join(root, "images", "wardrobe");

// Source normaliser: force-centre cover cutouts (1.webp) before deriving thumbs/
// cutouts, so a newly-added cover is auto-centred with no manual step. Hash-gated,
// so it's near-instant and writes nothing when covers are already centred (which
// also keeps the file watcher from looping on its own rewrites).
const centerScriptPath = path.join(root, "scripts", "center-cutouts.mjs");
let centerBuildTimer = null;
let centerBuildRunning = false;

function queueCenterBuild(reason) {
  if (centerBuildTimer) clearTimeout(centerBuildTimer);
  centerBuildTimer = setTimeout(async () => {
    centerBuildTimer = null;
    if (centerBuildRunning) { queueCenterBuild("retry-busy"); return; }
    centerBuildRunning = true;
    console.log(`[center] reconciling (${reason})…`);
    try {
      await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [centerScriptPath], { stdio: "inherit" });
        child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
      });
      console.log("[center] done.");
    } catch (err) {
      console.warn("[center] failed:", err?.message || err);
    } finally {
      centerBuildRunning = false;
      // Always derive the cutout set afterwards (hash-gated, near-instant if nothing moved).
      // (The pre-generated thumb/ set was retired — Worker resize covers card sizes.)
      queueCutoutBuild(`after-center:${reason}`);
    }
  }, 600);
}

const cutoutScriptPath = path.join(root, "scripts", "generate-wardrobe-cutout-thumbs.mjs");
let cutoutBuildTimer = null;
let cutoutBuildRunning = false;

function queueCutoutBuild(reason) {
  if (cutoutBuildTimer) clearTimeout(cutoutBuildTimer);
  cutoutBuildTimer = setTimeout(async () => {
    cutoutBuildTimer = null;
    if (cutoutBuildRunning) { queueCutoutBuild("retry-busy"); return; }
    cutoutBuildRunning = true;
    console.log(`[cutouts] rebuilding (${reason})…`);
    try {
      await new Promise((resolve, reject) => {
        const child = spawn(process.execPath, [cutoutScriptPath], { stdio: "inherit" });
        child.on("close", (code) => (code === 0 ? resolve() : reject(new Error(`exit ${code}`))));
      });
      console.log("[cutouts] done.");
    } catch (err) {
      console.warn("[cutouts] build failed:", err?.message || err);
    } finally {
      cutoutBuildRunning = false;
    }
  }, 600);
}

function installThumbWatcher() {
  try {
    const watcher = watchFs(wardrobeMainDir, { recursive: true, persistent: true }, (eventType, filename) => {
      const f = String(filename || "").replace(/\\/g, "/");
      const inMain = f.includes("/main/");
      const isVariantCover = /\/variants\/[^/]+\/1\.webp$/i.test(f);
      if (!inMain && !isVariantCover) return;
      if (!/\.(webp|png|jpe?g)$/i.test(f)) return;
      // Source changed — re-centre the cover first, then regenerate both
      // presentation sets (queueCenterBuild chains thumb + cutout on completion).
      queueCenterBuild(f);
    });
    watcher.on("error", (err) => console.warn("[thumbs] watch error:", err?.message || err));
    console.log("[thumbs] watching images/wardrobe/*/main/ for changes");
  } catch (err) {
    console.warn("[thumbs] watcher unavailable:", err?.message || err);
  }
}

function installCssAutoBuildWatcher() {
  try {
    const watcher = watchFs(cssWatchDir, { persistent: true }, (eventType, filename) => {
      const file = String(filename || "");
      if (!file || !file.toLowerCase().endsWith(".css")) return;
      queueCssBuild(`${eventType}:${file}`);
    });
    watcher.on("error", (err) => {
      console.warn("[css] watch error:", err?.message || err);
    });
    console.log("[css] watching css/*.css for changes");
  } catch (err) {
    console.warn("[css] watcher unavailable:", err?.message || err);
  }
}

const preferredPort = Number(process.env.PORT) || 8787;
const maxPortTries = 20;

async function handleGetWardrobeStatus(_req, res) {
  jsonResponse(res, 200, {
    gitStorage: true,
    imageRoot: "/images/wardrobe",
    wardrobeJs: "data/wardrobe.js",
  });
}

/**
 * Renames local wardrobe gallery files to canonical 1.webp, 2.webp, 3.webp… order.
 * Body: { itemId: string, orderedPaths: string[] }
 *   orderedPaths: full URL paths as stored (e.g. ["/images/wardrobe/item/main/2.webp", ...])
 * Returns: { ok: true, image: string, gallery: string[] }
 */
async function handlePostWardrobeRenameGallery(req, res) {
  let payload;
  try {
    payload = JSON.parse(await readRequestBody(req));
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Invalid JSON");
    return;
  }

  const itemId = String(payload?.itemId ?? "").trim();
  const orderedPaths = Array.isArray(payload?.orderedPaths) ? payload.orderedPaths : [];
  if (!itemId || !orderedPaths.length) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Expected { itemId, orderedPaths }");
    return;
  }

  // Validate and resolve all paths
  const imageWardrobeRoot = path.join(root, "images", "wardrobe");
  const resolved = [];
  for (const p of orderedPaths) {
    const rel = String(p ?? "").trim().replace(/^\/+/, "");
    if (!rel || rel.includes("\0") || !rel.startsWith("images/wardrobe/")) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(`Invalid path: ${p}`);
      return;
    }
    const abs = path.resolve(path.join(root, rel));
    if (!abs.startsWith(path.resolve(imageWardrobeRoot) + path.sep)) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Path escapes wardrobe root");
      return;
    }
    // All files must be in the same directory
    if (resolved.length > 0 && path.dirname(abs) !== path.dirname(resolved[0])) {
      res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("All paths must be in the same directory");
      return;
    }
    resolved.push(abs);
  }

  const dir = path.dirname(resolved[0]);

  try {
    // Step 1: rename each file to a temp name to avoid conflicts
    const tmpPaths = [];
    for (let i = 0; i < resolved.length; i++) {
      const tmp = path.join(dir, `__tw_tmp_${i}${path.extname(resolved[i])}`);
      await fs.rename(resolved[i], tmp);
      tmpPaths.push(tmp);
    }
    // Step 2: rename temp files to canonical 1.webp, 2.webp, ...
    const finalPaths = [];
    for (let i = 0; i < tmpPaths.length; i++) {
      const ext = path.extname(tmpPaths[i]);
      const canonical = path.join(dir, `${i + 1}${ext}`);
      await fs.rename(tmpPaths[i], canonical);
      finalPaths.push("/" + path.relative(root, canonical).replace(/\\/g, "/"));
    }
    jsonResponse(res, 200, {
      ok: true,
      image: finalPaths[0] ?? "",
      gallery: finalPaths.slice(1),
    });
  } catch (e) {
    console.error(e);
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Rename failed");
  }
}

const server = http.createServer((req, res) => {
  const pathname = req.url?.split("?")[0] || "";
  if (req.method === "POST" && pathname === "/api/wardrobe/rename-gallery") {
    void handlePostWardrobeRenameGallery(req, res);
    return;
  }
  if (req.method === "GET" && pathname === "/api/wardrobe/status") {
    void handleGetWardrobeStatus(req, res);
    return;
  }
  if (req.method === "PUT" && pathname === "/api/custom-items") {
    void handlePutCustomItems(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/wardrobe/local-image") {
    void handlePostWardrobeLocalImage(req, res);
    return;
  }
  if (req.method === "GET" || req.method === "HEAD") {
    void handleStatic(req, res);
    return;
  }
  res.writeHead(405, { Allow: "GET, HEAD, PUT, POST" });
  res.end();
});

installCssAutoBuildWatcher();
installThumbWatcher();
// Startup image reconcile is handled by the predev hook (runs center → cutouts
// before the server starts). Watcher handles live edits from here on.

function listenWithFallback(port, triesLeft) {
  server.once("error", (err) => {
    const e = /** @type {NodeJS.ErrnoException} */ (err);
    if (e.code === "EADDRINUSE" && triesLeft > 1) {
      console.warn(`Port ${port} busy, trying ${port + 1}…`);
      if (port === preferredPort) {
        console.warn(
          "Tip: another `npm run dev` may still be running (another terminal, or Ctrl+Z suspended). " +
            "Open only the URL printed below, or free the port: lsof -nP -iTCP:" +
            port +
            " -sTCP:LISTEN"
        );
      }
      listenWithFallback(port + 1, triesLeft - 1);
      return;
    }
    console.error(e);
    process.exit(1);
  });
  server.listen(port, "127.0.0.1", () => {
    console.log(`Timeless Wardrobe dev server → http://127.0.0.1:${port}/`);
    console.log("PUT /api/custom-items writes data/custom-items.json (browser-only mode custom rows)");
    console.log("POST /api/wardrobe/local-image mirrors editor uploads into images/wardrobe/ during local dev.");
    console.log("Wardrobe images: Supabase Storage is canonical; npm run db:backup-to-local can refresh the full mirror.");
  });
}

listenWithFallback(preferredPort, maxPortTries);
