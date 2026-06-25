/**
 * Timeless Wardrobe — R2 Image Upload Worker
 *
 * Accepts authenticated POST /upload requests and stores the image in R2.
 * Auth: Supabase JWT passed as Authorization: Bearer <token>.
 *
 * Env bindings (set in wrangler.toml / CF dashboard):
 *   WARDROBE_IMAGES  — R2 bucket binding
 *   R2_PUBLIC_URL    — e.g. https://pub-f0dd24245fc04b73b2bffc58bebc2f02.r2.dev
 *   SUPABASE_URL     — e.g. https://xxxx.supabase.co
 *   SUPABASE_ANON_KEY
 *   ALLOWED_ORIGIN   — e.g. https://timelesswardrobe.uk (or * for dev)
 */

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = env.ALLOWED_ORIGIN || "*";
    const corsHeaders = {
      "Access-Control-Allow-Origin": allowed === "*" ? "*" : origin,
      "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST" && request.method !== "DELETE") {
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
      const safePath = path.replace(/^\/+/, "").replace(/\.\./g, "");
      await env.WARDROBE_IMAGES.delete(safePath);
      return new Response(JSON.stringify({ deleted: safePath }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse form data
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

    // Sanitise path — no leading slash, no traversal
    const safePath = path.replace(/^\/+/, "").replace(/\.\./g, "");

    await env.WARDROBE_IMAGES.put(safePath, file.stream(), {
      httpMetadata: { contentType: file.type || "image/webp" },
    });

    const publicUrl = `${(env.R2_PUBLIC_URL || "").replace(/\/$/, "")}/${safePath}`;
    return new Response(JSON.stringify({ url: publicUrl, path: safePath }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  },
};
