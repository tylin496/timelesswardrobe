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
    const { sourceOutfitId } = await req.json();
    if (!sourceOutfitId) {
      return new Response(JSON.stringify({ error: "sourceOutfitId is required" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const sb = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: source, error: sourceErr } = await sb
      .from("outfits")
      .select("id, name, notes, outfit_items(item_id, sort_order, colour_key)")
      .eq("id", sourceOutfitId)
      .maybeSingle();

    if (sourceErr || !source) {
      return new Response(JSON.stringify({ error: "Source outfit not found" }), {
        status: 404,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    const rawBytes = crypto.getRandomValues(new Uint8Array(32));
    const rawToken = Array.from(rawBytes)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    const tokenHash = await hashToken(rawToken);

    const newId = crypto.randomUUID();
    const newSlug = generateSlug(String(source.name ?? "outfit"));

    const { error: insertErr } = await sb.from("outfits").insert({
      id: newId,
      name: String(source.name ?? ""),
      notes: source.notes ?? null,
      slug: newSlug,
      owner_token_hash: tokenHash,
      created_at: new Date().toISOString(),
    });
    if (insertErr) throw new Error(insertErr.message);

    const links: Array<{ item_id: string; sort_order: number; colour_key: string | null }> =
      Array.isArray(source.outfit_items) ? source.outfit_items : [];
    links.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

    const itemRows = links.map((x, i) => ({
      outfit_id: newId,
      item_id: String(x.item_id ?? ""),
      sort_order: i,
      colour_key: x.colour_key ?? null,
    }));

    if (itemRows.length) {
      const { error: slotsErr } = await sb.from("outfit_items").insert(itemRows);
      if (slotsErr) {
        await sb.from("outfits").delete().eq("id", newId);
        throw new Error(slotsErr.message);
      }
    }

    const slots = links.map((x) => {
      const colourKey = String(x.colour_key ?? "").trim();
      return colourKey
        ? { itemId: String(x.item_id ?? ""), colourKey }
        : { itemId: String(x.item_id ?? "") };
    });

    return new Response(JSON.stringify({ id: newId, slug: newSlug, ownerToken: rawToken, slots }), {
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
