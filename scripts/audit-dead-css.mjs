// Audit: find CSS classes defined in css/main.css with no reference anywhere
// in HTML/JS — neither as a literal nor via dynamic construction.
//
//   node scripts/audit-dead-css.mjs
//
// Report-only (not part of `npm run check`): dynamic-construction detection is
// heuristic, so findings need a human/Claude spot-check before deleting.
// A class is reported dead only if BOTH are true:
//   1. its full name appears nowhere in the corpus (*.html, *.js, js/, scripts/)
//   2. no concat/template stem in the corpus could build it:
//        `foo--${x}` / "foo--" + x   → prefix stem "foo--"
//        x + "--bar" / ${x}--bar     → suffix stem "--bar"
// Verified against the July 2026 cleanup: 0 false positives on 196 removals.
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const css = readFileSync(join(ROOT, 'css/main.css'), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');

const corpusFiles = [];
for (const f of readdirSync(ROOT)) if (/\.(html|js)$/.test(f)) corpusFiles.push(join(ROOT, f));
for (const d of ['js', 'scripts'])
  for (const f of readdirSync(join(ROOT, d))) if (/\.(js|mjs|html)$/.test(f)) corpusFiles.push(join(ROOT, d, f));
const corpus = corpusFiles.map((f) => readFileSync(f, 'utf8')).join('\n');

// class tokens from selector preludes (skip at-rule preludes and declarations)
const classes = new Map(); // cls -> selector usage count
{
  let i = 0;
  while (i < css.length) {
    const open = css.indexOf('{', i);
    if (open === -1) break;
    let start = open - 1;
    while (start >= 0 && !'{};'.includes(css[start])) start--;
    const prelude = css.slice(start + 1, open).trim();
    if (prelude.startsWith('@')) { i = open + 1; continue; }
    for (const m of prelude.matchAll(/\.(-?[a-zA-Z_][\w-]*)/g))
      classes.set(m[1], (classes.get(m[1]) || 0) + 1);
    const close = css.indexOf('}', open);
    i = close === -1 ? css.length : close + 1;
  }
}

// dynamic-construction stems
const prefixStems = new Set(), suffixStems = new Set();
for (const m of corpus.matchAll(/([A-Za-z][\w-]*(?:__|--|-))\$\{/g)) prefixStems.add(m[1]);
for (const m of corpus.matchAll(/["']([A-Za-z][\w-]*(?:__|--|-))["']\s*\+/g)) prefixStems.add(m[1]);
for (const m of corpus.matchAll(/\+\s*["']((?:__|--|-)[\w-]+)["']/g)) suffixStems.add(m[1]);
for (const m of corpus.matchAll(/\}((?:__|--|-)[\w-]+)/g)) suffixStems.add(m[1]);

const dead = [];
for (const [cls, n] of classes) {
  if (corpus.includes(cls)) continue;
  let dynamic = false;
  for (const s of prefixStems) if (cls.startsWith(s)) { dynamic = true; break; }
  if (!dynamic) for (const s of suffixStems) if (cls.endsWith(s)) { dynamic = true; break; }
  if (!dynamic) dead.push([cls, n]);
}

if (!dead.length) {
  console.log('OK - no dead classes in css/main.css (' + classes.size + ' classes checked).');
} else {
  console.log('Found ' + dead.length + ' dead class(es) — spot-check before deleting:');
  for (const [c, n] of dead.sort()) console.log('  ' + String(n).padStart(4) + '  .' + c);
  process.exitCode = 1;
}
