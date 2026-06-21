#!/usr/bin/env node
/**
 * Lint: catch misused `env(safe-area-inset-*)`.
 *
 * Two failure shapes have shipped here (both invisible on desktop / in DevTools,
 * because env() returns 0 there — they only bite on real iOS once the inset turns
 * non-zero):
 *
 *   1. A single-side property pointing at the wrong inset, e.g. a TOP header with
 *      `padding-bottom: env(safe-area-inset-bottom)` (the bottom home-indicator gap
 *      grows the header mid-scroll).
 *   2. A `padding`/`margin` shorthand with the left/right insets swapped between the
 *      right and left positions.
 *
 * This checks the physical side a value lands on against the inset direction it
 * names, for both longhand single-side props and 4-/3-/2-value box shorthands.
 *
 * Usage: node scripts/check-safe-area-insets.mjs [file ...]   (defaults to css/main.css)
 * Exits 1 if any violation is found.
 */
import fs from "node:fs";
import path from "node:path";

const files = process.argv.slice(2);
if (files.length === 0) files.push(path.join("css", "main.css"));

/** Map a physical side to the inset direction that is legitimate there. */
const SIDE_OK = {
  top: ["top"],
  bottom: ["bottom"],
  left: ["left"],
  right: ["right"],
};

/** Longhand props that pin to exactly one physical side. */
const SINGLE_SIDE = {
  "padding-top": "top",
  "padding-bottom": "bottom",
  "padding-left": "left",
  "padding-right": "right",
  "margin-top": "top",
  "margin-bottom": "bottom",
  "margin-left": "left",
  "margin-right": "right",
  top: "top",
  bottom: "bottom",
  left: "left",
  right: "right",
  "scroll-padding-top": "top",
  "scroll-padding-bottom": "bottom",
};

/** Split a CSS value into top-level comma/space tokens, keeping calc()/max()/min() groups whole. */
function splitTopLevel(value) {
  const out = [];
  let depth = 0;
  let cur = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth === 0 && /\s/.test(ch)) {
      if (cur.trim()) out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** For an N-value box shorthand, which physical side does each position map to? */
function shorthandSides(n) {
  if (n === 4) return ["top", "right", "bottom", "left"];
  if (n === 3) return ["top", "lr", "bottom"]; // pos1 is both left & right
  if (n === 2) return ["tb", "lr"]; // vertical, horizontal
  if (n === 1) return ["all"];
  return null;
}

const insetRe = /env\(\s*safe-area-inset-(top|bottom|left|right)/g;

const violations = [];

/**
 * Track the current declaration block so we can flag a rule that references BOTH
 * inset-top and inset-bottom. An element can only honour both edges if it spans the
 * full viewport height; otherwise (a top header, a bottom footer) one of them is the
 * copy/paste mirror mistake that grew the header. Full-height sheets are rare — list
 * them here to silence the (correct) review flag.
 */
const FULL_HEIGHT_OK = [/__search-megamenu-inner/, /__search-surface/, /-sheet\b/, /modal/];

for (const file of files) {
  const raw = fs.readFileSync(file, "utf8");
  // Blank out comments up front (keeping newlines so line numbers stay accurate) —
  // otherwise a comment that mentions "safe-area-inset-bottom" trips the scan.
  const text = raw.replace(/\/\*[^]*?\*\//g, (c) => c.replace(/[^\n]/g, " "));
  const lines = text.split("\n");

  // Pass A — per-block: a non-full-height rule using both top & bottom insets.
  let blockSel = "";
  let blockStart = 0;
  let blockDirs = new Set();
  const flushBlock = () => {
    if (blockDirs.has("top") && blockDirs.has("bottom") && !FULL_HEIGHT_OK.some((re) => re.test(blockSel))) {
      violations.push({
        file,
        line: blockStart,
        prop: blockSel,
        msg: `rule "${blockSel}" uses BOTH inset-top and inset-bottom (only valid full-height; otherwise one side is a mirror typo)`,
        src: blockSel + " { … }",
      });
    }
    blockDirs = new Set();
  };
  lines.forEach((line, i) => {
    const code = line.replace(/\/\*[^]*?\*\//g, "");
    const selM = code.match(/^\s*([.#:\[][^{}]*?|[a-z][^{}]*?)\s*\{\s*$/i);
    if (selM) {
      flushBlock();
      blockSel = selM[1].trim();
      blockStart = i + 1;
    }
    for (const x of code.matchAll(insetRe)) blockDirs.add(x[1]);
    if (code.includes("}")) flushBlock();
  });
  flushBlock();

  // Pass B — per-declaration: side/direction mismatches (longhand + shorthand position).
  lines.forEach((line, i) => {
    if (!line.includes("safe-area-inset")) return;
    // Strip comments so the "NOT env(safe-area-inset-bottom)" note doesn't trip us.
    const code = line.replace(/\/\*[^]*?\*\//g, "");
    const m = code.match(/^\s*([a-z-]+)\s*:\s*(.+?);?\s*$/i);
    if (!m) return;
    const prop = m[1].toLowerCase();
    const value = m[2];

    // Inline-axis props accept either left or right — skip.
    if (/inline/.test(prop)) return;

    const dirsInValue = [...value.matchAll(insetRe)].map((x) => x[1]);
    if (dirsInValue.length === 0) return;

    if (prop in SINGLE_SIDE) {
      const side = SINGLE_SIDE[prop];
      for (const dir of dirsInValue) {
        if (!SIDE_OK[side].includes(dir)) {
          violations.push({ file, line: i + 1, prop, msg: `${prop} (a ${side} side) uses safe-area-inset-${dir}`, src: line.trim() });
        }
      }
      return;
    }

    if (prop === "padding" || prop === "margin") {
      const parts = splitTopLevel(value);
      const sides = shorthandSides(parts.length);
      if (!sides) return;
      parts.forEach((part, idx) => {
        const dirs = [...part.matchAll(insetRe)].map((x) => x[1]);
        if (dirs.length === 0) return;
        const slot = sides[idx];
        for (const dir of dirs) {
          const ok =
            slot === "all" ||
            (slot === "lr" && (dir === "left" || dir === "right")) ||
            (slot === "tb" && (dir === "top" || dir === "bottom")) ||
            slot === dir;
          if (!ok) {
            violations.push({
              file,
              line: i + 1,
              prop,
              msg: `${prop} position ${idx + 1} (${slot} side) uses safe-area-inset-${dir}`,
              src: line.trim(),
            });
          }
        }
      });
    }
  });
}

if (violations.length) {
  console.error(`✗ safe-area inset misuse (${violations.length}):\n`);
  for (const v of violations) {
    console.error(`  ${v.file}:${v.line}  ${v.msg}`);
    console.error(`    ${v.src}\n`);
  }
  console.error("A top-anchored element must not use inset-bottom (and vice versa);");
  console.error("in padding/margin shorthand, left/right insets must match their side.");
  process.exit(1);
}

console.log("✓ safe-area insets: no side/direction mismatches");
