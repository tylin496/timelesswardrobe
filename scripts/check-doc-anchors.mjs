#!/usr/bin/env node
/**
 * check:doc-anchors — keep the map docs anchored to code by SYMBOL, not line number.
 *
 * The orientation docs (ARCHITECTURE, DATA-CONTRACT, DEBUG-RUNBOOK, …) are the map a
 * cold session reads instead of scrolling app.js. They used to cite `app.js:<line>`.
 * Line numbers rot on every edit and nothing caught the drift, so a stale anchor sent
 * the reader to the wrong code — worse than no anchor. The fix is not to police line
 * numbers; it is to stop depending on them. Docs now reference code by symbol name,
 * which a reader (or the next Claude) greps. This check enforces that:
 *
 *   1. BAN line-number anchors. Any `app.js:123` / `app.js ~123` / `app.js line 123`
 *      in a doc fails. Reference the symbol instead — `mergeWardrobeFromSources` (app.js).
 *   2. VERIFY symbol anchors resolve. Every `` `symbol` (app.js) `` (also the
 *      `` `symbol` ([app.js](../app.js)) `` link form, and the bare `` `symbol` app.js ``
 *      table form) must still be findable in app.js. A rename/removal fails with a hint.
 *
 * HANDOFF-*.md is exempt: handoffs are dated audit records and may quote historical
 * line numbers as evidence of the very drift this check exists to prevent.
 */

import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DOCS = join(ROOT, "docs");
const appText = readFileSync(join(ROOT, "app.js"), "utf8");
const appLines = appText.split("\n");

const SKIP = /^HANDOFF-/;
// A line-number anchor: `app.js` (optional closing backtick) then a :, ~, or "line "
// separator, then digits. Plain "app.js (32k lines)" or "app.js keys" do NOT match.
const LINEREF = /app\.js`?\s*(?::|~|line\s+)\s*\d+/gi;
// A symbol anchor: `token` then a MANDATORY space-or-"(" gap, then app.js (optionally
// the [app.js](../app.js) markdown-link form). The gap must be non-empty so a bare
// backticked file mention — `foo` `app.js` — is not misread as `foo` (app.js).
const ANCHOR = /`([^`\n]+?)`[\s(]+\[?app\.js\b(?:\]\([^)]*\))?\)?/gi;

function existsInApp(token) {
  const needle = token.replace(/\(\)$/, "").trim();
  // Plain identifier (optionally dotted, e.g. hay.includes) → require a real word match.
  if (/^[A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*$/.test(needle)) {
    const esc = needle.replace(/\./g, "\\.");
    const re = new RegExp(`(^|[^\\w$.])${esc}([^\\w$]|$)`);
    return appLines.some((l) => re.test(l));
  }
  // Expression / snippet token (has quotes, spaces, operators) → substring match.
  return appText.includes(needle);
}

function defLine(token) {
  const ident = token.replace(/\(\)$/, "").trim().split(/[.([\s]/)[0];
  if (!/^[A-Za-z_$][\w$]*$/.test(ident)) return null;
  const re = new RegExp(`\\b(function|const|let|var)\\s+${ident}\\b`);
  for (let i = 0; i < appLines.length; i++) if (re.test(appLines[i])) return i + 1;
  return null;
}

const files = readdirSync(DOCS)
  .filter((f) => f.endsWith(".md") && !SKIP.test(f))
  .sort();

const errors = [];
let checked = 0;

for (const file of files) {
  readFileSync(join(DOCS, file), "utf8")
    .split("\n")
    .forEach((line, i) => {
      const where = `${file}:${i + 1}`;
      for (const m of line.matchAll(LINEREF)) {
        errors.push(
          `${where}  line-number anchor "${m[0].trim()}" — anchor by symbol name instead ` +
            "(e.g. `mergeWardrobeFromSources` (app.js)); line numbers rot."
        );
      }
      for (const m of line.matchAll(ANCHOR)) {
        const token = m[1].trim();
        if (token === "app.js") continue; // bare `app.js` file mention carries no symbol
        checked++;
        if (!existsInApp(token)) {
          const hint = defLine(token);
          errors.push(
            `${where}  \`${token}\` (app.js) does not resolve — renamed or removed? ` +
              (hint ? `(a similar symbol is defined at app.js:${hint}) ` : "") +
              "Re-grep and update the doc."
          );
        }
      }
    });
}

if (errors.length) {
  console.error(`✗ check:doc-anchors — ${errors.length} problem(s):\n`);
  for (const e of errors) console.error("  " + e);
  console.error(
    "\nMap docs anchor code by symbol name, never by line number. Fix the reference(s) above."
  );
  process.exit(1);
}
console.log(
  `✓ check:doc-anchors — ${checked} symbol anchor(s) resolve, ` +
    `zero line-number anchors (${files.length} docs scanned).`
);
