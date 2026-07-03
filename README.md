# Timeless Wardrobe

Static menswear-archive UI: filters, outfit builder, saved looks. Vanilla JS
(`app.js`) + a single compiled stylesheet, data merged from Supabase and a
frozen local catalogue.

## Quick start

`npm run dev` starts the dev server (also rebuilds CSS on change), open
`index.html`. See **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** for the data
model and merge pipeline, and **[docs/CONVENTIONS.md](docs/CONVENTIONS.md)**
for the design system (BEM, tokens, rails).

Production (Vercel): [timeless-wardrobe.vercel.app](https://timeless-wardrobe.vercel.app/). See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md). Mirror: [GitHub Pages](https://tylin496.github.io/timeless-wardrobe/). Build: `npm run build` → `dist/`.

## Supabase

See **[docs/SUPABASE.md](docs/SUPABASE.md)** for schema SQL, env vars, and
security notes. Copy `.env.example` to `.env` for Node scripts (service role
key); fill `js/tw-supabase-config.js` with the **public** URL and anon key for
the browser. Data-shape/contract details: **[docs/DATA-CONTRACT.md](docs/DATA-CONTRACT.md)**
and **[docs/DATA-INVARIANTS.md](docs/DATA-INVARIANTS.md)**.

## CSS

Edit **`css/main.css`**, then compile to **`styles.css`** (`npm run css:build`). HTML loads `styles.css` only. See **[docs/CSS.md](docs/CSS.md)** for cascade notes and debugging.

`npm run dev` rebuilds CSS when files under `css/` change.

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server + CSS watch |
| `npm run build` | Full production build → `dist/` |
| `npm run css:build` | Compile Tailwind + `main.css` → `styles.css` |
| `npm run check` | Run all guard scripts (insets, URLs, id-drift, data integrity, CSS build) |
| `npm run check:data` | Validate Supabase/catalogue data integrity |
| `npm run check:id-drift` | Guard against wardrobe item `id` renames |
| `npm run check:showcase` | Validate Showcase order snapshot |
| `npm run db:backup` | Back up Supabase data |
| `npm run db:freeze-catalogue` | Snapshot Supabase into the frozen local catalogue |
| `npm run images:rebuild` | Regenerate cutout thumbnails |
| `npm run og:build` / `npm run og:items` | Generate OG images (site / per-item pages) |
