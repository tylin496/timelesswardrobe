import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });

  try {
    const { outfitId, ownerToken, action, name, notes, slots, created_at } = await req.json();
    if (!outfitId) {
      return new Response(JSON.stringify({ error: "outfitId is required" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Admin check: valid session JWT with email in wardrobe_editors
    let isAdmin = false;
    const authHeader = req.headers.get("Authorization") ?? "";
    if (authHeader.startsWith("Bearer ")) {
      const jwt = authHeader.slice(7);
      const { data: { user } } = await sb.auth.getUser(jwt);
      if (user?.email) {
        const { data: editor } = await sb
          .from("wardrobe_editors")
          .select("email")
          .eq("email", user.email.toLowerCase())
          .maybeSingle();
        if (editor) isAdmin = true;
      }
    }

    if (!isAdmin) {
      if (!ownerToken) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      }
      const { data: outfit } = await sb
        .from("outfits")
        .select("owner_token_hash")
        .eq("id", outfitId)
        .maybeSingle();
      if (!outfit) {
        return new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      }
      const storedHash = String(outfit.owner_token_hash ?? "");
      if (!storedHash) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      }
      const computedHash = await hashToken(String(ownerToken));
      if (!timingSafeEqual(computedHash, storedHash)) {
        return new Response(JSON.stringify({ error: "Forbidden" }), {
          status: 403,
          headers: { ...CORS, "Content-Type": "application/json" },
        });
      }
    }

    if (action === "delete") {
      const { error } = await sb.from("outfits").delete().eq("id", outfitId);
      if (error) throw new Error(error.message);
      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    if (action === "update") {
      const { error: eDel } = await sb.from("outfit_items").delete().eq("outfit_id", outfitId);
      if (eDel) throw new Error(eDel.message);

      const patch: Record<string, unknown> = {
        name: String(name ?? "").trim(),
        notes: notes ? String(notes).trim() || null : null,
      };
      if (created_at) {
        const d = new Date(String(created_at));
        if (!Number.isNaN(d.getTime())) patch.created_at = d.toISOString();
      }
      const { error: eUp } = await sb
        .from("outfits")
        .update(patch)
        .eq("id", outfitId);
      if (eUp) throw new Error(eUp.message);

      const rows = (Array.isArray(slots) ? slots : [])
        .map((s: Record<string, string>, i: number) => {
          const itemId = String(s?.itemId ?? "").trim();
          if (!itemId) return null;
          const colourKey = String(s?.colourKey ?? s?.colorKey ?? "").trim();
          return { outfit_id: outfitId, item_id: itemId, sort_order: i, colour_key: colourKey || null };
        })
        .filter(Boolean);

      if (rows.length) {
        const { error: eIns } = await sb.from("outfit_items").insert(rows);
        if (eIns) throw new Error(eIns.message);
      }

      return new Response(JSON.stringify({ ok: true }), {
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: `Unknown action: ${action}` }), {
      status: 400,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
