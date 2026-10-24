import type { Problem } from "../data/types";
import type { RunResult, TestResult } from "../runner";
import { compareToExpected } from "../runner";
import { renderCCaseBody } from "./cCaseRenderer";

/**
 * Runs a C (or C++) solution against a problem's test cases via the
 * dev-only `/api/run-c` endpoint (see server/cRunnerPlugin.ts). Only
 * available when running `vite dev` locally — the endpoint does not exist
 * in a static production build, same as the local Ollama features.
 *
 * Case bodies are generated generically from `problem.cSignature` +
 * `problem.testCases` (see cCaseRenderer.ts) — no per-problem runner code.
 * Problems without a `cSignature` aren't C-solvable; callers should check
 * for that field before offering C as a language option.
 */
export async function runCTests(
  source: string,
  problem: Problem,
  lang: "c" | "cpp" = "c"
): Promise<RunResult> {
  if (!problem.cSignature) {
    return {
      allPassed: false,
      results: [],
      compileError: "This problem doesn't have a C signature defined yet.",
    };
  }
  const cSignature = problem.cSignature;

  let caseBodies: string[];
  try {
    caseBodies = problem.testCases.map((tc) => renderCCaseBody(problem.fnName, cSignature, tc.input));
  } catch (err) {
    return {
      allPassed: false,
      results: [],
      compileError: `Could not render C test cases for this problem: ${String(err)}`,
    };
  }

  let payload: { compileError?: string; results?: RawCaseResult[] };
  try {
    const res = await fetch("/api/run-c", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, caseBodies, lang }),
    });
    payload = await res.json();
  } catch (err) {
    return {
      allPassed: false,
      results: [],
      compileError: `Could not reach the local C runner (is \`vite dev\` running?): ${String(err)}`,
    };
  }

  if (payload.compileError) {
    return { allPassed: false, results: [], compileError: payload.compileError };
  }

  const rawResults = payload.results ?? [];
  const results: TestResult[] = problem.testCases.map((testCase, index) => {
    const raw = rawResults.find((r) => r.index === index);
    if (!raw) {
      return {
        index,
        pass: false,
        input: testCase.input,
        expected: testCase.expected,
        got: undefined,
        error: "No result returned for this test case.",
      };
    }
    if (raw.timedOut) {
      return {
        index,
        pass: false,
        input: testCase.input,
        expected: testCase.expected,
        got: undefined,
        error: "Timed out (possible infinite loop).",
      };
    }
    if (raw.exitCode !== 0) {
      return {
        index,
        pass: false,
        input: testCase.input,
        expected: testCase.expected,
        got: undefined,
        error: raw.stderr || `Crashed (exit code ${raw.exitCode}).`,
      };
    }
    let got: unknown;
    try {
      got = JSON.parse(raw.stdout.trim());
    } catch {
      return {
        index,
        pass: false,
        input: testCase.input,
        expected: testCase.expected,
        got: raw.stdout,
        error: "Output was not valid JSON.",
      };
    }
    return {
      index,
      pass: compareToExpected(got, testCase.expected, problem),
      input: testCase.input,
      expected: testCase.expected,
      got,
    };
  });

  return { allPassed: results.length > 0 && results.every((r) => r.pass), results };
}

interface RawCaseResult {
  index: number;
  stdout: string;
  stderr: string;
  exitCode: number | null;
  timedOut: boolean;
}
