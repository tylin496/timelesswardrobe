const CACHE_TTL = 60 * 60 * 24 * 365; // 1 year — immutable assets

// Diagnostic probe image — small known-size WebP, change w= to force a different size.
const PROBE_KEY = "wardrobe/tank-solo/main/1.webp";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // strip leading /

    // ── Diagnostic endpoint ──────────────────────────────────────────────────
    // GET /diagnostics — fetches probe image with and without cf.image to check
    // whether Image Transformations are active on this zone.
    if (key === "diagnostics") {
      const base = `${(env.R2_PUBLIC_URL || "").replace(/\/$/, "")}/${PROBE_KEY}`;
      const [orig, resized] = await Promise.all([
        fetch(base),
        fetch(base, { cf: { image: { width: 50, height: 50, fit: "contain", format: "webp" } } }),
      ]);
      const origLen = orig.headers.get("content-length");
      const resizedLen = resized.headers.get("content-length");
      const origType = orig.headers.get("content-type");
      const resizedType = resized.headers.get("content-type");
      const working = resizedLen !== null && resizedLen !== origLen;
      return Response.json({
        cf_image_working: working,
        original: { content_length: origLen, content_type: origType, status: orig.status },
        resized:  { content_length: resizedLen, content_type: resizedType, status: resized.status },
        note: working
          ? "cf.image is applying transforms — sizes differ."
          : "cf.image is NOT working — sizes identical. Image Transformations may not be enabled on this zone.",
      }, { headers: { "Access-Control-Allow-Origin": "*" } });
    }
    // ────────────────────────────────────────────────────────────────────────

    if (!key.startsWith("wardrobe/")) {
      return new Response("Not found", { status: 404 });
    }

    const w = parseInt(url.searchParams.get("w") || "0") || undefined;
    const h = parseInt(url.searchParams.get("h") || "0") || undefined;
    const qRaw = parseInt(url.searchParams.get("q") || "0", 10) || undefined;
    const q = qRaw && qRaw >= 20 && qRaw <= 95 ? qRaw : undefined;
    const fit = url.searchParams.get("fit") || "contain";
    const bg = url.searchParams.get("background") || undefined;

    const sourceUrl = `${(env.R2_PUBLIC_URL || "").replace(/\/$/, "")}/${key}`;

    const cfImage = (w || h) ? {
      width: w,
      height: h,
      fit,
      format: "webp",
      ...(q ? { quality: q } : {}),
      ...(bg ? { background: `#${bg.replace(/^#/, "")}` } : {}),
    } : undefined;

    const response = await fetch(sourceUrl, {
      cf: cfImage ? { image: cfImage } : undefined,
    });

    if (!response.ok) {
      return new Response(response.statusText, { status: response.status });
    }

    const headers = new Headers(response.headers);
    headers.set("Cache-Control", `public, max-age=${CACHE_TTL}, immutable`);
    headers.set("Access-Control-Allow-Origin", "*");

    return new Response(response.body, { status: 200, headers });
  },
};
