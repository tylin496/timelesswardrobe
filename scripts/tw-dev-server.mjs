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
import { spawn, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import {
  fileExtensionFromName,
  localPublicUrlForStoragePath,
  wardrobeImageStorageObjectPath,
} from "./lib/wardrobe-image-local.mjs";
import { upsertWardrobeItemInFile } from "./lib/wardrobe-js-io.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const customJsonPath = path.join(root, "data", "custom-items.json");
const wardrobeImagesRoot = path.join(root, "images", "wardrobe");
const galleryManifestScript = path.join(root, "scripts", "build-wardrobe-local-gallery-manifest.mjs");
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

function runGalleryManifestBuild() {
  if (!galleryManifestScript) return;
  spawnSync(process.execPath, [galleryManifestScript], { cwd: root, stdio: "inherit" });
}

function jsonResponse(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

/** POST /api/wardrobe/upload — write image bytes to images/wardrobe/… */
async function handlePostWardrobeUpload(req, res) {
  let body;
  try {
    body = await readRequestBody(req);
  } catch (e) {
    console.error(e);
    res.writeHead(400);
    res.end();
    return;
  }
  /** @type {{ itemId?: string, slot?: object, fileName?: string, mimeType?: string, dataBase64?: string }} */
  let payload;
  try {
    payload = JSON.parse(body);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Invalid JSON");
    return;
  }
  const itemId = String(payload?.itemId ?? "").trim();
  const dataBase64 = String(payload?.dataBase64 ?? "").trim();
  const slot = payload?.slot && typeof payload.slot === "object" ? payload.slot : { type: "main_cover" };
  if (!itemId || !dataBase64) {
    jsonResponse(res, 400, { error: "itemId and dataBase64 are required" });
    return;
  }
  const ext = fileExtensionFromName(payload.fileName, payload.mimeType);
  const storagePath = wardrobeImageStorageObjectPath(itemId, ext, slot);
  const destPath = path.join(wardrobeImagesRoot, storagePath);
  if (!isPathInsideRoot(destPath)) {
    jsonResponse(res, 400, { error: "Invalid destination path" });
    return;
  }
  try {
    await fs.mkdir(path.dirname(destPath), { recursive: true });
    await fs.writeFile(destPath, Buffer.from(dataBase64, "base64"));
    runGalleryManifestBuild();
    jsonResponse(res, 200, {
      url: localPublicUrlForStoragePath(storagePath),
      storagePath,
    });
  } catch (e) {
    console.error(e);
    jsonResponse(res, 500, { error: e instanceof Error ? e.message : "Write failed" });
  }
}

/** PUT /api/wardrobe/item — upsert one row in data/wardrobe.js */
async function handlePutWardrobeItem(req, res) {
  let body;
  try {
    body = await readRequestBody(req);
  } catch (e) {
    console.error(e);
    res.writeHead(400);
    res.end();
    return;
  }
  /** @type {Record<string, unknown>} */
  let item;
  try {
    item = JSON.parse(body);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Invalid JSON");
    return;
  }
  if (!item || typeof item !== "object" || Array.isArray(item)) {
    jsonResponse(res, 400, { error: "Body must be a wardrobe item object" });
    return;
  }
  try {
    const saved = upsertWardrobeItemInFile(root, item);
    runGalleryManifestBuild();
    jsonResponse(res, 200, { ok: true, item: saved });
  } catch (e) {
    console.error(e);
    jsonResponse(res, 500, { error: e instanceof Error ? e.message : "Write failed" });
  }
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
  let rel = pathname === "/" ? "index.html" : pathname.replace(/^\//, "");
  if (pathname === "/item.html" || pathname === "/collection/item.html") {
    rel = "item.html";
  } else if (pathname === "/login" || pathname === "/login.html") {
    rel = "login.html";
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
  const cacheControl = "no-cache, must-revalidate";
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
  res.writeHead(200, { ...baseHeaders, "Content-Length": String(st.size) });
  createReadStream(filePath).pipe(res);
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

const server = http.createServer((req, res) => {
  const pathname = req.url?.split("?")[0] || "";
  if (req.method === "PUT" && pathname === "/api/custom-items") {
    void handlePutCustomItems(req, res);
    return;
  }
  if (req.method === "POST" && pathname === "/api/wardrobe/upload") {
    void handlePostWardrobeUpload(req, res);
    return;
  }
  if (req.method === "PUT" && pathname === "/api/wardrobe/item") {
    void handlePutWardrobeItem(req, res);
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
    console.log("PUT /api/custom-items writes data/custom-items.json");
    console.log("Git wardrobe: POST /api/wardrobe/upload, PUT /api/wardrobe/item → images/wardrobe + data/wardrobe.js");
  });
}

listenWithFallback(preferredPort, maxPortTries);
