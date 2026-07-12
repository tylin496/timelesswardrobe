// Wardrobe image worker — serves img.timelesswardrobe.uk/wardrobe/<key>.
//
// Reads originals straight from the R2 bucket via the WARDROBE_IMAGES binding
// (NOT the public pub-*.r2.dev URL) and resizes on demand with the Cloudflare
// Images binding (env.IMAGES). This is what lets the r2.dev public subdomain be
// disabled: nothing here depends on the bucket being publicly reachable.
//
// R2 keys are stable per slot (wardrobe/<id>/main/<n>.webp), not content-addressed.
// Safe to cache 1y immutable because re-uploads are busted client-side: a media-
// touching save stamps item.__displayNonce and withWardrobeImageCacheBust appends
// it as `?cb=`, so a re-upload gets a new URL rather than relying on expiry.
const CACHE_TTL = 60 * 60 * 24 * 365; // 1 year — immutable assets

// Diagnostic probe image — small known-size WebP.
const PROBE_KEY = "wardrobe/tank-solo/main/1.webp";

// Unbounded w/h means unbounded paid transforms + cache-key cardinality from an
// unauthenticated endpoint. 2400 covers the largest client request (zoom preset
// height); anything above is clamped, not rejected, so a bad param still renders.
const MAX_DIM = 2400;
const FITS = new Set(["scale-down", "contain", "cover", "crop", "pad"]);

const clampDim = (v) => {
  const n = parseInt(v || "0", 10);
  return n > 0 ? Math.min(n, MAX_DIM) : undefined;
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    // R2 object keys are the decoded path; client URLs percent-encode each segment.
    let key;
    try {
      key = decodeURIComponent(url.pathname.slice(1));
    } catch {
      key = url.pathname.slice(1);
    }

    // ── Diagnostic endpoint ──────────────────────────────────────────────────
    // GET /diagnostics — reads the probe via the R2 binding and runs an Images
    // transform, comparing byte sizes to confirm the binding + Images are live.
    if (key === "diagnostics") {
      const cors = { "Access-Control-Allow-Origin": "*" };
      const src = await env.WARDROBE_IMAGES.get(PROBE_KEY);
      if (!src) {
        return Response.json({ error: "probe key missing", key: PROBE_KEY }, { status: 404, headers: cors });
      }
      const origLen = (await src.arrayBuffer()).byteLength;
      let resizedLen = null;
      let err = null;
      try {
        const probe = await env.WARDROBE_IMAGES.get(PROBE_KEY);
        const out = await env.IMAGES
          .input(probe.body)
          .transform({ width: 50, height: 50, fit: "contain" })
          .output({ format: "image/webp" });
        resizedLen = (await out.response().arrayBuffer()).byteLength;
      } catch (e) {
        err = String(e);
      }
      const working = resizedLen !== null && resizedLen !== origLen;
      return Response.json({
        images_binding_working: working,
        original_bytes: origLen,
        resized_bytes: resizedLen,
        error: err,
        note: working
          ? "Images binding transform active — sizes differ."
          : "Images binding NOT transforming — check the [images] binding is deployed and Images is enabled on the account.",
      }, { headers: cors });
    }
    // ────────────────────────────────────────────────────────────────────────

    if (!key.startsWith("wardrobe/")) {
      return new Response("Not found", { status: 404 });
    }

    // Transforms are billed and non-trivial; serve repeat requests from the edge
    // cache so a given (key + params) is only transformed once.
    const cache = caches.default;
    const cacheKey = new Request(url.toString(), { method: "GET" });
    const cached = await cache.match(cacheKey);
    if (cached) return cached;

    const w = clampDim(url.searchParams.get("w"));
    const h = clampDim(url.searchParams.get("h"));
    const qRaw = parseInt(url.searchParams.get("q") || "0", 10) || undefined;
    const q = qRaw && qRaw >= 20 && qRaw <= 95 ? qRaw : undefined;
    const fitRaw = url.searchParams.get("fit") || "contain";
    const fit = FITS.has(fitRaw) ? fitRaw : "contain";
    const bgRaw = url.searchParams.get("background") || "";
    const background = bgRaw ? `#${bgRaw.replace(/^#/, "")}` : undefined;

    const obj = await env.WARDROBE_IMAGES.get(key);
    if (!obj) return new Response("Not found", { status: 404 });

    let body;
    let contentType = "image/webp";
    if (w || h) {
      // Resize path. Cutouts (alpha) never carry w/h — they fall through to the
      // raw branch below, so the transform never touches an alpha image.
      const transform = { fit };
      if (w) transform.width = w;
      if (h) transform.height = h;
      if (background) transform.background = background;
      const out = await env.IMAGES
        .input(obj.body)
        .transform(transform)
        .output({ format: "image/webp", ...(q ? { quality: q } : {}) });
      body = out.response().body;
    } else {
      // No resize (e.g. cutouts) — serve raw bytes, preserve stored content-type.
      body = obj.body;
      if (obj.httpMetadata?.contentType) contentType = obj.httpMetadata.contentType;
    }

    const response = new Response(body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": `public, max-age=${CACHE_TTL}, immutable`,
        "Access-Control-Allow-Origin": "*",
      },
    });

    ctx.waitUntil(cache.put(cacheKey, response.clone()));
    return response;
  },
};
