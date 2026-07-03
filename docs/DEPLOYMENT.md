# Deployment URLs

Production: **Cloudflare Pages** project `timelesswardrobe` → `https://timelesswardrobe.uk` (migrated off Vercel Jul 2026).

## Which URL to use

| URL | Status | Use for |
| --- | --- | --- |
| `https://timelesswardrobe.uk` | **Live** (200) | Primary production, OAuth, canonical, OG |
| `https://timelesswardrobe.pages.dev` | **Live** (200) | Cloudflare Pages default domain (fallback) |
| `https://tylin496.github.io/timelesswardrobe/` | **Live** (200) | GitHub Pages mirror |
| `http://127.0.0.1:8787/` | Local dev (`npm run dev`) | Development |

Cloudflare dashboard: Workers & Pages → `timelesswardrobe`.

## Single source of truth in code

- `js/tw-supabase-config.js` → `SITE_ORIGIN: "https://timelesswardrobe.uk"`

Must match:

- Supabase **Authentication → URL Configuration → Site URL**
- Supabase **Redirect URLs** → `https://timelesswardrobe.uk/**`
- HTML `canonical` / `og:*` in `index.html`, `collection.html`, `item.html`

Run before push:

```bash
npm run check:urls
```

## What is *not* a URL bug

These use `timeless-wardrobe` by design (npm package name, kept distinct from the GitHub repo/domain name):

- `package.json` `"name": "timeless-wardrobe"`
- `app.js` keys like `timeless-wardrobe-outfits-v1`
- JSON `_schema` fields in `data/`
