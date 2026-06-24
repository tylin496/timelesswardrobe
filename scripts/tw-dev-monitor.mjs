#!/usr/bin/env node
/**
 * Diagnostic wrapper for tw-dev-server.mjs.
 * Captures last 100 lines of stdout+stderr, exit code, and signal on death.
 *
 * Usage: node scripts/tw-dev-monitor.mjs
 *   or add "dev:monitor": "node scripts/tw-dev-monitor.mjs" to package.json scripts.
 *
 * On exit a report is written to /tmp/tw-dev-crash.log and printed to stderr.
 */
import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverScript = path.join(__dirname, "tw-dev-server.mjs");
const reportPath = "/tmp/tw-dev-crash.log";
const RING = 100;

function makeRing() {
  const buf = [];
  return {
    push(line) {
      buf.push(line);
      if (buf.length > RING) buf.shift();
    },
    lines() { return buf.slice(); },
  };
}

const stdoutRing = makeRing();
const stderrRing = makeRing();
const combinedRing = makeRing();

let parentKilled = false; // true when THIS process received SIGINT/SIGTERM

function onParentSignal(sig) {
  parentKilled = true;
  child.kill(sig);
}
process.on("SIGINT", () => onParentSignal("SIGINT"));
process.on("SIGTERM", () => onParentSignal("SIGTERM"));

const child = spawn(process.execPath, [serverScript], {
  cwd: path.resolve(__dirname, ".."),
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
});

// Stream stdout/stderr to terminal AND ring buffers
function wire(stream, ring, dest) {
  let partial = "";
  stream.on("data", (chunk) => {
    dest.write(chunk);
    const text = partial + chunk.toString("utf8");
    const lines = text.split("\n");
    partial = lines.pop(); // last fragment (may be incomplete)
    for (const l of lines) {
      ring.push(l);
      combinedRing.push(l);
    }
  });
  stream.on("end", () => {
    if (partial) { ring.push(partial); combinedRing.push(partial); }
  });
}

wire(child.stdout, stdoutRing, process.stdout);
wire(child.stderr, stderrRing, process.stderr);

child.on("error", (err) => {
  process.stderr.write(`[monitor] failed to spawn server: ${err.message}\n`);
  process.exit(1);
});

child.on("close", async (code, signal) => {
  if (parentKilled) {
    // Normal Ctrl-C — don't write a crash report
    process.exit(code ?? 0);
    return;
  }

  const ts = new Date().toISOString();
  const killed = signal != null;

  // Derive crash number from existing log
  let crashNum = 1;
  try {
    const existing = await fs.readFile(reportPath, "utf8");
    crashNum = (existing.match(/^=== Crash #\d+ ===/gm) ?? []).length + 1;
  } catch { /* file doesn't exist yet */ }

  const lines = [
    `=== Crash #${crashNum} ===`,
    `Timestamp : ${ts}`,
    `Exit code : ${code ?? "(none)"}`,
    `Signal    : ${signal ?? "(none)"}`,
    `Termination: ${killed ? `killed by signal ${signal}` : code === 0 ? "natural exit (code 0)" : `error exit (code ${code})`}`,
    ``,
    `--- last ${RING} lines STDOUT ---`,
    ...stdoutRing.lines(),
    ``,
    `--- last ${RING} lines STDERR ---`,
    ...stderrRing.lines(),
    ``,
    `--- last ${RING} lines COMBINED ---`,
    ...combinedRing.lines(),
    ``,
  ].join("\n");

  process.stderr.write(`\n\n${lines}`);

  try {
    await fs.appendFile(reportPath, lines, "utf8");
    process.stderr.write(`[monitor] crash #${crashNum} appended to ${reportPath}\n`);
  } catch (e) {
    process.stderr.write(`[monitor] could not write report: ${e.message}\n`);
  }

  process.exit(code ?? 1);
});
