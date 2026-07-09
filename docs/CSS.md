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

**Guard:** `npm run check:css` (part of `npm run check`) rebuilds to a temp file and fails if it differs from the committed `styles.css`. This catches the two recurring mistakes — hand-editing `styles.css`, or changing `css/main.css` without re-running `css:build` — before they ship. Fix: run `npm run css:build` and commit the result.

## Cursor: disable Markdown Reading Mode

This repo sets `"workbench.editorAssociations": { "*.md": "default" }` in `.vscode/settings.json` so `.md` files open as plain text, not Cursor’s rich Reading / WYSIWYG editor. Reload the window after changing editor associations. For a tab already in Reading Mode: Command Palette → **Reopen Editor With…** → **Text Editor**.

## Why rules look like they “fight”

Several selectors often target the **same node** on purpose:

1. **Base component** — e.g. `.card__meta-line { … }`
2. **Page override** — e.g. `body.collection-page #grid.grid--compact .card__meta-line { … }`
3. **Breakpoint** — e.g. `@media (max-width: 768px) { #grid .card__meta-line { … } }`

That is normal cascade, not a broken build. The more specific rule wins for the properties it sets.

## Debugging checklist

1. Edited `css/main.css` (not only `styles.css`)?
2. Ran `npm run css:build` or `npm run dev`?
3. Hard refresh the preview (compiled CSS is minified in one line).
4. In DevTools, select the element → **Computed** → see which rule wins and from which selector.
5. Prefer adjusting **tokens** on `body.home-page` or the page-specific block instead of adding another global rule later in the file.

## Dead-CSS audit

```bash
node scripts/audit-dead-css.mjs
```

Reports classes defined in `css/main.css` that appear nowhere in HTML/JS — neither
as a literal nor via string concatenation / template stems (`` `foo--${x}` ``).
Report-only (not in `npm run check`): findings need a spot-check before deleting,
because two selector shapes can fool it —

- `.alive:not(.deadClass)` — the rule still matches (a never-present class makes
  `:not()` always true); deleting it changes styling.
- `.x:is(.deadClass, .aliveClass)` — the alive arm keeps the rule reachable.

The July 2026 cleanup (196 classes, 318 rules, −8% source) checked both shapes:
zero false positives, but always re-check new findings against them.

- One **owner** per layout concern (spacing, typography) per page/section.
- Use **CSS variables** on `body.home-page` / `body.collection-page` instead of duplicating `clamp()` in many places.
- Avoid copying the same selector with small tweaks at the top and bottom of `main.css` — search for existing class names first.
