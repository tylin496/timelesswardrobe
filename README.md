# Timeless Wardrobe

Static menswear-archive UI: filters, outfit builder, saved looks. Vanilla JS
(`app.js`) + a single compiled stylesheet, data merged from Supabase and a
frozen local catalogue.

## Quick start

`npm run dev` starts the dev server on `http://127.0.0.1:8787/` (also rebuilds
CSS on change). `npm install` wires the pre-commit hook (`npm run check`) via
the `prepare` script.

Production (Cloudflare Pages): [timelesswardrobe.uk](https://timelesswardrobe.uk/).
Build: `npm run build` → `dist/`. See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)
for every live URL and what must stay in sync.

## Layout

| Path | What lives there |
| --- | --- |
| `app.js` | The app — catalogue, filters, PDP, outfits, editor |
| `css/main.css` → `styles.css` | CSS source → compiled output (HTML loads the output only) |
| `js/` | Small standalone modules (Supabase client/config, home hero, page theme boot) |
| `data/` | Frozen local catalogue + snapshots |
| `workers/img`, `workers/upload` | Cloudflare Workers fronting R2 image serving and upload/delete |
| `scripts/` | Build, guard, and data scripts (all `npm run` targets) |
| `docs/` | The map docs — read before changing anything (see below) |

## CSS

Edit **`css/main.css`**, then compile to **`styles.css`** (`npm run css:build`).
HTML loads `styles.css` only — never hand-edit it. `npm run dev` rebuilds when
files under `css/` change. See **[docs/CSS.md](docs/CSS.md)** for cascade notes
and debugging.

## Supabase

See **[docs/SUPABASE.md](docs/SUPABASE.md)** for schema SQL, env vars, and
security notes. Copy `.env.example` to `.env` for Node scripts (service role
key); fill `js/tw-supabase-config.js` with the **public** URL and anon key for
the browser.

## Docs

| Doc | Read it for |
| --- | --- |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Data sources → merge → read model, with `app.js` symbol anchors |
| [CONVENTIONS.md](docs/CONVENTIONS.md) | Design system: BEM, tokens, spacing, breakpoints, **rails** |
| [CSS.md](docs/CSS.md) | The build pipeline and why a change "did nothing" |
| [DATA-CONTRACT.md](docs/DATA-CONTRACT.md) | Per-field ownership, editability, sortability |
| [DATA-INVARIANTS.md](docs/DATA-INVARIANTS.md) | What the data guarantees + the command that proves it |
| [DEBUG-RUNBOOK.md](docs/DEBUG-RUNBOOK.md) | Symptom → layer → first file to read |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | URLs, canonical/OAuth origins, what must match |
| [IMAGE-HELPERS.md](docs/IMAGE-HELPERS.md) | Map of the ~73 image helpers (they are *not* duplicates) |
| [NOTES-ARCHITECTURE.md](docs/NOTES-ARCHITECTURE.md) | Why notes stay an annotation model |
| [SEARCH-OVERLAY-COLLAPSE.md](docs/SEARCH-OVERLAY-COLLAPSE.md) | iOS keyboard / search overlay investigation |
| [TEXT-LOGIC-INVENTORY.md](docs/TEXT-LOGIC-INVENTORY.md) | Logic that keys off free-form strings instead of state, by risk |
| [HANDOFF-data-pipeline-audit.md](docs/HANDOFF-data-pipeline-audit.md) | Closed audit — kept as the record of the decision |

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server + CSS watch (`predev` builds CSS and images first) |
| `npm run dev:monitor` | Dev-server monitor |
| `npm run build` | Full production build → `dist/` (insets → CSS → images → OG → static → item OG) |
| `npm run css:build` | Compile Tailwind + `main.css` → `styles.css` |
| `npm run check` | All guards — insets, public URLs, id-drift, data integrity, CSS build, doc anchors. Also the pre-commit hook |
| `npm run lint:insets` | Guard `env(safe-area-inset-*)` placement |
| `npm run check:urls` | Guard the public origin / canonical URLs |
| `npm run check:id-drift` | Guard against wardrobe item `id` renames |
| `npm run check:data` | Validate Supabase/catalogue data integrity |
| `npm run check:css` | Verify `styles.css` is in sync with `css/main.css` |
| `npm run check:doc-anchors` | Verify doc symbol anchors exist (and ban line refs) |
| `npm run check:showcase` | Validate Showcase order snapshot |
| `npm run check:r2-orphans` | Find R2 objects no catalogue item references |
| `npm run images:rebuild` | Re-centre covers + rebuild transparent cutouts under `images/wardrobe/` |
| `npm run og:build` / `npm run og:items` | Generate OG images (site / per-item pages) |
| `npm run db:backup` | Back up Supabase data |
| `npm run db:freeze-catalogue` | Snapshot Supabase into the frozen local catalogue |
