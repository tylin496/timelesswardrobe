#!/usr/bin/env node
/**
 * Diagnostic wrapper for tw-dev-server.mjs.
 * Streams every stdout/stderr line to /tmp/tw-dev-stream.log as it arrives,
 * so even a SIGKILL leaves a complete trail.
 * On clean exit appends a crash summary to /tmp/tw-dev-crash.log.
 *
 * Usage: node scripts/tw-dev-monitor.mjs
 */
import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverScript = path.join(__dirname, "tw-dev-server.mjs");
const crashLog = "/tmp/tw-dev-crash.log";
const streamLog = "/tmp/tw-dev-stream.log";
const RING = 100;

// Rolling stream log — opened in append mode so every session accumulates.
// Each session starts with a header line so sessions are distinguishable.
const streamWriter = createWriteStream(streamLog, { flags: "a" });
streamWriter.write(`\n=== Session start ${new Date().toISOString()} ===\n`);

function makeRing() {
  const buf = [];
  return {
    push(line) { buf.push(line); if (buf.length > RING) buf.shift(); },
    lines() { return buf.slice(); },
  };
}

const stdoutRing = makeRing();
const stderrRing = makeRing();
const combinedRing = makeRing();

let parentKilled = false;
function onParentSignal(sig) { parentKilled = true; child.kill(sig); }
process.on("SIGINT", () => onParentSignal("SIGINT"));
process.on("SIGTERM", () => onParentSignal("SIGTERM"));

const child = spawn(process.execPath, [serverScript], {
  cwd: path.resolve(__dirname, ".."),
  env: process.env,
  stdio: ["inherit", "pipe", "pipe"],
});

function wire(stream, ring, termDest, prefix) {
  let partial = "";
  stream.on("data", (chunk) => {
    termDest.write(chunk);
    const text = partial + chunk.toString("utf8");
    const lines = text.split("\n");
    partial = lines.pop();
    for (const l of lines) {
      const stamped = `${prefix} ${l}\n`;
      streamWriter.write(stamped);
      ring.push(l);
      combinedRing.push(l);
    }
  });
  stream.on("end", () => {
    if (partial) {
      streamWriter.write(`${prefix} ${partial}\n`);
      ring.push(partial);
      combinedRing.push(partial);
    }
  });
}

wire(child.stdout, stdoutRing, process.stdout, "[out]");
wire(child.stderr, stderrRing, process.stderr, "[err]");

child.on("error", (err) => {
  process.stderr.write(`[monitor] failed to spawn server: ${err.message}\n`);
  process.exit(1);
});

child.on("close", async (code, signal) => {
  streamWriter.write(`=== Process closed — code:${code ?? "none"} signal:${signal ?? "none"} parentKilled:${parentKilled} ===\n`);

  if (parentKilled) {
    process.exit(code ?? 0);
    return;
  }

  const ts = new Date().toISOString();
  const killed = signal != null;

  let crashNum = 1;
  try {
    const existing = await fs.readFile(crashLog, "utf8");
    crashNum = (existing.match(/^=== Crash #\d+ ===/gm) ?? []).length + 1;
  } catch { /* first crash */ }

  const report = [
    `=== Crash #${crashNum} ===`,
    `Timestamp : ${ts}`,
    `Exit code : ${code ?? "(none)"}`,
    `Signal    : ${signal ?? "(none)"}`,
    `Termination: ${killed ? `killed by signal ${signal}` : code === 0 ? "natural exit (code 0)" : `error exit (code ${code})`}`,
    `Stream log: ${streamLog}`,
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

  process.stderr.write(`\n\n${report}`);

  try {
    await fs.appendFile(crashLog, report, "utf8");
    process.stderr.write(`[monitor] crash #${crashNum} → ${crashLog}\n`);
    process.stderr.write(`[monitor] full stream   → ${streamLog}\n`);
  } catch (e) {
    process.stderr.write(`[monitor] could not write report: ${e.message}\n`);
  }

  process.exit(code ?? 1);
});
