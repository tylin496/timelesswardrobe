/**
 * Timeless Wardrobe — Image Proxy Worker
 *
 * Serves R2 images with on-the-fly resizing via Cloudflare Image Transformations.
 * Free plan: 5,000 unique transformations/month (cached after first hit).
 *
 * URL format:
 *   /wardrobe/<id>/main/1.webp?w=720&h=960&fit=contain
 *   /wardrobe/<id>/variants/<colour>/1.webp?w=360&fit=contain
 *
 * Query params:
 *   w    — width  (pixels)
 *   h    — height (pixels)
 *   fit  — contain (default) | cover | crop | pad
 *
 * Without w/h — returns original image from R2, no transform.
 *
 * Transparent images (cutouts): alpha is preserved when fit=contain.
 * For composited cards (beige bg), callers can pass fit=pad&background=f5f0eb.
 */

const CACHE_TTL = 60 * 60 * 24 * 365; // 1 year — immutable assets

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const key = url.pathname.slice(1); // strip leading /

    if (!key.startsWith("wardrobe/")) {
      return new Response("Not found", { status: 404 });
    }

    const w = parseInt(url.searchParams.get("w") || "0") || undefined;
    const h = parseInt(url.searchParams.get("h") || "0") || undefined;
    const fit = url.searchParams.get("fit") || "contain";
    const bg = url.searchParams.get("background") || undefined;

    const sourceUrl = `${(env.R2_PUBLIC_URL || "").replace(/\/$/, "")}/${key}`;

    const cfImage = (w || h) ? {
      width: w,
      height: h,
      fit,
      format: "webp",
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
