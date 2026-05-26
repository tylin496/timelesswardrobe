import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.105.4/+esm";

/** @param {import('@supabase/supabase-js').SupabaseClient} client */
export function createBrowserClient(url, key) {
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

/** Edge timeouts (e.g. HTTP 522) often omit CORS headers — browsers report “CORS” even though retry works. */
function isProbablyTransientFetchFailure(detail) {
  const d = String(detail ?? "").trim();
  if (!d) return true;
  return /failed to fetch|network\s*error|load failed|network request failed|fetch failed|timed out|timeout|522\b|523\b|524\b|cors|cors policy|access-control-allow-origin|typeerror/i.test(
    d
  );
}

function sleepMs(ms) {
  return new Promise((r) => globalThis.setTimeout(r, ms));
}

/**
 * @template T
 * @param {string} label — for debug logging only
 * @param {() => Promise<T>} run
 * @returns {Promise<T>}
 */
async function withNetworkRetries(label, run) {
  const maxAttempts = 4;
  let lastErr = "";
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    if (attempt > 0) {
      const backoff = 450 * 2 ** (attempt - 1);
      await sleepMs(Math.min(backoff, 8500));
    }
    try {
      return await run();
    } catch (e) {
      lastErr =
        typeof e?.message === "string" ? e.message : typeof e?.toString === "function" ? e.toString() : String(e ?? "");
      if (!isProbablyTransientFetchFailure(lastErr)) throw e;
      console.warn(`${label} transient failure (attempt ${attempt + 1}/${maxAttempts}):`, lastErr);
    }
  }
  throw new Error(lastErr || `${label}: failed after ${maxAttempts} attempts`);
}

/** @param {unknown} g */
function normalizeGallery(g) {
  if (Array.isArray(g)) return g.map((x) => String(x)).filter(Boolean);
  if (typeof g === "string" && g.trim()) {
    try {
      const p = JSON.parse(g);
      if (Array.isArray(p)) return p.map((x) => String(x)).filter(Boolean);
    } catch {
      /* ignore */
    }
  }
  return [];
}

/** @param {Record<string, unknown>} row */
export function mapRowToItem(row) {
  const meta =
    row.metadata && typeof row.metadata === "object" && !Array.isArray(row.metadata)
      ? row.metadata
      : null;
  const cvRaw =
    meta && Array.isArray(/** @type {{ colourVariants?: unknown }} */ (meta).colourVariants)
      ? /** @type {{ colourVariants: unknown[] }} */ (meta).colourVariants
      : meta && Array.isArray(/** @type {{ colorVariants?: unknown }} */ (meta).colorVariants)
        ? /** @type {{ colorVariants: unknown[] }} */ (meta).colorVariants
        : null;
  const seasonRaw = String(row.season ?? "").trim();
  const seasonNorm = !seasonRaw || seasonRaw === "All" ? "All-season" : seasonRaw;
  const colourText = String(row.colour ?? row.color ?? "").trim();
  const colourCodeVal =
    String(row.colour_code ?? row.color_code ?? "").trim() ||
    String(meta?.colourCode ?? meta?.colorCode ?? meta?.colour_code ?? meta?.color_code ?? "").trim();
  const topCv =
    Array.isArray(row.colourVariants) && row.colourVariants.length
      ? row.colourVariants
      : Array.isArray(row.colorVariants) && row.colorVariants.length
        ? row.colorVariants
        : cvRaw;
  /** @type {Record<string, unknown>} */
  const out = {
    id: String(row.id ?? ""),
    pillar: String(row.pillar ?? ""),
    section: String(row.section ?? ""),
    category: String(row.category ?? ""),
    brand: String(row.brand ?? ""),
    name: String(row.name ?? ""),
    season: seasonNorm,
    colour: colourText,
    colourCode: colourCodeVal,
    fabric: String(row.fabric ?? ""),
    weight: String(row.weight ?? ""),
    size: String(row.size ?? ""),
    measuredDimensions: String(row.measured_dimensions ?? row.measuredDimensions ?? ""),
    purchaseDate: String(row.purchase_date ?? row.purchaseDate ?? ""),
    image: String(row.image ?? ""),
    gallery: normalizeGallery(row.gallery),
    notes: String(row.notes ?? ""),
  };
  if (meta) {
    out.metadata = { ...meta };
  }
  if (topCv && topCv.length) {
    out.colourVariants = topCv;
  }
  return out;
}

