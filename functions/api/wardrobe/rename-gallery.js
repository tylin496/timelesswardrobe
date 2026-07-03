/**
 * POST /api/wardrobe/rename-gallery
 * Cloudflare Pages Function. Renames gallery image files in git via GitHub API
 * so prod can reorder images without local filesystem access.
 *
 * Body: { itemId: string, orderedPaths: string[] }
 *   orderedPaths — current gallery paths in desired order (leading "/" included)
 *
 * Response: { ok: true, image: string, gallery: string[] }
 *   canonical paths after rename (1.webp, 2.webp, …)
 *
 * Requires Pages environment variables:
 *   SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
 *   GITHUB_TOKEN  — fine-grained PAT with Contents: write for this repo
 *   GITHUB_REPO   — "owner/repo" (default: tylin496/timelesswardrobe)
 *   GITHUB_BRANCH — target branch (default: main)
 */
import { createClient } from "@supabase/supabase-js";

const GH = "https://api.github.com";

async function gh(token, path, { method = "GET", body } = {}) {
  const res = await fetch(`${GH}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`GitHub ${method} ${path} → ${res.status}: ${txt}`);
  }
  return res.json();
}

/**
 * Update image + gallery fields for one item in the wardrobe.js source string.
 * Operates on the raw text so no JS parsing is needed.
 */
function patchWardrobeJs(src, itemId, newImage, newGalleryPaths) {
  const idTag = `"id": "${itemId}"`;
  const start = src.indexOf(idTag);
  if (start === -1) return src;

  const nextId = src.indexOf('"id":', start + idTag.length);
  const end = nextId === -1 ? src.length : nextId;

  let block = src.slice(start, end);

  // Replace "image": "..."
  block = block.replace(/"image":\s*"[^"]*"/, `"image": "${newImage}"`);

  // Replace "gallery": [...] — entries don't contain ']' so [^\]]* is safe
  const galleryStr =
    newGalleryPaths.length > 0
      ? `"gallery": [\n      ${newGalleryPaths.map((p) => `"${p}"`).join(",\n      ")}\n    ]`
      : `"gallery": []`;
  block = block.replace(/"gallery":\s*\[[^\]]*\]/, galleryStr);

  return src.slice(0, start) + block + src.slice(end);
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function onRequestPost({ request, env }) {
  const authHeader = request.headers.get("authorization") ?? "";
  const accessToken = authHeader.replace(/^Bearer\s+/i, "").trim();
  if (!accessToken) return json({ error: "Unauthorized" }, 401);

  const supabaseUrl = env.SUPABASE_URL;
  const supabaseAnonKey = env.SUPABASE_ANON_KEY;
  const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;
  const githubToken = env.GITHUB_TOKEN;

  if (!supabaseUrl || !supabaseAnonKey) return json({ error: "Supabase config not found" }, 500);
  if (!githubToken) return json({ error: "GITHUB_TOKEN not configured" }, 500);

  const sbAuth = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authErr } = await sbAuth.auth.getUser(accessToken);
  if (authErr || !user) return json({ error: "Unauthorized" }, 401);

  // --- Input validation ---
  let payload;
  try {
    payload = await request.json();
  } catch {
    payload = {};
  }
  const { itemId, orderedPaths } = payload ?? {};
  if (!itemId || typeof itemId !== "string" || !Array.isArray(orderedPaths) || orderedPaths.length === 0) {
    return json({ error: "Expected { itemId: string, orderedPaths: string[] }" }, 400);
  }

  const pathRe = /^\/images\/wardrobe\/[a-z0-9-]+\/main\/\d+\.\w+$/;
  for (const p of orderedPaths) {
    if (!pathRe.test(p) || !p.includes(`/images/wardrobe/${itemId}/`)) {
      return json({ error: `Invalid path: ${p}` }, 400);
    }
  }

  // --- GitHub ---
  const [owner, repo] = (env.GITHUB_REPO ?? "tylin496/timelesswardrobe").split("/");
  const branch = env.GITHUB_BRANCH ?? "main";

  try {
    // 1. Current commit + tree
    const refData = await gh(githubToken, `/repos/${owner}/${repo}/git/refs/heads/${branch}`);
    const latestSha = refData.object.sha;
    const commitData = await gh(githubToken, `/repos/${owner}/${repo}/git/commits/${latestSha}`);
    const treeSha = commitData.tree.sha;

    // 2. Get blob SHAs for each source file (parallel)
    const blobShas = await Promise.all(
      orderedPaths.map(async (p) => {
        const filePath = p.replace(/^\//, "");
        const d = await gh(githubToken, `/repos/${owner}/${repo}/contents/${filePath}?ref=${branch}`);
        return d.sha;
      })
    );

    // 3. Canonical destination paths (1.webp, 2.webp, …)
    const ext = (orderedPaths[0].match(/\.\w+$/) ?? [".webp"])[0];
    const baseDir = `images/wardrobe/${itemId}/main`;
    const canonical = orderedPaths.map((_, i) => `${baseDir}/${i + 1}${ext}`);
    const destSet = new Set(canonical);

    // 4. Tree items: set each canonical path to the corresponding blob
    const treeItems = canonical.map((destPath, i) => ({
      path: destPath,
      mode: "100644",
      type: "blob",
      sha: blobShas[i],
    }));

    // Delete source paths that don't appear in the destination set
    // (handles count mismatches — rare, but safe to include)
    for (const p of orderedPaths) {
      const filePath = p.replace(/^\//, "");
      if (!destSet.has(filePath)) {
        treeItems.push({ path: filePath, mode: "100644", type: "blob", sha: null });
      }
    }

    // 5. Update data/wardrobe.js with new canonical image/gallery
    const newImage = `/${canonical[0]}`;
    const newGallery = canonical.slice(1).map((p) => `/${p}`);

    const wjsPath = "data/wardrobe.js";
    const wjsFile = await gh(githubToken, `/repos/${owner}/${repo}/contents/${wjsPath}?ref=${branch}`);
    const wjsSrc = atob(wjsFile.content.replace(/\n/g, ""));
    const wjsUpdated = patchWardrobeJs(wjsSrc, itemId, newImage, newGallery);

    if (wjsUpdated !== wjsSrc) {
      const blobRes = await gh(githubToken, `/repos/${owner}/${repo}/git/blobs`, {
        method: "POST",
        body: { content: wjsUpdated, encoding: "utf-8" },
      });
      treeItems.push({ path: wjsPath, mode: "100644", type: "blob", sha: blobRes.sha });
    }

    // 6. Commit
    const newTree = await gh(githubToken, `/repos/${owner}/${repo}/git/trees`, {
      method: "POST",
      body: { base_tree: treeSha, tree: treeItems },
    });
    const newCommit = await gh(githubToken, `/repos/${owner}/${repo}/git/commits`, {
      method: "POST",
      body: {
        message: `chore: reorder gallery for ${itemId}`,
        tree: newTree.sha,
        parents: [latestSha],
      },
    });
    await gh(githubToken, `/repos/${owner}/${repo}/git/refs/heads/${branch}`, {
      method: "PATCH",
      body: { sha: newCommit.sha },
    });

    // 7. Clear __mediaEditedAt / image / gallery from collection_overrides for this item
    if (supabaseServiceKey) {
      const sbAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      });
      const { data: row } = await sbAdmin
        .from("wardrobe_app_state")
        .select("collection_overrides")
        .eq("id", "default")
        .single();

      const allOv = row?.collection_overrides ?? {};
      const ov = allOv[itemId];
      if (ov) {
        const cleaned = { ...ov };
        delete cleaned.__mediaEditedAt;
        delete cleaned.image;
        delete cleaned.gallery;
        allOv[itemId] = cleaned;
        await sbAdmin
          .from("wardrobe_app_state")
          .update({ collection_overrides: allOv })
          .eq("id", "default");
      }
    }

    return json({ ok: true, image: newImage, gallery: newGallery });
  } catch (err) {
    console.error("[rename-gallery]", err);
    return json({ error: String(err?.message ?? err) }, 500);
  }
}
