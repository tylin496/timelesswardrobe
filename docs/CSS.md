# CSS workflow

This project uses a **single compiled stylesheet** in the browser. Understanding that pipeline avoids most “my change did nothing” and “CSS conflict” confusion.

## Source vs output

| File | Role |
| --- | --- |
| `css/main.css` | **Edit this** — component and page rules (~20k lines). |
| `css/input.css` | Tailwind entry: imports Tailwind + `main.css`. |
| `styles.css` | **Built output** — linked from every HTML page. Do not edit by hand. |

After any change under `css/`:

```bash
npm run css:build
```

`npm run dev` runs a CSS watcher on `css/` and rebuilds `styles.css` automatically (recommended while styling).

`npm run build` also compiles CSS before deploy.

## Cursor: disable Markdown Reading Mode

This repo sets `"workbench.editorAssociations": { "*.md": "default" }` in `.vscode/settings.json` so `.md` files open as plain text, not Cursor’s rich Reading / WYSIWYG editor. Reload the window after changing editor associations. For a tab already in Reading Mode: Command Palette → **Reopen Editor With…** → **Text Editor**.

## Why rules look like they “fight”

Several selectors often target the **same node** on purpose:

1. **Base component** — e.g. `.editorial-quote { padding: … }`
2. **Page override** — e.g. `body.home-page #main.home-hero .home-hero__division-rail-philosophy.editorial-quote { padding-top: var(--home-hero-philosophy-pad-y); … }`
3. **Breakpoint** — e.g. `@media (max-width: 768px) { … }`

That is normal cascade, not a broken build. The more specific rule wins for the properties it sets.

Homepage philosophy quote spacing is owned only by the `body.home-page #main.home-hero .home-hero__division-rail-philosophy` block and tokens:

- `--home-hero-philosophy-block-gap` — symmetric external margin above and below the quote box (Browse rail → quote ↔ quote → Highlights)
- `--home-hero-philosophy-pad-y` — padding inside the tinted quote box (text breathing room)
- Highlights band after the quote uses `padding-top: 0`; do not add `--home-hero-section-pad-y` there or the lower gap doubles

Generic `.editorial-quote` padding excludes that block via `:not(.home-hero__division-rail-philosophy)`.

## Debugging checklist

1. Edited `css/main.css` (not only `styles.css`)?
2. Ran `npm run css:build` or `npm run dev`?
3. Hard refresh the preview (compiled CSS is minified in one line).
4. In DevTools, select the element → **Computed** → see which rule wins and from which selector.
5. Prefer adjusting **tokens** on `body.home-page` or the page-specific block instead of adding another global rule later in the file.

## Reducing future overlap

- One **owner** per layout concern (spacing, typography) per page/section.
- Use **CSS variables** on `body.home-page` / `body.collection-page` instead of duplicating `clamp()` in many places.
- Avoid copying the same selector with small tweaks at the top and bottom of `main.css` — search for existing class names first.
