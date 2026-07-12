/**
 * Timeless Wardrobe — R2 Image Upload Worker
 *
 * Accepts authenticated requests and stores/moves/removes images in R2.
 * Auth: Supabase JWT passed as Authorization: Bearer <token>.
 *
 * Env bindings (set in wrangler.toml / CF dashboard):
 *   WARDROBE_IMAGES  — R2 bucket binding
 *   R2_PUBLIC_URL    — e.g. https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev
 *   SUPABASE_URL     — e.g. https://xxxx.supabase.co
 *   SUPABASE_ANON_KEY
 *   ALLOWED_ORIGIN   — e.g. https://timelesswardrobe.uk (or * for dev)
 *
 * Methods:
 *   POST   — upload a file (multipart/form-data: file + path)
 *   DELETE — remove an object (JSON: { path })
 *   PATCH  — copy/rename an object (JSON: { source, dest }) — R2 has no rename; copies then deletes source
 */

const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20 MB — crop export is ~1-4 MB; generous headroom

function resolveCorsOrigin(origin, allowedList) {
  if (allowedList === "*") return "*";
  if (!origin) return "";
  if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) return origin;
  const allowed = allowedList.split(",").map((s) => s.trim()).filter(Boolean);
  return allowed.includes(origin) ? origin : "";
}

// Bucket keys are only ever written under wardrobe/ (the img worker serves nothing else)
function safeWardrobeKey(path) {
  const key = String(path).replace(/^\/+/, "").replace(/\.\./g, "");
  return key.startsWith("wardrobe/") ? key : "";
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const corsHeaders = {
      "Access-Control-Allow-Origin": resolveCorsOrigin(origin, env.ALLOWED_ORIGIN || "*"),
      "Access-Control-Allow-Methods": "POST, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST" && request.method !== "DELETE" && request.method !== "PATCH") {
      return new Response("Method not allowed", { status: 405, headers: corsHeaders });
    }

    // Verify Supabase JWT
    const auth = request.headers.get("Authorization") || "";
    if (!auth.startsWith("Bearer ")) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const token = auth.slice(7).trim();
    const verifyRes = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: env.SUPABASE_ANON_KEY },
    });
    if (!verifyRes.ok) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }
    const user = await verifyRes.json();
    const email = user?.email ?? "";

    // Check editor allowlist
    const editorRes = await fetch(
      `${env.SUPABASE_URL}/rest/v1/wardrobe_editors?email=eq.${encodeURIComponent(email)}&select=email&limit=1`,
      { headers: { Authorization: `Bearer ${token}`, apikey: env.SUPABASE_ANON_KEY } }
    );
    const editors = editorRes.ok ? await editorRes.json() : [];
    if (!Array.isArray(editors) || !editors.length) {
      return new Response("Forbidden", { status: 403, headers: corsHeaders });
    }

    // DELETE — remove an object from R2
    if (request.method === "DELETE") {
      let body;
      try {
        body = await request.json();
      } catch {
        return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
      }
      const path = body?.path;
      if (typeof path !== "string" || !path.trim()) {
        return new Response("Missing path", { status: 400, headers: corsHeaders });
      }
      const safePath = safeWardrobeKey(path);
      if (!safePath) {
        return new Response("Path must be under wardrobe/", { status: 400, headers: corsHeaders });
      }
      await env.WARDROBE_IMAGES.delete(safePath);
      return new Response(JSON.stringify({ deleted: safePath }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PATCH — copy an R2 object to a new key (rename; R2 has no native rename)
    if (request.method === "PATCH") {
      let body;
      try {
        body = await request.json();
      } catch {
        return new Response("Invalid JSON", { status: 400, headers: corsHeaders });
      }
      const { source, dest } = body ?? {};
      if (typeof source !== "string" || !source.trim() || typeof dest !== "string" || !dest.trim()) {
        return new Response("Missing source or dest", { status: 400, headers: corsHeaders });
      }
      const safeSrc = safeWardrobeKey(source);
      const safeDest = safeWardrobeKey(dest);
      if (!safeSrc || !safeDest) {
        return new Response("Paths must be under wardrobe/", { status: 400, headers: corsHeaders });
      }
      if (safeSrc === safeDest) {
        return new Response(JSON.stringify({ skipped: true }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const obj = await env.WARDROBE_IMAGES.get(safeSrc);
      if (!obj) {
        return new Response("Source not found", { status: 404, headers: corsHeaders });
      }
      const bytes = await obj.arrayBuffer();
      await env.WARDROBE_IMAGES.put(safeDest, bytes, { httpMetadata: obj.httpMetadata });
      await env.WARDROBE_IMAGES.delete(safeSrc);
      return new Response(JSON.stringify({ moved: { from: safeSrc, to: safeDest } }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST — upload a file
    let formData;
    try {
      formData = await request.formData();
    } catch {
      return new Response("Invalid form data", { status: 400, headers: corsHeaders });
    }
    const file = formData.get("file");
    const path = formData.get("path");
    if (!file || typeof path !== "string" || !path.trim()) {
      return new Response("Missing file or path", { status: 400, headers: corsHeaders });
    }
    if (!file.type || !file.type.startsWith("image/")) {
      return new Response("Only image uploads are allowed", { status: 415, headers: corsHeaders });
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      return new Response("File too large (max 20 MB)", { status: 413, headers: corsHeaders });
    }

    const safePath = safeWardrobeKey(path);
    if (!safePath) {
      return new Response("Path must be under wardrobe/", { status: 400, headers: corsHeaders });
    }

    await env.WARDROBE_IMAGES.put(safePath, file.stream(), {
      httpMetadata: { contentType: file.type || "image/webp" },
    });

    const publicUrl = `${(env.R2_CDN_URL || env.R2_PUBLIC_URL || "").replace(/\/$/, "")}/${safePath}`;
    return new Response(JSON.stringify({ url: publicUrl, path: safePath }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
};
