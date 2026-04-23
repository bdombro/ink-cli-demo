import path from "node:path";
import { test, expect } from "bun:test";

/** Absolute path to `index.ts` next to this test file. */
const entry = path.join(import.meta.dir, "index.tsx");

/**
 * Runs the CLI entry with extra argv (after the script), capturing stdout and stderr.
 * @param args Arguments following the script, e.g. `["hello", "-n", "Ada"]`.
 */
function runCli(args: string[]) {
  return Bun.spawnSync({
    cmd: ["bun", entry, ...args],
    stdout: "pipe",
    stderr: "pipe",
  });
}

test("hello -n sets name", () => {
  const r = runCli(["hello", "-n", "Ada"]);
  expect(r.exitCode).toBe(0);
  expect(r.stdout.toString()).toContain("hello Ada");
});

test("fallback runs hello with default name", () => {
  const r = runCli([]);
  expect(r.exitCode).toBe(0);
  expect(r.stdout.toString()).toContain("hello world");
});

test("hello -v enables verbose line", () => {
  const r = runCli(["hello", "-n", "z", "-v"]);
  expect(r.exitCode).toBe(0);
  const out = r.stdout.toString();
  expect(out).toContain("verbose mode");
  expect(out).toContain("hello z");
});

test("hello -v without -n uses default name in non-interactive run", () => {
  const r = runCli(["hello", "-v"]);
  expect(r.exitCode).toBe(0);
  const out = r.stdout.toString();
  expect(out).toContain("verbose mode");
  expect(out).toContain("hello world");
});

test("hello --help prints scoped help and exits 0", () => {
  const r = runCli(["hello", "--help"]);
  expect(r.exitCode).toBe(0);
  const out = r.stdout.toString();
  expect(out).toContain("Say hello.");
  expect(out).toContain("--name");
});
