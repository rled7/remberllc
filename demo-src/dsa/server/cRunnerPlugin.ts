import type { Plugin } from "vite";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Dev-only C/C++ compile-and-run endpoint. Never present in a production
 * build (this plugin only registers its middleware under Vite's dev
 * server, which does not exist in the static `dist/` output) — same
 * dark-in-production pattern as the local Ollama features.
 *
 * POST /api/run-c
 * Body: { source: string; caseBodies: string[]; lang?: "c" | "cpp" }
 *   - source: user code defining the target function.
 *   - caseBodies: one C statement block per test case (already rendered
 *     with that case's literal inputs baked in); each block must print a
 *     single JSON value to stdout representing the return value.
 * Response: { compileError?: string; results?: CaseRunResult[] }
 */

interface CaseRunResult {
  index: number;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}

const RUN_TIMEOUT_MS = 5000;
const COMPILE_TIMEOUT_MS = 10000;

// Shared JSON-printing helpers available to every generated harness, so the
// generic case-body renderer (src/runners/cCaseRenderer.ts) never needs to
// emit its own printing logic — it just calls these by name.
const JSON_PRINT_HELPERS = `
static void __print_json_string(const char* s) {
  putchar('"');
  for (const char* p = s; *p; p++) {
    if (*p == '"' || *p == '\\\\') putchar('\\\\');
    if (*p == '\\n') { printf("\\\\n"); continue; }
    putchar(*p);
  }
  putchar('"');
}
static void __print_json_int_array(const int* arr, int n) {
  putchar('[');
  for (int i = 0; i < n; i++) { if (i) putchar(','); printf("%d", arr[i]); }
  putchar(']');
}
static void __print_json_string_array(char** arr, int n) {
  putchar('[');
  for (int i = 0; i < n; i++) { if (i) putchar(','); __print_json_string(arr[i]); }
  putchar(']');
}
`;

function buildHarness(source: string, caseBodies: string[]): string {
  const cases = caseBodies
    .map(
      (body, i) => `    case ${i}: {\n${indent(body, 6)}\n      return 0;\n    }`
    )
    .join("\n");

  return `#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdbool.h>
#include <ctype.h>
${JSON_PRINT_HELPERS}
${source}

int main(int argc, char** argv) {
  if (argc < 2) return 1;
  int __idx = atoi(argv[1]);
  switch (__idx) {
${cases}
    default: return 1;
  }
  return 1;
}
`;
}

function indent(s: string, spaces: number): string {
  const pad = " ".repeat(spaces);
  return s
    .split("\n")
    .map((line) => pad + line)
    .join("\n");
}

function run(
  cmd: string,
  args: string[],
  cwd: string,
  timeoutMs: number
): Promise<{ stdout: string; stderr: string; code: number | null; timedOut: boolean }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const timer = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ stdout, stderr, code, timedOut });
    });
    child.on("error", (err) => {
      clearTimeout(timer);
      resolve({ stdout, stderr: stderr + String(err), code: null, timedOut: false });
    });
  });
}

export function cRunnerPlugin(): Plugin {
  return {
    name: "dev-only-c-runner",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/run-c", async (req, res) => {
        if (req.method !== "POST") {
          res.statusCode = 405;
          res.end("Method not allowed");
          return;
        }

        let body = "";
        req.on("data", (chunk) => (body += chunk));
        req.on("end", async () => {
          let workDir: string | null = null;
          try {
            const { source, caseBodies, lang } = JSON.parse(body) as {
              source: string;
              caseBodies: string[];
              lang?: "c" | "cpp";
            };

            const dir = await mkdtemp(join(tmpdir(), "dsa-c-run-"));
            workDir = dir;
            const ext = lang === "cpp" ? "cpp" : "c";
            const srcPath = join(dir, `harness.${ext}`);
            const binPath = join(dir, "harness.bin");
            const harness = buildHarness(source, caseBodies);
            await writeFile(srcPath, harness, "utf8");

            const compiler = lang === "cpp" ? "clang++" : "clang";
            const compileArgs = [
              "-O0",
              "-Wall",
              "-o",
              binPath,
              srcPath,
              ...(lang === "cpp" ? ["-std=c++17"] : ["-std=c11"]),
            ];
            const compileResult = await run(compiler, compileArgs, dir, COMPILE_TIMEOUT_MS);

            if (compileResult.code !== 0) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ compileError: compileResult.stderr || "Compile failed." }));
              return;
            }

            const results: CaseRunResult[] = [];
            for (let i = 0; i < caseBodies.length; i++) {
              const r = await run(binPath, [String(i)], dir, RUN_TIMEOUT_MS);
              results.push({
                index: i,
                stdout: r.stdout,
                stderr: r.stderr,
                exitCode: r.code,
                timedOut: r.timedOut,
              });
            }

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ results }));
          } catch (err) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ compileError: String(err) }));
          } finally {
            if (workDir) {
              try {
                await rm(workDir, { recursive: true, force: true });
              } catch {
                // best-effort cleanup
              }
            }
          }
        });
      });
    },
  };
}