/** @param {string[]} ids */
function formatPostgrestInList(ids) {
  const quoted = ids
    .map((id) => String(id ?? "").trim())
    .filter(Boolean)
    .map((id) => `"${id.replace(/"/g, '\\"')}"`);
  return `(${quoted.join(",")})`;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {string[]} [excludeIds] — when set, skip frozen catalogue ids (hybrid local mode).
 * @returns {Promise<{ ok: true, items: object[] } | { ok: false, error: string }>}
 */
export async function fetchWardrobeItems(client, excludeIds = []) {
  try {
    return await withNetworkRetries("fetchWardrobeItems", async () => {
      const exclude = Array.isArray(excludeIds)
        ? excludeIds.map((id) => String(id ?? "").trim()).filter(Boolean)
        : [];
      let query = client
        .from("wardrobe_items")
        .select("*")
        .order("section", { ascending: true })
        .order("category", { ascending: true })
        .order("brand", { ascending: true })
        .order("name", { ascending: true });
      if (exclude.length) {
        query = query.not("id", "in", formatPostgrestInList(exclude));
      }
      const { data, error } = await query;
      if (error) {
        if (isProbablyTransientFetchFailure(error.message)) throw new Error(error.message);
        return { ok: false, error: error.message };
      }
      const items = (data || []).map(mapRowToItem);
      return { ok: true, items };
    });
  } catch (e) {
    const msg = typeof e?.message === "string" ? e.message : String(e ?? "");
    return { ok: false, error: msg };
  }
}

/** @param {Record<string, unknown>} row */
function mapRowToEditorialStory(row) {
  const pieceIds = Array.isArray(row.piece_ids)
    ? row.piece_ids
    : Array.isArray(row.pieceIds)
      ? row.pieceIds
      : [];
  return {
    slug: String(row.slug ?? "").trim(),
    label: String(row.label ?? "").trim(),
    title: String(row.title ?? "").trim(),
    subtitle: String(row.subtitle ?? "").trim(),
    heroImage: row.hero_image == null ? null : String(row.hero_image).trim() || null,
    thumbnailImage: row.thumbnail_image == null ? null : String(row.thumbnail_image).trim() || null,
    pieceIds: pieceIds.map((x) => String(x ?? "").trim()).filter(Boolean),
  };
}

function isMissingEditorialThumbnailColumn(error) {
  const msg = String(error?.message ?? error ?? "").toLowerCase();
  const code = String(error?.code ?? "");
  return (code === "PGRST204" || code === "42703" || /column/.test(msg)) && /thumbnail_image/.test(msg);
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @returns {Promise<{ ok: true, stories: object[] } | { ok: false, error: string }>}
 */
export async function fetchEditorialStories(client) {
  try {
    return await withNetworkRetries("fetchEditorialStories", async () => {
      let { data, error } = await client
        .from("editorial_stories")
        .select("slug, label, title, subtitle, hero_image, thumbnail_image, piece_ids, sort_order")
        .order("sort_order", { ascending: true })
        .order("title", { ascending: true });
      if (error && isMissingEditorialThumbnailColumn(error)) {
        ({ data, error } = await client
          .from("editorial_stories")
          .select("slug, label, title, subtitle, hero_image, piece_ids, sort_order")
          .order("sort_order", { ascending: true })
          .order("title", { ascending: true }));
      }
      if (error) {
        if (isProbablyTransientFetchFailure(error.message)) throw new Error(error.message);
        return { ok: false, error: error.message };
      }
      const stories = (data || []).map(mapRowToEditorialStory).filter((s) => s.slug && s.title);
      return { ok: true, stories };
    });
  } catch (e) {
    const msg = typeof e?.message === "string" ? e.message : String(e ?? "");
    return { ok: false, error: msg };
  }
}

/**
 * Replaces the editorial story list with the supplied ordered array.
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {{ slug: string, label?: string, title: string, subtitle?: string, heroImage?: string | null, thumbnailImage?: string | null, pieceIds?: string[] }[]} stories
 */
export async function replaceEditorialStories(client, stories) {
  const sourceRows = (Array.isArray(stories) ? stories : [])
    .map((story, sort_order) => {
      const slug = String(story?.slug ?? "").trim();
      const title = String(story?.title ?? "").trim();
      if (!slug || !title) return null;
      return {
        slug,
        label: String(story.label ?? "").trim(),
        title,
        subtitle: String(story.subtitle ?? "").trim(),
        hero_image: story.heroImage ? String(story.heroImage).trim() : null,
        thumbnail_image: story.thumbnailImage ? String(story.thumbnailImage).trim() : null,
        piece_ids: Array.isArray(story.pieceIds)
          ? story.pieceIds.map((x) => String(x ?? "").trim()).filter(Boolean)
          : [],
        sort_order,
        updated_at: new Date().toISOString(),
      };
    })
    .filter(Boolean);
  let rows = sourceRows;

  if (rows.length) {
    let { error: upsertError } = await client.from("editorial_stories").upsert(rows, { onConflict: "slug" });
    if (upsertError && isMissingEditorialThumbnailColumn(upsertError)) {
      rows = sourceRows.map(({ thumbnail_image, ...row }) => row);
      ({ error: upsertError } = await client.from("editorial_stories").upsert(rows, { onConflict: "slug" }));
    }
    if (upsertError) return { ok: false, error: upsertError.message };
  }

  const keepSlugs = rows.map((row) => row.slug);
  if (keepSlugs.length) {
    const { error: deleteError } = await client
      .from("editorial_stories")
      .delete()
      .not("slug", "in", formatPostgrestInList(keepSlugs));
    if (deleteError) return { ok: false, error: deleteError.message };
  } else {
    const { error: deleteError } = await client.from("editorial_stories").delete().neq("slug", "");
    if (deleteError) return { ok: false, error: deleteError.message };
  }

  const verify = await fetchEditorialStories(client);
  if (!verify.ok) return verify;
  const expected = JSON.stringify(rows.map(mapRowToEditorialStory));
  const actual = JSON.stringify(verify.stories);
  if (expected !== actual) {
    return { ok: false, error: "Cloud editorial save did not persist the expected story list." };
  }
  return { ok: true };
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @returns {Promise<{ ok: true, outfits: { id: string, name: string, slots: { itemId: string, colourKey?: string }[], createdAt: string }[] } | { ok: false, error: string }>}
 */
export async function fetchOutfits(client) {
  try {
    return await withNetworkRetries("fetchOutfits", async () => {
      const selectWithNotes =
        "id, name, notes, created_at, outfit_items(item_id, sort_order, colour_key)";
      const selectLegacy = "id, name, created_at, outfit_items(item_id, sort_order, colour_key)";
      let data;
      let error;
      ({ data, error } = await client.from("outfits").select(selectWithNotes).order("created_at", { ascending: false }));
      if (error && /notes|column/i.test(String(error.message ?? ""))) {
        ({ data, error } = await client
          .from("outfits")
          .select(selectLegacy)
          .order("created_at", { ascending: false }));
      }
      if (error) {
        if (isProbablyTransientFetchFailure(error.message)) throw new Error(error.message);
        return { ok: false, error: error.message };
      }

      /** @type {{ id: string, name: string, slots: { itemId: string, colourKey?: string }[], createdAt: string }[]} */
      const outfits = [];
      for (const row of data || []) {
        const links = Array.isArray(row.outfit_items) ? row.outfit_items : [];
        links.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
        const slots = links.map((x) => {
          const itemId = String(x.item_id ?? "").trim();
          const ck =
            x.colour_key != null
              ? String(x.colour_key).trim()
              : x.color_key != null
                ? String(x.color_key).trim()
                : "";
          return ck ? { itemId, colourKey: ck } : { itemId };
        });
        outfits.push({
          id: String(row.id),
          name: String(row.name ?? ""),
          notes: String(row.notes ?? ""),
          slots,
          createdAt: row.created_at
            ? new Date(row.created_at).toISOString()
            : new Date().toISOString(),
        });
      }
      return { ok: true, outfits };
    });
  } catch (e) {
    const msg = typeof e?.message === "string" ? e.message : String(e ?? "");
    return { ok: false, error: msg };
  }
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {{ id: string, name: string, slots?: { itemId: string, colourKey?: string; colorKey?: string }[], itemIds?: string[], createdAt: string }} record
 */
export async function insertOutfitWithItems(client, record) {
  const notes = String(record.notes ?? "").trim();
  const baseRow = {
    id: record.id,
    name: record.name,
    created_at: record.createdAt,
  };
  let e1;
  if (notes) {
    ({ error: e1 } = await client.from("outfits").insert({ ...baseRow, notes }));
    if (e1 && /notes|column/i.test(String(e1.message ?? ""))) {
      ({ error: e1 } = await client.from("outfits").insert(baseRow));
    }
  } else {
    ({ error: e1 } = await client.from("outfits").insert(baseRow));
  }
  if (e1) return { ok: false, error: e1.message };

  const slots =
    Array.isArray(record.slots) && record.slots.length
      ? record.slots
      : Array.isArray(record.itemIds)
        ? record.itemIds.map((itemId) => ({ itemId: String(itemId) }))
        : [];
  const normalizedSlots = slots
    .map((s) => {
      const itemId = String(s?.itemId ?? "").trim();
      if (!itemId) return null;
      const colourKey = String(s?.colourKey ?? s?.colorKey ?? "").trim();
      return colourKey ? { itemId, colourKey } : { itemId };
    })
    .filter(Boolean);
  const rows = normalizedSlots.map((s, sort_order) => {
    const ck = String(s.colourKey ?? s.colorKey ?? "").trim();
    return {
      outfit_id: record.id,
      item_id: String(s.itemId ?? "").trim(),
      sort_order,
      colour_key: ck || null,
    };
  });
  const { error: e2 } = await client.from("outfit_items").insert(rows);
  if (e2) {
    await client.from("outfits").delete().eq("id", record.id);
    return { ok: false, error: e2.message };
  }

  // Guard against silent RLS no-op writes: verify the persisted row matches this insert.
  let verifyHasNotes = true;
  let verifyRow;
  let verifyErr;
  ({ data: verifyRow, error: verifyErr } = await client
    .from("outfits")
    .select("id, name, notes, outfit_items(item_id, sort_order, colour_key)")
    .eq("id", record.id)
    .maybeSingle());
  if (verifyErr && /notes|column/i.test(String(verifyErr.message ?? ""))) {
    verifyHasNotes = false;
    ({ data: verifyRow, error: verifyErr } = await client
      .from("outfits")
      .select("id, name, created_at, outfit_items(item_id, sort_order, colour_key)")
      .eq("id", record.id)
      .maybeSingle());
  }
  if (verifyErr) return { ok: false, error: verifyErr.message };
  if (!verifyRow) return { ok: false, error: "Cloud save did not persist (outfit row not returned)." };

  const verifySlots = Array.isArray(verifyRow.outfit_items) ? verifyRow.outfit_items : [];
  verifySlots.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const expectedSig = normalizedSlots.map((s) => `${s.itemId}::${String(s.colourKey ?? "").trim()}`).join("|");
  const actualSig = verifySlots
    .map((s) => `${String(s.item_id ?? "").trim()}::${String(s.colour_key ?? "").trim()}`)
    .join("|");
  if (expectedSig !== actualSig) {
    return {
      ok: false,
      error: "Cloud save did not persist line items (possible RLS or stale write).",
    };
  }

  const nameMatches = String(verifyRow.name ?? "") === String(record.name ?? "");
  const notesMatches = !verifyHasNotes || String(verifyRow.notes ?? "").trim() === String(record.notes ?? "").trim();
  if (!nameMatches || !notesMatches) {
    return {
      ok: false,
      error: "Cloud save did not persist outfit name/notes (possible RLS or stale write).",
    };
  }
  return { ok: true };
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {string} id
 */
export async function deleteOutfitById(client, id) {
  const { error } = await client.from("outfits").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  return { ok: true };
}

/**
 * Replace name and line items for an existing outfit (local id must match cloud row).
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 * @param {{ id: string, name: string, slots: { itemId: string, colourKey?: string; colorKey?: string }[] }} record
 */
export async function updateOutfitWithItems(client, record) {
  const { error: eDel } = await client.from("outfit_items").delete().eq("outfit_id", record.id);
  if (eDel) return { ok: false, error: eDel.message };

  const notes = String(record.notes ?? "").trim();
  const patch = { name: record.name };
  // Explicitly clear notes when user deletes text.
  patch.notes = notes || null;
  let eUp;
  ({ error: eUp } = await client.from("outfits").update(patch).eq("id", record.id));
  if (eUp && /notes|column/i.test(String(eUp.message ?? ""))) {
    ({ error: eUp } = await client.from("outfits").update({ name: record.name }).eq("id", record.id));
  }
  if (eUp) return { ok: false, error: eUp.message };

  const slots = (Array.isArray(record.slots) ? record.slots : [])
    .map((s) => {
      const itemId = String(s?.itemId ?? "").trim();
      if (!itemId) return null;
      const colourKey = String(s?.colourKey ?? s?.colorKey ?? "").trim();
      return colourKey ? { itemId, colourKey } : { itemId };
    })
    .filter(Boolean);
  const rows = slots.map((s, sort_order) => {
    const ck = String(s.colourKey ?? s.colorKey ?? "").trim();
    return {
      outfit_id: record.id,
      item_id: String(s.itemId ?? "").trim(),
      sort_order,
      colour_key: ck || null,
    };
  });
  if (rows.length) {
    const { error: eIns } = await client.from("outfit_items").insert(rows);
    if (eIns) return { ok: false, error: eIns.message };
  }

  // Guard against silent RLS no-op writes: verify the persisted row matches this update.
  let verifyHasNotes = true;
  let verifyRow;
  let verifyErr;
  ({ data: verifyRow, error: verifyErr } = await client
    .from("outfits")
    .select("id, name, notes, outfit_items(item_id, sort_order, colour_key)")
    .eq("id", record.id)
    .maybeSingle());
  if (verifyErr && /notes|column/i.test(String(verifyErr.message ?? ""))) {
    verifyHasNotes = false;
    ({ data: verifyRow, error: verifyErr } = await client
      .from("outfits")
      .select("id, name, created_at, outfit_items(item_id, sort_order, colour_key)")
      .eq("id", record.id)
      .maybeSingle());
  }
  if (verifyErr) return { ok: false, error: verifyErr.message };
  if (!verifyRow) return { ok: false, error: "Cloud update did not persist (outfit row not returned)." };

  const verifySlots = Array.isArray(verifyRow.outfit_items) ? verifyRow.outfit_items : [];
  verifySlots.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  const expectedSig = slots.map((s) => `${s.itemId}::${String(s.colourKey ?? "").trim()}`).join("|");
  const actualSig = verifySlots
    .map((s) => `${String(s.item_id ?? "").trim()}::${String(s.colour_key ?? "").trim()}`)
    .join("|");
  if (expectedSig !== actualSig) {
    return {
      ok: false,
      error: "Cloud update did not persist line-item edits (possible RLS or stale write).",
    };
  }

  const nameMatches = String(verifyRow.name ?? "") === String(record.name ?? "");
  const notesMatches = !verifyHasNotes || String(verifyRow.notes ?? "").trim() === String(record.notes ?? "").trim();
  if (!nameMatches || !notesMatches) {
    return {
      ok: false,
      error: "Cloud update did not persist outfit name/notes (possible RLS or stale write).",
    };
  }
  return { ok: true };
}
