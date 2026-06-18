import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function generateSlug(name: string): string {
  const base = (name || "outfit")
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
  const suffix = Array.from(crypto.getRandomValues(new Uint8Array(3)))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${base || "outfit"}-${suffix}`;
}

async function hashToken(token: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: CORS });

  try {
    const { name, notes, slots, created_at } = await req.json();
    if (!name || !String(name).trim()) {
      return new Response(JSON.stringify({ error: "name is required" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Generate raw token → hash it → store only hash
    const rawBytes = crypto.getRandomValues(new Uint8Array(32));
    const rawToken = Array.from(rawBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const tokenHash = await hashToken(rawToken);

    const id = crypto.randomUUID();
    const slug = generateSlug(String(name).trim());

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { error: outfitErr } = await sb.from("outfits").insert({
      id,
      name: String(name).trim(),
      notes: notes ? String(notes).trim() || null : null,
      slug,
      owner_token_hash: tokenHash,
      created_at: (() => {
        if (created_at) {
          const d = new Date(String(created_at));
          if (!Number.isNaN(d.getTime())) return d.toISOString();
        }
        return new Date().toISOString();
      })(),
    });
    if (outfitErr) throw new Error(outfitErr.message);

    const rows = (Array.isArray(slots) ? slots : [])
      .map((s: Record<string, string>, i: number) => {
        const itemId = String(s?.itemId ?? "").trim();
        if (!itemId) return null;
        const colourKey = String(s?.colourKey ?? s?.colorKey ?? "").trim();
        return { outfit_id: id, item_id: itemId, sort_order: i, colour_key: colourKey || null };
      })
      .filter(Boolean);

    if (rows.length) {
      const { error: itemsErr } = await sb.from("outfit_items").insert(rows);
      if (itemsErr) {
        await sb.from("outfits").delete().eq("id", id);
        throw new Error(itemsErr.message);
      }
    }

    return new Response(JSON.stringify({ id, slug, ownerToken: rawToken }), {
      status: 200,
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
