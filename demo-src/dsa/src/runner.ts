import type { Problem } from "./data/types";

export interface TestResult {
  index: number;
  pass: boolean;
  input: unknown[];
  expected: unknown;
  got: unknown;
  error?: string;
}

export interface RunResult {
  allPassed: boolean;
  results: TestResult[];
  /** Set if the submitted code failed to parse or didn't define fnName. */
  compileError?: string;
}

/**
 * Executes user-submitted JS source against a problem's test cases.
 * Uses `new Function` to evaluate the source in an isolated function scope
 * (no access to closures in this module) and pull out the named function.
 * Every step is wrapped in try/catch so a throwing solution renders as a
 * failing test case, not an uncaught exception.
 */
export function runTests(userCode: string, problem: Problem): RunResult {
  let fn: (...args: unknown[]) => unknown;

  try {
    // eslint-disable-next-line no-new-func
    const factory = new Function(`"use strict";\n${userCode}\nreturn ${problem.fnName};`);
    const candidate = factory();
    if (typeof candidate !== "function") {
      throw new Error(`"${problem.fnName}" is not defined as a function.`);
    }
    fn = candidate as (...args: unknown[]) => unknown;
  } catch (err) {
    return { allPassed: false, results: [], compileError: describeError(err) };
  }

  const results: TestResult[] = problem.testCases.map((testCase, index) => {
    try {
      const got = fn(...testCase.input);
      return {
        index,
        pass: compareToExpected(got, testCase.expected, problem),
        input: testCase.input,
        expected: testCase.expected,
        got,
      };
    } catch (err) {
      return {
        index,
        pass: false,
        input: testCase.input,
        expected: testCase.expected,
        got: undefined,
        error: describeError(err),
      };
    }
  });

  return { allPassed: results.length > 0 && results.every((r) => r.pass), results };
}

/** Compares a candidate return value against a test case's expected value,
 * applying the problem's `normalize` first if present. Shared by every
 * language runner so pass/fail semantics stay identical across languages. */
export function compareToExpected(got: unknown, expected: unknown, problem: Problem): boolean {
  const gotCmp = problem.normalize ? problem.normalize(got) : got;
  const expCmp = problem.normalize ? problem.normalize(expected) : expected;
  return deepEqual(gotCmp, expCmp);
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (Object.is(a, b)) return true;
  if (Array.isArray(a) || Array.isArray(b)) {
    if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
    return a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === "object" && a !== null && typeof b === "object" && b !== null) {
    const aKeys = Object.keys(a as Record<string, unknown>);
    const bKeys = Object.keys(b as Record<string, unknown>);
    if (aKeys.length !== bKeys.length) return false;
    return aKeys.every((k) =>
      deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k])
    );
  }
  return false;
}

function describeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

export function formatValue(v: unknown): string {
  if (v === undefined) return "undefined";
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}
